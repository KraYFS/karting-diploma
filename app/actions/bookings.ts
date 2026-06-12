"use server"

import { db } from "@/lib/db"
import { bookings, slots, user } from "@/lib/db/schema"
import { getUserId } from "@/lib/session"
import { and, asc, count, eq, gte, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type AvailableSlot = {
  id: number
  date: string
  startTime: string
  endTime: string
  capacity: number
  booked: number
  remaining: number
  bookedByMe: boolean
}

/** Returns open, future slots with remaining capacity for a given date (YYYY-MM-DD). */
export async function getSlotsForDate(dateStr: string): Promise<AvailableSlot[]> {
  const userId = await getUserId()

  const rows = await db
    .select({
      id: slots.id,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      capacity: slots.capacity,
      booked: sql<number>`coalesce(count(${bookings.id}) filter (where ${bookings.status} = 'confirmed'), 0)`,
      bookedByMe: sql<boolean>`bool_or(${bookings.userId} = ${userId} and ${bookings.status} = 'confirmed')`,
    })
    .from(slots)
    .leftJoin(bookings, eq(bookings.slotId, slots.id))
    .where(and(eq(slots.date, dateStr), eq(slots.status, "open")))
    .groupBy(slots.id)
    .orderBy(asc(slots.startTime))

  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    startTime: r.startTime,
    endTime: r.endTime,
    capacity: r.capacity,
    booked: Number(r.booked),
    remaining: Math.max(0, r.capacity - Number(r.booked)),
    bookedByMe: Boolean(r.bookedByMe),
  }))
}

/** Returns the distinct future dates that have at least one open slot. */
export async function getAvailableDates(): Promise<string[]> {
  await getUserId()
  const today = new Date().toISOString().slice(0, 10)
  const rows = await db
    .selectDistinct({ date: slots.date })
    .from(slots)
    .where(and(eq(slots.status, "open"), gte(slots.date, today)))
    .orderBy(asc(slots.date))
  return rows.map((r) => r.date)
}

/** Book a slot for the current user, respecting capacity. */
export async function bookSlot(slotId: number) {
  const userId = await getUserId()

  return db.transaction(async (tx) => {
    const [slot] = await tx.select().from(slots).where(eq(slots.id, slotId))
    if (!slot) throw new Error("Slot not found")
    if (slot.status !== "open") throw new Error("This slot is no longer available")

    const [{ value: bookedCount }] = await tx
      .select({ value: count() })
      .from(bookings)
      .where(and(eq(bookings.slotId, slotId), eq(bookings.status, "confirmed")))

    if (bookedCount >= slot.capacity) {
      throw new Error("This slot is fully booked")
    }

    // Re-activate a previously cancelled booking, or insert a new one.
    const [existing] = await tx
      .select()
      .from(bookings)
      .where(and(eq(bookings.slotId, slotId), eq(bookings.userId, userId)))

    if (existing) {
      if (existing.status === "confirmed") {
        throw new Error("You already booked this slot")
      }
      await tx
        .update(bookings)
        .set({ status: "confirmed" })
        .where(eq(bookings.id, existing.id))
    } else {
      await tx.insert(bookings).values({ userId, slotId, status: "confirmed" })
    }
  }).then(() => {
    revalidatePath("/book")
    revalidatePath("/profile")
    return { ok: true as const }
  })
}

/** Cancel the current user's booking for a slot. */
export async function cancelBooking(bookingId: number) {
  const userId = await getUserId()
  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)))
  revalidatePath("/book")
  revalidatePath("/profile")
  return { ok: true as const }
}

export type MyBooking = {
  bookingId: number
  status: string
  date: string
  startTime: string
  endTime: string
}

/** Returns the current user's bookings, newest session first. */
export async function getMyBookings(): Promise<MyBooking[]> {
  const userId = await getUserId()
  const rows = await db
    .select({
      bookingId: bookings.id,
      status: bookings.status,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
    })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .where(eq(bookings.userId, userId))
    .orderBy(asc(slots.date), asc(slots.startTime))
  return rows
}

/** Update the current user's display name. */
export async function updateProfileName(name: string) {
  const userId = await getUserId()
  const trimmed = name.trim()
  if (!trimmed) throw new Error("Name cannot be empty")
  await db
    .update(user)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(user.id, userId))
  revalidatePath("/profile")
  return { ok: true as const }
}
