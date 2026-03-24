'use client'
 
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
 
export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
 
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Using a timeout to simulate a smooth transition
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden">
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
        <CardContent className="px-10 pb-12">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                className="h-12 text-center text-lg tracking-widest border-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg shadow-lg btn-primary-civic"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
