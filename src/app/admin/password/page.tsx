'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simple password check - in production, this should be server-side
      if (password === 'admin123') {
        toast.success('Admin access granted!')
        router.push('/admin')
      } else {
        toast.error('Incorrect password. Please try again.')
        setPassword('')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block mb-4 sm:mb-6">
            <div className="relative w-32 sm:w-48 h-10 sm:h-16">
              <Image
                src="/assets/logo.png"
                alt="NagarSeva"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </Link>
          
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">
            <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            Admin Access Required
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400 text-sm sm:text-base px-2">Enter your admin credentials to access the dashboard</p>
        </div>

        {/* Password Card */}
        <Card className="border-red-500/20 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-red-500/10">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-white flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <span className="text-sm sm:text-base">Authentication Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                  Admin Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12 h-11 sm:h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20 text-sm sm:text-base"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 sm:py-3 transition-colors shadow-lg shadow-red-500/20 h-11 sm:h-12 text-sm sm:text-base"
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    <span className="text-xs sm:text-sm">Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-xs sm:text-sm">Access Admin Dashboard</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-800">
              <div className="text-center space-y-2">
                <p className="text-slate-500 text-xs sm:text-sm">
                  Demo password: <span className="text-red-400 font-mono">admin123</span>
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Back to Home</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/50 border border-slate-700">
            <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
            <span className="text-slate-500 text-[10px] sm:text-xs">Secure admin access point</span>
          </div>
        </div>
      </div>
    </div>
  )
}
