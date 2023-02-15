'use client'
import { checkEnter, checkOnlyEnter } from '@/util/keyboard'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import React, { ChangeEventHandler, useState } from 'react'
import styles from './chat.module.scss'
import Conversation from './Conversation'

interface Conversation {
  prompt: string
  answer: string
}

export default function Dashboard () {
  const [prompt, setPrompt] = useState('')
  const [state, setState] = useState({
    isFetching: false,
  })

  const [conversations, setConversation] = useState<Conversation[]>([])
  const [answers, setAnswer] = useState<string[]>([])

  const submit = async () => {
    setState({ isFetching: true })
    
    const result = await fetch('/api/complete-chat-gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
      .then(async res => await res.json())
      .catch(e => {
        console.log('submit error', e)
      })

    if (result) {
      const answer: string = result.answer
      setAnswer([...answers, answer])
      setConversation([
        ...conversations,
        {
          prompt,
          answer,
        },
      ])
    }

    setState({ isFetching: false })
  }

  const handlePromptChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setPrompt(e.target.value)
  }

  const handlePromptKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (checkOnlyEnter(e)) {
      e.preventDefault()
      await submit()
      setPrompt('')
      return
    }

    if (checkEnter(e)) {
      setPrompt(`${prompt}\n`)
    }
  }

  return (
    <div>
      <h4 className={styles.title}>Enjoy a chat with GPT</h4>
      <div>
        {conversations.map(({ prompt, answer }, i) => (
          <Conversation key={i} prompt={prompt} answer={answer} />
        ))}
      </div>
      <TextareaAutosize className={styles.prompt}
        value={prompt}
        onChange={handlePromptChange}
        onKeyDown={handlePromptKeyDown}
      />
    </div>
  )
}