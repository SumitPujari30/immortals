'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useUserProfile } from '@/hooks/useProfile'
import { useUserComplaints, useRecentComplaints } from '@/hooks/useComplaints'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

const WELCOME_MESSAGES: Record<string, string> = {
  citizen:
    'Namaste! 🙏 I\'m your NagarSeva AI Assistant. I can see you\'re a registered citizen. Ask me about filing complaints, tracking your existing reports, or anything about civic services!',
  volunteer:
    'Hello, Field Agent! 🛡️ I\'m here to help you with task management, status updates, and navigating your assigned complaints. What do you need?',
  admin:
    'Welcome, Administrator. 📊 I can help you with complaint management, analytics insights, worker assignments, and system operations. How can I assist?',
  guest:
    'Namaste! 🙏 I\'m the NagarSeva AI Assistant. I can help you learn about our civic services, guide you through registration, or answer questions about filing complaints. How can I help?',
}

const SUGGESTIONS_BY_ROLE: Record<string, string[]> = {
  citizen: [
    'How do I file a complaint?',
    'What\'s the status of my complaints?',
    'What complaint categories are there?',
    'How long does resolution take?',
  ],
  volunteer: [
    'How do I pick up a task?',
    'How do I update complaint status?',
    'What does each status mean?',
    'How do I use GPS navigation?',
  ],
  admin: [
    'Show me complaint statistics',
    'How do I assign workers?',
    'What are the complaint categories?',
    'How does the workflow operate?',
  ],
  guest: [
    'What is NagarSeva?',
    'How do I register?',
    'What types of issues can I report?',
    'How does the platform work?',
  ],
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/dashboard': 'Citizen Dashboard',
  '/complaints/new': 'File Complaint',
  '/volunteer': 'Volunteer Portal',
  '/admin': 'Admin Dashboard',
  '/admin/complaints': 'Admin Complaints',
  '/admin/login': 'Admin Login',
}

