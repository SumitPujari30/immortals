import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if user already exists in user_credentials using a more robust check
    const { data: existingUsers, error: fetchError } = await supabaseAdmin
      .from('user_credentials')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (fetchError) {
      console.error('Lookup error:', fetchError)
      throw fetchError
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('Registration blocked: User already exists:', email)
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Insert into user_credentials
    const { data: newUser, error } = await supabaseAdmin
      .from('user_credentials')
      .insert({ email, password_hash })
      .select()
      .single()

    if (error) {
      console.error('Registration insertion error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json({ 
        error: `Database error: ${error.message}`, 
        code: error.code,
        details: error.details 
      }, { status: 500 })
    }

    console.log('User registered successfully:', email, 'ID:', newUser?.id)

    return NextResponse.json({ 
      success: true, 
      user: { id: newUser.id, email: newUser.email },
      message: 'Registration successful' 
    })
  } catch (err: any) {
    console.error('Registration catastrophic failure:', err)
    return NextResponse.json({ 
      error: err.message || 'Registration failed',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 })
  }
}
