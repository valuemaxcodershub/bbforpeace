'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email address').max(254),
})

// Simple in-memory rate limiter
const subscriptions = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 3600000 // 1 hour

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = subscriptions.get(key)

  if (!entry || now > entry.resetAt) {
    subscriptions.set(key, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }

  if (entry.count >= RATE_LIMIT) {
    return true
  }

  entry.count++
  return false
}

export async function subscribeNewsletter(formData: FormData) {
  const result = schema.safeParse({ email: formData.get('email') })

  if (!result.success) {
    return { error: 'Please enter a valid email address.' }
  }

  const email = result.data.email.toLowerCase()

  // Rate limit
  if (isRateLimited(email)) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  try {
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default

    const payload = await getPayload({ config })

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return { success: true, message: 'You are already subscribed!' }
    }

    await payload.create({
      collection: 'subscribers',
      data: {
        email,
        status: 'active',
        subscribedAt: new Date().toISOString(),
      },
    })

    return { success: true, message: 'Successfully subscribed! Thank you.' }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}
