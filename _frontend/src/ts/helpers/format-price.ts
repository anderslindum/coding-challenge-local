export default function formatPrice(price: number | undefined) {
    if (price === undefined) return 'DKK 0,-'
    const formatted = new Intl.NumberFormat('da-DK').format(price)
    return formatted ? `DKK ${formatted},-` : 'DKK 0,-'
}
