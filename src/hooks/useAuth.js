import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
