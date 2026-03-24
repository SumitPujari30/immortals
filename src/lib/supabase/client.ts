import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

// In-memory store for mock persistence, outside function for Better HMR persistence
const mockStore: Record<string, any[]> = {
  complaints: [
    {
      id: 'comp_1',
      category: 'pothole',
      description: 'Dangerous pothole on Main Street near the courthouse.',
      location_address: '123 Main St, Nagar',
      status: 'pending',
      priority_level: 'high',
      image_url: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?q=80&w=800&auto=format&fit=crop',
      latitude: 18.5204,
      longitude: 73.8567,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'comp_2',
      category: 'garbage',
      description: 'Illegal dumping in the alleyway behind Central Mall.',
      location_address: 'Alley 4, Sector 7',
      status: 'in_progress',
      priority_level: 'medium',
      image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop',
      latitude: 18.5250,
      longitude: 73.8590,
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'comp_3',
      category: 'street_light',
      description: 'Street light flickering and making noise at Night Chowk.',
      location_address: 'Night Chowk, Old Town',
      status: 'resolved',
      priority_level: 'low',
      image_url: 'https://images.unsplash.com/photo-1471958680802-1345a694ba6d?q=80&w=800&auto=format&fit=crop',
      latitude: 18.5100,
      longitude: 73.8400,
      created_at: new Date(Date.now() - 259200000).toISOString(),
    }
  ],
  profiles: [
    { id: 'vol_1', user_id: 'vol_1', full_name: 'Rahul Sharma', role: 'volunteer', is_on_duty: true },
    { id: 'vol_2', user_id: 'vol_2', full_name: 'Priya Singh', role: 'volunteer', is_on_duty: false },
    { id: 'mock-user-id', user_id: 'mock-user-id', full_name: 'Test Volunteer', role: 'volunteer', is_on_duty: false, city: 'Nagar' },
  ],
}

// Track auth listeners for mock mode
let authListeners: ((event: string, session: any) => void)[] = []

const notifyAuthListeners = (event: string, session: any) => {
  authListeners.forEach(l => l(event, session))
}

export function createClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_SUPABASE === 'true'

  if (isMockMode) {
    console.log('🚀 Supabase Mock Mode Enabled')
    
    // Create a robust mock client that supports chaining and terminal actions
    const createMockProxy = (name = 'root', table?: string, filters: any[] = []): any => {
      const mock = () => {}
      
      const proxy = new Proxy(mock, {
        get(target: any, prop: string): any {
          if (prop === 'then') {
            return (resolve: any) => {
              let data: any = []
              if (table && mockStore[table]) {
                data = [...mockStore[table]]
                // Simple filter support for id and user_id
                filters.forEach(f => {
                  data = data.filter((item: any) => item[f.column] === f.value)
                })
              }
              resolve({ 
                data: name === 'single' ? (data[0] || null) : data, 
                error: null 
              })
            }
          }

          if (prop === 'onAuthStateChange') {
            return (callback: any) => {
              authListeners.push(callback)
              return { data: { subscription: { unsubscribe: () => {
                authListeners = authListeners.filter(l => l !== callback)
              } } } }
            }
          }

          if (prop === 'from') {
            return (tableName: string) => createMockProxy('from', tableName)
          }

          if (prop === 'eq') {
            return (column: string, value: any) => createMockProxy(prop, table, [...filters, { column, value }])
          }

          if (prop === 'auth') {
            return createMockProxy('auth')
          }

          return createMockProxy(prop, table, filters)
        },
        apply(target, thisArg, args) {
          if (name === 'signUp' || name === 'signInWithPassword' || name === 'getUser' || name === 'getSession') {
            const mockUser = { id: 'mock-user-id', email: args[0]?.email || 'mock@example.com' }
            const session = { user: mockUser, access_token: 'mock-token' }
            
            if (name === 'signInWithPassword' || name === 'signUp') {
              setTimeout(() => notifyAuthListeners('SIGNED_IN', session), 0)
            }

            return Promise.resolve({ 
              data: name === 'getSession' ? { session: { user: mockUser } } : { user: mockUser, session: session }, 
              error: null 
            })
          }

          if (name === 'signOut') {
            setTimeout(() => notifyAuthListeners('SIGNED_OUT', null), 0)
            return Promise.resolve({ error: null })
          }

          if (name === 'insert' && table && mockStore[table]) {
            const newData = { 
              id: Math.random().toString(36).substr(2, 9),
              created_at: new Date().toISOString(),
              ...args[0] 
            }
            mockStore[table].push(newData)
            return createMockProxy('insert', table, [{ column: 'id', value: newData.id }])
          }

          if (name === 'update' && table && mockStore[table]) {
            // Very simple update logic
            const updateData = args[0]
            mockStore[table] = mockStore[table].map(item => {
              const matches = filters.every(f => item[f.column] === f.value)
              return matches ? { ...item, ...updateData } : item
            })
            return proxy
          }

          return proxy
        }
      })
      
      return proxy as any
    }

    supabaseInstance = createMockProxy()
    return supabaseInstance!
  }

  // Validate that we have real Supabase credentials
  if (!url || !url.startsWith('http') || !key || key.includes('placeholder')) {
    console.warn(
      '⚠️ Supabase not configured. Please check your .env file.'
    )
  }

  supabaseInstance = createBrowserClient(url, key)
  return supabaseInstance
}
