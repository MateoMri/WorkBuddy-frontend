import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Componente que protege las rutas para usuarios autenticados
const ProtectedRoute = ({ children, allowedRoles = ['admin', 'employees'] }) => {
  const { isAuthenticated, userType, loading } = useAuth();

  // Si está cargando, mostrar indicador de carga
  if (loading) {
    return <div className="text-center p-5">Cargando...</div>;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el tipo de usuario está permitido
  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene permisos, mostrar la ruta
  return children;
};

export default ProtectedRoute;
