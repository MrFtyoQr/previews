import type React from "react"
import { Typewriter } from "@/components/typewriter"

interface TerminalProps {
  messages: { role: string; content: string }[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function Terminal({ messages, isLoading, messagesEndRef }: TerminalProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-black p-2 rounded border border-green-700 terminal-window">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="terminal-message">
            {message.role === "user" ? (
              <div>
                <span className="text-cyan-400">usuario@deepPenguin:~$ </span>
                <span className="text-white">{message.content}</span>
              </div>
            ) : message.role === "system" ? (
              <div>
                <span className="text-yellow-400">[SISTEMA] </span>
                <span className="text-green-400">{message.content}</span>
              </div>
            ) : (
              <div>
                <span className="text-purple-400">deepPenguin@kali:~$ </span>
                <Typewriter text={message.content} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="terminal-message">
            <span className="text-purple-400">deepPenguin@kali:~$ </span>
            <span className="loading-cursor">_</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

