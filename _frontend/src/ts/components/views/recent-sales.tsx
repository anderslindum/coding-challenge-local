import React from 'react'
import formatPrice from '../../helpers/format-price'
import Table from '../widgets/table'
import { Card } from '../widgets/card'
import { Sale } from '../../context/sales-context'

export interface RecentSalesViewProps {
    recentSales: Sale[]
    visible: boolean
}

export const RecentSalesView: React.FC<RecentSalesViewProps> = ({ recentSales, visible }) => {
    return (
        <div className={`${visible ? 'block' : 'hidden'}`}>
            <Card>
                <Card.InsetBody>
                    <Table id='recent-sales' title='Recent Sales'>
                        <Table.Headers>
                            <Table.Header>User</Table.Header>
                            <Table.Header>Product</Table.Header>
                            <Table.Header>Duration</Table.Header>
                            <Table.Header>Subscription price</Table.Header>
                        </Table.Headers>
                        <Table.Body>
                            {recentSales.map((sale) => (
                                <Table.Row key={sale.id}>
                                    <Table.Cell>{sale.name}</Table.Cell>
                                    <Table.Cell>{sale.productName}</Table.Cell>
                                    <Table.Cell>{sale.duration} months</Table.Cell>
                                    <Table.Cell>
                                        <span>{formatPrice(sale.totalPrice)}</span>
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
