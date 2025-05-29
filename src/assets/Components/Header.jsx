import React, { useContext } from "react";
import icon from "../../assets/favicon.png";
import TextField from "./TextField";
import "./CSS/style.css";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
const Header = ({ texto, buscador }) => {
  const { logout, isAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada correctamente");
      
      // Forzar un refresco completo de la página para limpiar cualquier estado
      // incluidas las cookies persistentes
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
      
      // Incluso en caso de error, intentar limpiar el estado
      localStorage.removeItem('authToken');
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  return (
    <header className="header">
      <div className="d-flex align-items-center">
        <img
          src={icon}
          width="100"
          height="100"
          style={{ marginRight: "20px" }}
          alt="Logo"
        />
        <h1>{texto}</h1>
      </div>
      
      <div style={{ position: "absolute", right: "0", marginRight: "25px" }} className="d-flex align-items-center">
        {/* Si buscador es true, se renderiza el buscador */}
        {buscador && <TextField type="text" hint="Buscar" className="me-3" />}
        
        {/* Botón de cerrar sesión (solo se muestra si el usuario está autenticado) */}
        {isAuthenticated && (
          <button 
            onClick={handleLogout} 
            className="btn btn-outline-danger btn-sm ms-3"
            style={{ whiteSpace: "nowrap" }}
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
