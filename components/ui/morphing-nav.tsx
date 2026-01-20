"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { UserRound, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"

export type NavItem = {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

type UserProfile = {
  full_name?: string | null
  student_number?: string | null
  year_level?: string | null
  strand_or_course?: string | null
  email?: string | null
  created_at?: string | null
}

type MorphingNavProps = {
  items: NavItem[]
  user?: UserProfile | null
  loadingUser?: boolean
  onLogout?: () => void
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function MorphingNav({
  items,
  user,
  loadingUser = false,
  onLogout,
  value,
  onValueChange,
  className,
}: MorphingNavProps) {
  const [internalValue, setInternalValue] = useState(
    value ?? items?.[0]?.id ?? ""
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    if (value) setInternalValue(value)
  }, [value])

  const handleClick = (id: string) => {
    if (!value) setInternalValue(id)
    onValueChange?.(id)
  }

  const fetchProfile = async () => {
    if (!user) return
    setLoadingProfile(true)
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) {
      setLoadingProfile(false)
      return
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .maybeSingle()

    if (error) console.error(error)
    else setProfileData(profile ?? null)

    setLoadingProfile(false)
  }

  const handleOpenModal = () => {
    setModalOpen(true)
    fetchProfile()
  }

  if (!items || items.length === 0) return null

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-40 border-b bg-background",
          className
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Left: Nav items */}
          <div className="flex gap-2">
            {items.map((item) => {
              const isActive = internalValue === item.id
              const Icon = item.icon

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="morphing-nav"
                      className="absolute inset-0 rounded-lg bg-primary"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Right: User profile */}
          <div className="flex items-center gap-3">
            <div
              onClick={handleOpenModal}
              className="flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer"
            >
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {loadingUser ? (
                <span className="text-sm text-muted-foreground">Loading…</span>
              ) : user ? (
                <div className="leading-tight">
                  <p className="text-sm font-medium">
                    {user.full_name || user.email}
                  </p>
                  {user.email && (
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Not signed in</span>
              )}
            </div>

            {user && onLogout && (
              <Button
                variant="outline"
                size="icon"
                onClick={onLogout}
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* User Profile Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>

          {loadingProfile ? (
            <p>Loading profile...</p>
          ) : profileData ? (
            <div className="space-y-2">
              <p><strong>Full Name:</strong> {profileData.full_name}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Student Number:</strong> {profileData.student_number}</p>
              <p><strong>Year Level:</strong> {profileData.year_level}</p>
              <p><strong>Strand / Course:</strong> {profileData.strand_or_course}</p>
              <p><strong>Account Created:</strong> {new Date(profileData.created_at || "").toLocaleString()}</p>
            </div>
          ) : (
            <p>No profile data found.</p>
          )}

          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
