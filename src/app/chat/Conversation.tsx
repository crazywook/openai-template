import style from './conversation.module.scss'

export default function Conversation ({
  prompt,
  answer,
}: {
  prompt: string
  answer: string
}) {
  return (
    <>
      <div className={style.conversation}>prompt: {prompt}</div>
      <div className={style.conversation}>answer: {answer}</div>
    </>
  )
}