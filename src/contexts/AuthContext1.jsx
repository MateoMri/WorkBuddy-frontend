import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authService } from "../services/api";

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Función para iniciar sesión
  const login = async (email, password) => {
    console.log("Iniciando login con:", { email, password });
    setAuthError("");
    
    try {
      // Validar que los campos no estén vacíos
      if (!email || !password) {
        const msg = "Por favor ingresa correo y contraseña";
        setAuthError(msg);
        toast.error(msg);
        return { success: false, message: msg };
      }
      
      // Usar el servicio de autenticación
      const response = await authService.login(email, password);
      console.log("Respuesta del servidor:", response);
      
      // Extraer token de la respuesta
      const { token, message } = response;
      
      if (!token) {
        const msg = "No se recibió token de autenticación";
        setAuthError(msg);
        toast.error(msg);
        return { success: false, message: msg };
      }
      
      // Guardar el token en localStorage
      localStorage.setItem("authToken", token);
      
      // Procesar el token de forma segura
      let userInfo = { id: "unknown" };  // Valor por defecto
      let extractedUserType = "";
      
      try {
        // Intentar decodificar el token
        const decodedInfo = parseJwt(token);
        
        if (decodedInfo) {
          console.log("Token decodificado:", decodedInfo);
          userInfo = decodedInfo;
          
          // Extraer el tipo de usuario según la estructura del token
          if (decodedInfo.userType) {
            extractedUserType = decodedInfo.userType;
          } else if (decodedInfo.id === "admin") {
            extractedUserType = "admin";
          }
        } else {
          console.warn("No se pudo decodificar el token JWT");
          toast.warning("Sesión iniciada con información limitada", { duration: 4000 });
        }
      } catch (tokenError) {
        console.error("Error al procesar el token:", tokenError);
        toast.warning("Sesión iniciada con información limitada", { duration: 4000 });
      }
      
      // Actualizar el estado con la información obtenida
      setCurrentUser(userInfo);
      setUserType(extractedUserType);
      setIsAuthenticated(true);
      
      // Mostrar mensaje de éxito
      toast.success("Inicio de sesión exitoso");
      
      // Pequeña pausa antes de redirigir para permitir que se muestre el toast
      setTimeout(() => {
        // Redirigir al usuario
        window.location.href = "/Home";
      }, 1000);
      
      return { success: true, message };
      
    } catch (error) {
      console.error("Error en login:", error);
      
      // Establecer el mensaje de error
      const errorMessage = error.message || "Error al iniciar sesión";
      setAuthError(errorMessage);
      toast.error(errorMessage);
      
      return { success: false, message: errorMessage };
    }
  };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    navigate("/");
    toast.success("Sesión cerrada correctamente");
  }, [navigate]);

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (token) {
          // Verificar que el token sea válido con el backend
          try {
            await authService.verifyToken();
            const userInfo = parseJwt(token);
            
            if (userInfo) {
              // Asegurarnos de que userType está presente
              const userType = userInfo.userType || "";
              
              // Solo permitir acceso a empleados y admin
              if (userType === "admin" || userType === "employees") {
                setCurrentUser(userInfo);
                setUserType(userType);
                setIsAuthenticated(true);
              } else {
                throw new Error("Tipo de usuario no autorizado");
              }
            } else {
              throw new Error("Token inválido");
            }
          } catch (error) {
            console.error("Error al verificar token:", error);
            logout();
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [logout, navigate]);  // Añadir logout y navigate como dependencias

  // Función simplificada para decodificar el token JWT
  const parseJwt = (token) => {
    if (!token || typeof token !== "string") {
      console.warn("Token inválido para decodificar");
      return null;
    }
    
    try {
      // Dividir el token en sus partes
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.warn("El token no tiene formato JWT (header.payload.signature)");
        return null;
      }
      
      // Decodificar la parte del payload
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      
      // Decodificar usando window.atob y parsear como JSON
      const jsonPayload = window.atob(base64);
      const payload = JSON.parse(jsonPayload);
      
      console.log("Token decodificado correctamente:", payload);
      return payload;
    } catch (error) {
      console.error("Error al decodificar token JWT:", error);
      return null;
    }
  };

  // Valores que se proporcionarán a través del contexto
  const value = {
    currentUser,
    userType,
    isAuthenticated,
    loading,
    authError,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {initialized ? children : <div className="loading-screen">Cargando aplicación...</div>}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
