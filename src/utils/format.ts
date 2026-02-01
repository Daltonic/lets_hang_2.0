// File: src/utils/format.ts
export const formatPhoneNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly.length <= 3) return digitsOnly
  if (digitsOnly.length <= 6)
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
  if (digitsOnly.length <= 10)
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
}

export const formatCurrency = (value: string): string => {
  const numericValue = value.replace(/[^\d.]/g, '')
  if (!numericValue) return ''
  const num = parseFloat(numericValue)
  if (isNaN(num)) return ''
  return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatDateForDisplay = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return date.toLocaleDateString('en-US', options)
}
