import React, { useRef, useEffect, useState, useLayoutEffect } from 'react'
import Table from '../widgets/table'
import { Card } from '../widgets/card'
import { Seller } from '../../context/sales-context'
import formatPrice from '../../helpers/format-price'

export interface TopSalesViewProps {
    sellers: Seller[]
    visible: boolean
}

export const TopSalesView: React.FC<TopSalesViewProps> = ({ sellers, visible }) => {
    const [displayOrder, setDisplayOrder] = useState<Seller[]>(sellers)

    const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map())
    const prevRects = useRef<Map<string, DOMRect>>(new Map())

    const measureBeforeUpdate = () => {
        rowRefs.current.forEach((el, id) => {
            prevRects.current.set(id, el.getBoundingClientRect())
        })
    }

    useEffect(() => {
        if (!visible) return

        // ✅ FIRST: measure current positions
        measureBeforeUpdate()

        const topSellers = [...sellers].sort((a, b) => b.totalPrice - a.totalPrice)
        setDisplayOrder(topSellers)
    }, [sellers])

    useLayoutEffect(() => {
        rowRefs.current.forEach((el, id) => {
            const prevRect = prevRects.current.get(id)
            if (!prevRect) return

            const newRect = el.getBoundingClientRect()
            const deltaY = prevRect.top - newRect.top

            if (deltaY !== 0) {
                el.style.setProperty('--flip-delta-y', `${deltaY}px`)
                el.classList.add('tr-flip', 'tr-flip--invert')

                requestAnimationFrame(() => {
                    el.classList.remove('tr-flip--invert')
                    el.classList.add('tr-flip--animate')
                })

                // Clean up after animation
                el.addEventListener(
                    'transitionend',
                    () => {
                        el.classList.remove('tr-flip--animate')
                        el.style.removeProperty('--flip-delta-y')
                    },
                    { once: true },
                )
            }
        })

        prevRects.current.clear()
    })

    return (
        <div className={`${visible ? 'block' : 'hidden'}`}>
            <Card>
                <Card.InsetBody>
                    <Table id='top-sales' title='Top Sales'>
                        <Table.Headers>
                            <Table.Header>User</Table.Header>
                            <Table.Header>Total sales</Table.Header>
                        </Table.Headers>
                        <Table.Body>
                            {displayOrder.map((seller, index) => (
                                <Table.Row
                                    key={seller?.id}
                                    ref={(el) => {
                                        if (el) rowRefs.current.set(seller.id, el)
                                        else rowRefs.current.delete(seller.id)
                                    }}
                                    data-seller-id={seller.id}>
                                    <Table.Cell>{seller?.name}</Table.Cell>
                                    <Table.Cell>
                                        <span>{formatPrice(seller?.totalPrice)}</span>
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
