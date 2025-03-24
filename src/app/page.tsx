"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Terminal } from "@/components/terminal"
import Image from "next/image"

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: "Bienvenido a DeepPenguin Terminal. ¿En qué puedo ayudarte hoy?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the API
      const response = await fetch(`http://localhost:8000/api/ask?question=${encodeURIComponent(input)}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.text()

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: data }])
    } catch (error) {
      console.error("Error fetching from API:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error de conexión. Por favor, verifica que el servidor esté funcionando.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-green-500 font-mono p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image src="/images/deeppenguin-logo.png" alt="DeepPenguin Logo" width={40} height={40} className="mr-2" />
          <h1 className="text-xl font-bold">DeepPenguin Terminal</h1>
        </div>
        <button
          onClick={() => (window.location.href = "/word-search")}
          className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded border border-green-500"
        >
          Sopa de Letras
        </button>
      </div>

      <Terminal messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center">
          <span className="mr-2">deepPenguin@kali:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-500"
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
          />
        </div>
      </form>
    </main>
  )
}

