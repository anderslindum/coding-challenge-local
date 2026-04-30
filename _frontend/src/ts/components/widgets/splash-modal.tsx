import React from 'react'
import formatPrice from '../../helpers/format-price'
import { Sale } from '../../context/sales-context'

interface SplashModalProps {
    sale: Sale
}

export const SplashModal: React.FC<SplashModalProps> = ({ sale }) => {
    const [newSale, setNewSale] = React.useState<SplashModalProps | null>(null)
    const [animate, setAnimate] = React.useState(false)

    React.useEffect(() => {
        setNewSale({ sale })
        setAnimate(true)
        const timer = setTimeout(() => {
            setAnimate(false)
            setNewSale(null)
        }, 5000)
        return () => clearTimeout(timer)
    }, [sale])

    if (!newSale) return null

    return (
        <div className={`splash-modal ${animate ? 'animate-fade-in-scale' : ''}`}>
            <div className='splash-modal__content'>
                <div className='splash-modal__content-icon'>
                    <span aria-hidden='true'>🍿</span>
                </div>
                <div className='splash-modal__details'>
                    <h2 className='splash-modal__details-title'>{sale.name}</h2>
                    <dl className='splash-modal__details-list'>
                        <div className='splash-modal__details-item'>
                            <dt className='splash-modal__details-item-label'>Product Name:</dt>
                            <dd className='splash-modal__details-item-value'>{sale.productName}</dd>
                        </div>
                        <div className='splash-modal__details-item'>
                            <dt className='splash-modal__details-item-label'>Total Price:</dt>
                            <dd className='splash-modal__details-item-value'>{formatPrice(sale.totalPrice)}</dd>
                        </div>
                    </dl>

                    <div className='mt-2 flex'>
                        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                            New Sale!
                        </span>
                        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                            {new Date(sale.timestamp).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
