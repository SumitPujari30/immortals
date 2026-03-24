import { NextResponse } from 'next/server'
import { getSession } from '@/lib/jwt'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ 
      user: { 
        id: session.userId, 
        email: session.email 
      } 
    })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
