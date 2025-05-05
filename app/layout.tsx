'use client';  // This ensures it's a Client Component

import { ProductProvider } from '@/contexts/product-context'; // Adjust the path if necessary
import { OrderProvider } from '@/contexts/order-context';     // Adjust the path if necessary

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProductProvider>
            <OrderProvider>
                {children}
            </OrderProvider>
        </ProductProvider>
    );
}
