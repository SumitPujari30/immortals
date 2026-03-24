import { NextResponse } from 'next/server'
import { otpStore } from '@/lib/otp-store'
import { setSession } from '@/lib/jwt'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    const storedData = otpStore.get(email)

    if (!storedData) {
      return NextResponse.json({ error: 'No OTP found for this email' }, { status: 400 })
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email)
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
    }

    if (storedData.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    // OTP verified successfully
    otpStore.delete(email)

    // Get user id to set session
    const { data: user } = await supabaseAdmin
      .from('user_credentials')
      .select('id')
      .eq('email', email)
      .single()

    if (user) {
      await setSession(user.id, email)
    }

    return NextResponse.json({ success: true, message: 'OTP verified successfully' })
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
