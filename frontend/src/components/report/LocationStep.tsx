import { LoaderCircle, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { LocationData } from '../../types'
import { isValidLatitude, isValidLongitude } from '../../utils/report'
import { Button } from '../ui/Button'
import { StepNav } from './StepNav'

type LocationStepProps = {
  location: LocationData
  onChange: (patch: Partial<LocationData>) => void
  onBack: () => void
  onContinue: () => void
}

export function LocationStep({
  location,
  onChange,
  onBack,
  onContinue,
}: LocationStepProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    latitude?: string
    longitude?: string
  }>({})

  function update(field: keyof LocationData, value: string) {
    onChange({ [field]: value })
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is unavailable on this device. Enter coordinates manually.')
      return
    }

    setIsLocating(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        })
        setFieldErrors({})
        setIsLocating(false)
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission was denied. Enter coordinates manually.')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGeoError('Geolocation is unavailable. Enter coordinates manually.')
        } else {
          setGeoError('Could not get your location. Enter coordinates manually.')
        }
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function handleContinue() {
    const nextErrors = {
      latitude: isValidLatitude(location.latitude)
        ? undefined
        : 'Enter a latitude between -90 and 90.',
      longitude: isValidLongitude(location.longitude)
        ? undefined
        : 'Enter a longitude between -180 and 180.',
    }

    setFieldErrors(nextErrors)

    if (nextErrors.latitude || nextErrors.longitude) {
      return
    }

    onContinue()
  }

  return (
    <div>
      <p className="text-sm leading-6 text-slate-600">
        Attach GPS coordinates or enter them manually. An address description is
        optional.
      </p>

      <Button
        variant="secondary"
        className="mt-5"
        onClick={useCurrentLocation}
        disabled={isLocating}
      >
        {isLocating ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <MapPin className="h-4 w-4" aria-hidden="true" />
        )}
        {isLocating ? 'Getting location…' : 'Use My Current Location'}
      </Button>

      {geoError ? (
        <p className="mt-3 text-sm font-medium text-severity-high" role="alert">
          {geoError}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          id="latitude"
          label="Latitude"
          value={location.latitude}
          placeholder="e.g. 28.613900"
          error={fieldErrors.latitude}
          onChange={(value) => update('latitude', value)}
        />
        <Field
          id="longitude"
          label="Longitude"
          value={location.longitude}
          placeholder="e.g. 77.209000"
          error={fieldErrors.longitude}
          onChange={(value) => update('longitude', value)}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="location-description" className="mb-1.5 block text-sm font-semibold text-navy-900">
          Location description
          <span className="ml-1 font-medium text-slate-500">(optional)</span>
        </label>
        <textarea
          id="location-description"
          rows={3}
          value={location.description}
          onChange={(event) => update('description', event.target.value)}
          placeholder="Landmark, ward, or street name"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-100"
        />
      </div>

      <StepNav onBack={onBack} onContinue={handleContinue} continueLabel="Continue" />
    </div>
  )
}

function Field({
  id,
  label,
  value,
  placeholder,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-100"
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-severity-high" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
