"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  disablePaste?: boolean
}

export function CodeEditor({ value, onChange, language, disablePaste = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  // Map language names to prism supported languages
  const languageMap: Record<string, string> = {
    python: "python",
    javascript: "javascript",
    java: "java",
    "c++": "cpp",
    "c#": "csharp",
    php: "php",
    ruby: "ruby",
    go: "go",
    swift: "swift",
    rust: "rust",
  }

  const syntaxLanguage = languageMap[language.toLowerCase()] || "text"

  // Sync scroll between textarea and syntax highlighter
  useEffect(() => {
    const textarea = editorRef.current
    const pre = preRef.current

    if (!textarea || !pre) return

    const handleScroll = () => {
      pre.scrollTop = textarea.scrollTop
      pre.scrollLeft = textarea.scrollLeft
    }

    textarea.addEventListener("scroll", handleScroll)
    return () => textarea.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd

      // Insert tab at cursor position
      const newValue = value.substring(0, start) + "  " + value.substring(end)
      onChange(newValue)

      // Move cursor after the inserted tab
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  // Prevent paste if disablePaste is true
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (disablePaste) {
      e.preventDefault()
      alert("No se permite pegar código. Debes escribirlo manualmente.")
    }
  }

  return (
    <div className="relative border border-green-700 rounded overflow-hidden">
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="absolute top-0 left-0 w-full h-full p-4 bg-transparent text-transparent caret-green-500 resize-none outline-none font-mono z-10"
        spellCheck="false"
        style={{
          caretColor: "#22c55e",
          minHeight: "300px",
        }}
      />
      <pre ref={preRef} className="overflow-hidden p-0 m-0" style={{ minHeight: "300px" }}>
        <SyntaxHighlighter
          language={syntaxLanguage}
          style={atomDark}
          customStyle={{
            backgroundColor: "#0a0a0a",
            padding: "1rem",
            minHeight: "300px",
            margin: 0,
          }}
        >
          {value || " "}
        </SyntaxHighlighter>
      </pre>
    </div>
  )
}

