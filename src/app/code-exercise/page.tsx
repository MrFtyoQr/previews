"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { CodeMatrix } from "@/components/code-matrix"
import { CodeEditor } from "@/components/code-editor"
import { CodeDisplay } from "@/components/code-display"

interface CodeResponse {
  code: string
  explanation?: string
}

export default function CodeExercisePage() {
  const [prompt, setPrompt] = useState("Función que calcule el factorial de un número")
  const [language, setLanguage] = useState("Python")
  const [explanation, setExplanation] = useState(true)
  const [codeData, setCodeData] = useState<CodeResponse | null>(null)
  const [userCode, setUserCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [practiceMode, setPracticeMode] = useState(false)
  const [result, setResult] = useState<{ score: number; message: string } | null>(null)

  const fetchCode = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(
        `http://localhost:8000/api/generate-code?prompt=${encodeURIComponent(prompt)}&language=${encodeURIComponent(language)}&explanation=${explanation}`,
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setCodeData(data)
      setUserCode("") // Reset user code
      setPracticeMode(false) // Reset practice mode
      setResult(null) // Reset result
    } catch (err) {
      console.error("Error fetching code:", err)
      setError("Error al cargar el ejercicio de código. Verifica que el servidor esté funcionando.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCode()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCode()
  }

  const startPractice = () => {
    setPracticeMode(true)
    setUserCode("")
    setResult(null)
  }

  const compareCode = () => {
    if (!codeData) return

    // Normalize both codes (remove extra whitespace, etc.)
    const normalizeCode = (code: string) => {
      return code
        .trim()
        .replace(/\r\n/g, "\n")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}[\]().,;:+\-*/%=<>!&|^])\s*/g, "$1")
    }

    const originalNormalized = normalizeCode(codeData.code)
    const userNormalized = normalizeCode(userCode)

    // Calculate similarity score
    let score = 0
    if (userNormalized === originalNormalized) {
      score = 100
    } else {
      // Simple similarity calculation
      const maxLength = Math.max(originalNormalized.length, userNormalized.length)
      let sameChars = 0

      for (let i = 0; i < Math.min(originalNormalized.length, userNormalized.length); i++) {
        if (originalNormalized[i] === userNormalized[i]) {
          sameChars++
        }
      }

      score = Math.round((sameChars / maxLength) * 100)
    }

    // Generate feedback message
    let message = ""
    if (score === 100) {
      message = "¡Perfecto! Tu código coincide exactamente con la solución."
    } else if (score >= 90) {
      message = "¡Muy bien! Tu código es casi idéntico a la solución."
    } else if (score >= 70) {
      message = "Buen trabajo. Tu código es similar a la solución pero tiene algunas diferencias."
    } else if (score >= 50) {
      message = "Tu código tiene algunas similitudes con la solución, pero hay diferencias significativas."
    } else {
      message = "Tu código es bastante diferente de la solución. Intenta revisar la lógica y sintaxis."
    }

    setResult({ score, message })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Matrix Background */}
      <CodeMatrix />

      <main className="relative z-10 flex min-h-screen flex-col text-green-500 font-mono p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => (window.location.href = "/word-search")}
              className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded border border-green-500 mr-4"
            >
              ← Volver a Sopa de Letras
            </button>
            <Image src="/images/deeppenguin-logo.png" alt="DeepPenguin Logo" width={40} height={40} className="mr-2" />
            <h1 className="text-xl font-bold">DeepPenguin Ejercicio de Código</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-green-700 rounded bg-black bg-opacity-80">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="prompt" className="block mb-2">
                Prompt:
              </label>
              <input
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-black border border-green-500 text-green-500 p-2 rounded"
                placeholder="Describe el ejercicio de código..."
              />
            </div>
            <div className="w-full md:w-48">
              <label htmlFor="language" className="block mb-2">
                Lenguaje:
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-black border border-green-500 text-green-500 p-2 rounded"
              >
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option>
                <option value="PHP">PHP</option>
                <option value="Ruby">Ruby</option>
                <option value="Go">Go</option>
                <option value="Swift">Swift</option>
                <option value="Rust">Rust</option>
              </select>
            </div>
            <div className="w-full md:w-48">
              <label className="flex items-center mt-8">
                <input
                  type="checkbox"
                  checked={explanation}
                  onChange={(e) => setExplanation(e.target.checked)}
                  className="mr-2"
                />
                Incluir explicación
              </label>
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

        <div className="flex flex-col gap-6 bg-black bg-opacity-80 p-4 rounded border border-green-700">
          {codeData ? (
            <>
              {!practiceMode ? (
                <>
                  <CodeDisplay
                    code={codeData.code}
                    language={language.toLowerCase()}
                    explanation={codeData.explanation}
                  />
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={startPractice}
                      className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded border border-green-500"
                    >
                      Practicar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Escribe el código de memoria:</h3>
                    <p className="text-yellow-400 mb-4">
                      Recuerda que no puedes pegar código, debes escribirlo manualmente.
                    </p>
                    <CodeEditor
                      value={userCode}
                      onChange={setUserCode}
                      language={language.toLowerCase()}
                      disablePaste={true}
                    />
                  </div>

                  {result && (
                    <div
                      className={`p-4 rounded mb-4 ${
                        result.score >= 90 ? "bg-green-900" : result.score >= 70 ? "bg-yellow-900" : "bg-red-900"
                      }`}
                    >
                      <h3 className="font-bold mb-2">Resultado: {result.score}%</h3>
                      <p>{result.message}</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={compareCode}
                      className="bg-green-700 hover:bg-green-600 text-black font-bold py-2 px-4 rounded border border-green-500"
                    >
                      Comprobar
                    </button>
                    <button
                      onClick={() => setPracticeMode(false)}
                      className="bg-red-700 hover:bg-red-600 text-black font-bold py-2 px-4 rounded border border-red-500"
                    >
                      Ver Solución
                    </button>
                  </div>
                </>
              )}
            </>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-green-500 animate-pulse">Cargando ejercicio de código...</p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-green-500">Genera un ejercicio de código para comenzar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

