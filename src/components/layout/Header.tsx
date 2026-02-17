'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Search } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about', children: [
    { name: 'Who We Are', href: '/about' },
    { name: 'Our Team', href: '/about#team' },
    { name: 'Partners', href: '/about#partners' },
  ]},
  { name: 'Programmes', href: '/programmes' },
  { name: 'Media', href: '/blog', children: [
    { name: 'Blog', href: '/blog' },
    { name: 'Press Statements', href: '/media/press' },
    { name: 'Gallery', href: '/gallery' },
  ]},
  { name: 'Reports', href: '/publications', children: [
    { name: 'Publications', href: '/publications' },
    { name: 'Project Reports', href: '/reports' },
  ]},
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  const handleMobileDropdownToggle = (name: string) => {
    setMobileDropdown(mobileDropdown === name ? null : name)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results (you can implement a search page)
      window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="container h-full flex items-start justify-center pt-20">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, publications, events..."
                  className="w-full pl-14 pr-14 py-5 text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </form>
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Press <kbd className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono text-xs">Esc</kbd> to close or <kbd className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono text-xs">Enter</kbd> to search
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-white'
      }`}>
        <div className="container">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow ring-2 ring-primary-100">
                <Image
                  src="/images/logo.jpg"
                  alt="BB4Peace Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="ml-3 hidden sm:block">
                <span className="block text-lg font-bold text-gradient leading-tight">
                  BB4Peace
                </span>
                <span className="block text-[10px] text-gray-500 font-medium">
                  Building Blocks for Peace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div 
                  key={item.name} 
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      activeDropdown === item.name
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-700 hover:text-primary-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>
                  {item.children && activeDropdown === item.name && (
                    <div className="absolute left-0 top-full pt-2 animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-xl py-3 min-w-52 border border-gray-100">
                        {item.children.map((child, idx) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="flex items-center px-5 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent hover:text-primary-900 transition-all"
                          >
                            <span className="w-2 h-2 rounded-full mr-3" style={{
                              background: ['#e5243b', '#ffa500', '#4c9f38'][idx % 3]
                            }} />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-gray-600 hover:text-primary-900 hover:bg-gray-100 transition-all" 
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <Link 
                href="/donate" 
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white text-sm bg-accent-gold text-primary-900 hover:bg-yellow-400 transition-all duration-200"
              >
                Donate
              </Link>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t animate-slide-up">
            <div className="container py-4">
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => handleMobileDropdownToggle(item.name)}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                            mobileDropdown === item.name ? 'rotate-180' : ''
                          }`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ${
                          mobileDropdown === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="ml-4 mt-1 space-y-1 pb-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-primary-900 hover:bg-primary-50 transition-colors"
                                onClick={() => {
                                  setIsMobileMenuOpen(false)
                                  setMobileDropdown(null)
                                }}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t">
                <Link 
                  href="/contact" 
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #e5243b, #ffa500)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
