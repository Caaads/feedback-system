"use client"

import { FormEvent, useEffect, useState } from "react"
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

export default function CompleteProfilePage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [studentNumber, setStudentNumber] = useState("")
  const [yearLevel, setYearLevel] = useState("")
  const [strandOrCourse, setStrandOrCourse] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6ac0bd10-a869-466e-a257-d935ecae3c38',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'initial',
          hypothesisId:'H3',
          location:'app/complete-profile/page.tsx:checkUser',
          message:'Result of supabase.auth.getUser in checkUser',
          data:{ hasUser: !!data?.user, hasError: !!error },
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion

      if (error || !data.user) {
        router.replace("/login")
        return
      }
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSaving(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6ac0bd10-a869-466e-a257-d935ecae3c38',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'initial',
        hypothesisId:'H4',
        location:'app/complete-profile/page.tsx:handleSubmit',
        message:'Result of supabase.auth.getUser in handleSubmit',
        data:{ hasUser: !!user, hasError: !!userError },
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion

    if (userError || !user) {
      setError("You must be logged in to complete your profile.")
      setSaving(false)
      return
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        student_number: studentNumber,
        year_level: yearLevel,
        strand_or_course: strandOrCourse,
      },
      { onConflict: "id" }
    )

    if (profileError) {
      setError(profileError.message)
      setSaving(false)
      return
    }

    router.replace("/home")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete your profile</CardTitle>
          <CardDescription>
            Just a few more details so we can personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

