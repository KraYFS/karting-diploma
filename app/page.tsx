import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CalendarCheck,
  Gauge,
  ShieldCheck,
  Timer,
  Trophy,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const features = [
  {
    icon: CalendarCheck,
    title: "Real-time Booking",
    desc: "Reserve open track slots instantly and see live availability for every session.",
  },
  {
    icon: Gauge,
    title: "Pro-spec Karts",
    desc: "390cc sprint karts maintained to race standard, hitting up to 90 km/h on the straights.",
  },
  {
    icon: ShieldCheck,
    title: "Safety First",
    desc: "Full safety briefing, certified helmets, and marshalled sessions for every driver.",
  },
  {
    icon: Timer,
    title: "Live Timing",
    desc: "Lap-by-lap timing transponders so you can chase your personal best every lap.",
  },
]

const stats = [
  { value: "1.2km", label: "Floodlit circuit" },
  { value: "90km/h", label: "Top speed" },
  { value: "12", label: "Karts on grid" },
  { value: "7 days", label: "Open weekly" },
]

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-karting.png"
              alt="Go-karts racing on a floodlit circuit at golden hour"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
            <Badge className="mb-5 gap-1.5 bg-primary/15 text-primary hover:bg-primary/15">
              <Zap className="h-3.5 w-3.5" />
              Now taking bookings for the new season
            </Badge>
            <h1 className="max-w-2xl text-balance font-heading text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Book your seat. Chase the apex. Own the track.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Apex Karting Club is a members-first circuit for drivers who live
              for lap times. Reserve a session in seconds and go wheel-to-wheel
              on our floodlit 1.2km track.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/book">
                  <CalendarCheck className="h-5 w-5" />
                  Book a Session
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Explore the Club</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-2 py-6 text-center">
                <div className="font-heading text-3xl font-bold text-primary md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need for a perfect lap
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              From booking to chequered flag, the club is built around getting
              you on track and pushing your limits.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card to-secondary/40 px-6 py-14 text-center md:px-12">
            <Trophy className="mx-auto h-10 w-10 text-accent" />
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Ready to set a new personal best?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
              Join the club, pick an open slot, and we will see you on the grid.
              Membership is free — track time is unforgettable.
            </p>
            <Button asChild size="lg" className="mt-7 gap-2">
              <Link href="/sign-up">
                <Zap className="h-5 w-5" />
                Join the Club
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
