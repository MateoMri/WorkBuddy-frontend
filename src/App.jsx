import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './assets/Components/Button'
import TextField from './assets/Components/TextField'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <TextField hint={"Correo electrónico"} type={"text"}></TextField><br/><br/>
    <TextField hint={"Contraseña"} type={"password"}></TextField><br/><br/>
      <Button texto={"ENTRAR"}></Button>
      
    </>
  )
}

export default App
