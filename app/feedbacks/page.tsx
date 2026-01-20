"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FeedbacksPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-3xl space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Feedbacks</h1>
        <p className="text-muted-foreground">
          This page will show a list of submitted feedbacks. (Coming soon)
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/home">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

