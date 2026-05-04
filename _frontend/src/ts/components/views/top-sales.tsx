import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useListFlipAnimation } from '../../hooks/useListFlipAnimation'
import { usePriceFlash } from '../../hooks/usePriceFlash'
import Table from '../widgets/table'
import { Card } from '../widgets/card'
import { Seller } from '../../context/sales-context'
import formatPrice from '../../helpers/format-price'

export interface TopSalesViewProps {
    sellers: Seller[]
    visible: boolean
    topSize?: number
}

export const TopSalesView: React.FC<TopSalesViewProps> = ({ sellers, visible, topSize = 10 }) => {
    const [limit, setLimit] = useState(topSize)
    const prevTopNIdsRef = useRef<Set<string>>(new Set())
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const sorted = useMemo(() => sellers.filter((s) => s.totalPrice > 0).sort((a, b) => b.totalPrice - a.totalPrice), [sellers])

    // Detect new entrants to top n and temporarily expand to n+1 for 3 s
    useEffect(() => {
        const topNIds = new Set(sorted.slice(0, topSize).map((s) => s.id.toString()))
        const hasNewEntry = prevTopNIdsRef.current.size > 0 && Array.from(topNIds).some((id) => !prevTopNIdsRef.current.has(id))
        prevTopNIdsRef.current = topNIds

        if (hasNewEntry) {
            setLimit(topSize + 1)
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setLimit(topSize), 3000)
        }
    }, [sorted, topSize])

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        },
        [],
    )

    const activeSellers = useMemo(() => sorted.slice(0, limit), [sorted, limit])

    const { displayOrder, newIds, registerRowRef } = useListFlipAnimation(activeSellers, visible, (list) =>
        [...list].sort((a, b) => b.totalPrice - a.totalPrice),
    )

    const flashIds = usePriceFlash(activeSellers, displayOrder)

    return (
        <div className={`overflow-y-hidden pb-8 ${visible ? 'block' : 'hidden'}`}>
            <Card>
                <Card.InsetBody>
                    <Table id='top-sales' title='Top Sales'>
                        <Table.Headers>
                            <Table.Header>User</Table.Header>
                            <Table.Header>Total sales</Table.Header>
                        </Table.Headers>
                        <Table.Body>
                            {displayOrder.map((seller) => (
                                <Table.Row
                                    key={seller?.id}
                                    ref={registerRowRef(seller.id.toString())}
                                    data-seller-id={seller.id}
                                    className={newIds.has(seller.id.toString()) ? 'tr-new' : ''}>
                                    <Table.Cell>{seller?.name}</Table.Cell>
                                    <Table.Cell>
                                        <span className={flashIds.has(seller.id.toString()) ? 'price-flash' : ''}>
                                            {formatPrice(seller?.totalPrice)}
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </Card.InsetBody>
            </Card>
        </div>
    )
}
