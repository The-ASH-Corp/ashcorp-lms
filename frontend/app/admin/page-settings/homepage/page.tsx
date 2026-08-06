import type { ComponentType } from "react"
import {
  Bell,
  Blocks,
  Check,
  CircleDot,
  Eye,
  GraduationCap,
  LayoutTemplate,
  MessageSquareText,
  Plus,
  Rocket,
  Settings,
  Sparkles,
  Star,
  X,
} from "lucide-react"

type MetricCardProps = {
  icon: ComponentType<{ className?: string }>
  badge: string
  badgeTone: "violet" | "slate" | "red"
  title: string
  value: string
  trend?: string
  trendTone?: "green" | "violet"
}

type CategoryCardProps = {
  title: string
  count: string
  status: "Active" | "Hidden"
  gradient: string
}

function HeaderStrip() {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-violet-100 bg-white p-5 shadow-[0_12px_32px_-22px_rgba(124,58,237,0.55)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
          <CircleDot className="size-4 text-violet-500" />
          <input
            readOnly
            value="Search academy data..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center justify-between gap-5">
          <button className="relative rounded-full p-2 text-slate-600 transition hover:bg-violet-50">
            <Bell className="size-4" />
            <span className="absolute right-1 top-1 inline-block size-1.5 rounded-full bg-violet-600" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="text-right leading-tight">
              <p className="text-[11px] uppercase tracking-[0.17em] text-slate-500">
                Academy Admin
              </p>
              <p className="text-xs font-medium tracking-[0.12em] text-slate-800">
                Principal Level
              </p>
            </div>
            <div className="grid size-7 place-items-center rounded-full bg-violet-600 text-white">
              <GraduationCap className="size-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-700">
            <span className="inline-block size-1.5 rounded-full bg-violet-600" />
            Live Environment
          </div>
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
            Landing Page Orchestration
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Central command for Ash Academy&apos;s primary public interface.
            Monitor section health, approve incoming testimonials, and
            orchestrate featured content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50">
            <Eye className="size-4" />
            Preview Draft
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-14px_rgba(124,58,237,0.9)] transition hover:bg-violet-700">
            <Rocket className="size-4" />
            Publish Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  badge,
  badgeTone,
  title,
  value,
  trend,
  trendTone,
}: MetricCardProps) {
  const badgeToneClass =
    badgeTone === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700"
      : badgeTone === "red"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-white text-slate-600"

  const trendClass =
    trendTone === "green" ? "text-emerald-600" : "text-violet-600"

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.2)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="grid size-8 place-items-center rounded-lg border border-violet-100 bg-violet-50 text-violet-600">
          <Icon className="size-4" />
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badgeToneClass}`}
        >
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
      {trend ? <p className={`mt-1 text-xs ${trendClass}`}>{trend}</p> : null}
    </div>
  )
}

function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={LayoutTemplate}
        badge="Hero Active"
        badgeTone="violet"
        title="Primary CTA Conversions"
        value="14.2%"
        trend="↗ +2.1%"
        trendTone="green"
      />
      <MetricCard
        icon={Blocks}
        badge="12 Live"
        badgeTone="slate"
        title="Categories Orchestrated"
        value="8/12 Optimized"
      />
      <MetricCard
        icon={GraduationCap}
        badge="Highlights"
        badgeTone="slate"
        title="Featured Courses"
        value="24 Rotated Weekly"
      />
      <MetricCard
        icon={MessageSquareText}
        badge="Action Req"
        badgeTone="red"
        title="Pending Testimonials"
        value="5 Awaiting Review"
      />
    </div>
  )
}

function HeroOrchestrationCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
          <Sparkles className="size-4 text-violet-600" />
          Hero Orchestration
        </h2>
        <button className="rounded-md p-1.5 text-slate-500 transition hover:bg-violet-50 hover:text-violet-700">
          <Settings className="size-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-linear-to-b from-violet-50 to-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Main Headline
        </p>
        <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900">
          Master the Art of Creative Learning
        </div>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Subheadline
        </p>
        <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          Join a global community of lifelong learners and industry experts.
          Unlock your potential today.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
            Edit Primary CTA
          </button>
          <button className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50">
            Edit Secondary CTA
          </button>
        </div>
      </div>
    </section>
  )
}

function FeaturedCoursesCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4">
      <h2 className="mb-4 inline-flex items-center gap-2 text-base font-semibold text-slate-900">
        <Star className="size-4 text-violet-600" />
        Featured Courses
      </h2>

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-14 rounded-md bg-linear-to-br from-violet-200 to-violet-50" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-900">
                Advanced UI Architecture
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>12.4k</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <Star className="size-3 fill-amber-500 text-amber-500" />
                  4.9
                </span>
              </div>
            </div>
          </div>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 bg-violet-50 px-3 py-4 text-sm text-violet-700 transition hover:bg-violet-100">
          <Plus className="size-4" />
          Add to Carousel
        </button>
      </div>
    </section>
  )
}

function GraduateStoriesCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Graduate Stories</h2>
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
          5
        </span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="mb-3 flex items-start gap-2">
          <div className="mt-0.5 grid size-7 place-items-center rounded-full bg-linear-to-br from-violet-200 to-violet-100 text-[10px] font-semibold text-violet-900">
            SJ
          </div>
          <div>
            <p className="text-sm text-slate-900">Sarah Jenkins</p>
            <p className="text-[11px] text-slate-500">UX Design Cohort &apos;23</p>
          </div>
        </div>

        <blockquote className="text-xs italic text-slate-600">
          &quot;The structure and approach to design thinking completely changed
          how I tackle product work.&quot;
        </blockquote>

        <div className="mt-3 flex items-center gap-2">
          <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-violet-600 bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700">
            <Check className="size-3.5" />
            Approve
          </button>
          <button className="inline-flex size-7 items-center justify-center rounded-md border border-violet-200 bg-white text-violet-700 transition hover:bg-violet-50">
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <button className="mt-3 w-full rounded-lg border border-violet-600 bg-violet-600 px-3 py-2 text-sm text-white transition hover:bg-violet-700">
        Open Moderation Queue
      </button>
    </section>
  )
}

function CategoryCard({ title, count, status, gradient }: CategoryCardProps) {
  const statusClass =
    status === "Active"
      ? "bg-violet-100 text-violet-700"
      : "bg-slate-200 text-slate-700"

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-2.5">
      <div className={`mb-2 h-20 rounded-xl bg-linear-to-br ${gradient}`} />
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm text-slate-900">{title}</h3>
        <span className={`rounded px-1.5 py-0.5 text-[10px] ${statusClass}`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500">{count}</p>
    </article>
  )
}

function CategoryMatrixCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Category Matrix</h2>
          <p className="mt-1 text-sm text-slate-600">
            Arrange and toggle subject pillars.
          </p>
        </div>
        <button className="text-sm font-medium text-violet-600 transition hover:text-violet-700">
          View All Categories →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <CategoryCard
          title="Technology"
          count="24 Courses"
          status="Active"
          gradient="from-violet-100 via-violet-200/70 to-violet-300/60"
        />
        <CategoryCard
          title="Digital Marketing"
          count="18 Courses"
          status="Active"
          gradient="from-violet-100 via-fuchsia-100 to-violet-300/70"
        />
        <CategoryCard
          title="Design Arts"
          count="Drafting (9)"
          status="Hidden"
          gradient="from-slate-200 via-slate-300 to-slate-400"
        />
      </div>
    </section>
  )
}

export default function LandingPageSettings() {
  return (
    <main className="min-h-screen rounded-3xl border border-violet-100 bg-white p-4 text-slate-900 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-300 space-y-4">
        <HeaderStrip />
        <MetricsGrid />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.65fr_0.85fr]">
          <div className="space-y-4">
            <HeroOrchestrationCard />
            <CategoryMatrixCard />
          </div>

          <div className="space-y-4">
            <FeaturedCoursesCard />
            <GraduateStoriesCard />
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_5%,rgba(124,58,237,0.09),transparent_28%),radial-gradient(circle_at_90%_90%,rgba(124,58,237,0.07),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-violet-100 to-transparent" />
    </main>
  )
}