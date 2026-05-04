import React, { useMemo } from 'react'
import { useListFlipAnimation } from '../../hooks/useListFlipAnimation'
import { usePriceFlash } from '../../hooks/usePriceFlash'
import Table from '../widgets/table'
import { Card } from '../widgets/card'
import { Seller } from '../../context/sales-context'
import formatPrice from '../../helpers/format-price'

export interface TopSalesViewProps {
    sellers: Seller[]
    visible: boolean
}

export const TopSalesView: React.FC<TopSalesViewProps> = ({ sellers, visible }) => {
    const activeSellers = useMemo(() => sellers.filter((s) => s.totalPrice > 0).slice(0, 10), [sellers])

    const { displayOrder, newIds, registerRowRef } = useListFlipAnimation(activeSellers, visible, (list) =>
        [...list].sort((a, b) => b.totalPrice - a.totalPrice),
    )

    const flashIds = usePriceFlash(activeSellers, displayOrder)

    return (
        <div className={`overflow-y-hidden pb-4 ${visible ? 'block' : 'hidden'}`}>
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
