'use client'
 
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
 
export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
 
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      if (password === 'admin@seva') {
        sessionStorage.setItem('admin_auth', 'true')
        toast.success('Admin access granted')
        router.push('/admin')
      } else {
        toast.error('Invalid administrative password')
        setIsLoading(false)
      }
    }, 500)
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />
      
      <div className="w-full max-w-md relative z-10 animate-page-enter">
        <Card className="shadow-2xl border-none overflow-hidden">
          <div className="bg-primary h-2 w-full" />
          <CardHeader className="text-center space-y-6 pt-10 flex flex-col items-center">
            <div className="relative w-full h-24 transition-transform hover:scale-105 cursor-pointer">
              <Image 
                src="/assets/logo.png" 
                alt="NagarSeva Admin" 
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-display font-bold">Admin Login</CardTitle>
              <p className="text-muted-foreground">Enter administrative password to proceed</p>
            </div>
          </CardHeader>
          <CardContent className="px-6 sm:px-10 pb-8 sm:pb-12">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="h-12 pl-10 pr-11 text-center text-lg tracking-widest border-2 focus:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg shadow-lg btn-primary-civic"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Verifying...' : 'Access Dashboard'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group text-sm"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
