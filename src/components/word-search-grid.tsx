"use client"

import { useState, useEffect } from "react"

interface WordPosition {
  word: string
  start: [number, number]
  end: [number, number]
  direction: string
  found?: boolean
}

interface WordSearchGridProps {
  wordSearchString: string
  answers: WordPosition[]
  onWordFound: (word: string) => void
}

export function WordSearchGrid({ wordSearchString, answers, onWordFound }: WordSearchGridProps) {
  const [grid, setGrid] = useState<string[][]>([])
  const [selectionStart, setSelectionStart] = useState<[number, number] | null>(null)
  const [currentEnd, setCurrentEnd] = useState<[number, number] | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)

  // Parse the word search string into a 2D grid
  useEffect(() => {
    if (wordSearchString) {
      const rows = wordSearchString.split("\n")
      const parsedGrid = rows.map((row) => row.split(" "))
      setGrid(parsedGrid)

      // Reset selections and found words when grid changes
      setSelectionStart(null)
      setCurrentEnd(null)
      setSelectedCells(new Set())
      setFoundWords(new Set())
    }
  }, [wordSearchString])

  // Handle cell click for selection
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!isSelecting) {
      // Start selection
      setIsSelecting(true)
      setSelectionStart([rowIndex, colIndex])
      setCurrentEnd(null)
      setSelectedCells(new Set([`${rowIndex}-${colIndex}`]))
    } else {
      // End selection
      setIsSelecting(false)
      setCurrentEnd([rowIndex, colIndex])

      // Check if the selection matches any word
      if (selectionStart) {
        const selectedWord = checkSelection(selectionStart, [rowIndex, colIndex])
        if (selectedWord) {
          setFoundWords((prev) => new Set([...prev, selectedWord]))
          onWordFound(selectedWord)
        }
      }
    }
  }

  // Handle cell hover during selection
  const handleCellHover = (rowIndex: number, colIndex: number) => {
    if (isSelecting && selectionStart) {
      updateSelectedCells(selectionStart, [rowIndex, colIndex])
    }
  }

  // Update the set of selected cells based on start and current position
  const updateSelectedCells = (start: [number, number], current: [number, number]) => {
    const [startRow, startCol] = start
    const [currentRow, currentCol] = current

    // Calculate direction
    const rowDiff = currentRow - startRow
    const colDiff = currentCol - startCol

    // Only allow straight lines or diagonals
    if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
      const newSelectedCells = new Set<string>()

      // Determine step direction
      const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1
      const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1

      // Calculate number of steps
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))

      // Add all cells in the path
      for (let i = 0; i <= steps; i++) {
        const row = startRow + i * rowStep
        const col = startCol + i * colStep
        newSelectedCells.add(`${row}-${col}`)
      }

      setSelectedCells(newSelectedCells)
    }
  }

  // Check if the selection matches any word in the answers
  const checkSelection = (start: [number, number], end: [number, number]): string | null => {
    // Check each answer
    for (const answer of answers) {
      const answerStart = answer.start
      const answerEnd = answer.end

      // Check if selection matches this answer (in either direction)
      if (
        (start[0] === answerStart[0] &&
          start[1] === answerStart[1] &&
          end[0] === answerEnd[0] &&
          end[1] === answerEnd[1]) ||
        (start[0] === answerEnd[0] &&
          start[1] === answerEnd[1] &&
          end[0] === answerStart[0] &&
          end[1] === answerStart[1])
      ) {
        return answer.word
      }
    }

    return null
  }

  // Check if a cell is part of a found word
  const isCellInFoundWord = (rowIndex: number, colIndex: number): boolean => {
    for (const answer of answers) {
      if (foundWords.has(answer.word)) {
        const [startRow, startCol] = answer.start
        const [endRow, endCol] = answer.end

        // Calculate direction
        const rowStep = startRow === endRow ? 0 : startRow < endRow ? 1 : -1
        const colStep = startCol === endCol ? 0 : startCol < endCol ? 1 : -1

        // Calculate number of steps
        const steps = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol))

        // Check if the cell is in the path
        for (let i = 0; i <= steps; i++) {
          const row = startRow + i * rowStep
          const col = startCol + i * colStep
          if (row === rowIndex && col === colIndex) {
            return true
          }
        }
      }
    }

    return false
  }

  return (
    <div className="border border-green-700 rounded p-4 bg-black">
      <div className="grid grid-cols-1 gap-1">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`
              const isSelected = selectedCells.has(cellKey)
              const isFound = isCellInFoundWord(rowIndex, colIndex)

              return (
                <div
                  key={cellKey}
                  className={`
                    w-8 h-8 flex items-center justify-center m-1 rounded cursor-pointer
                    ${isSelected ? "bg-green-700 text-black" : "bg-black"}
                    ${isFound ? "bg-purple-700 text-white" : ""}
                    border border-green-500 hover:border-green-300
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

