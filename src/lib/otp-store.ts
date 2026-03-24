// In-memory store for OTPs (For production, use a database or Redis)
// Using a global variable to persist across hot reloads in development
const globalForOtp = global as unknown as { otpStore: Map<string, { otp: string; expires: number }> }

export const otpStore = globalForOtp.otpStore || new Map<string, { otp: string; expires: number }>()

if (process.env.NODE_ENV !== 'production') globalForOtp.otpStore = otpStore

export default otpStore
