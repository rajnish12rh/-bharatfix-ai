export function formatReportTimestamp(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function createEmptyLocation() {
  return {
    latitude: '',
    longitude: '',
    description: '',
  }
}

export function isValidLatitude(value: string): boolean {
  const latitude = Number(value)
  return value.trim().length > 0 && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
}

export function isValidLongitude(value: string): boolean {
  const longitude = Number(value)
  return (
    value.trim().length > 0 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  )
}
