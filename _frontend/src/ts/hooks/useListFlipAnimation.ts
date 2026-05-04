import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'

/**
 * useListFlipAnimation
 * Handles FLIP animation for list reordering in a table.
 * Returns displayOrder and a registerRowRef callback for use in the component.
 */
export function useListFlipAnimation<T extends { id: string | number }>(sellers: T[], visible: boolean, sortFn: (list: T[]) => T[]) {
    const [displayOrder, setDisplayOrder] = useState<T[]>(sellers)
    const [newIds, setNewIds] = useState<Set<string>>(new Set())
    const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())
    const prevRects = useRef<Map<string, DOMRect>>(new Map())
    const prevIndexMap = useRef<Map<string, number>>(new Map())
    const prevIdsRef = useRef<Set<string>>(new Set(sellers.map((s) => s.id.toString())))
    const sortFnRef = useRef(sortFn)
    sortFnRef.current = sortFn

    // Ref callback for Table.Row
    const registerRowRef = useCallback(
        (id: string | number) => (el: HTMLTableRowElement | null) => {
            if (el) rowRefs.current.set(id.toString(), el)
            else rowRefs.current.delete(id.toString())
        },
        [],
    )

    // Measure before update
    const measureBeforeUpdate = useCallback(() => {
        rowRefs.current.forEach((el, id) => {
            prevRects.current.set(id, el.getBoundingClientRect())
        })
    }, [])

    // Update display order on sellers change
    useEffect(() => {
        if (!visible) return
        measureBeforeUpdate()
        const sorted = sortFnRef.current([...sellers])
        const currentIds = new Set(sorted.map((item) => item.id.toString()))
        const entered = new Set<string>()
        currentIds.forEach((id) => {
            if (!prevIdsRef.current.has(id)) entered.add(id)
        })
        prevIdsRef.current = currentIds
        if (entered.size > 0) {
            setNewIds(entered)
            setTimeout(() => setNewIds(new Set()), 1500)
        }
        setDisplayOrder(sorted)
    }, [sellers, visible, measureBeforeUpdate])

    // Animate rows using FLIP
    useLayoutEffect(() => {
        rowRefs.current.forEach((el, id) => {
            const prevRect = prevRects.current.get(id)
            if (!prevRect) return
            const newRect = el.getBoundingClientRect()
            const deltaY = prevRect.top - newRect.top
            if (deltaY !== 0) {
                // Calculate animation duration based on distance moved
                const BASE_MS = 850
                const STEP_EXTRA_MS = 40
                const prevIndex = prevIndexMap.current.get(id) ?? 0
                const newIndex = Array.from(rowRefs.current.keys()).indexOf(id)
                const steps = Math.abs(newIndex - prevIndex)
                const duration = BASE_MS + steps * STEP_EXTRA_MS

                el.style.setProperty('--flip-delta-y', `${deltaY}px`)
                el.style.setProperty('--flip-duration', `${duration}ms`)
                el.classList.add('tr-flip', 'tr-flip--invert')
                requestAnimationFrame(() => {
                    el.classList.remove('tr-flip--invert')
                    el.classList.add('tr-flip--animate')
                })
                el.addEventListener(
                    'transitionend',
                    () => {
                        el.classList.remove('tr-flip--animate')
                        el.style.removeProperty('--flip-delta-y')
                        el.style.removeProperty('--flip-duration')
                    },
                    { once: true },
                )
            }
        })
        prevRects.current.clear()
    })

    return { displayOrder, newIds, registerRowRef }
}
