export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const ACCEPTED_IMAGE_LABEL = 'JPG, JPEG, PNG'

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png'])
const ACCEPTED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png'])

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function validateImageFile(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  const hasValidType = ACCEPTED_TYPES.has(file.type)
  const hasValidExtension = ACCEPTED_EXTENSIONS.has(extension)

  if (!hasValidType && !hasValidExtension) {
    return 'Please choose a JPG, JPEG, or PNG image.'
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image must be 10 MB or smaller.'
  }

  return null
}
