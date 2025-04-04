import "./App.css";
import Button from "./assets/Components/Button";
import TextField from "./assets/Components/TextField";
import logo from "./assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Home from "./Home";
import Users from "./Users";
import Inventory from "./Inventory";
import Orders from "./Orders";
import Offers from "./Offers";
import Stats from "./Stats";
import Reports from "./Reports";
import Settings from "./Settings";

// Componente de la página principal que maneja la navegación
function HomePage() {
  document.body.style.backgroundColor = "#B7A18B";
  const navigate = useNavigate(); // Usamos el hook useNavigate aquí para que funcione

  const goToHome = () => {
    navigate("/Home"); // Redirige a /Home
  };

  
  return (
    <div>
      <img
        src={logo}
        alt="Descripción de la imagen"
        style={{ width: "290px", height: "210px" }}
      />
      <br />
      <br />
      <br />
      <TextField hint={"Correo electrónico"} type={"text"} />
      <br />
      <br />
      <TextField hint={"Contraseña"} type={"password"} />
      <br />
      <br />
      <Button texto={"ENTRAR"} onClick={goToHome} />
    </div>
  );
}

function App() {

  return (
    <Router>
      <Routes>
        {/* Componente principal */}
        <Route path="/" element={<HomePage />} />
        {/* Ruta de la página Home */}
        <Route path="/Home" element={<Home />} />
      {/* Ruta de la página Users  */}
      <Route path="/Users" element={<Users/>}/>
      {/* Ruta de la página Inventory */}
      <Route path="/Inventory" element={<Inventory/>}/>
      {/* Ruta de la página Orders */}
      <Route path="/Orders" element={<Orders/>}/>
      {/* Ruta de la página Offers */}
      <Route path="/Offers" element={<Offers/>}/>
      {/* Ruta de la página Stats */}
      <Route path="/Stats" element={<Stats/>}/>
      {/* Ruta de la página Reports */}
      <Route path="/Reports" element={<Reports/>}/>
      {/* Ruta de la página Settings */}
      <Route path="/Settings" element={<Settings/>}/>
      </Routes>
    </Router>
  );
}

export default App;