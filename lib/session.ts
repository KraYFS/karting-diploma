import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
}

/** Returns the current session, or null if not signed in. */
export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}

/** Returns the current user id or throws. Use inside server actions. */
export async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

/** Returns the current user (with role) or throws. */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  const u = session.user as unknown as SessionUser
  return { id: u.id, name: u.name, email: u.email, role: u.role ?? "user" }
}

/** Throws unless the current user is an admin. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser()
  if (user.role !== "admin") throw new Error("Forbidden")
  return user
}
