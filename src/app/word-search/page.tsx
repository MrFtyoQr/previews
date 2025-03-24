"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { WordSearchGrid } from "@/components/word-search-grid"
import { WordList } from "@/components/word-list"

interface WordPosition {
  word: string
  start: [number, number]
  end: [number, number]
  direction: string
  found?: boolean
}

interface WordSearchData {
  word_search: {
    word_search: string
    answers: WordPosition[]
  }
}

export default function WordSearchPage() {
  const [topic, setTopic] = useState("MongoDB")
  const [size, setSize] = useState(10)
  const [wordSearchData, setWordSearchData] = useState<WordSearchData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [foundWords, setFoundWords] = useState<string[]>([])

  const fetchWordSearch = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(
        `http://localhost:8000/api/word-search?topic=${encodeURIComponent(topic)}&size=${size}`,
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setWordSearchData(data)

      // Reset found words
      setFoundWords([])
    } catch (err) {
      console.error("Error fetching word search:", err)
      setError("Error al cargar la sopa de letras. Verifica que el servidor esté funcionando.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchWordSearch()
  }, [])

  const handleWordFound = (word: string) => {
    if (!foundWords.includes(word)) {
      setFoundWords([...foundWords, word])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWordSearch()
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-green-500 font-mono p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded border border-green-500 mr-4"
          >
            ← Volver al Chat
          </button>
          <Image src="/images/deeppenguin-logo.png" alt="DeepPenguin Logo" width={40} height={40} className="mr-2" />
          <h1 className="text-xl font-bold">DeepPenguin Sopa de Letras</h1>
        </div>
        <button
          onClick={() => (window.location.href = "/code-exercise")}
          className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded border border-green-500"
        >
          Ejercicio de Código →
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 p-4 border border-green-700 rounded bg-black">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="topic" className="block mb-2">
              Tema:
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black border border-green-500 text-green-500 p-2 rounded"
              placeholder="Ej: MongoDB, JavaScript, Python..."
            />
          </div>
          <div className="w-full md:w-32">
            <label htmlFor="size" className="block mb-2">
              Tamaño:
            </label>
            <input
              id="size"
              type="number"
              min="5"
              max="20"
              value={size}
              onChange={(e) => setSize(Number.parseInt(e.target.value))}
              className="w-full bg-black border border-green-500 text-green-500 p-2 rounded"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded border border-green-500"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Generar"}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="p-4 mb-4 bg-red-900 text-white rounded">{error}</div>}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {wordSearchData ? (
            <WordSearchGrid
              wordSearchString={wordSearchData.word_search.word_search}
              answers={wordSearchData.word_search.answers}
              onWordFound={handleWordFound}
            />
          ) : loading ? (
            <div className="flex justify-center items-center h-64 border border-green-700 rounded bg-black">
              <p className="text-green-500 animate-pulse">Cargando sopa de letras...</p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 border border-green-700 rounded bg-black">
              <p className="text-green-500">Genera una sopa de letras para comenzar</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-64">
          {wordSearchData && (
            <WordList words={wordSearchData.word_search.answers.map((a) => a.word)} foundWords={foundWords} />
          )}
        </div>
      </div>
    </main>
  )
}

