'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth, useUserProfile } from '@/hooks'
import Chatbot from '@/components/features/Chatbot'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LogOut,
  User,
  LayoutDashboard,
  PlusCircle,
  Shield,
  Menu,
  X,
  MapPin,
  Bell,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth()
  const { data: profile } = useUserProfile(user?.id)
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const isAdminRoute = pathname?.startsWith('/admin')

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getDashboardLink = () => {
    if (!profile) return '/dashboard'
    if (profile.role === 'admin') return '/admin'
    if (profile.role === 'volunteer') return '/volunteer'
    return '/dashboard'
  }

  const navLinks = [
    { name: 'Community', href: '/#community' },
    { name: 'About', href: '/#about' },
  ] as const

  const authLinks = isAuthenticated
    ? [
        { name: 'Dashboard', href: getDashboardLink(), icon: LayoutDashboard },
        { name: 'New Complaint', href: '/complaints/new', icon: PlusCircle },
      ]
    : []

  if (profile?.role === 'admin') {
    authLinks.push({ name: 'Admin Panel', href: '/admin', icon: Shield })
  } else if (profile?.role === 'volunteer') {
    authLinks.push({ name: 'Volunteer Portal', href: '/volunteer', icon: Shield })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Navbar */}
      {!isAdminRoute && (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 h-full">
          <Link href="/" className="flex items-center group h-full flex-shrink-0">
            <div className="relative w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-96 h-full group-hover:scale-105 transition-transform">
              <Image 
                src="/assets/logo.png" 
                alt="NagarSeva" 
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 md:gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-brand-orange transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden xl:inline">{link.name}</span>
                <span className="xl:hidden">{link.name.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center">
                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none group">
                    <div className="relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95">
                      <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                      <Avatar variant="pill" size="sm" className="relative border-none shadow-2xl shadow-emerald-900/10 sm:size-4xl">
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {profile?.full_name || 'Citizen'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>My Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/login"
                  className="bg-brand-orange hover:bg-orange-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-lg shadow-brand-orange/20 transition-all whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Login / Register</span>
                  <span className="sm:hidden">Login</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background p-4 sm:p-6 animate-slide-in">
            <nav className="flex flex-col gap-4">
              {[...navLinks, ...authLinks].map((link) => {
                const hasIcon = 'icon' in link
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-base sm:text-lg font-medium p-3 sm:p-2 hover:bg-primary/5 rounded-md transition-colors flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {hasIcon && <link.icon className="w-5 h-5 flex-shrink-0" />}
                    {link.name}
                  </Link>
                )
              })}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-2 border-t mt-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold text-center shadow-lg shadow-brand-orange/20 transition-all"
                  >
                    Login / Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {!isAdminRoute && (
        <footer className="bg-slate-950 text-white">
          {/* Top Banner */}
          <div className="border-b border-white/5 bg-black/30">
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                System Operational — Civic Reports Monitored 24/7
              </div>
              <a
                href="mailto:nagarsevaofficial@gmail.com"
                className="text-sm text-white/50 hover:text-brand-orange transition-colors font-medium"
              >
                nagarsevaofficial@gmail.com
              </a>
            </div>
          </div>

          {/* Main Footer Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">

              {/* Brand Column */}
              <div className="md:col-span-4 space-y-4 sm:space-y-6">
                <Link href="/" className="inline-flex">
                  <div className="relative w-40 sm:w-48 lg:w-52 h-10 sm:h-12 lg:h-14">
                    <Image
                      src="/assets/logo.png"
                      alt="NagarSeva"
                      fill
                      className="object-contain object-left brightness-0 invert"
                    />
                  </div>
                </Link>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                  Empowering citizens to report, track, and resolve local civic issues. Together, we build a smarter and more responsive community infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-2 text-xs text-white/60">
                    <Shield className="w-3.5 h-3.5 text-brand-orange" />
                    Govt. Verified Platform
                  </div>
                  <Link
                    href="/admin/password"
                    className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    Admin
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="md:col-span-2 space-y-4 sm:space-y-5">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Quick Links</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'Features', href: '/#features' },
                    { label: 'How it Works', href: '/#how-it-works' },
                    { label: 'Community', href: '/#community' },
                    { label: 'About', href: '/#about' },
                  ].map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/50 hover:text-brand-orange transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="md:col-span-2 space-y-4 sm:space-y-5">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Services</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { label: 'File a Complaint', href: '/complaints/new' },
                    { label: 'Track Status', href: '/dashboard' },
                    { label: 'Volunteer Portal', href: '/volunteer' },
                    { label: 'Login / Register', href: '/login' },
                    { label: 'Admin Panel', href: '/admin/login' },
                  ].map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/50 hover:text-brand-orange transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="md:col-span-4 space-y-4 sm:space-y-5">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Contact Us</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/50">123 Civil Center, Nagar City, NC 45678</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    <a href="mailto:nagarsevaofficial@gmail.com" className="text-sm text-white/50 hover:text-brand-orange transition-colors">
                      nagarsevaofficial@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-white/50">Emergency: <span className="text-red-400 font-bold">101</span> / <span className="text-red-400 font-bold">108</span></span>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    href="/complaints/new"
                    className="inline-flex items-center gap-2 bg-brand-orange hover:bg-orange-500 text-white text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-brand-orange/20"
                  >
                    Report an Issue →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/30">
                © {new Date().getFullYear()} NagarSeva Civic Portal. All rights reserved.
              </p>
              <p className="text-xs text-white/20">
                Built for Indian communities &bull; Powered by civic responsibility
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  )
}
