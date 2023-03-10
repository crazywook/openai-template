'use client'
import { checkEnter, checkOnlyEnter } from '@/util/keyboard'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import Image from 'next/image'
import React, { ChangeEventHandler, useState } from 'react'
import ApiConfig from './ApiConfig'
import styles from './chat.module.scss'
import Conversation from './Conversation'
import loadingIcon from './SpinnerTrans200.png'

interface Conversation {
  prompt: string
  answer: string | JSX.Element
}
interface State {
  thinkingState?: 'thinking' | 'done' | 'error'
}

export default function OpenAiPage () {
  const [prompt, setPrompt] = useState('')
  const [state, setState] = useState<State>({
    thinkingState: undefined,
  })

  const [conversations, setConversation] = useState<Conversation[]>([])
  const [answers, setAnswer] = useState<string[]>([])

  const submit = async () => {
    
    const currentPrompt = prompt
    setPrompt('')
    console.log('currentPrompt' ,currentPrompt)
    setState({ thinkingState: 'thinking' })

    const newConversations = [
      ...conversations,
      {
        prompt: currentPrompt,
        answer: <>thinking...<Image height={20} src={loadingIcon} alt="loading"/></>,
      },
    ]
    setConversation(newConversations)

    const result = await fetch('/api/openai/complete-chat-gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: currentPrompt }),
    })
      .then(async res => await res.json())
      .catch(e => {
        console.log('submit error', e)
      })

    if (result) {
      const answer: string = result.answer
      setAnswer([...answers, answer])
      setConversation([
        ...newConversations.slice(0, -1),
        {
          prompt: currentPrompt,
          answer,
        },
      ])
    }

    await new Promise(resolve => {
      setTimeout(() => {
        resolve('')
      }, 1000)
    })
    setState({ thinkingState: 'done' })
  }

  const handlePromptChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setPrompt(e.target.value)
  }

  const handlePromptKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (checkOnlyEnter(e)) {
      e.preventDefault()
      await submit()
      return
    }

    if (checkEnter(e)) {
      setPrompt(`${prompt}\n`)
    }
  }

  return (
    <div className={styles.openai}>
      <aside className={styles['left-side']}></aside>
      <main className={styles.main}>
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
      </main>
      <ApiConfig/>
    </div>
  )
}
