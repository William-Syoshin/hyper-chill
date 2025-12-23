import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HyperSystem - イベントチェックインシステム',
  description: '回遊型イベント用QRチェックインシステム',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gray-50">{children}</body>
    </html>
  )
}

