"use client"

import { useEffect, useState } from "react"
import { displayWigTips } from "@/app/helper/displayWigTips"

export default function WigTip() {
  const [tip, setTip] = useState("")

  useEffect(() => {
    setTip(displayWigTips())
  }, [])

  return (
    <section className="section-spacing">
  <h2 className="text-2xl font-semibold text-center mb-4">
    Wig Care Tip
  </h2>
  <div className="flex justify-center">
    <div className="relative hover:shadow-xl flex items-center justify-center text-center">
      <p className="text-lg font-medium text-black-700 dark:text-gray-100 leading-relaxed italic">
        <b>{tip ? `“${tip}”` : "Loading tip..."}</b>
      </p>
    </div>
  </div>
</section>
  )
}
