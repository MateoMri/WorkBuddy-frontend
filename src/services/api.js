import axios from 'axios';
import toast from 'react-hot-toast';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: 'http://localhost:4000/wb', // URL base del backend
  withCredentials: true, // Importante para manejar cookies de autenticación
  timeout: 10000, // Tiempo máximo de espera para las solicitudes
});

// Interceptor para agregar el token a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    // Log para depuración
    console.log("Respuesta exitosa:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log detallado del error para depuración
    console.error("Error en petición:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      error: error.message
    });

    const statusCode = error.response?.status;
    
    // Si el error es 401 (no autorizado) o 403 (prohibido)
    if (statusCode === 401 || statusCode === 403) {
      toast.error('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
      // Limpiar sesión
      localStorage.removeItem('authToken');
      window.location.href = '/'; // Redirigir al login
    } else if (statusCode === 404) {
      toast.error('Recurso no encontrado');
    } else if (statusCode === 500) {
      toast.error('Error en el servidor. Intente más tarde.');
    } else {
      toast.error(error.response?.data?.message || 'Ha ocurrido un error');
    }
    
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    try {
      console.log("Enviando solicitud de login a:", api.defaults.baseURL + "/login");
      // Es importante incluir credentials: "include" para permitir cookies
      const response = await api.post("/login", { email, password }, { withCredentials: true });
      
      // Depurar la respuesta completa del servidor
      console.log("Respuesta completa del servidor:", response);
      console.log("Headers de respuesta:", response.headers);
      console.log("Datos de respuesta login:", response.data);
      
      // Verificar y depurar el token JWT
      if (response.data && response.data.token) {
        console.log("Token recibido:", response.data.token);
        console.log("Longitud del token:", response.data.token.length);
        console.log("Partes del token:", response.data.token.split(".").length);
        
        // Verificar formato del token (debe tener 3 partes separadas por puntos)
        const tokenParts = response.data.token.split(".");
        if (tokenParts.length !== 3) {
          console.warn("El token no tiene el formato JWT esperado (header.payload.signature)");
        }
      } else {
        console.warn("La respuesta no contiene un token JWT");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error completo en login:", error);
      // Mostrar más detalles del error para depuración
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Código de estado:", error.response.status);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor", error.request);
      } else {
        console.error("Error en la configuración de la solicitud:", error.message);
      }
      throw error.response?.data || { message: "Error al iniciar sesión" };
    }
  },
  
  // Verificar token
  verifyToken: async () => {
    try {
      // Intentamos verificar el token utilizando el endpoint de empleados
      // ya que es una ruta protegida que requiere autenticación
      const response = await api.get("/employees", { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error al verificar token:", error);
      if (error.response) {
        console.error("Código de estado:", error.response.status);
      }
      throw error.response?.data || { message: "Error al verificar token" };
    }
  },
  
  // Cerrar sesión
  logout: async () => {
    try {
      // Si tu backend tiene un endpoint para logout
      // const response = await api.post('/logout');
      // return response.data;
      
      // Si no hay endpoint de logout, solo limpiamos localmente
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Error al cerrar sesión' };
    }
  }
};

// Servicios para usuarios (empleados)
export const userService = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      const response = await api.get('/employees');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuarios' };
    }
  },
  
  // Obtener un usuario por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el usuario' };
    }
  },
  
  // Crear un nuevo usuario
  create: async (userData) => {
    try {
      const response = await api.post('/employees', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el usuario' };
    }
  },
  
  // Actualizar un usuario
  update: async (id, userData) => {
    try {
      const response = await api.put(`/employees/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el usuario' };
    }
  },
  
  // Eliminar un usuario
  delete: async (id) => {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el usuario' };
    }
  }
};

// Puedes agregar más servicios para otras entidades (órdenes, inventario, etc.)

export default api;
