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
                    <div className='splash-modal__details-item'>
                        <div className='splash-modal__details-item-label'>{sale.productName}</div>
                        <div className='splash-modal__details-item-value'>{formatPrice(sale.totalPrice)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
