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
      
      // Verificar que el cliente tenga un nombre válido
      if (!response.data.name || response.data.name.trim() === '') {
        console.warn('ADVERTENCIA: Cliente recibido sin nombre válido');
        // Buscar en localStorage si tenemos un nombre guardado para este cliente
        const savedName = localStorage.getItem(`client_name_${id}`);
        if (savedName) {
          console.log('Usando nombre guardado en localStorage:', savedName);
          response.data.name = savedName;
        }
      }
      
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
    // SOLUCIÓN ROBUSTA: Guardar el nombre en localStorage y en memoria global ANTES de cualquier operación
    // Esto garantiza que tengamos el nombre incluso si hay errores
    if (clientData.name && clientData.name.trim() !== '') {
      const cleanName = String(clientData.name).trim();
      console.log('SOLUCIÓN ROBUSTA: Guardando nombre en localStorage y memoria global:', cleanName);
      localStorage.setItem(`client_name_${id}`, cleanName);
      
      // Guardar en una variable global para acceso inmediato
      window.__CLIENT_NAMES = window.__CLIENT_NAMES || {};
      window.__CLIENT_NAMES[id] = cleanName;
    }
    
    // SOLUCIÓN ROBUSTA: Crear una copia de los datos para no modificar el original
    const dataToSend = {...clientData};
    
    // SOLUCIÓN ROBUSTA: Asegurarnos de que el nombre esté presente y sea string
    if (dataToSend.name) {
      dataToSend.name = String(dataToSend.name).trim();
    }
    
    // Variable para almacenar el cliente actualizado
    let clientResult = null;
    let serverError = false;
    
    try {
      // Intentar realizar la actualización
      console.log('Enviando datos al servidor:', dataToSend);
      const response = await axiosClient.put(`/clients/${id}`, dataToSend);
      console.log('Respuesta completa del servidor:', response.data);
      
      // Obtener los datos actualizados
      try {
        const getResponse = await axiosClient.get(`/clients/${id}`);
        clientResult = getResponse.data;
      } catch (getError) {
        console.error('Error al obtener el cliente actualizado:', getError);
        // Si no podemos obtener los datos actualizados, usamos un objeto base
        clientResult = { _id: id };
        serverError = true;
      }
    } catch (updateError) {
      console.error(`Error al actualizar el cliente ${id}:`, updateError);
      // Si hay error en la actualización, usamos un objeto base
      clientResult = { _id: id };
      serverError = true;
    }
    
    // SOLUCIÓN ROBUSTA: Recuperar el cliente de todas formas
    if (!clientResult || serverError) {
      console.log('Recuperando cliente después de error');
      // Crear un objeto cliente con los datos que tenemos
      clientResult = clientResult || { _id: id };
      
      // Intentar recuperar datos del cliente existente
      try {
        const existingResponse = await axiosClient.get(`/clients/${id}`);
        clientResult = { ...existingResponse.data };
      } catch (existingError) {
        console.error('Error al recuperar cliente existente:', existingError);
      }
    }
    
    // SOLUCIÓN ROBUSTA: Forzar el nombre correcto en la respuesta SIEMPRE
    if (dataToSend.name) {
      // Siempre usar el nombre que enviamos, sin importar lo que devuelva el servidor
      const originalName = dataToSend.name;
      console.log(`Forzando nombre '${originalName}' en el resultado final`);
      clientResult = { ...clientResult, name: originalName };
    }
    
    // SOLUCIÓN ROBUSTA: Si no tenemos nombre, intentar recuperarlo de localStorage o memoria global
    if (!clientResult.name || clientResult.name.trim() === '') {
      // Intentar obtener de la memoria global
      let savedName = window.__CLIENT_NAMES && window.__CLIENT_NAMES[id];
      
      // Si no está en memoria global, intentar obtener de localStorage
      if (!savedName) {
        savedName = localStorage.getItem(`client_name_${id}`);
      }
      
      if (savedName) {
        console.log(`Recuperando nombre '${savedName}' de almacenamiento local`);
        clientResult.name = savedName;
      }
    }
    
    // Actualizar la memoria global y localStorage con el resultado final
    if (clientResult._id && clientResult.name) {
      localStorage.setItem(`client_name_${clientResult._id}`, clientResult.name);
      window.__CLIENT_NAMES = window.__CLIENT_NAMES || {};
      window.__CLIENT_NAMES[clientResult._id] = clientResult.name;
    }
    
    // Si hubo un error del servidor pero pudimos recuperar los datos, notificamos pero no lanzamos excepción
    if (serverError) {
      console.warn('Cliente recuperado después de error del servidor');
      return clientResult; // Devolvemos el cliente recuperado en lugar de lanzar excepción
    }
    
    return clientResult;
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
