import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

/**
 * Shared resilient Payload client for server components.
 *
 * - Wraps `getPayload()` with a configurable timeout to prevent hanging
 *   on Supabase cold starts (free-tier can take 5-7 seconds).
 * - Throws on failure — callers should wrap in try/catch with fallback UI.
 * - Uses Payload's built-in caching — after the first successful init,
 *   subsequent calls within the same serverless function return instantly.
 */
export async function getPayloadClient(
  timeoutMs = 15000,
): Promise<Payload> {
  return await Promise.race([
    getPayload({ config }),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Payload init timeout after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ])
}
