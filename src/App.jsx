import "./App.css";
import Button from "./assets/Components/Button";
import TextField from "./assets/Components/TextField";
import logo from "./assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Offers from "./pages/Offers";
import Stats from "./pages/Stats";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AuthProvider from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster, toast } from "react-hot-toast";

// Componente de la página principal que maneja la navegación
function HomePage() {
  document.body.style.backgroundColor = "#B7A18B";
  // Llamada incondicional al hook
  const authContext = useAuth();
  
  // Solo extraemos lo que necesitamos para el login
  
  // Uso seguro de los valores del contexto
  const login = authContext?.login || (() => console.error("Función login no disponible"));
  const authError = authContext?.authError || "";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, field) => {
    console.log(`Campo ${field} cambiado a: ${e.target.value}`);
    setFormData(prevData => ({
      ...prevData,
      [field]: e.target.value
    }));
  };

  const handleLogin = async () => {
    // Mostrar los valores actuales antes de la validación
    console.log("Datos de formulario al intentar login:", formData);
    
    if (!formData.email || formData.email.trim() === "") {
      toast.error("Por favor ingresa un correo electrónico");
      return;
    }
    
    if (!formData.password || formData.password.trim() === "") {
      toast.error("Por favor ingresa una contraseña");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Intentando login con:", {
        email: formData.email,
        password: formData.password
      });
      
      await login(formData.email, formData.password);
    } catch (error) {
      console.error("Error en handleLogin:", error);
      // El manejo de errores ya está en el contexto AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img
          src={logo}
          alt="WorkBuddy Logo"
          style={{ width: "290px", height: "210px" }}
          className="mb-4"
        />
        <h2 className="mb-4">Acceso Empleados</h2>
        
        {authError && (
          <div className="alert alert-danger">{authError}</div>
        )}
        
        <div className="mb-3">
          <TextField 
            hint={"Correo electrónico"} 
            type={"text"} 
            value={formData.email}
            onChange={(e) => handleChange(e, "email")}
          />
        </div>
        
        <div className="mb-4">
          <TextField 
            hint={"Contraseña"} 
            type={"password"} 
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
          />
        </div>
        
        <Button 
          texto={isLoading ? "CARGANDO..." : "ENTRAR"} 
          onClick={handleLogin} 
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

// No olvidar importar useState arriba
import { useState } from "react";

// Componente principal que configura las rutas y la autenticación
function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Configuración del sistema de notificaciones */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        
        <Routes>
          {/* Página de login (accesible para todos) */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rutas protegidas (solo para empleados y administradores) */}
          <Route path="/Home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/Users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="/Inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />
          
          <Route path="/Orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          
          <Route path="/Offers" element={
            <ProtectedRoute>
              <Offers />
            </ProtectedRoute>
          } />
          
          <Route path="/Stats" element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          } />
          
          <Route path="/Reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/Settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Ruta de fallback para URLs no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;