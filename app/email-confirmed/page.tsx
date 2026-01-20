"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function EmailConfirmedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email confirmed</CardTitle>
          <CardDescription>
            Your email address has been verified. You can now log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Go to login</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            If this was not you, you can safely ignore this page.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

