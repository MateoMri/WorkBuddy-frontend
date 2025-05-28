import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authService } from "../services/api";

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
const AuthProvider = ({ children }) => {
  // Estados para manejar la autenticación
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  // Función para decodificar el token JWT
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

  // Función para cerrar sesión
  const logout = useCallback(async () => {
    try {
      // Primero llamar al logout del API para limpiar cookies
      await authService.logout();
      
      // Luego actualizar el estado local
      setCurrentUser(null);
      setUserType("");
      setIsAuthenticated(false);
      navigate("/");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún si hay error, limpiamos el estado local
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      setUserType("");
      setIsAuthenticated(false);
      navigate("/");
      toast.error("Hubo un problema al cerrar sesión");
    }
  }, [navigate]);

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

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Verificar que el token sea válido con el backend
        try {
          const isValid = await authService.verifyToken();
          
          if (!isValid) {
            console.warn("Token no válido según verificación del backend");
            logout();
            setLoading(false);
            return;
          }
          
          // Intentar decodificar el token
          const userInfo = parseJwt(token);
          
          if (userInfo) {
            // Extraer el tipo de usuario
            let userType = "";
            if (userInfo.userType) {
              userType = userInfo.userType;
            } else if (userInfo.id === "admin") {
              userType = "admin";
            }
            
            // Actualizar el estado
            setCurrentUser(userInfo);
            setUserType(userType);
            setIsAuthenticated(true);
          } else {
            console.warn("No se pudo decodificar el token JWT");
            logout();
          }
        } catch (error) {
          console.error("Error al verificar token:", error);
          logout();
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        logout();
      } finally {
        // Siempre marcar como cargado cuando se completa la verificación
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [logout]);

  // Valores que se proporcionarán a través del contexto
  const contextValue = {
    currentUser,
    userType,
    isAuthenticated,
    loading,
    authError,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
