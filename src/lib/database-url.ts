const normalizeConnectionString = (raw: string): string => {
  return raw.replace('sslmode=require', 'sslmode=no-verify')
}

const transactionConnectionEnvVars = [
  'PAYLOAD_TRANSACTION_DATABASE_URI',
  'TRANSACTION_DATABASE_URI',
  'POSTGRES_TRANSACTION_URL',
] as const

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

const deriveSupabaseTransactionUrl = (raw: string): string => {
  try {
    const url = new URL(raw)

    if (!isSupabasePoolerHost(url.hostname)) {
      return normalizeConnectionString(raw)
    }

    url.port = '6543'

    return normalizeConnectionString(url.toString())
  } catch {
    return normalizeConnectionString(raw)
  }
}

export const getPreferredDatabaseUrl = (): string => {
  const explicitTransactionUrl = getFirstEnvValue(transactionConnectionEnvVars)
  if (explicitTransactionUrl) {
    return normalizeConnectionString(explicitTransactionUrl)
  }

  const explicitDirectUrl = getFirstEnvValue(directConnectionEnvVars)
  if (explicitDirectUrl) {
    return normalizeConnectionString(explicitDirectUrl)
  }

  const pooledUrl = getFirstEnvValue(pooledConnectionEnvVars)
  if (!pooledUrl) {
    return ''
  }

  if (process.env.NODE_ENV === 'production') {
    return deriveSupabaseTransactionUrl(pooledUrl)
  }

  return normalizeConnectionString(pooledUrl)
}

export const getDatabaseUrlDiagnostics = () => {
  const explicitTransactionUrl = getFirstEnvValue(transactionConnectionEnvVars)
  const explicitDirectUrl = getFirstEnvValue(directConnectionEnvVars)
  const pooledUrl = getFirstEnvValue(pooledConnectionEnvVars)
  const selectedUrl = getPreferredDatabaseUrl()

  return {
    explicitTransactionConfigured: !!explicitTransactionUrl,
    explicitDirectConfigured: !!explicitDirectUrl,
    pooledConfigured: !!pooledUrl,
    selectedUrl,
    selectedUrlSource: explicitTransactionUrl
      ? 'explicit-transaction-env'
      : explicitDirectUrl
      ? 'explicit-direct-env'
      : pooledUrl && selectedUrl !== normalizeConnectionString(pooledUrl)
        ? 'derived-transaction-pooler'
        : pooledUrl
          ? 'pooled-env'
          : 'missing',
  }
}