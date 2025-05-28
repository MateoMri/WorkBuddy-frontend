import axios from 'axios';

// Usando la misma URL base que el resto de la aplicación (puerto 4000)
const API_URL = 'http://localhost:4000/wb';
console.log('API URL para clients:', API_URL);

// Configuración del cliente axios con withCredentials para manejar cookies
const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const clientsService = {
  // Obtener todos los clientes
  getClients: async () => {
    try {
      const response = await axiosClient.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error.response?.data || { message: 'Error al obtener los clientes' };
    }
  },

  // Obtener un cliente específico
  getClient: async (id) => {
    try {
      const response = await axiosClient.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el cliente ${id}:`, error);
      throw error.response?.data || { message: 'Error al obtener el cliente' };
    }
  },

  // Crear un nuevo cliente
  createClient: async (clientData) => {
    try {
      const response = await axiosClient.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error.response?.data || { message: 'Error al crear el cliente' };
    }
  },

  // Actualizar un cliente existente
  updateClient: async (id, clientData) => {
    try {
      const response = await axiosClient.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el cliente ${id}:`, error);
      throw error.response?.data || { message: 'Error al actualizar el cliente' };
    }
  },

  // Eliminar un cliente
  deleteClient: async (id) => {
    try {
      const response = await axiosClient.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el cliente ${id}:`, error);
      throw error.response?.data || { message: 'Error al eliminar el cliente' };
    }
  }
};

export default clientsService;
