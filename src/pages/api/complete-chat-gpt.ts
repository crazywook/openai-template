import { openai } from '@/model/openai'
import { NextApiHandler } from 'next'

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

async function complete (prompt: string) {
  const completion = await openai.createCompletion({
    model: AiModel.DAVINCI_003,
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
    
    throw e
  })
  
  console.log('=== complete', completion.data)
  return completion.data.choices[0].text
}
