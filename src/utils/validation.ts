// File: src/utils/validation.ts
export const validatePhoneNumber = (phone: string): string | undefined => {
  const digitsOnly = phone.replace(/\D/g, '')
  if (digitsOnly.length === 0) return undefined
  if (digitsOnly.length < 10) return 'Phone number must be at least 10 digits'
  if (digitsOnly.length > 15) return 'Phone number is too long'
  return undefined
}

export const validateEventName = (name: string): string | undefined => {
  if (name.trim().length === 0) return undefined
  if (name.trim().length < 3) return 'Event name must be at least 3 characters'
  if (name.length > 100) return 'Event name is too long (max 100 characters)'
  return undefined
}

export const validateDateTime = (dt: string): string | undefined => {
  if (dt.trim().length === 0) return undefined
  if (dt.trim().length < 5) return 'Please enter a valid date and time'
  return undefined
}

export const validateLocation = (loc: string): string | undefined => {
  if (loc.trim().length === 0) return undefined
  if (loc.trim().length < 3) return 'Location must be at least 3 characters'
  if (loc.length > 200) return 'Location is too long (max 200 characters)'
  return undefined
}

export const validateCost = (cost: string): string | undefined => {
  if (cost.trim().length === 0) return undefined
  const numericValue = parseFloat(cost.replace(/[$,]/g, ''))
  if (isNaN(numericValue)) return 'Please enter a valid cost'
  if (numericValue < 0) return 'Cost cannot be negative'
  if (numericValue > 1000000) return 'Cost is too high'
  return undefined
}
