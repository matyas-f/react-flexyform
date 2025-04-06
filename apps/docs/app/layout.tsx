import './global.css'
import { RootProvider } from 'fumadocs-ui/provider'
import { Geist } from 'next/font/google'
import type { ReactNode } from 'react'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" cz-shortcut-listen="true">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
