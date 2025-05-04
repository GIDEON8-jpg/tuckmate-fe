// app/layout.tsx
import './globals.css'
import SWRegister from './sw-register'
import { ReactNode } from 'react'

export const metadata = {
    title: 'Tuckmate',
    description: 'Tuckmate Application'
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#000000" />
            <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body>
        <SWRegister />
        {children}
        </body>
        </html>
    )
}
