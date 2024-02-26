'use client'

import { useRef } from 'react'
import { useChat } from '@/hooks/useChat'

export default function Chat() {
  const scrollRef = useRef(null)

  const { messages, input, setInput, handleSubmit, responsePrefixRef, responseMessageRef } = useChat(scrollRef)
  return (
    <div className="flex flex-col w-full py-24 items-center">
      <div className="flex flex-col w-full max-w-prose">
        {messages.length > 0
          ? messages.map((message) => (
              <div key={message.id} className="whitespace-pre-wrap my-4">
                <span className="font-bold">{message.role === 'human' ? 'User: ' : 'AI: '}</span>
                <span>{message.content}</span>
              </div>
            ))
          : null}

        <div className="whitespace-pre-wrap my-4">
          <span ref={responsePrefixRef} className="font-bold"></span>
          <span ref={responseMessageRef}></span>
        </div>
        <div ref={scrollRef} className="h-10"></div>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <input
          className="fixed box-border bottom-0 w-full max-w-lg p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  )
}
