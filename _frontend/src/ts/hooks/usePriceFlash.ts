import { useEffect, useRef, useState } from 'react'

/**
 * usePriceFlash
 * Returns a set of IDs whose price changed without a position change.
 * The flash clears after `durationMs`.
 */
export function usePriceFlash<T extends { id: string | number; totalPrice: number }>(
    items: T[],
    displayOrder: T[],
    durationMs = 600,
): Set<string> {
    const prevPrices = useRef<Map<string, number>>(new Map())
    const prevPositions = useRef<Map<string, number>>(new Map())
    const [flashIds, setFlashIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        const changed = new Set<string>()

        items.forEach((item) => {
            const id = item.id.toString()
            const prevPrice = prevPrices.current.get(id)
            const prevPos = prevPositions.current.get(id)
            const newPos = displayOrder.findIndex((s) => s.id.toString() === id)
            const positionChanged = prevPos !== undefined && prevPos !== newPos

            if (prevPrice !== undefined && prevPrice !== item.totalPrice && !positionChanged) {
                changed.add(id)
            }

            prevPrices.current.set(id, item.totalPrice)
        })

        displayOrder.forEach((item, index) => {
            prevPositions.current.set(item.id.toString(), index)
        })

        if (changed.size > 0) {
            setFlashIds(changed)
            setTimeout(() => setFlashIds(new Set()), durationMs)
        }
    }, [items, displayOrder, durationMs])

    return flashIds
}
