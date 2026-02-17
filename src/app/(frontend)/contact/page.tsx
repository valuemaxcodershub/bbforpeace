import type { Metadata } from 'next'
import { PageHero } from '@/components/layout'
import { Mail, Phone, MapPin, Clock, Send, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | BB4Peace',
  description:
    'Get in touch with Building Blocks for Peace Foundation. We welcome inquiries, partnership opportunities, and feedback.',
}

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: 'info@bbforpeace.org',
    link: 'mailto:info@bbforpeace.org',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: '+234 8054151494',
    link: 'tel:+2348054151494',
  },
  {
    icon: Globe,
    title: 'Website',
    details: 'bbforpeace.org',
    link: 'https://bbforpeace.org',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: 'Mon - Fri: 9:00 AM - 5:00 PM',
    link: null,
  },
]

const offices = [
  {
    title: 'Head Office',
    address: '256, 1st Avenue, FHA, Lugbe, Abuja, Nigeria',
    phone: '+234 8054151494',
  },
  {
    title: 'Regional Office',
    address: '35, Edward Ujege Street, High Level, Makurdi, Benue State',
    phone: '+234 8054151494',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
          subtitle="Get in Touch"
          description="Have a question or want to collaborate? We'd love to hear from you. Reach out and let's build peace together."
          backgroundImage="/images/_VEE6887 (20).jpg"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Contact', href: '/contact' },
          ]}
        />

        {/* Contact Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-1" data-scroll="left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex items-start group">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-200 to-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-primary-900 group-hover:to-primary-800 transition-all shadow-lg">
                        <item.icon className="w-6 h-6 text-primary-900 group-hover:text-white transition-colors" />
                      </div>
                      <div className="ml-5">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-gray-600 hover:text-primary-900 transition-colors"
                          >
                            {item.details}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Office Locations */}
                <div className="mt-10 pt-10 border-t">
                  <h3 className="font-bold text-gray-900 mb-5">Our Offices</h3>
                  <div className="space-y-4">
                    {offices.map((office, idx) => (
                      <div key={idx} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-primary-900 mb-2">{office.title}</h4>
                        <p className="text-gray-600 text-sm flex items-start gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent-gold" />
                          {office.address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-10 pt-10 border-t">
                  <h3 className="font-bold text-gray-900 mb-5">Follow Us</h3>
                  <div className="flex gap-3">
                    <a href="#" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-primary-900 hover:text-white transition-all shadow-sm hover:shadow-lg">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-primary-900 hover:text-white transition-all shadow-sm hover:shadow-lg">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-primary-900 hover:text-white transition-all shadow-sm hover:shadow-lg">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-primary-900 hover:text-white transition-all shadow-sm hover:shadow-lg">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2" data-scroll="right">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    Send Us a Message
                  </h2>
                  <form className="space-y-6">
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
                        className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50/80 resize-none transition-all"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors shadow-lg shadow-primary-900/30"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section 
          className="h-[500px] relative overflow-hidden bg-fixed bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/PXL_20251023_124331635.MP~2.jpg)' }}
        >
          <div className="absolute inset-0 bg-primary-950/80" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center" data-scroll="up">
              <div className="w-20 h-20 rounded-3xl bg-accent-gold/20 flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-accent-gold" />
              </div>
              <p className="font-bold text-2xl mb-3">Visit Our Office</p>
              <p className="text-gray-300 max-w-md">256, 1st Avenue, FHA, Lugbe, Abuja, Nigeria</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-primary-950 font-bold rounded-xl hover:bg-yellow-400 transition-colors mt-8 shadow-lg shadow-accent-gold/30"
              >
                Get Directions
              </a>
            </div>
          </div>
        </section>
    </>
  )
}
