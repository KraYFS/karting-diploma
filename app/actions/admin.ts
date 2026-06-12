"use server"

import { db } from "@/lib/db"
import { bookings, slots, user } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/session"
import { and, asc, count, desc, eq, gte, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type AdminSlot = {
  id: number
  date: string
  startTime: string
  endTime: string
  capacity: number
  status: string
  booked: number
}

/** All slots (admin view) with confirmed booking counts. */
export async function getAllSlots(): Promise<AdminSlot[]> {
  await requireAdmin()
  const rows = await db
    .select({
      id: slots.id,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      capacity: slots.capacity,
      status: slots.status,
      booked: sql<number>`coalesce(count(${bookings.id}) filter (where ${bookings.status} = 'confirmed'), 0)`,
    })
    .from(slots)
    .leftJoin(bookings, eq(bookings.slotId, slots.id))
    .groupBy(slots.id)
    .orderBy(desc(slots.date), asc(slots.startTime))
  return rows.map((r) => ({ ...r, booked: Number(r.booked) }))
}

export async function createSlot(input: {
  date: string
  startTime: string
  endTime: string
  capacity: number
}) {
  await requireAdmin()
  if (!input.date || !input.startTime || !input.endTime) {
    throw new Error("Date, start and end time are required")
  }
  if (input.endTime <= input.startTime) {
    throw new Error("End time must be after start time")
  }
  try {
    await db.insert(slots).values({
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      capacity: Math.max(1, Math.floor(input.capacity)),
      status: "open",
    })
  } catch {
    throw new Error("A slot already exists at that date and start time")
  }
  revalidatePath("/admin")
  revalidatePath("/book")
  return { ok: true as const }
}

export async function toggleSlotStatus(slotId: number) {
  await requireAdmin()
  const [slot] = await db.select().from(slots).where(eq(slots.id, slotId))
  if (!slot) throw new Error("Slot not found")
  await db
    .update(slots)
    .set({ status: slot.status === "open" ? "closed" : "open" })
    .where(eq(slots.id, slotId))
  revalidatePath("/admin")
  revalidatePath("/book")
  return { ok: true as const }
}

export async function deleteSlot(slotId: number) {
  await requireAdmin()
  // Remove associated bookings first (no FK on bookings.slotId).
  await db.delete(bookings).where(eq(bookings.slotId, slotId))
  await db.delete(slots).where(eq(slots.id, slotId))
  revalidatePath("/admin")
  revalidatePath("/book")
  return { ok: true as const }
}

export type AdminBooking = {
  bookingId: number
  status: string
  userName: string
  userEmail: string
  date: string
  startTime: string
  endTime: string
  createdAt: Date
}

/** All bookings across users (admin view). */
export async function getAllBookings(): Promise<AdminBooking[]> {
  await requireAdmin()
  const rows = await db
    .select({
      bookingId: bookings.id,
      status: bookings.status,
      userName: user.name,
      userEmail: user.email,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      createdAt: bookings.createdAt,
    })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .innerJoin(user, eq(bookings.userId, user.id))
    .orderBy(desc(slots.date), asc(slots.startTime))
  return rows
}

export type AdminStats = {
  totalSlots: number
  upcomingSlots: number
  confirmedBookings: number
  members: number
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin()
  const today = new Date().toISOString().slice(0, 10)
  const [totalSlots] = await db.select({ v: count() }).from(slots)
  const [upcoming] = await db
    .select({ v: count() })
    .from(slots)
    .where(and(eq(slots.status, "open"), gte(slots.date, today)))
  const [confirmed] = await db
    .select({ v: count() })
    .from(bookings)
    .where(eq(bookings.status, "confirmed"))
  const [members] = await db.select({ v: count() }).from(user)
  return {
    totalSlots: totalSlots.v,
    upcomingSlots: upcoming.v,
    confirmedBookings: confirmed.v,
    members: members.v,
  }
}
