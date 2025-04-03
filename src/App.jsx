import './App.css'
import Button from './assets/Components/Button'
import TextField from './assets/Components/TextField'
import logo from "./assets/logo.png"

function App() {
  document.body.style.backgroundColor= "#B7A18B"
  return (
    <>
      <img src={logo} alt="Descripción de la imagen" style={{ width: "200px", height: "200px" }} /><br /><br /><br />
      <TextField hint={"Correo electrónico"} type={"text"}></TextField><br /><br />
      <TextField hint={"Contraseña"} type={"password"}></TextField><br /><br />
      <Button texto={"ENTRAR"}></Button>
    </>
  )
}

export default App
