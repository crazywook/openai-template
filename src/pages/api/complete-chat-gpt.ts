import { openai } from '@/model/openai'
import { NextApiHandler } from 'next'
import { FinishReason } from './types'

const h: NextApiHandler = async (req, res) => {
  if (!req.body.prompt) {
    res.status(400).json({ error: 'empty prompt' })
    return
  }
  const answer = await complete(req.body.prompt)
  res.status(200).json({ answer })
}
export default h

enum AiModel {
  DAVINCI_002 = 'text-davinci-002',
  DAVINCI_003 = 'text-davinci-003',
}

async function complete (prompt: string, callCount: number = 1): Promise<string> {
  const { data: completedData } = await openai.createCompletion({
    model: AiModel.DAVINCI_002,
    prompt,
  }).catch(e => {
    console.error('=== openai error', e.response.data.error)
    switch (e.response.status) {
      case 401:
        console.log('=== 401 todo notification')
        break
      default:
        break
    }
    
    if (callCount === 1) {
      throw e
    }
    return {
      data: {
        error: e,
        text: prompt,
      },
    }
  })

  if ('error' in completedData) {
    return completedData.text
  }
  
  console.log('=== completed', completedData)
  const choice = completedData.choices[0]

  const completed = callCount === 1
    ? choice.text || ''
    : prompt + choice.text

  if (choice.finish_reason !== FinishReason.LENGTH) {
    return completed
  }
  
  return complete(completed, callCount + 1)
}
