import { CreateCompletionRequest } from 'openai'
import { useEffect, useState } from 'react'
import styles from './chat.module.scss'

export default function ApiConfig () {
  const [apiConfig, setApiConfig] = useState<Partial<CreateCompletionRequest>>({})

  const init = async () => {
    const { config } = await fetch('/api/openai/config').then(r => r.json())

    setApiConfig(config)
  }

  const getVariation = () => {
    let display = ''

    if (apiConfig.top_p) {
      display += `top_p ${apiConfig.top_p}`
    }
    if (apiConfig.temperature) {
      display += ` temperature ${apiConfig.temperature}`
    }

    return display.trim()
  }

  useEffect(() => {
    init()
  }, [])

  return <aside className={styles['right-side']}>
    <div>model: {apiConfig.model}</div>
    <div>max-token: {apiConfig.max_tokens}</div>
    <div>variation: {getVariation()}</div>
  </aside>
}
