import React from 'react'
import { RecentSalesView } from './views/recent-sales'
import { TopSalesView } from './views/top-sales'
import { SplashModal } from './widgets/splash-modal'
import { Header } from './views/header'
import { SalesConnnectorContext } from '../context/sales-connector'
import { SalesEvent } from '../services/messages'
import { Sale, useSalesContext } from '../context/sales-context'

export const DashBoardView = () => {
    const { hub, store } = React.useContext(SalesConnnectorContext)
    const { updateSellers, sellers, updateRecentSales, recentSales } = useSalesContext()
    const [mode, setMode] = React.useState<'top' | 'recent'>('top')
    const [splashQueue, setSplashQueue] = React.useState<Sale[]>([])
    const [currentSplash, setCurrentSplash] = React.useState<Sale | null>(null)

    // Auto-switch between modes: top (1 min), recent (30 sec)
    React.useEffect(() => {
        let timer: NodeJS.Timeout
        if (mode === 'top') {
            timer = setTimeout(() => setMode('recent'), 60_000)
        } else {
            timer = setTimeout(() => setMode('top'), 30_000)
        }
        return () => clearTimeout(timer)
    }, [mode])

    React.useEffect(() => {
        // initialize callback
        const cb = async (e: SalesEvent) => {
            let user = await store.getUser(e.userId)
            let product = await store.getProduct(e.productId)
            const totalPrice = product ? product.unitPrice * e.duration : 0
            if (user) {
                updateSellers({ id: e.userId, name: user.name, totalPrice: totalPrice })
            }
            if (product && user) {
                const now = Date.now()
                const id = `${e.userId}-${e.productId}-${now}`
                const sale = {
                    id: id,
                    timestamp: now,
                    name: user.name,
                    productName: product.name,
                    duration: e.duration,
                    totalPrice: totalPrice,
                } as Sale

                updateRecentSales(sale)
                setSplashQueue((prev) => [...prev, sale])
            }
        }
        hub.registerSalesEventListener(cb)
        return () => hub.unregisterSalesEventListener(cb)
    }, [])

    React.useEffect(() => {
        if (!currentSplash && splashQueue.length > 0) {
            const oldestItem = splashQueue.reduce((oldest, item) => (item.timestamp < oldest.timestamp ? item : oldest))
            setCurrentSplash(oldestItem)
        }
    }, [splashQueue, currentSplash])

    React.useEffect(() => {
        if (currentSplash) {
            const timer = setTimeout(() => {
                setSplashQueue((prev) => [...prev.filter((s) => s.id !== currentSplash.id)])
                setCurrentSplash(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [currentSplash])

    return (
        <>
            <div className='flex-auto p-5'>
                <Header />
                <RecentSalesView recentSales={recentSales} visible={mode === 'recent'} />
                <TopSalesView sellers={sellers} visible={mode === 'top'} />

                {currentSplash && <SplashModal sale={currentSplash} />}
            </div>
        </>
    )
}
