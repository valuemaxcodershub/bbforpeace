'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Users,
  Target,
  UserCircle,
  BookOpen,
  Newspaper,
  ImageIcon,
  FileText,
  Calendar,
  ArrowRight,
  MessageSquareQuote,
} from 'lucide-react'

type SiteNavChild = {
  name: string
  href: string
  description?: string
  iconKey?: string
}

type SiteNavItem = {
  name: string
  href: string
  children?: SiteNavChild[]
}

type HeaderClientProps = {
  navigation: SiteNavItem[]
  siteName: string
  siteTagline: string
  logoUrl: string
  logoAlt: string
}

const iconMap = {
  users: Users,
  target: Target,
  userCircle: UserCircle,
  bookOpen: BookOpen,
  newspaper: Newspaper,
  imageIcon: ImageIcon,
  fileText: FileText,
  calendar: Calendar,
  messageSquareQuote: MessageSquareQuote,
} as const

export function HeaderClient({ navigation, siteName, siteTagline, logoUrl, logoAlt }: HeaderClientProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const [supportsHover, setSupportsHover] = useState(true)
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

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')

    const updateHoverSupport = () => {
      setSupportsHover(mediaQuery.matches)
    }

    updateHoverSupport()

    mediaQuery.addEventListener('change', updateHoverSupport)

    return () => mediaQuery.removeEventListener('change', updateHoverSupport)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setMobileDropdown(null)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
        setMobileDropdown(null)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setMobileDropdown(null)
  }

  const handleDesktopNavItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: SiteNavItem,
  ) => {
    if (supportsHover || !item.children) return

    if (activeDropdown !== item.name) {
      event.preventDefault()
      setActiveDropdown(item.name)
    }
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = searchQuery.trim()

    if (trimmed && trimmed.length <= 200) {
      const sanitized = trimmed.replace(/[<>"']/g, '')
      window.location.href = `/blog?search=${encodeURIComponent(sanitized)}`
    }
  }

  return (
    <>
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
                  onChange={(event) => setSearchQuery(event.target.value)}
                  maxLength={200}
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

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white'
      }`}>
        <div className="container">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center group">
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow ring-2 ring-primary-100 flex-shrink-0">
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0 max-w-[58vw] sm:max-w-none">
                <span className="block text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gradient leading-tight">
                  Building Blocks for Peace Foundation
                </span>
                <span className="hidden sm:block text-xs md:text-sm text-gray-500 font-medium leading-tight">
                  {siteTagline}
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={supportsHover && item.children ? () => setActiveDropdown(item.name) : undefined}
                  onMouseLeave={supportsHover && item.children ? () => setActiveDropdown(null) : undefined}
                >
                  <Link
                    href={item.href}
                    onClick={(event) => handleDesktopNavItemClick(event, item)}
                    aria-haspopup={item.children ? 'menu' : undefined}
                    aria-expanded={item.children ? activeDropdown === item.name : undefined}
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
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(40,0,91,0.03)_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.05)_0%,transparent_40%)]" />

                        {item.children.map((child, index) => {
                          const Icon = iconMap[child.iconKey as keyof typeof iconMap] || FileText
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="group relative flex items-start gap-4 px-5 py-3.5 mx-2 rounded-xl hover:bg-white hover:shadow-md hover:shadow-primary-100/50 transition-all duration-300"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors duration-300" />
                              </div>
                              <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-800 group-hover:text-primary-900 transition-colors">{child.name}</span>
                                  <ArrowRight className="w-4 h-4 text-accent-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                                {child.description && (
                                  <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-600 transition-colors leading-relaxed">{child.description}</p>
                                )}
                              </div>
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="min-h-11 min-w-11 p-3 rounded-full text-gray-600 hover:text-primary-900 hover:bg-gray-100 transition-all touch-manipulation"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/contact"
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white text-sm bg-accent-gold text-primary-900 hover:bg-yellow-400 transition-all duration-200"
              >
                Get Involved
              </Link>

              <button
                className="lg:hidden min-h-11 min-w-11 p-3 rounded-full text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div className={`lg:hidden fixed inset-y-0 right-0 h-[100dvh] w-[min(90vw,22rem)] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`} id="mobile-site-menu" aria-hidden={!isMobileMenuOpen}>
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary-900 to-primary-800 pt-[max(1rem,env(safe-area-inset-top))]">
            <span className="text-white font-bold text-lg">Menu</span>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex h-[calc(100dvh-4.75rem)] flex-col overflow-y-auto overscroll-contain py-4 pb-[max(5rem,env(safe-area-inset-bottom))]">
            <nav className="flex flex-col gap-1 px-3">
              {navigation.map((item, itemIndex) => (
                <div
                  key={item.name}
                  className="animate-slide-up"
                  style={{ animationDelay: `${itemIndex * 50}ms` }}
                >
                  {item.children ? (
                    <>
                      <button
                        onClick={() => handleMobileDropdownToggle(item.name)}
                        className={`flex min-h-11 items-center justify-between w-full px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                          mobileDropdown === item.name ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-expanded={mobileDropdown === item.name}
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
                          <div className="h-0.5 bg-gradient-to-r from-primary-500 via-accent-gold to-primary-500" />

                          <div className="p-2 space-y-1">
                            {item.children.map((child, childIndex) => {
                              const Icon = iconMap[child.iconKey as keyof typeof iconMap] || FileText
                              return (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                  className="group flex items-center gap-3 px-3 py-3.5 rounded-lg bg-white/60 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all duration-200 touch-manipulation"
                                  onClick={() => {
                                    closeMobileMenu()
                                  }}
                                  style={{ animationDelay: `${childIndex * 30}ms` }}
                                >
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-200 shadow-sm">
                                    <Icon className="w-4 h-4 text-primary-600 group-hover:text-white transition-colors" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="block text-sm font-medium text-gray-700 group-hover:text-primary-900">{child.name}</span>
                                    {child.description && (
                                      <span className="block text-xs text-gray-400 group-hover:text-gray-500 leading-tight">{child.description}</span>
                                    )}
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
                      className="flex min-h-11 items-center px-4 py-3.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 hover:text-primary-900 transition-all duration-200 touch-manipulation"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 space-y-3">
            <Link
              href="/contact"
              className="flex min-h-11 items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-primary-900 bg-accent-gold hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-400/30 touch-manipulation"
              onClick={closeMobileMenu}
            >
              Get Involved
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
