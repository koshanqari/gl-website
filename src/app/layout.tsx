import type { Metadata } from 'next'
import { Montserrat, Source_Sans_3 } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600'],
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  weight: ['400', '600'],
})

export const metadata: Metadata = {
  title: 'Golden Lotus - Corporate Event Planning & Management',
  description: 'India\'s leading MICE and Experience Marketing Agency. Specialists in corporate events, conferences, product launches, and strategic experiential marketing.',
  keywords: 'corporate events, event planning, MICE, conferences, product launches, experiential marketing, India',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${sourceSans3.variable}`}>
      <body className="font-source-sans antialiased">
        {children}
      </body>
    </html>
  )
}
