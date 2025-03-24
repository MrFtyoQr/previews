"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  text: string
  speed?: number
}

export function Typewriter({ text, speed = 10 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed])

  return (
    <span className="text-green-400">
      {displayedText}
      {!isComplete && <span className="animate-pulse">_</span>}
    </span>
  )
}

