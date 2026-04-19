"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  LayoutTemplate,
  FolderOpen, 
  Users, 
  BookOpen, 
  Award, 
  Settings, 
  LogOut,
  Menu,
  X,
  Newspaper,
  Megaphone,
  Calendar,
  PenTool,
  Wrench,
  Play,
  Image as ImageIcon,
  Clock,
  Contact,
  Info,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({ children, title = "Admin Panel" }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({ 'Homepage': false, 'About': false })
  const [toasts, setToasts] = useState([])
  const toastTimers = useRef({})
  const router = useRouter()
  const pathname = usePathname()

  const removeToast = useCallback((id) => {
    if (toastTimers.current[id]) {
      clearTimeout(toastTimers.current[id])
      delete toastTimers.current[id]
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((message, type = 'info', duration = 4000) => {
    const normalizedMessage = `${message || ''}`.trim()
    if (!normalizedMessage) {
      return
    }

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, type, message: normalizedMessage }].slice(-4))

    toastTimers.current[id] = setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [removeToast])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined') {
      return
    }

    const handleToastEvent = (event) => {
      const detail = event?.detail || {}
      pushToast(detail.message, detail.type || 'info', detail.duration || 4000)
    }

    window.addEventListener('admin:toast', handleToastEvent)

    const originalAlert = window.alert
    window.alert = (rawMessage) => {
      const message = typeof rawMessage === 'string' ? rawMessage : `${rawMessage || ''}`
      const isErrorToast = /failed|error|unable|invalid|required|not found|could not|can't|cannot/i.test(message)
      pushToast(message, isErrorToast ? 'error' : 'success', 4500)
    }

    return () => {
      window.removeEventListener('admin:toast', handleToastEvent)
      window.alert = originalAlert

      Object.values(toastTimers.current).forEach((timer) => clearTimeout(timer))
      toastTimers.current = {}
    }
  }, [isAuthenticated, pushToast])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1A365D]"></div>
      </div>
    )
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { 
      name: 'Homepage', 
      icon: LayoutTemplate, 
      items: [
        { name: 'Hero Section', href: '/admin/pages/hero-section' },
        { name: 'About Section', href: '/admin/pages/about-section' },
        { name: 'Projects Section', href: '/admin/pages/projects-section' },
        { name: 'Services Section', href: '/admin/pages/services-section' },
        { name: 'Events Section', href: '/admin/pages/events-section' },
        { name: 'Media Section', href: '/admin/pages/media-section' },
        { name: 'Publications Section', href: '/admin/pages/publications-section' },
        { name: 'Timeline Section', href: '/admin/pages/timeline-section' },
        { name: 'Working Areas Section', href: '/admin/pages/working-areas-section' },
        { name: 'Contact Section', href: '/admin/pages/contact-section' },
        { name: 'Newsletter Section', href: '/admin/pages/newsletter-section' }
      ]
    },
    { 
      name: 'About', 
      icon: Info, 
      items: [
        { name: 'Work With Us', href: '/admin/pages/work-with-us' },
        { name: 'Know Us', href: '/admin/pages/know-us' }
      ]
    },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Publications', href: '/admin/publications', icon: BookOpen },
    { name: 'Videos', href: '/admin/videos', icon: Play },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Timeline', href: '/admin/timeline', icon: Clock },
    { name: 'Awards', href: '/admin/awards', icon: Award },
    { name: 'News', href: '/admin/news', icon: Newspaper },
    { name: 'Press', href: '/admin/press', icon: Megaphone },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Blog', href: '/admin/blog', icon: PenTool },
    { name: 'Contacts & Socials', href: '/admin/socials', icon: Contact },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ]

  const isActivePage = (href) => {
    return pathname.startsWith(href)
  }

  const getToastStyle = (type) => {
    if (type === 'success') {
      return {
        icon: CheckCircle2,
        container: 'border-green-200 bg-green-50 text-green-800',
        iconColor: 'text-green-600',
      }
    }

    if (type === 'error') {
      return {
        icon: AlertCircle,
        container: 'border-red-200 bg-red-50 text-red-800',
        iconColor: 'text-red-600',
      }
    }

    return {
      icon: Info,
      container: 'border-blue-200 bg-blue-50 text-blue-800',
      iconColor: 'text-blue-600',
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1A365D] text-white 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col
        h-screen overflow-hidden
      `}>
        <div className="p-6 border-b border-blue-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">FEED Admin</h1>
              <p className="text-blue-200 text-sm">Management Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            if (item.items) {
              const isAnyChildActive = item.items.some(subItem => pathname.startsWith(subItem.href));
              
              return (
                <div key={item.name} className="flex flex-col">
                  <button
                    className={`flex justify-between items-center px-4 py-3 rounded-lg transition-colors w-full ${
                      isAnyChildActive || expandedMenus[item.name]
                        ? 'bg-blue-800 text-white'
                        : 'hover:bg-blue-700 text-blue-100'
                    }`}
                    onClick={() => {
                      setExpandedMenus(prev => ({
                        ...prev,
                        [item.name]: !prev[item.name]
                      }));
                    }}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                    {expandedMenus[item.name] || isAnyChildActive ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  
                  {(expandedMenus[item.name] || isAnyChildActive) && (
                    <div className="flex flex-col mt-1 ml-4 border-l border-blue-700/50 pl-2 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                            pathname === subItem.href
                              ? 'bg-blue-700 text-white font-medium shadow-sm border border-blue-600/30'
                              : 'hover:bg-blue-700/50 text-blue-200'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-700 text-blue-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-blue-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full hover:bg-blue-700 rounded-lg transition-colors text-blue-100"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area - Scrollable with left margin for sidebar */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64 min-h-screen">
        {/* Header - Fixed */}
        <header className="bg-white shadow-sm border-b p-4 lg:p-6 flex-shrink-0 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            </div>
            <div className="text-sm text-gray-600 hidden sm:block">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </header>

        {/* Content - Scrollable */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Global admin toast notifications */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[80] flex flex-col gap-3 w-[min(92vw,420px)] pointer-events-none">
        {toasts.map((toast) => {
          const style = getToastStyle(toast.type)
          const Icon = style.icon

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto border rounded-lg shadow-lg px-4 py-3 ${style.container}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${style.iconColor}`} />
                <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
