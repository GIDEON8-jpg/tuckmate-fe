import { OrderProvider } from "@/contexts/order-context"
import { ProductProvider } from "@/contexts/product-context"
import { registerServiceWorker } from "@/lib/register-sw"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TuckMate App",
  description: "A modern tuck shop management system",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TuckMate'
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png'
  }
}

// test

export default function RootLayout({ children }) {
  // Register service worker
  typeof window !== 'undefined' && registerServiceWorker()

  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="TuckMate" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TuckMate" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        <link rel="manifest" href="/manifest.json"></link>
      </head>
      <body className={inter.className}>
        <ProductProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </ProductProvider>
      </body>
    </html>
  )
}
