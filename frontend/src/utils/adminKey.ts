const STORAGE_KEY = 'bharatfix-admin-key'

export function getAdminKey(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function setAdminKey(value: string): void {
  try {
    if (value) {
      sessionStorage.setItem(STORAGE_KEY, value)
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Storage can be unavailable (e.g. some private browsing modes).
  }
}
