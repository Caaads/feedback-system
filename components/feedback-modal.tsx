"use client"

import { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"

type FeedbackModalProps = {
  open: boolean
  onClose: () => void
  subject: string
  teacher: string
  rating: number
  comment: string
  loading: boolean
  message: string | null
  setSubject: (value: string) => void
  setTeacher: (value: string) => void
  setRating: (value: number) => void
  setComment: (value: string) => void
  onSubmit: (event: FormEvent) => void
}

export function FeedbackModal({
  open,
  onClose,
  subject,
  teacher,
  rating,
  comment,
  loading,
  message,
  setSubject,
  setTeacher,
  setRating,
  setComment,
  onSubmit,
}: FeedbackModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-8">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <Card className="relative z-50 w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create feedback</CardTitle>
          <CardDescription>
            Share your thoughts about your classes and instructors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
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

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit feedback"}
              </Button>
            </div>

            {message && (
              <p className="text-center text-sm text-muted-foreground">
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

