'use server'

import { z } from 'zod'

const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(100).trim(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').max(254),
  subject: z.enum(['general', 'partnership', 'volunteer', 'donation', 'media', 'other'], {
    errorMap: () => ({ message: 'Please select a valid subject' }),
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000).trim(),
})

// Simple in-memory rate limiter (per server instance)
const submissions = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3 // max submissions
const RATE_WINDOW = 600000 // 10 minutes

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = submissions.get(key)

  if (!entry || now > entry.resetAt) {
    submissions.set(key, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }

  if (entry.count >= RATE_LIMIT) {
    return true
  }

  entry.count++
  return false
}

export async function submitContactForm(formData: FormData) {
  const raw = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  }

  // Validate input
  const result = contactSchema.safeParse(raw)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    const firstError = Object.values(errors).flat()[0] || 'Invalid input'
    return { error: firstError }
  }

  // Rate limit by email
  const rateLimitKey = result.data.email.toLowerCase()
  if (isRateLimited(rateLimitKey)) {
    return { error: 'Too many submissions. Please try again later.' }
  }

  try {
    // Save contact message to Payload CMS
    const { getPayloadClient } = await import('@/lib/payload-client')
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'subscribers',
      data: {
        email: result.data.email,
        name: `${result.data.firstName} ${result.data.lastName}`,
        status: 'active',
        subscribedAt: new Date().toISOString(),
      },
    }).catch(() => {
      // Subscriber may already exist - that's fine
    })

    return { success: true, message: 'Thank you! Your message has been sent successfully.' }
  } catch {
    return { error: 'Failed to send message. Please try again later.' }
  }
}
