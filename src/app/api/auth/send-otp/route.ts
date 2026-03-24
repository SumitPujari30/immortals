import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { otpStore } from '@/lib/otp-store'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes expiry

    otpStore.set(email, { otp, expires })

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Nagar Seva - Your OTP for Verification',
      text: `Your OTP for Nagar Seva verification is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Nagar Seva Verification</h2>
          <p>Thank you for signing up. Please use the following One-Time Password (OTP) to complete your registration:</p>
          <div style="font-size: 24px; font-weight: bold; background: #f3f4f6; padding: 10px; border-radius: 5px; display: inline-block; letter-spacing: 2px;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This OTP will expire in 10 minutes.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: 'OTP sent successfully' })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: 'Failed to send OTP. Please check SMTP configuration.' }, { status: 500 })
  }
}

// Export the store so verify-otp can access it (Note: This only works if both run in the same process)
// Removed: export { otpStore }
