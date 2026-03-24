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
      console.error('Insertion error:', error)
      throw error
    }

    console.log('User registered successfully:', email)

    return NextResponse.json({ 
      success: true, 
      user: { id: newUser.id, email: newUser.email },
      message: 'Registration successful' 
    })
  } catch (error: any) {
    console.error('Registration error detailed:', error)
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 })
  }
}
