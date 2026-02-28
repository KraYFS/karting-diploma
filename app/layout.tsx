import './globals.scss'

import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

const MontserratSans = Montserrat({
  variable: '--font-montserrat-sans',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Karting School',
  description: 'karting school website its a diploma project for 4th year students of O.M Beketov University',
    icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${MontserratSans.variable}`}>{children}</body>
    </html>
  )
}
