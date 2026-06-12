import { Flag } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Flag className="h-4 w-4" />
          </span>
          <span className="font-heading text-base font-bold tracking-tight">
            APEX KARTING CLUB
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/book" className="hover:text-foreground">
            Book a Session
          </Link>
          <Link href="/sign-in" className="hover:text-foreground">
            Member Sign In
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          {"\u00A9"} {new Date().getFullYear()} Apex Karting Club. Drive fast,
          stay safe.
        </p>
      </div>
    </footer>
  )
}
