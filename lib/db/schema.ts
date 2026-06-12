import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  date,
  integer,
  unique,
} from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // App-specific: "user" (default) or "admin". Used to gate the admin panel.
  role: text("role").notNull().default("user"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables ------------------------------------------------------------

// Admin-defined time slots. Each row is a bookable session on a given date.
// `capacity` allows multiple karts per slot; `status` lets admins disable a slot.
export const slots = pgTable(
  "slots",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    startTime: text("startTime").notNull(), // "14:00"
    endTime: text("endTime").notNull(), // "14:30"
    capacity: integer("capacity").notNull().default(1),
    status: text("status").notNull().default("open"), // "open" | "closed"
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => ({
    uniqueSlot: unique().on(t.date, t.startTime),
  }),
)

// Reservations made by users against a slot.
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    userId: text("userId").notNull(),
    slotId: integer("slotId").notNull(),
    status: text("status").notNull().default("confirmed"), // "confirmed" | "cancelled"
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (t) => ({
    // A user can only hold one active booking per slot.
    uniqueUserSlot: unique().on(t.userId, t.slotId),
  }),
)
