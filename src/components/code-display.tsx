import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeDisplayProps {
  code: string
  language: string
  explanation?: string
}

export function CodeDisplay({ code, language, explanation }: CodeDisplayProps) {
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

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Código:</h3>
      <div className="rounded overflow-hidden mb-4">
        <SyntaxHighlighter
          language={syntaxLanguage}
          style={atomDark}
          customStyle={{
            backgroundColor: "#0a0a0a",
            padding: "1rem",
            borderRadius: "0.25rem",
            border: "1px solid #2F855A",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {explanation && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Explicación:</h3>
          <div className="bg-gray-900 p-4 rounded border border-green-700">
            <p className="whitespace-pre-line">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

