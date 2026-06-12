import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const values = [
  "Race-prepped 390cc sprint karts serviced before every session",
  "Floodlit 1.2km circuit open seven days a week",
  "Mandatory safety briefing and certified gear for all drivers",
  "Live transponder timing and online lap-time history",
  "Friendly marshals and a welcoming members community",
]

const hours = [
  { day: "Monday – Thursday", time: "4:00 PM – 10:00 PM" },
  { day: "Friday", time: "2:00 PM – 11:00 PM" },
  { day: "Saturday – Sunday", time: "10:00 AM – 11:00 PM" },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">
                About the club
              </p>
              <h1 className="mt-3 text-balance font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                Built by racers, for racers
              </h1>
              <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
                Apex Karting Club started with a simple idea: make competitive
                karting accessible, social, and seriously fast. Our floodlit
                circuit and pro-spec fleet give every member — from first-timers
                to seasoned racers — a place to push their limits and shave
                tenths off their lap times.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/book">Book a Session</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/sign-up">Join the Club</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60">
              <Image
                src="/track-map.png"
                alt="Aerial view of the Apex Karting circuit"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                What every session includes
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
                {values.map((v) => (
                  <li key={v} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="leading-relaxed text-muted-foreground">
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                Opening hours
              </h3>
              <dl className="mt-4 flex flex-col gap-3">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center justify-between border-b border-border/40 pb-3 text-sm last:border-0 last:pb-0"
                  >
                    <dt className="text-muted-foreground">{h.day}</dt>
                    <dd className="font-medium">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  14 Circuit Drive, Speedway Park
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  (555) 012-7788
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
