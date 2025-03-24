interface WordListProps {
  words: string[]
  foundWords: string[]
}

export function WordList({ words, foundWords }: WordListProps) {
  return (
    <div className="border border-green-700 rounded p-4 bg-black">
      <h2 className="text-lg font-bold mb-4">Palabras a encontrar</h2>
      <ul className="space-y-2">
        {words.map((word, index) => {
          const isFound = foundWords.includes(word)
          return (
            <li
              key={index}
              className={`
                ${isFound ? "line-through text-purple-400" : "text-green-400"}
              `}
            >
              {word}
            </li>
          )
        })}
      </ul>
      <div className="mt-4 pt-4 border-t border-green-700">
        <p>
          Encontradas: {foundWords.length} / {words.length}
        </p>
      </div>
    </div>
  )
}

