"use client"

import {
  cancelBooking,
  getMyBookings,
  updateProfileName,
  type MyBooking,
} from "@/app/actions/bookings"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDateLong, formatTime, isPastDate } from "@/lib/format"
import type { SessionUser } from "@/lib/session"
import { Calendar, Clock, Mail, ShieldCheck } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function ProfileClient({
  user,
  initialBookings,
}: {
  user: SessionUser
  initialBookings: MyBooking[]
}) {
  const [name, setName] = useState(user.name)
  const [bookings, setBookings] = useState<MyBooking[]>(initialBookings)
  const [savingName, startSaveName] = useTransition()
  const [pending, startTransition] = useTransition()

  const initials = (user.name || user.email)
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    startSaveName(async () => {
      try {
        await updateProfileName(name)
        toast.success("Name updated")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update name")
      }
    })
  }

  function handleCancel(bookingId: number) {
    startTransition(async () => {
      try {
        await cancelBooking(bookingId)
        toast.success("Booking cancelled")
        setBookings(await getMyBookings())
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not cancel")
      }
    })
  }

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && !isPastDate(b.date),
  )
  const past = bookings.filter(
    (b) => b.status !== "confirmed" || isPastDate(b.date),
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      {/* Account details */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary font-heading text-lg font-semibold text-secondary-foreground">
                {initials}
              </span>
              <div className="min-w-0">
                <CardTitle className="truncate font-heading text-xl">
                  {user.name || "Racer"}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{user.email}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user.role === "admin" && (
              <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                <ShieldCheck className="h-3.5 w-3.5" />
                Club Admin
              </Badge>
            )}
            <form onSubmit={handleSaveName} className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={60}
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={savingName || name.trim() === user.name}
              >
                {savingName ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Bookings */}
      <div className="flex flex-col gap-6">
        <section>
          <h2 className="font-heading text-lg font-semibold">
            Upcoming sessions
          </h2>
          {upcoming.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No upcoming sessions. Head to the booking page to reserve track
                time.
              </p>
              <Button asChild size="sm" className="mt-4">
                <a href="/book">Book a session</a>
              </Button>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {upcoming.map((b) => (
                <li
                  key={b.bookingId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4"
                >
                  <div>
                    <div className="font-heading text-base font-semibold">
                      {formatDateLong(b.date)}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {formatTime(b.startTime)} – {formatTime(b.endTime)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    disabled={pending}
                    onClick={() => handleCancel(b.bookingId)}
                  >
                    Cancel
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="font-heading text-lg font-semibold">History</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {past.map((b) => (
                <li
                  key={b.bookingId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {formatDateLong(b.date)}
                    </span>
                    <span>
                      {formatTime(b.startTime)} – {formatTime(b.endTime)}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      b.status === "cancelled"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  >
                    {b.status === "cancelled" ? "Cancelled" : "Completed"}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
