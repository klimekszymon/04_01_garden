export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  if (maxLength <= 0) return ''
  if (maxLength <= 3) return '.'.repeat(maxLength)

  const truncatedLength = maxLength - 3
  return `${str.slice(0, truncatedLength)}...`
}
