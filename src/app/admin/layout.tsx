'use client'
 
import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
 
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
 
  useEffect(() => {
    const isAdminAuthenticated = sessionStorage.getItem('admin_auth') === 'true'
    
    if (!isAdminAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
      setIsAuthorized(false)
    } else if (isAdminAuthenticated && pathname === '/admin/login') {
      router.push('/admin')
      setIsAuthorized(true)
    } else {
      setIsAuthorized(true)
    }
  }, [pathname, router])
 
  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    logout()
    router.push('/admin/login')
  }
 
  // Don't render sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
 
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full" />
          <p className="text-slate-400 font-medium">Verifying sessions...</p>
        </div>
      </div>
    )
  }
 
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-slate-900">Admin Dashboard</h1>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <AdminSidebar onLogout={handleLogout} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
