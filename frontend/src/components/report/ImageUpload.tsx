import { ImagePlus, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { formatFileSize, validateImageFile } from '../../utils/file'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'
import { StepNav } from './StepNav'

type ImageUploadProps = {
  file: File | null
  previewUrl: string | null
  onSelect: (file: File) => void
  onRemove: () => void
  onContinue: () => void
}

export function ImageUpload({
  file,
  previewUrl,
  onSelect,
  onRemove,
  onContinue,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function applyFile(nextFile: File | undefined) {
    if (!nextFile) {
      return
    }

    const validationError = validateImageFile(nextFile)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onSelect(nextFile)
  }

  function openFilePicker() {
    inputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={inputRef}
        id="issue-photo"
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(event) => {
          applyFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />

      {file && previewUrl ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src={previewUrl}
              alt="Selected infrastructure issue"
              className="max-h-80 w-full object-contain"
            />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy-900">{file.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={openFilePicker}>
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                Change Photo
              </Button>
              <Button variant="ghost" onClick={onRemove}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={openFilePicker}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            applyFile(event.dataTransfer.files[0])
          }}
          className={cn(
            'flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center',
            isDragging
              ? 'border-navy-700 bg-navy-50'
              : 'border-slate-300 bg-slate-50 hover:border-navy-400 hover:bg-white',
          )}
        >
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-navy-800 shadow-sm">
            <Upload className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="text-lg font-bold text-navy-900">Upload a photo of the issue</p>
          <p className="mt-1 text-sm text-slate-600">
            Drag & drop or browse from your device
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Supported: JPG, JPEG, PNG · Max size: 10 MB
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={(event) => {
              event.stopPropagation()
              openFilePicker()
            }}
          >
            Browse Files
          </Button>
        </div>
      )}

      {error ? (
        <p className="mt-3 text-sm font-medium text-severity-high" role="alert">
          {error}
        </p>
      ) : null}

      <StepNav
        continueLabel="Continue to Analysis"
        continueDisabled={!file}
        onContinue={onContinue}
      />
    </div>
  )
}
