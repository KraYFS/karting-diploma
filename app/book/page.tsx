import { getAvailableDates, getMyBookings } from "@/app/actions/bookings"
import { BookingClient } from "@/components/booking-client"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function BookPage() {
  const session = await getSession()
  if (!session?.user) redirect("/sign-in")

  const [availableDates, bookings] = await Promise.all([
    getAvailableDates(),
    getMyBookings(),
  ])

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Book a session
          </h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Choose a date, grab an open slot, and lock in your track time. You
            can cancel any time before the session.
          </p>
        </header>
        <BookingClient
          availableDates={availableDates}
          initialBookings={bookings}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
