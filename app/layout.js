import { OrderProvider } from "@/contexts/order-context"
import { ProductProvider } from "@/contexts/product-context"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TuckMate App",
  description: "A modern tuck shop management system",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProductProvider>
          <OrderProvider>{children}</OrderProvider>
        </ProductProvider>
      </body>
    </html>
  )
}



