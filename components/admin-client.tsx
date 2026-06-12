"use client"

import {
  createSlot,
  deleteSlot,
  getAdminStats,
  getAllBookings,
  getAllSlots,
  toggleSlotStatus,
  type AdminBooking,
  type AdminSlot,
  type AdminStats,
} from "@/app/actions/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDateLong, formatTime } from "@/lib/format"
import { CalendarPlus, Power, Trash2, Users } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

const todayStr = new Date().toISOString().slice(0, 10)

export function AdminClient({
  initialStats,
  initialSlots,
  initialBookings,
}: {
  initialStats: AdminStats
  initialSlots: AdminSlot[]
  initialBookings: AdminBooking[]
}) {
  const [stats, setStats] = useState(initialStats)
  const [slots, setSlots] = useState(initialSlots)
  const [bookings, setBookings] = useState(initialBookings)
  const [pending, startTransition] = useTransition()

  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [capacity, setCapacity] = useState("1")

  async function refresh() {
    const [s, sl, b] = await Promise.all([
      getAdminStats(),
      getAllSlots(),
      getAllBookings(),
    ])
    setStats(s)
    setSlots(sl)
    setBookings(b)
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await createSlot({
          date,
          startTime,
          endTime,
          capacity: Number(capacity) || 1,
        })
        toast.success("Slot created")
        setDate("")
        setStartTime("")
        setEndTime("")
        setCapacity("1")
        await refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not create slot")
      }
    })
  }

  function handleToggle(id: number) {
    startTransition(async () => {
      try {
        await toggleSlotStatus(id)
        await refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not update slot")
      }
    })
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      try {
        await deleteSlot(id)
        toast.success("Slot deleted")
        await refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not delete slot")
      }
    })
  }

  const statCards = [
    { label: "Total slots", value: stats.totalSlots },
    { label: "Upcoming open", value: stats.upcomingSlots },
    { label: "Confirmed bookings", value: stats.confirmedBookings },
    { label: "Members", value: stats.members },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="font-heading text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {s.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="slots">
        <TabsList>
          <TabsTrigger value="slots">Slots</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        {/* Slots tab */}
        <TabsContent value="slots" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg">
                  <CalendarPlus className="h-5 w-5 text-primary" />
                  New slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="start">Start</Label>
                      <Input
                        id="start"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="end">End</Label>
                      <Input
                        id="end"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="capacity">Karts (capacity)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min={1}
                      max={50}
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving..." : "Create slot"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  All slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No slots yet. Create one to open up the track.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Booked</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {slots.map((slot) => (
                          <TableRow key={slot.id}>
                            <TableCell className="font-medium">
                              {formatDateLong(slot.date)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {formatTime(slot.startTime)} –{" "}
                              {formatTime(slot.endTime)}
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                {slot.booked}/{slot.capacity}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  slot.status === "open"
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  slot.status === "open"
                                    ? "bg-accent/15 text-accent hover:bg-accent/15"
                                    : "text-muted-foreground"
                                }
                              >
                                {slot.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  title={
                                    slot.status === "open"
                                      ? "Close slot"
                                      : "Open slot"
                                  }
                                  disabled={pending}
                                  onClick={() => handleToggle(slot.id)}
                                >
                                  <Power className="h-4 w-4" />
                                  <span className="sr-only">Toggle status</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  title="Delete slot"
                                  disabled={pending}
                                  onClick={() => handleDelete(slot.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete slot</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bookings tab */}
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                All bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No bookings yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((b) => (
                        <TableRow key={b.bookingId}>
                          <TableCell>
                            <div className="font-medium">{b.userName}</div>
                            <div className="text-xs text-muted-foreground">
                              {b.userEmail}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDateLong(b.date)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatTime(b.startTime)} – {formatTime(b.endTime)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                b.status === "confirmed"
                                  ? "text-accent"
                                  : "text-destructive"
                              }
                            >
                              {b.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
