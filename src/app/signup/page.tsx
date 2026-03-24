'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth, useCreateProfile } from '@/hooks'
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
  User,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  Upload,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function getPasswordStrength(password: string): { label: string; score: number; color: string } {
  if (!password) return { label: '', score: 0, color: '' }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: 'Weak', score: 1, color: 'bg-red-500' }
  if (score <= 2) return { label: 'Fair', score: 2, color: 'bg-orange-500' }
  if (score <= 3) return { label: 'Good', score: 3, color: 'bg-yellow-500' }
  if (score <= 4) return { label: 'Strong', score: 4, color: 'bg-emerald-500' }
  return { label: 'Very Strong', score: 5, color: 'bg-emerald-600' }
}

export default function SignupPage() {
  const router = useRouter()
  const { signup, refreshUser } = useAuth()
  const { mutateAsync: createProfile } = useCreateProfile()
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'citizen',
    documentType: '',
  })
  const [documentImage, setDocumentImage] = useState<File | null>(null)

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const result = await signup(formData.email, formData.password)
      if (result.success && result.user) {
        setUserId(result.user.id)
        
        // Send OTP
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        })
        
        const otpData = await response.json()
        
        if (otpData.success) {
          setShowOtpInput(true)
          toast.success('OTP sent to your email for verification.')
        } else {
          toast.error(otpData.error || 'Failed to send verification code.')
          await finalizeSignup(result.user.id)
        }
      } else {
        if (result.message === 'User already exists') {
          toast.message('Sign up Successfull', {
            description: 'Redirecting to login...',
          })
          setTimeout(() => router.push('/login'), 2000)
        } else {
          toast.error(result.message || 'Failed to create account.')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const finalizeSignup = async (uid: string) => {
    try {
      await createProfile({
        user_id: uid,
        full_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        role: formData.role as 'citizen' | 'volunteer' | 'admin',
      })

      toast.success(
        'Account created successfully! Welcome to Nagar Seva.'
      )
      router.push('/dashboard')
    } catch (error: any) {
      if (error.message?.includes('duplicate key') || error.message?.includes('violates unique constraint')) {
        toast.message('Welcome back!', {
          description: 'Your account is already set up. Redirecting to login...',
        })
        setTimeout(() => router.push('/login'), 2000)
      } else {
        toast.error('Profile creation failed: ' + error.message)
      }
    }
  }

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otpValue }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('OTP verified successfully!')
        if (userId) {
          await refreshUser()
          await finalizeSignup(userId)
        }
      } else {
        toast.error(data.error || 'Invalid OTP. Please try again.')
      }
    } catch (error: any) {
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 bg-background">
      <div className="w-full max-w-2xl animate-page-enter">
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
          <Link
            href="/"
            className="relative w-full max-w-[240px] sm:max-w-[320px] h-20 sm:h-28 mb-4 transition-transform hover:scale-105"
          >
            <Image 
              src="/assets/logo.png" 
              alt="NagarSeva" 
              fill
              className="object-contain"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
            Join the Community
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Help make your city better by participating in civic improvement.
          </p>
        </div>

        <Card className="civic-card border-none shadow-xl sm:shadow-2xl overflow-hidden">
          <div className="bg-accent h-2" />
          <CardHeader className="pt-6 sm:pt-8 px-6 sm:px-8">
            <CardTitle className="text-xl font-bold">
              Create Account
            </CardTitle>
            <CardDescription>
              Register as a citizen or apply to be a volunteer
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!showOtpInput ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="font-semibold text-foreground"
                      >
                        Full Legal Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          className="pl-10 h-12 border-2 focus:ring-primary"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              fullName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="role"
                        className="font-semibold text-foreground"
                      >
                        Register As
                      </Label>
                      <Select
                        defaultValue="citizen"
                        onValueChange={(val) =>
                          setFormData((p) => ({ ...p, role: val }))
                        }
                      >
                        <SelectTrigger className="h-12 border-2 focus:ring-primary">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="citizen">
                            Citizen (Report Issues)
                          </SelectItem>
                          <SelectItem value="volunteer">
                            Volunteer (Resolve Issues)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="font-semibold text-foreground"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10 h-12 border-2 focus:ring-primary"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="font-semibold text-foreground"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="+91 XXXXX XXXXX"
                          className="pl-10 h-12 border-2 focus:ring-primary"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="font-semibold text-foreground"
                    >
                      Home/Work Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="Enter your locality or street address"
                        className="pl-10 h-12 border-2 focus:ring-primary"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            address: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="documentType"
                        className="font-semibold text-foreground"
                      >
                        Legal Document Type
                      </Label>
                      <Select
                        onValueChange={(val: string) =>
                          setFormData((p) => ({ ...p, documentType: val }))
                        }
                      >
                        <SelectTrigger className="h-12 border-2 focus:ring-primary pl-10 relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                          <SelectValue placeholder="Select document" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                          <SelectItem value="voter">Voter ID</SelectItem>
                          <SelectItem value="driving">Driving License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="documentImage"
                        className="font-semibold text-foreground"
                      >
                        Upload Document (Image)
                      </Label>
                      <div className="relative">
                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                        <Input
                          id="documentImage"
                          type="file"
                          accept="image/*"
                          className="pl-10 h-12 border-2 focus:ring-primary pt-2.5"
                          onChange={(e) =>
                            setDocumentImage(e.target.files?.[0] || null)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="font-semibold text-foreground"
                      >
                        Create Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10 pr-11 h-12 border-2 focus:ring-primary"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              password: e.target.value,
                            }))
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                          tabIndex={-1}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                                  level <= passwordStrength.score
                                    ? passwordStrength.color
                                    : "bg-slate-100"
                                )}
                              />
                            ))}
                          </div>
                          <p className={cn(
                            "text-xs font-semibold transition-colors",
                            passwordStrength.score <= 1 ? "text-red-500" :
                            passwordStrength.score <= 2 ? "text-orange-500" :
                            passwordStrength.score <= 3 ? "text-yellow-600" :
                            "text-emerald-600"
                          )}>
                            {passwordStrength.label}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="font-semibold text-foreground"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className={cn(
                            "pl-10 pr-11 h-12 border-2 focus:ring-primary",
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? "border-red-300 focus:border-red-400"
                              : formData.confirmPassword && formData.password === formData.confirmPassword
                                ? "border-emerald-300 focus:border-emerald-400"
                                : ""
                          )}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              confirmPassword: e.target.value,
                            }))
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                          tabIndex={-1}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs font-semibold text-red-500">Passwords do not match</p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="text-xs font-semibold text-emerald-600">Passwords match ✓</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full h-12 sm:h-14 btn-primary-civic text-lg sm:text-xl shadow-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      )}
                      {isLoading ? 'Creating Account...' : 'Register as Citizen'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-8 flex flex-col items-center py-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <KeyRound className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-primary">Verify Your Email</h3>
                    <p className="text-muted-foreground">
                      We've sent a 6-digit code to <span className="font-semibold text-foreground">{formData.email}</span>
                    </p>
                  </div>
                  
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={(value) => setOtpValue(value)}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2" />
                        <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2" />
                        <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2" />
                        <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2" />
                        <InputOTPSlot index={4} className="w-12 h-14 text-xl border-2" />
                        <InputOTPSlot index={5} className="w-12 h-14 text-xl border-2" />
                      </InputOTPGroup>
                    </InputOTP>

                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full h-12 sm:h-14 btn-primary-civic text-lg sm:text-xl shadow-xl mt-4"
                      disabled={isLoading || otpValue.length !== 6}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin mr-2" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      )}
                      {isLoading ? 'Verifying...' : 'Verify & Complete'}
                    </Button>
                    
                    <button
                      type="button"
                      onClick={() => setShowOtpInput(false)}
                      className="text-primary hover:underline font-semibold"
                    >
                      Use a different email address
                    </button>
                  </div>
                </div>
              )}
                <p className="text-center text-muted-foreground text-sm mt-4">
                  By signing up, you agree to our{' '}
                  <Link
                    href="/"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col bg-muted/30 p-6 sm:p-8 border-t">
            <p className="text-center text-muted-foreground mb-4">
              Already have an account?
            </p>
            <Link 
              href="/login"
              className={buttonVariants({ variant: "outline", className: "w-full h-11 border-2 border-primary/20 hover:bg-primary/5" })}
            >
              Sign In Securely
            </Link>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
