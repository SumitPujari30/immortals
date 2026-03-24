import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/shared/providers'
import { MainLayout } from '@/components/layout/MainLayout'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Nagar Seva - Smart Civic Complaint & Tracking Portal',
  description:
    'Empowering citizens to report, track, and resolve local issues. Smart Civic Complaint & Tracking Portal for a better community.',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
