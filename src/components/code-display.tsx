"use client"

interface CodeDisplayProps {
  code: string
  language: string
  explanation?: string
}

export function CodeDisplay({ code, language, explanation }: CodeDisplayProps) {
  // Map language names to CSS classes for syntax highlighting
  const getLanguageClass = (lang: string): string => {
    const languageMap: Record<string, string> = {
      python: "language-python",
      javascript: "language-javascript",
      java: "language-java",
      cpp: "language-cpp",
      csharp: "language-csharp",
      php: "language-php",
      ruby: "language-ruby",
      go: "language-go",
      swift: "language-swift",
      rust: "language-rust",
    }

    return languageMap[lang.toLowerCase()] || "language-text"
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Código:</h3>
      <div className="rounded overflow-hidden mb-4 bg-gray-900 border border-green-700">
        <pre className="p-4 overflow-x-auto">
          <code className={`block text-green-500 ${getLanguageClass(language)}`}>{code}</code>
        </pre>
      </div>

      {explanation && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Explicación:</h3>
          <div className="bg-gray-900 p-4 rounded border border-green-700">
            <p className="whitespace-pre-line text-green-500">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

