import { OpenAIApi, Configuration } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

console.log('=== init openai', openai)

export { openai }
