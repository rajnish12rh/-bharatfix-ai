import { useEffect, useState } from 'react'
import { AnalysisStep } from '../components/report/AnalysisStep'
import { ImageUpload } from '../components/report/ImageUpload'
import { LocationStep } from '../components/report/LocationStep'
import { ReportProgress } from '../components/report/ReportProgress'
import { ReportSuccess } from '../components/report/ReportSuccess'
import { ReviewStep } from '../components/report/ReviewStep'
import { SeverityStep } from '../components/report/SeverityStep'
import { analyzeImage, createReport } from '../services/api'
import type { LocationData, ReportDraft, ReportStep, SeverityLevel } from '../types'
import { createEmptyLocation } from '../utils/report'

function createEmptyDraft(): ReportDraft {
  return {
    file: null,
    previewUrl: null,
    analysis: null,
    severity: null,
    location: createEmptyLocation(),
    reviewedAt: null,
  }
}

export function ReportIssuePage() {
  const [step, setStep] = useState<ReportStep>(1)
  const [draft, setDraft] = useState<ReportDraft>(createEmptyDraft)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [reportId, setReportId] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (draft.previewUrl) {
        URL.revokeObjectURL(draft.previewUrl)
      }
    }
  }, [draft.previewUrl])

  function goTo(next: ReportStep) {
    setStep(next)
  }

  function handleSelectFile(file: File) {
    setAnalysisError(null)
    setDraft((current) => {
      if (current.previewUrl) {
        URL.revokeObjectURL(current.previewUrl)
      }

      return {
        ...createEmptyDraft(),
        file,
        previewUrl: URL.createObjectURL(file),
      }
    })
  }

  function handleRemoveFile() {
    setAnalysisError(null)
    setDraft((current) => {
      if (current.previewUrl) {
        URL.revokeObjectURL(current.previewUrl)
      }

      return createEmptyDraft()
    })
  }

  async function handleAnalyze() {
    if (!draft.file || isAnalyzing) {
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const analysis = await analyzeImage(draft.file)
      setDraft((current) => ({
        ...current,
        analysis,
        severity: analysis.severity,
      }))
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  function handleSeverityChange(severity: SeverityLevel) {
    setDraft((current) => ({ ...current, severity }))
  }

  function handleLocationChange(patch: Partial<LocationData>) {
    setDraft((current) => ({
      ...current,
      location: { ...current.location, ...patch },
    }))
  }

  function handleContinueToReview() {
    setDraft((current) => ({
      ...current,
      reviewedAt: new Date().toISOString(),
    }))
    goTo(5)
  }

  async function handleSubmit() {
    if (!draft.file || !draft.analysis || !draft.severity) {
      setSubmitError('Please complete all report steps before submitting.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const saved = await createReport({
        file: draft.file,
        issueType: draft.analysis.detectedIssue,
        category: draft.analysis.category,
        confidence: draft.analysis.confidence,
        isDemoAnalysis: draft.analysis.isDemo,
        severity: draft.severity,
        latitude: draft.location.latitude,
        longitude: draft.location.longitude,
        locationDescription: draft.location.description,
      })
      setReportId(saved.reportId)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit report.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReportAnother() {
    if (draft.previewUrl) {
      URL.revokeObjectURL(draft.previewUrl)
    }

    setDraft(createEmptyDraft())
    setReportId(null)
    setSubmitError(null)
    setAnalysisError(null)
    setStep(1)
  }

  if (reportId) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <ReportSuccess reportId={reportId} onReportAnother={handleReportAnother} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
          Report an Infrastructure Issue
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Upload a photo of a road or public infrastructure problem. BharatFix AI
          will analyze the issue and help create a structured report.
        </p>
      </header>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-2 py-4 shadow-sm sm:px-4">
        <ReportProgress
          currentStep={step}
          onStepSelect={(nextStep) => {
            if (nextStep < step) {
              goTo(nextStep)
            }
          }}
        />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        {step === 1 ? (
          <ImageUpload
            file={draft.file}
            previewUrl={draft.previewUrl}
            onSelect={handleSelectFile}
            onRemove={handleRemoveFile}
            onContinue={() => goTo(2)}
          />
        ) : null}

        {step === 2 ? (
          <AnalysisStep
            previewUrl={draft.previewUrl}
            analysis={draft.analysis}
            isAnalyzing={isAnalyzing}
            error={analysisError}
            onAnalyze={() => {
              void handleAnalyze()
            }}
            onBack={() => goTo(1)}
            onContinue={() => goTo(3)}
          />
        ) : null}

        {step === 3 ? (
          <SeverityStep
            severity={draft.severity ?? 'High'}
            onChange={handleSeverityChange}
            onBack={() => goTo(2)}
            onContinue={() => goTo(4)}
          />
        ) : null}

        {step === 4 ? (
          <LocationStep
            location={draft.location}
            onChange={handleLocationChange}
            onBack={() => goTo(3)}
            onContinue={handleContinueToReview}
          />
        ) : null}

        {step === 5 ? (
          <ReviewStep
            draft={draft}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onBack={() => goTo(4)}
            onSubmit={() => {
              void handleSubmit()
            }}
          />
        ) : null}
      </section>
    </div>
  )
}
