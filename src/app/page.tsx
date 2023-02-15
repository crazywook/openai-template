import styles from './page.module.css'
import Chat from './chat/page'

export default function Home () {
  return (
    <main className={styles.main}>
      <Chat />
    </main>
  )
}
