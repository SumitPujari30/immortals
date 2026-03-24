import { NextRequest, NextResponse } from 'next/server'

const BASE_SYSTEM_PROMPT = `You are NagarSeva AI Assistant — a helpful, friendly, and knowledgeable chatbot for the NagarSeva Smart Civic Complaint & Tracking Portal.

## About NagarSeva
NagarSeva is a civic complaint management platform for Indian citizens. It enables:
- **Citizens** to report civic issues (potholes, garbage, water leaks, street lights, encroachment, stray animals) with photo/video evidence and GPS location
- **Volunteers** to self-assign complaints, physically verify issues, and update status (pending → under_review → in_progress → resolved)
- **Admins** to manage all complaints, assign workers, track city-wide issues, and view analytics dashboards

## Key Features
- File complaints at /complaints/new with photo/video upload and automatic GPS location
- Track complaint status in real-time on the citizen dashboard at /dashboard
- Volunteer portal at /volunteer for field agents to pick up and resolve issues
- Admin dashboard at /admin with analytics charts and complaint management at /admin/complaints
- All data is stored securely in Supabase and refreshes automatically every 30 seconds

## Supported Complaint Categories
1. Pothole & Road Damage
2. Garbage & Waste Collection
3. Water Leakage
4. Street Light Issue
5. Public Encroachment
6. Stray Animal Issue
7. Other Civic Issue

## Complaint Status Flow
pending → under_review → in_progress → resolved (or rejected)

## Pages & Navigation
- Home: / (landing page with info)
- Login: /login
- Signup: /signup
- File Complaint: /complaints/new
- Citizen Dashboard: /dashboard
- Volunteer Portal: /volunteer
- Admin Login: /admin/login
- Admin Dashboard: /admin
- Admin Complaints: /admin/complaints

## Your Behavior Rules
1. Be warm, friendly, and concise. Use simple language.
2. Always answer in the context of NagarSeva. If a question is unrelated, politely redirect.
3. If a user asks how to file a complaint, guide them step by step.
4. If a user reports an issue in chat, tell them to use the complaint form at /complaints/new for official tracking.
5. Never reveal internal system details, API keys, or database structure.
6. Use emojis sparingly for friendliness (1-2 per message max).
7. Keep responses under 150 words unless the user asks for detailed instructions.
8. If you don't know something, say so honestly and suggest contacting nagarsevaofficial@gmail.com.`

function buildUserContext(context?: {
  userRole?: string
  userName?: string
  currentPage?: string
  complaintsTotal?: number
  complaintsPending?: number
  complaintsResolved?: number
  assignedTasks?: number
  isOnDuty?: boolean
}): string {
  if (!context) return ''

  const parts: string[] = ['\n\n## Current User Context']

  if (context.userName) {
    parts.push(`The user's name is **${context.userName}**.`)
  }

  if (context.currentPage) {
    parts.push(`They are currently on the **${context.currentPage}** page.`)
  }

  if (context.userRole === 'citizen') {
    parts.push(`They are a **Citizen** user.`)
    parts.push(`They have filed ${context.complaintsTotal || 0} total complaints.`)
    if (context.complaintsPending) parts.push(`${context.complaintsPending} are still pending.`)
    if (context.complaintsResolved) parts.push(`${context.complaintsResolved} have been resolved.`)
    parts.push(`As a citizen, help them file complaints, track status, and understand the resolution process. Guide them to /complaints/new to file and /dashboard to track.`)
  } else if (context.userRole === 'volunteer') {
    parts.push(`They are a **Volunteer** field agent.`)
    if (context.isOnDuty !== undefined) parts.push(`They are currently ${context.isOnDuty ? '**ON DUTY**' : '**OFF DUTY**'}.`)
    if (context.assignedTasks !== undefined) parts.push(`They have ${context.assignedTasks} assigned task(s).`)
    parts.push(`As a volunteer, help them manage tasks, understand the status flow (pending→under_review→in_progress→resolved), use the navigation/GPS features, and explain how to self-assign complaints from the open queue.`)
  } else if (context.userRole === 'admin') {
    parts.push(`They are an **Admin** user.`)
    if (context.complaintsTotal) parts.push(`There are ${context.complaintsTotal} total complaints in the system.`)
    if (context.complaintsPending) parts.push(`${context.complaintsPending} are pending.`)
    parts.push(`As an admin, help them manage complaints, assign workers, understand analytics, and use the admin dashboard features. Guide them to /admin/complaints for management.`)
  } else {
    parts.push(`They are a **Guest** (not logged in).`)
    parts.push(`Help them understand NagarSeva, guide them to /login or /signup, and explain how the platform works.`)
  }

  return parts.join('\n')
}

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash'] as const
const BACKOFF_DELAYS = [3000, 8000, 15000]

async function callGeminiREST(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: { role: string; content: string }[],
  maxRetries: number = 3
): Promise<string> {
  let lastError: any = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const modelName = attempt >= 2 ? MODELS[1] : MODELS[0]
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

    // Build contents array with history + new message
    const contents: any[] = []

    // Add conversation history
    for (const msg of history) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })
    }

    // Add the new user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    })

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topP: 0.9,
      },
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (response.status === 429) {
        throw new Error('RATE_LIMIT: Resource has been exhausted')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!reply) {
        throw new Error('No response text received from Gemini')
      }

      return reply
    } catch (error: any) {
      lastError = error
      const isRateLimit =
        error.message?.includes('RATE_LIMIT') ||
        error.message?.includes('429') ||
        error.message?.includes('Resource has been exhausted') ||
        error.message?.includes('quota')

      if (isRateLimit && attempt < maxRetries - 1) {
        const delay = BACKOFF_DELAYS[attempt] || 15000
        console.log(`Rate limited (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay / 1000}s with ${modelName}...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      throw error
    }
  }

  throw lastError
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    const body = await req.json().catch(() => null)

    if (!body || !body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Please type a message to get help.' },
        { status: 400 }
      )
    }

    const userMessage = body.message.trim()
    if (userMessage.length === 0) {
      return NextResponse.json(
        { error: 'Please type a message to get help.' },
        { status: 400 }
      )
    }

    if (userMessage.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 2000 characters.' },
        { status: 400 }
      )
    }

    // Build dynamic system prompt with user context
    const userContext = buildUserContext(body.context)
    const systemPrompt = BASE_SYSTEM_PROMPT + userContext

    const history = (body.history || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      content: msg.content,
    }))

    const reply = await callGeminiREST(apiKey, systemPrompt, userMessage, history)

    return NextResponse.json({ success: true, reply })
  } catch (error: any) {
    console.error('Gemini API Error:', error.message)

    const errMsg = error.message || ''

    if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid')) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please contact support.' },
        { status: 503 }
      )
    }

    if (
      errMsg.includes('RATE_LIMIT') ||
      errMsg.includes('429') ||
      errMsg.includes('Resource has been exhausted') ||
      errMsg.includes('quota')
    ) {
      return NextResponse.json(
        { error: "I'm a bit busy right now — please wait a few seconds and try again. 🙏" },
        { status: 429 }
      )
    }

    if (errMsg.includes('SAFETY')) {
      return NextResponse.json(
        { error: "I wasn't able to process that request. Could you try rephrasing your question?" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: `Something went wrong. Please try again or contact nagarsevaofficial@gmail.com for help.` },
      { status: 500 }
    )
  }
}