export default function Chatbot() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const { data: profile } = useUserProfile(user?.id)
  const { data: userComplaints } = useUserComplaints(user?.id)
  const { data: allComplaints } = useRecentComplaints(100)

  const userRole = profile?.role || 'guest'
  const isGuest = !isAuthenticated

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInitialized = useRef(false)

  // Set welcome message based on role
  useEffect(() => {
    if (hasInitialized.current) return
    const role = isGuest ? 'guest' : userRole
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGES[role] || WELCOME_MESSAGES.guest,
    }
    setMessages([welcomeMsg])
    hasInitialized.current = true
  }, [isGuest, userRole])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Build context to send with each request
  const buildContext = useCallback(() => {
    const context: Record<string, any> = {
      currentPage: PAGE_LABELS[pathname] || pathname,
      userRole: isGuest ? 'guest' : userRole,
    }

    if (profile) {
      context.userName = profile.full_name
    }

    if (userRole === 'citizen' && userComplaints) {
      context.complaintsTotal = userComplaints.length
      context.complaintsPending = userComplaints.filter((c: any) =>
        c.status === 'pending' || c.status === 'under_review'
      ).length
      context.complaintsResolved = userComplaints.filter((c: any) =>
        c.status === 'resolved'
      ).length
    }

    if (userRole === 'volunteer') {
      context.isOnDuty = profile?.is_on_duty || false
      const assigned = allComplaints?.filter(
        (c: any) => c.assigned_volunteer_id === user?.id
      )
      context.assignedTasks = assigned?.filter(
        (c: any) => c.status !== 'resolved' && c.status !== 'rejected'
      ).length || 0
    }

    if (userRole === 'admin' && allComplaints) {
      context.complaintsTotal = allComplaints.length
      context.complaintsPending = allComplaints.filter((c: any) =>
        c.status === 'pending'
      ).length
      context.complaintsResolved = allComplaints.filter((c: any) =>
        c.status === 'resolved'
      ).length
    }

    return context
  }, [pathname, isGuest, userRole, profile, userComplaints, allComplaints, user?.id])

  const sendMessage = async (content?: string) => {
    const text = (content || input).trim()
    if (!text || isLoading || cooldown) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome' && !m.error)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content,
        }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          context: buildContext(),
        }),
        signal: AbortSignal.timeout(45000),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get response')
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
      }

      setMessages((prev) => [...prev, aiMessage])
      if (!isOpen) setHasNewMessage(true)
    } catch (error: any) {
      const isRateLimit = error.message?.includes('busy') || error.message?.includes('try again')
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error.name === 'TimeoutError'
            ? 'The request timed out. Please try again.'
            : error.message || 'Something went wrong. Please try again.',
        error: true,
      }
      setMessages((prev) => [...prev, errorMessage])

      // If rate limited, add a 5s cooldown
      if (isRateLimit) {
        setCooldown(true)
        setTimeout(() => setCooldown(false), 5000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'user')
    if (lastUserMessage) {
      setMessages((prev) => prev.filter((m) => !m.error))
      sendMessage(lastUserMessage.content)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setHasNewMessage(false)
  }

  const formatContent = (text: string) => {
    // Escape HTML entities first
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // 1. Markdown links: [text](url)
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary underline underline-offset-2 hover:text-primary/80 font-medium">$1</a>'
    )

    // 2. Bold: **text**
    html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')

    // 3. Italic: *text* (but not inside already processed tags)
    html = html.replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, '<em>$1</em>')

    // 4. Standalone routes: /path (only at word boundary, not inside href="...")
    html = html.replace(
      /(?<!="|\/\w)(\/(?:login|signup|dashboard|complaints\/new|volunteer|admin\/complaints|admin\/login|admin))\b/g,
      '<a href="$1" class="text-primary underline underline-offset-2 hover:text-primary/80 font-medium">$1</a>'
    )

    // 5. Newlines to <br/>
    html = html.replace(/\n/g, '<br/>')

    return html
  }

  const currentRole = isGuest ? 'guest' : userRole
  const suggestions = SUGGESTIONS_BY_ROLE[currentRole] || SUGGESTIONS_BY_ROLE.guest

  // Header subtitle based on role
  const headerSubtitle = isGuest
    ? 'Ask me anything'
    : currentRole === 'citizen'
      ? `Hi ${profile?.full_name?.split(' ')[0] || 'there'}!`
      : currentRole === 'volunteer'
        ? `Field Agent Mode`
        : currentRole === 'admin'
          ? `Admin Mode`
          : 'Always here to help'

  return (
    <>
      {/* Chat Panel */}
      <div
        className={cn(
          'fixed z-[100] transition-all duration-500 ease-out',
          isOpen
            ? 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] opacity-100 translate-y-0 scale-100'
            : 'bottom-6 right-6 w-0 h-0 opacity-0 translate-y-4 scale-95 pointer-events-none'
        )}
      >
        <div className="flex flex-col h-full bg-white sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-emerald-600 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">NagarSeva AI</p>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                  {headerSubtitle}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
              onClick={toggleChat}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300',
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1',
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : msg.error
                        ? 'bg-red-100 text-red-500'
                        : 'bg-emerald-100 text-emerald-600'
                  )}
                >
                  {msg.role === 'user' ? (
                    <User className="w-3.5 h-3.5" />
                  ) : msg.error ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-md'
                      : msg.error
                        ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-md'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-md'
                  )}
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: formatContent(msg.content),
                    }}
                  />
                  {msg.error && (
                    <button
                      onClick={handleRetry}
                      disabled={cooldown}
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {cooldown ? 'Wait a moment...' : 'Retry'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 animate-in fade-in duration-300">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Suggestions */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                  Quick Questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 px-3 py-2 rounded-xl transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  cooldown
                    ? 'Please wait a moment...'
                    : 'Ask me anything about NagarSeva...'
                }
                className="flex-1 h-11 rounded-xl border-2 border-slate-100 focus:border-primary bg-slate-50 focus:bg-white text-sm px-4 transition-colors"
                disabled={isLoading || cooldown}
                maxLength={2000}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading || cooldown}
                size="icon"
                className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 shrink-0 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-[9px] text-slate-400 text-center mt-2 font-medium">
              Powered by Gemini AI · {PAGE_LABELS[pathname] || 'NagarSeva'}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Bubble */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
          <span className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-75 pointer-events-none" />
        </button>
      )}
    </>
  )
}
