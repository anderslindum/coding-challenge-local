import React from 'react'
import { Users } from '../services/_private/db'

export interface Seller {
    id: string
    name: string
    totalPrice: number
}

export interface Sale {
    id: string
    timestamp: number
    name: string
    productName: string
    duration: number
    totalPrice: number
}

interface SalesContextProps {
    sellers: Seller[]
    updateSellers: (seller: Seller) => void
    recentSales: Sale[]
    updateRecentSales: (sale: Sale) => void
}

const SalesContext = React.createContext<SalesContextProps | undefined>(undefined)

export const SalesContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize sellers with all users from the database, each with totalPrice 0
    const [sellers, setSellers] = React.useState<Seller[]>(() =>
        Users.map((user) => ({ id: user.id.toString(), name: user.name, totalPrice: 0 })),
    )
    const [recentSales, setRecentSales] = React.useState<Sale[]>([])

    const updateSellers = (newSeller: Seller) => {
        setSellers((prev) => {
            return prev.map((seller) =>
                seller.id === newSeller.id ? { ...seller, totalPrice: seller.totalPrice + newSeller.totalPrice } : seller,
            )
        })
    }

    const updateRecentSales = (newSale: Sale) => {
        setRecentSales((prev) => {
            const updated = [...prev, newSale]
            return updated
                .sort((a, b) => b.timestamp - a.timestamp) // newest first
                .slice(0, 10)
        })
    }

    return <SalesContext.Provider value={{ sellers, updateSellers, recentSales, updateRecentSales }}>{children}</SalesContext.Provider>
}

export function useSalesContext() {
    const ctx = React.useContext(SalesContext)
    if (!ctx) throw new Error('useSalesContext must be used within SalesContextProvider')
    return ctx
}
