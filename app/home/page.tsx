"use client"

import { useEffect, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { FeedbackModal } from "@/components/feedback-modal"
import { MorphingNav, NavItem } from "@/components/ui/morphing-nav"
import { Home, MessageSquare, Users, BookCopy, BadgeQuestionMark } from "lucide-react"

type UserProfile = {
  full_name?: string | null
  email?: string | null
}

export default function HomePage() {
  const router = useRouter()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [teacher, setTeacher] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const navItems: NavItem[] = [
    { id: "home", label: "Home", href: "/home", icon: Home },
    { id: "feedbacks", label: "Feedbacks", href: "/feedbacks", icon: MessageSquare },
    { id: "teachers", label: "Teachers", href: "/teachers", icon: Users },
    { id: "subjects", label: "Subjects", href: "/subjects", icon: BookCopy },
    { id: "about", label: "About", href: "/about", icon: BadgeQuestionMark },
  ]

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        setLoadingUser(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.user.id)
        .maybeSingle()

      setUser({
        full_name: profile?.full_name,
        email: data.user.email,
      })

      setLoadingUser(false)
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data } = await supabase.auth.getUser()
    if (!data?.user) {
      setMessage("Please log in.")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("feedback").insert({
      user_id: data.user.id,
      subject,
      teacher,
      rating,
      comment,
    })

    if (error) setMessage(error.message)
    else {
      setMessage("Feedback submitted 🎉")
      setIsModalOpen(false)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <MorphingNav
        items={navItems}
        user={user}
        loadingUser={loadingUser}
        onLogout={handleLogout}
      />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <Button onClick={() => setIsModalOpen(true)}>
          Create feedback
        </Button>

        <FeedbackModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subject={subject}
          teacher={teacher}
          rating={rating}
          comment={comment}
          loading={loading}
          message={message}
          setSubject={setSubject}
          setTeacher={setTeacher}
          setRating={setRating}
          setComment={setComment}
          onSubmit={submit}
        />
      </div>
    </main>
  )
}
