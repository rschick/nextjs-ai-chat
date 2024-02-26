import React, { useCallback, useState, useRef } from 'react'

const decoder = new TextDecoder()

export function useChat(scrollRef?: React.MutableRefObject<HTMLDivElement>) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const responsePrefixRef = useRef(null)
  const responseMessageRef = useRef(null)

  const sendRequest = useCallback(
    async (messages) => {
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        body: JSON.stringify({ messages })
      })

      const reader = response.body.getReader()

      responsePrefixRef.current.innerHTML = 'AI: '

      for (;;) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        responseMessageRef.current.innerHTML += decoder.decode(value)

        if (scrollRef.current) {
          scrollRef.current.scrollIntoView()
        }
      }
    },
    [scrollRef]
  )

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const newMessages = [
        ...messages,
        ...(responseMessageRef.current.innerHTML && [
          { role: 'assistant', content: responseMessageRef.current.innerHTML, id: Math.random().toString() }
        ]),
        { role: 'human', content: input, id: Math.random().toString() }
      ]

      responsePrefixRef.current.innerHTML = ''
      responseMessageRef.current.innerHTML = ''

      if (scrollRef.current) {
        scrollRef.current.scrollIntoView()
      }

      setMessages(newMessages)
      setInput('')
      await sendRequest(newMessages)
    },
    [input, messages, scrollRef, sendRequest]
  )

  return { messages, input, setInput, handleSubmit, responseMessageRef, responsePrefixRef }
}
