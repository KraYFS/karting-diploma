/** Formatting helpers shared across booking views. */

export function formatDateLong(dateStr: string): string {
  // dateStr is "YYYY-MM-DD". Parse as local to avoid TZ shifting the day.
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function formatTime(t: string): string {
  // t is "HH:MM" 24h. Convert to 12h.
  const [h, m] = t.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`
}

export function isPastDate(dateStr: string): boolean {
  const today = new Date().toISOString().slice(0, 10)
  return dateStr < today
}
