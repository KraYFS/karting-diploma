import {
  getAdminStats,
  getAllBookings,
  getAllSlots,
} from "@/app/actions/admin"
import { AdminClient } from "@/components/admin-client"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { requireUser } from "@/lib/session"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Admin Panel | Apex Karting",
}

export default async function AdminPage() {
  let user
  try {
    user = await requireUser()
  } catch {
    redirect("/sign-in")
  }
  if (user.role !== "admin") redirect("/")

  const [stats, slots, bookings] = await Promise.all([
    getAdminStats(),
    getAllSlots(),
    getAllBookings(),
  ])

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Admin panel
          </h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Schedule track sessions, manage capacity, and keep an eye on member
            bookings.
          </p>
        </header>
        <AdminClient
          initialStats={stats}
          initialSlots={slots}
          initialBookings={bookings}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
