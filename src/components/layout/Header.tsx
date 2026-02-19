'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Search, Users, Target, UserCircle, BookOpen, Newspaper, ImageIcon, FileText, Calendar, ArrowRight } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about', children: [
    { name: 'Who We Are', href: '/about', icon: Users, description: 'Learn about our mission and vision' },
    { name: 'Our Strategy', href: '/about#strategy', icon: Target, description: 'Our strategic approach to peacebuilding' },
    { name: 'Our Team', href: '/about#team', icon: UserCircle, description: 'Meet the people behind BBFORPEACE' },
  ]},
  { name: 'Programmes', href: '/programmes' },
  { name: 'Events', href: '/events' },
  { name: 'Media', href: '/blog', children: [
    { name: 'Blog', href: '/blog', icon: BookOpen, description: 'Latest news and insights' },
    { name: 'Press Statements', href: '/media/press', icon: Newspaper, description: 'Official press releases' },
    { name: 'Gallery', href: '/gallery', icon: ImageIcon, description: 'Photos from our activities' },
  ]},
  { name: 'Reports', href: '/reports', children: [
    { name: 'Publications', href: '/publications', icon: FileText, description: 'Research and publications' },
    { name: 'Annual Reports', href: '/reports', icon: Calendar, description: 'Yearly impact reports' },
    { name: 'Project Reports', href: '/reports/projects', icon: FileText, description: 'Project documentation' },
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
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow ring-2 ring-primary-100 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="BBFORPEACE Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="ml-2 sm:ml-3">
                <span className="block text-sm sm:text-lg font-bold text-gradient leading-tight">
                  BBFORPEACE
                </span>
                <span className="block text-[8px] sm:text-[10px] text-gray-500 font-medium">
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
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 animate-fade-in">
                      <div className="relative bg-gradient-to-br from-white via-gray-50/95 to-white backdrop-blur-xl rounded-2xl shadow-2xl py-2 min-w-80 border border-gray-200/60 overflow-hidden">
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(40,0,91,0.03)_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.05)_0%,transparent_40%)]" />
                        
                        {item.children.map((child, idx) => {
                          const Icon = child.icon
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="group relative flex items-start gap-4 px-5 py-3.5 mx-2 rounded-xl hover:bg-white hover:shadow-md hover:shadow-primary-100/50 transition-all duration-300"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors duration-300" />
                              </div>
                              <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-800 group-hover:text-primary-900 transition-colors">{child.name}</span>
                                  <ArrowRight className="w-4 h-4 text-accent-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-600 transition-colors leading-relaxed">{child.description}</p>
                              </div>
                              {/* Hover glow effect */}
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-accent-gold/0 group-hover:from-primary-500/5 group-hover:via-transparent group-hover:to-accent-gold/5 transition-all duration-500" />
                            </Link>
                          )
                        })}
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

        {/* Mobile Menu Overlay */}
        <div 
          className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary-900 to-primary-800">
            <span className="text-white font-bold text-lg">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Scrollable Navigation */}
          <div className="h-[calc(100%-140px)] overflow-y-auto py-4">
            <nav className="flex flex-col gap-1 px-3">
              {navigation.map((item, itemIdx) => (
                <div 
                  key={item.name}
                  className="animate-slide-up"
                  style={{ animationDelay: `${itemIdx * 50}ms` }}
                >
                  {item.children ? (
                    <>
                      <button
                        onClick={() => handleMobileDropdownToggle(item.name)}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                          mobileDropdown === item.name 
                            ? 'bg-primary-100 text-primary-900' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                          mobileDropdown === item.name ? 'rotate-180 text-primary-600' : ''
                        }`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-out ${
                        mobileDropdown === item.name ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="mx-2 mt-2 mb-2 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-50/80 border border-gray-100 shadow-inner overflow-hidden">
                          {/* Top accent line */}
                          <div className="h-0.5 bg-gradient-to-r from-primary-500 via-accent-gold to-primary-500" />
                          
                          <div className="p-2 space-y-1">
                            {item.children.map((child, childIdx) => {
                              const Icon = child.icon
                              return (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className="group flex items-center gap-3 px-3 py-3 rounded-lg bg-white/60 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all duration-200"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false)
                                    setMobileDropdown(null)
                                  }}
                                  style={{ animationDelay: `${childIdx * 30}ms` }}
                                >
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-200 shadow-sm">
                                    <Icon className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="block text-sm font-medium text-gray-700 group-hover:text-primary-900">{child.name}</span>
                                    <span className="block text-xs text-gray-400 group-hover:text-gray-500 leading-tight">{child.description}</span>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent-gold group-hover:translate-x-1 transition-all duration-200" />
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 hover:text-primary-900 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Mobile Footer CTAs */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 space-y-3">
            <Link 
              href="/donate" 
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-primary-900 bg-accent-gold hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-400/30"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Donate Now
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-800 to-primary-900 hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Involved
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
