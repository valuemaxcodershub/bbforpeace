'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { submitContactForm } from '@/app/actions/contact'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setMessage('')

    const result = await submitContactForm(formData)

    if (result.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setMessage(result.message || 'Message sent successfully!')
      // Reset form
      const form = document.getElementById('contact-form') as HTMLFormElement
      form?.reset()
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Send Us a Message
      </h2>
      <form id="contact-form" action={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              minLength={2}
              maxLength={100}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 transition-all"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              minLength={2}
              maxLength={100}
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            maxLength={254}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            required
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 transition-all"
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="partnership">Partnership Opportunity</option>
            <option value="volunteer">Volunteer Interest</option>
            <option value="donation">Donation Inquiry</option>
            <option value="media">Media/Press Inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={5000}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 resize-none transition-all"
            placeholder="How can we help you?"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 disabled:opacity-50 transition-colors shadow-lg shadow-primary-900/30"
          >
            <Send className="w-5 h-5" />
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {status === 'success' && (
          <p className="text-green-600 font-medium flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</span>
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-600 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
