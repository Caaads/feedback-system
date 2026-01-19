"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
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
import { Settings, Star, UserRound } from "lucide-react"

type UserProfile = {
  full_name?: string | null
  email?: string | null
  student_number?: string | null
  year_level?: string | null
  strand_or_course?: string | null
}

export default function HomePage() {
  const router = useRouter()
  const [subject, setSubject] = useState("")
  const [teacher, setTeacher] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        setUserInfo(null)
        setLoadingUser(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, student_number, year_level, strand_or_course"
        )
        .eq("id", userData.user.id)
        .maybeSingle()

      if (profileError) {
        setUserInfo({
          email: userData.user.email,
        })
      } else {
        setUserInfo({
          full_name: profile?.full_name,
          student_number: profile?.student_number,
          year_level: profile?.year_level,
          strand_or_course: profile?.strand_or_course,
          email: userData.user.email,
        })
      }

      setLoadingUser(false)
    }

    loadUser()
  }, [])


  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      setMessage(userError.message)
      setLoading(false)
      return
    }

    if (!user) {
      setMessage("Please log in to submit feedback.")
      setLoading(false)
      return
    }

    const safeRating = Math.min(5, Math.max(1, rating))

    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      subject,
      teacher,
      rating: safeRating,
      comment,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Thanks for your feedback 🎉")
      setSubject("")
      setTeacher("")
      setRating(5)
      setComment("")
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMessage(error.message)
    } else {
      setUserInfo(null)
      router.push("/")
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-5xl space-y-6">
        <nav className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Feedback</span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Return to Welcome</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {loadingUser ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : userInfo ? (
                <div className="leading-tight">
                  <p className="text-sm font-medium">
                    {userInfo.full_name || userInfo.email || "Signed in user"}
                  </p>
                  {userInfo.email && (
                    <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not signed in</p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
              Logout
            </Button>
          </div>
        </nav>

        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Student Feedback</CardTitle>
            <CardDescription>
              Share your thoughts about your classes and instructors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  required
                  placeholder="e.g. Calculus"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teacher</label>
                <Input
                  required
                  placeholder="e.g. Prof. Smith"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const active = value <= rating
                    return (
                      <Button
                        key={value}
                        type="button"
                        variant={active ? "default" : "outline"}
                        size="icon"
                        onClick={() => setRating(value)}
                        aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                      >
                        <Star
                          className="h-4 w-4"
                          fill={active ? "currentColor" : "none"}
                        />
                      </Button>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comments</label>
                <textarea
                  className="h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="What went well? What could be improved?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit feedback"}
              </Button>

              {message && (
                <p className="text-center text-sm text-muted-foreground">{message}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
