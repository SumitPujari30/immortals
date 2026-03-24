'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  ShieldCheck,
  UserPlus,
  LogOut,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AdminSidebarProps {
  onLogout: () => void
  onClose?: () => void // Add onClose prop for mobile
}

export function AdminSidebar({ onLogout, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose()
    }
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Complaints', icon: AlertCircle, href: '/admin/complaints' },
    { name: 'Issues Resolved', icon: CheckCircle, href: '/admin/resolved' },
    { name: 'All Workers', icon: Users, href: '/admin/workers' },
    { name: 'Add Worker', icon: UserPlus, href: '/admin/workers/add' },
    { name: 'Volunteers', icon: ShieldCheck, href: '/admin/volunteers' },
  ]

  return (
    <aside className="w-64 h-screen bg-card border-r flex flex-col sticky top-0">
      <div className="p-6 border-b flex flex-col items-center gap-4 group cursor-pointer hover:bg-slate-50/50 transition-colors">
        <Link href="/admin" onClick={handleLinkClick} className="relative w-full h-24 transition-transform group-hover:scale-105">
          <Image 
            src="/assets/logo.png" 
            alt="NagarSeva Admin" 
            fill
            className="object-contain"
          />
        </Link>
        <span className="font-display font-black text-xs uppercase tracking-[0.3em] text-slate-400">
           System <span className="text-primary">Control</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              pathname === item.href
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
          >
            <item.icon className={cn("w-5 h-5", pathname === item.href ? "" : "group-hover:scale-110 transition-transform")} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div className="bg-emerald-500/5 rounded-3xl p-6 flex flex-col items-center text-center gap-5 border border-emerald-500/10 active:scale-[0.98] transition-all group/profile overflow-hidden">
          <div className="relative">
            <div className="absolute -inset-3 bg-emerald-500/20 rounded-[100px] blur-2xl opacity-0 group-hover/profile:opacity-100 transition-opacity duration-500" />
            <Avatar 
              variant="pill" 
              size="4xl" 
              className="relative shadow-2xl shadow-emerald-900/30"
            >
              <AvatarFallback />
            </Avatar>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Administrator</p>
            <p className="text-sm font-bold truncate text-slate-900">Nagar Seva Team</p>
            <p className="text-xs text-slate-400">admin@nagarseva.gov</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 rounded-xl border-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </aside>
  )
}
