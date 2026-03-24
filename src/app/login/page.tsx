'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield,
  ArrowLeft,
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        toast.success('Welcome back to Nagar Seva!')
        router.push('/dashboard')
      } else {
        toast.error(
          result.message || 'Login failed. Please check your credentials.'
        )
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-12 px-4 bg-background">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
          <Link
            href="/"
            className="relative w-full max-w-[240px] sm:max-w-[320px] h-20 sm:h-28 mb-4 sm:mb-6 transition-transform hover:scale-105"
          >
            <Image 
              src="/assets/logo.png" 
              alt="NagarSeva" 
              fill
              className="object-contain"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Enter your credentials to access your account.
          </p>
        </div>

        <Card className="civic-card border-none shadow-xl sm:shadow-2xl overflow-hidden">
          <div className="bg-primary h-1.5" />
          <CardHeader className="pt-6 sm:pt-8 px-6 sm:px-8">
            <CardTitle className="text-lg sm:text-xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Citizen or Volunteer Portal Access
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-semibold text-foreground text-sm"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 sm:pl-11 h-11 sm:h-12 border-2 focus:ring-primary text-sm sm:text-base"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="font-semibold text-foreground text-sm"
                  >
                    Password
                  </Label>
                  <Link
                    href="/"
                    className="text-xs sm:text-sm font-medium text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 sm:pl-11 h-11 sm:h-12 border-2 focus:ring-primary text-sm sm:text-base"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, password: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 btn-primary-civic text-base sm:text-lg shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                )}
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col bg-muted/30 p-6 sm:p-8 border-t">
            <p className="text-center text-muted-foreground mb-4 text-sm">
              Don&apos;t have an account yet?
            </p>
            <Link 
              href="/signup"
              className={buttonVariants({ variant: "outline", className: "w-full h-10 sm:h-11 border-2 border-primary/20 hover:bg-primary/5 text-sm" })}
            >
              Create Citizen Account
            </Link>
          </CardFooter>
        </Card>

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
