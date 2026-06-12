import { getMyBookings } from "@/app/actions/bookings"
import { ProfileClient } from "@/components/profile-client"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { requireUser } from "@/lib/session"
import { redirect } from "next/navigation"

export const metadata = {
  title: "My Profile | Apex Karting",
}

export default async function ProfilePage() {
  let user
  try {
    user = await requireUser()
  } catch {
    redirect("/sign-in")
  }

  const bookings = await getMyBookings()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <header className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            My profile
          </h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Manage your racer details and review your booked track sessions.
          </p>
        </header>
        <ProfileClient user={user} initialBookings={bookings} />
      </main>
      <SiteFooter />
    </div>
  )
}
