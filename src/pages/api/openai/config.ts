import { NextApiHandler } from 'next'
import { OpenAiConfig } from './constants'


const h: NextApiHandler = async (req, res) => {
  res.status(200).json({ config: OpenAiConfig })
}
export default h
