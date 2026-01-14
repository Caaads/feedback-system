"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [subject, setSubject] = useState("")
  const [teacher, setTeacher] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [done, setDone] = useState(false)

  const submit = async () => {
    await supabase.from("feedback").insert({
      subject, teacher, rating, comment
    })
    setDone(true)
  }

  if (done) return <h2>Thanks for your feedback 🎉</h2>

  return (
    <div>
      <h1>Student Feedback</h1>
      <input placeholder="Subject" onChange={e=>setSubject(e.target.value)} />
      <input placeholder="Teacher" onChange={e=>setTeacher(e.target.value)} />
      <button onClick={submit}>Submit</button>
    </div>
  )
}
