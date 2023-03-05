import { CreateCompletionRequest } from 'openai'

export enum AiModel {
  DAVINCI_002 = 'text-davinci-002',
  DAVINCI_003 = 'text-davinci-003',
}

export const OpenAiConfig: CreateCompletionRequest = {
  model: AiModel.DAVINCI_003,
  max_tokens: 2048,
  // temperature: 1.2,
  top_p: 0.5,
  n: 3,
  stream: false,
  logprobs: 5,
}
