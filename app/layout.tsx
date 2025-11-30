import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/Theme/Providers'

export const metadata: Metadata = {
  title: 'DemandeX - Gerenciando sua vida com inteligência',
  description: 'Aplicativo completo de gestão de vida para estudantes',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

