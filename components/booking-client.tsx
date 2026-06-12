"use client"

import {
  bookSlot,
  cancelBooking,
  getMyBookings,
  getSlotsForDate,
  type AvailableSlot,
  type MyBooking,
} from "@/app/actions/bookings"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateLong, formatDateShort, formatTime } from "@/lib/format"
import { Check, Clock, Users } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function BookingClient({
  availableDates,
  initialBookings,
}: {
  availableDates: string[]
  initialBookings: MyBooking[]
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(
    availableDates[0] ?? null,
  )
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [bookings, setBookings] = useState<MyBooking[]>(initialBookings)
  const [pending, startTransition] = useTransition()
  const [actingSlot, setActingSlot] = useState<number | null>(null)

  useEffect(() => {
    if (!selectedDate) {
      setSlots([])
      return
    }
    let active = true
    setLoadingSlots(true)
    getSlotsForDate(selectedDate)
      .then((data) => {
        if (active) setSlots(data)
      })
      .finally(() => {
        if (active) setLoadingSlots(false)
      })
    return () => {
      active = false
    }
  }, [selectedDate])

  function refresh() {
    if (selectedDate) {
      getSlotsForDate(selectedDate).then(setSlots)
    }
    getMyBookings().then(setBookings)
  }

  function handleBook(slotId: number) {
    setActingSlot(slotId)
    startTransition(async () => {
      try {
        await bookSlot(slotId)
        toast.success("Session booked! See you on the grid.")
        refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not book slot")
      } finally {
        setActingSlot(null)
      }
    })
  }

  function handleCancel(bookingId: number) {
    startTransition(async () => {
      try {
        await cancelBooking(bookingId)
        toast.success("Booking cancelled")
        refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not cancel")
      }
    })
  }

  const myConfirmed = bookings.filter((b) => b.status === "confirmed")

  if (availableDates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
        <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 font-heading text-xl font-semibold">
          No sessions scheduled yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-pretty leading-relaxed text-muted-foreground">
          Track slots are released by the club. Check back soon — new sessions
          are added regularly.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Date selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableDates.map((d) => {
            const selected = d === selectedDate
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "flex shrink-0 flex-col items-center rounded-lg border px-4 py-3 text-sm transition-colors",
                  selected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <span className="font-medium">{formatDateShort(d)}</span>
              </button>
            )
          })}
        </div>

        {/* Slots */}
        <div className="mt-6">
          {selectedDate && (
            <h2 className="font-heading text-lg font-semibold">
              {formatDateLong(selectedDate)}
            </h2>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {loadingSlots ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No open slots for this date.
              </p>
            ) : (
              slots.map((slot) => {
                const full = slot.remaining <= 0
                return (
                  <div
                    key={slot.id}
                    className={cn(
                      "flex items-center justify-between rounded-xl border bg-card p-4",
                      slot.bookedByMe
                        ? "border-accent/50"
                        : "border-border/60",
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-heading text-base font-semibold">
                        <Clock className="h-4 w-4 text-primary" />
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {full
                          ? "Fully booked"
                          : `${slot.remaining} of ${slot.capacity} karts left`}
                      </div>
                    </div>
                    {slot.bookedByMe ? (
                      <Badge className="gap-1 bg-accent/15 text-accent hover:bg-accent/15">
                        <Check className="h-3.5 w-3.5" />
                        Booked
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        disabled={full || pending}
                        onClick={() => handleBook(slot.id)}
                      >
                        {actingSlot === slot.id && pending
                          ? "Booking..."
                          : full
                            ? "Full"
                            : "Book"}
                      </Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* My upcoming bookings */}
      <aside className="h-fit rounded-xl border border-border/60 bg-card p-5 lg:sticky lg:top-20">
        <h3 className="font-heading text-base font-semibold">
          Your upcoming sessions
        </h3>
        {myConfirmed.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You have no booked sessions yet. Pick a slot to get started.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {myConfirmed.map((b) => (
              <li
                key={b.bookingId}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/50 p-3"
              >
                <div>
                  <div className="text-sm font-medium">
                    {formatDateShort(b.date)}
                  </div>
                  <div className="text-xs text-muted-foreground">
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
      </aside>
    </div>
  )
}
