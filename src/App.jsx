import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './assets/Components/Button'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button texto={"Entrar"}></Button>
    </>
  )
}

export default App
