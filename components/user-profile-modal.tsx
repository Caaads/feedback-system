"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { UserRound } from "lucide-react"

type UserProfile = {
  full_name?: string | null
  student_number?: string | null
  year_level?: string | null
  strand_or_course?: string | null
  email?: string | null
  created_at?: string | null
}

type UserProfileModalProps = {
  trigger?: React.ReactNode
}

export function UserProfileModal({ trigger }: UserProfileModalProps) {
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)

const fetchProfile = async () => {
  setLoading(true)

  // Get auth user
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    setLoading(false)
    return
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileError) console.error(profileError)

  // Merge auth email with profile info
  setProfile({
    ...profileData,
    email: userData.user.email,
  })

  setLoading(false)
}

  useEffect(() => {
    if (open) fetchProfile()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-md rounded-xl bg-card p-6 shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-center">
            User Profile
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground">
            Loading profile…
          </p>
        ) : profile ? (
          <div className="flex flex-col gap-4">
            {/* Avatar & Name */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center rounded-full bg-primary/20 p-4">
                <UserRound className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-lg font-medium">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>

            {/* Profile Info */}
            <div className="space-y-2 rounded-lg border border-border p-4 bg-background/50">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Student Number:</span>
                <span className="text-sm">{profile.student_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Year Level:</span>
                <span className="text-sm">{profile.year_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Strand / Course:</span>
                <span className="text-sm">{profile.strand_or_course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Account Created:</span>
                <span className="text-sm">
                  {new Date(profile.created_at || "").toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No profile data found.
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
