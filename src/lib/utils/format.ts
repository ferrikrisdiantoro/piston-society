/**
 * Format a number as AUD currency
 */
export function formatCurrency(
  amount: number,
  options?: { compact?: boolean }
): string {
  if (options?.compact && amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`
  }
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a date string to a readable format (Australian style)
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Format a date to relative time (e.g. "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Calculate monthly price from weekly price
 */
export function weeklyToMonthly(weeklyPrice: number): number {
  return weeklyPrice * 4.33
}

/**
 * Format car name: Make + Model + Year
 */
export function formatCarName(make: string, model: string, year: number): string {
  return `${year} ${make} ${model}`
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('61') && cleaned.length === 11) {
    return `+61 ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }
  if (cleaned.startsWith('04') && cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

/**
 * Truncate text to a given character limit
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

/**
 * Generate a WhatsApp link with a pre-filled message
 */
export function generateWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const phoneNumber = cleaned.startsWith('0')
    ? `61${cleaned.slice(1)}`
    : cleaned
  const encodedMessage = encodeURIComponent(
    message ?? "Hi, I'm interested in your car subscription service!"
  )
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

/**
 * Format number with ordinal suffix (1st, 2nd, 3rd...)
 */
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
