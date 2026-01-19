"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [studentNumber, setStudentNumber] = useState("")
  const [yearLevel, setYearLevel] = useState("")
  const [strandOrCourse, setStrandOrCourse] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    // 1️⃣ Sign up (email confirmation redirect for Vercel)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://cads-feedback-system.vercel.app",
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // 2️⃣ Immediately sign in the user
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const user = signInData.user

    if (!user) {
      setError(
        signUpData.session
          ? "Could not load user session. Please try again."
          : "Signup succeeded but no session was created. Check Supabase email confirmation settings."
      )
      setLoading(false)
      return
    }

    // 3️⃣ Insert profile AFTER the user is logged in
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id, // important
      full_name: fullName,
      student_number: studentNumber,
      year_level: yearLevel,
      strand_or_course: strandOrCourse,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    // Success - redirect to home
    router.push("/home")
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">← Back</Link>
            </Button>
          </div>
          <CardDescription>
            Register to start sending feedback and access the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                required
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                required
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Student Number</label>
              <Input
                required
                type="text"
                placeholder="e.g. 2024-12345"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year Level</label>
              <Input
                required
                type="text"
                placeholder="e.g. 1st Year, 2nd Year"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Strand or Course</label>
              <Input
                required
                type="text"
                placeholder="e.g. STEM, Computer Science"
                value={strandOrCourse}
                onChange={(e) => setStrandOrCourse(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline">
              Log in
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
