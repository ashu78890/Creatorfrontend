export const formatCurrency = (value: number, currency = "USD") => {
  const safeCurrency = currency ? currency.toUpperCase() : "USD"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: 0
  }).format(value)
}

export const formatCurrencyCompact = (value: number, currency = "USD") => {
  const safeCurrency = currency ? currency.toUpperCase() : "USD"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: safeCurrency,
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  }).format(value)
}
