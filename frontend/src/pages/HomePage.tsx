import {
  Camera,
  ChevronRight,
  ClipboardCheck,
  Gauge,
  MapPin,
  ScanSearch,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { HeroVisual } from '../components/ui/HeroVisual'
import type { ProcessStep, WorkflowItem } from '../types'

const workflow: Array<WorkflowItem & { icon: LucideIcon }> = [
  {
    title: 'Capture',
    description: 'Photograph the civic issue on site.',
    icon: Camera,
  },
  {
    title: 'Detect',
    description: 'AI identifies the infrastructure problem.',
    icon: ScanSearch,
  },
  {
    title: 'Prioritize',
    description: 'Severity is ranked for faster action.',
    icon: Gauge,
  },
  {
    title: 'Locate',
    description: 'GPS or map location is attached.',
    icon: MapPin,
  },
  {
    title: 'Report',
    description: 'A trackable civic report is created.',
    icon: ClipboardCheck,
  },
]

const processSteps: Array<ProcessStep & { icon: LucideIcon }> = [
  {
    number: '01',
    title: 'Upload / Capture',
    description: 'Citizen uploads a photo of the issue.',
    icon: Camera,
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'System identifies the likely infrastructure problem.',
    icon: ScanSearch,
  },
  {
    number: '03',
    title: 'Severity',
    description: 'Issue is classified as Low, Medium or High priority.',
    icon: Gauge,
  },
  {
    number: '04',
    title: 'Location',
    description: 'GPS or selected map location is attached.',
    icon: MapPin,
  },
  {
    number: '05',
    title: 'Report',
    description: 'A standardized report is generated for tracking.',
    icon: ClipboardCheck,
  },
]

export function HomePage() {
  return (
    <>
      <HeroSection />
      <WorkflowSection />
      <ProcessSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <Badge>
            <Sparkles className="h-3.5 w-3.5 text-civic" aria-hidden="true" />
            AI-Powered Civic Infrastructure Reporting
          </Badge>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance text-navy-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
            Spot a Problem.
            <br />
            Help Fix Your City.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Report potholes, road cracks and public infrastructure issues in
            seconds. BharatFix AI uses artificial intelligence to detect,
            prioritize and organize civic issues for faster action.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/report" className="px-6 py-3">
              Report an Issue
            </Button>
            <Button to="/dashboard" variant="secondary" className="px-6 py-3">
              View Dashboard
            </Button>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

function WorkflowSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-civic uppercase">
          How it works
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
          Capture → Detect → Prioritize → Locate → Report
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          A clear path from a street-level photo to a standardized civic report.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {workflow.map((item, index) => {
          const Icon = item.icon

          return (
            <article
              key={item.title}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {index < workflow.length - 1 ? (
                <ChevronRight
                  className="absolute top-6 -right-3 hidden h-5 w-5 text-navy-200 lg:block"
                  aria-hidden="true"
                />
              ) : null}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-navy-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-civic uppercase">
            Citizen to civic action
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            From a Photo to Action
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Five steps that turn a local infrastructure problem into a
            trackable report.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {processSteps.map((step) => {
            const Icon = step.icon

            return (
              <li
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-2xl font-bold tracking-tight text-navy-200">
                    {step.number}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-navy-800 shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-base font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
                {step.number === '03' ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-civic-soft px-2 py-0.5 text-[11px] font-semibold text-civic-dark">
                      Low
                    </span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-severity-medium">
                      Medium
                    </span>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-severity-high">
                      High
                    </span>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
