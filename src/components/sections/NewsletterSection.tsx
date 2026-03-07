'use client'

import { useState } from 'react'
import { ArrowRight, Mail, Bell } from 'lucide-react'
import { subscribeNewsletter } from '@/app/actions/newsletter'

export interface NewsletterSectionProps {
  heading?: string
  description?: string
  buttonText?: string
}

export function NewsletterSection({
  heading = 'Stay Updated',
  description = 'Subscribe to our newsletter for the latest news on youth peacebuilding in Nigeria.',
  buttonText = 'Subscribe Now',
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    const formData = new FormData()
    formData.append('email', email)

    const result = await subscribeNewsletter(formData)

    if (result.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setMessage(result.message || 'Subscribed successfully!')
      setEmail('')
    }
  }

  return (
    <section className="py-20 bg-gray-100">
      <div className="container">
        <div className="max-w-4xl mx-auto" data-scroll="up">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              {/* Left Side - Icon & Text */}
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
                  <Bell className="w-6 h-6 text-primary-900" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {heading}
                </h2>
                <p className="text-gray-600">
                  {description}
                </p>
              </div>

              {/* Right Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      disabled={status === 'loading'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-primary-900 text-white hover:bg-primary-800 disabled:opacity-50 transition-colors"
                  >
                    {status === 'loading' ? 'Subscribing...' : buttonText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {status === 'success' && (
                  <p className="mt-3 text-green-600 text-sm flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">✓</span>
                    {message}
                  </p>
                )}
                {status === 'error' && (
                  <p className="mt-3 text-red-600 text-sm">
                    {message}
                  </p>
                )}

                <p className="mt-4 text-gray-400 text-xs text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
