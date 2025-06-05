import api from './api';

export const clientsService = {
  // Obtener todos los clientes
  getAllClients: async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error.response?.data || { message: 'Error al cargar los clientes' };
    }
  },

  // Obtener un cliente por ID
  getClientById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener cliente ${id}:`, error);
      throw error.response?.data || { message: 'Error al cargar el cliente' };
    }
  },

  // Crear un nuevo cliente
  createClient: async (clientData) => {
    try {
      const response = await api.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error.response?.data || { message: 'Error al crear el cliente' };
    }
  },

  // Actualizar un cliente existente
  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar cliente ${id}:`, error);
      throw error.response?.data || { message: 'Error al actualizar el cliente' };
    }
  },

  // Eliminar un cliente
  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar cliente ${id}:`, error);
      throw error.response?.data || { message: 'Error al eliminar el cliente' };
    }
  }
};

export default clientsService;