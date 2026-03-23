type PrimitiveRelation = number | string

type NestedArrayRelationField = {
  arrayField: string
  itemField: string
}

type SanitizerOptions = {
  relationFields?: string[]
  nullableRelationFields?: string[]
  relationArrayFields?: string[]
  nestedArrayRelationFields?: NestedArrayRelationField[]
  removeFields?: string[]
  conditionalRemovals?: Array<{
    when: (data: Record<string, unknown>) => boolean
    fields: string[]
  }>
}

const SYSTEM_FIELDS = ['id', 'collection', 'createdAt', 'updatedAt', 'deletedAt', '_status']

export const toRelationId = (value: unknown): PrimitiveRelation | null | undefined => {
  if (value === null || value === undefined || value === '') return undefined
  if (typeof value === 'number' || typeof value === 'string') return value

  if (typeof value === 'object' && value && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number' || typeof id === 'string') return id
  }

  return undefined
}

export const sanitizeAdminDocumentData = (
  rawData: Record<string, unknown>,
  options: SanitizerOptions = {},
): Record<string, unknown> => {
  const data = { ...rawData }

  for (const field of SYSTEM_FIELDS) {
    delete data[field]
  }

  for (const field of options.removeFields || []) {
    delete data[field]
  }

  for (const field of options.relationFields || []) {
    const relationId = toRelationId(data[field])
    if (relationId !== undefined) data[field] = relationId
  }

  for (const field of options.nullableRelationFields || []) {
    const relationId = toRelationId(data[field])
    data[field] = relationId === undefined ? null : relationId
  }

  for (const field of options.relationArrayFields || []) {
    const value = data[field]
    if (!Array.isArray(value)) continue

    data[field] = value
      .map((entry) => toRelationId(entry))
      .filter((entry): entry is PrimitiveRelation => entry !== undefined)
  }

  for (const nested of options.nestedArrayRelationFields || []) {
    const value = data[nested.arrayField]
    if (!Array.isArray(value)) continue

    data[nested.arrayField] = value.map((entry) => {
      if (!entry || typeof entry !== 'object') return entry

      const nextEntry = { ...(entry as Record<string, unknown>) }
      const relationId = toRelationId(nextEntry[nested.itemField])

      if (relationId !== undefined) nextEntry[nested.itemField] = relationId
      else delete nextEntry[nested.itemField]

      return nextEntry
    })
  }

  for (const rule of options.conditionalRemovals || []) {
    if (!rule.when(data)) continue
    for (const field of rule.fields) delete data[field]
  }

  return data
}