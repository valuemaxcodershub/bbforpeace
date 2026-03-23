const normalizeConnectionString = (raw: string): string => {
  return raw.replace('sslmode=require', 'sslmode=no-verify')
}

const directConnectionEnvVars = [
  'PAYLOAD_DIRECT_DATABASE_URI',
  'DIRECT_DATABASE_URI',
  'DIRECT_URL',
  'SUPABASE_DIRECT_URL',
] as const

const pooledConnectionEnvVars = [
  'POSTGRES_URL_NON_POOLING',
  'DATABASE_URI',
  'POSTGRES_URL',
] as const

const getFirstEnvValue = (keys: readonly string[]): string => {
  for (const key of keys) {
    const value = process.env[key]
    if (value?.trim()) return value.trim()
  }

  return ''
}

const isSupabasePoolerHost = (host: string): boolean => {
  return host.endsWith('.pooler.supabase.com')
}

const deriveDirectSupabaseUrl = (raw: string): string => {
  try {
    const url = new URL(raw)

    if (!isSupabasePoolerHost(url.hostname)) {
      return normalizeConnectionString(raw)
    }

    const usernameParts = decodeURIComponent(url.username).split('.')
    if (usernameParts.length < 2) {
      return normalizeConnectionString(raw)
    }

    const directUsername = usernameParts[0]
    const projectRef = usernameParts[1]

    url.hostname = `db.${projectRef}.supabase.co`
    url.port = '5432'
    url.username = encodeURIComponent(directUsername)

    return normalizeConnectionString(url.toString())
  } catch {
    return normalizeConnectionString(raw)
  }
}

export const getPreferredDatabaseUrl = (): string => {
  const explicitDirectUrl = getFirstEnvValue(directConnectionEnvVars)
  if (explicitDirectUrl) {
    return normalizeConnectionString(explicitDirectUrl)
  }

  const pooledUrl = getFirstEnvValue(pooledConnectionEnvVars)
  if (!pooledUrl) {
    return ''
  }

  if (process.env.NODE_ENV === 'production') {
    return deriveDirectSupabaseUrl(pooledUrl)
  }

  return normalizeConnectionString(pooledUrl)
}

export const getDatabaseUrlDiagnostics = () => {
  const explicitDirectUrl = getFirstEnvValue(directConnectionEnvVars)
  const pooledUrl = getFirstEnvValue(pooledConnectionEnvVars)
  const selectedUrl = getPreferredDatabaseUrl()

  return {
    explicitDirectConfigured: !!explicitDirectUrl,
    pooledConfigured: !!pooledUrl,
    selectedUrl,
    selectedUrlSource: explicitDirectUrl
      ? 'explicit-direct-env'
      : pooledUrl && selectedUrl !== normalizeConnectionString(pooledUrl)
        ? 'derived-from-pooler'
        : pooledUrl
          ? 'pooled-env'
          : 'missing',
  }
}