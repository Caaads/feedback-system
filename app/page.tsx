"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary to-white px-6 py-12">
      <div className="max-w-xl rounded-2xl border bg-card p-10 shadow-xl">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Student Feedback System
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Welcome! Choose how you want to get started.
          </h1>
          <p className="text-muted-foreground">
            Log in if you already have an account or create one to begin sharing
            feedback.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button asChild className="w-full">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Register</Link>
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Or continue to the{" "}
          <Link href="/home" className="font-medium text-primary underline">
            homepage
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
