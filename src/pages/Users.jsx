import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "../assets/Components/Header";
import Fab from "../assets/Components/Fab";
import { clientsService } from "../services/clientsService";
import "./Users.css";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [botones, setBotones] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    birthday: "",
    isVerified: false
  });

  // Obtener los clientes al cargar el componente
  useEffect(() => {
    fetchClients();
  }, []);
  
  // Función para obtener los clientes desde el API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clientsService.getAllClients();
      console.log("Clientes obtenidos:", response);
      setClients(response);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      toast.error("Error al cargar los clientes");
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar clientes por búsqueda
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.includes(searchTerm)
  );

  // Manejar botones flotantes
  const handleClick = () => {
    setBotones(!botones);
  };
  
  // Función para abrir el modal de edición
  const handleEdit = (client) => {
    setCurrentClient(client);
    setEditFormData({
      name: client.name,
      phoneNumber: client.phoneNumber,
      email: client.email,
      address: client.address,
      birthday: client.birthday ? client.birthday.substring(0, 10) : "", // Formato YYYY-MM-DD para el input date
      isVerified: client.isVerified
    });
    setShowEditModal(true);
  };
  
  // Función para actualizar los datos del formulario de edición
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  // Función para guardar los cambios
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!currentClient) return;
    
    try {
      await clientsService.updateClient(currentClient._id, editFormData);
      toast.success("Cliente actualizado exitosamente");
      setShowEditModal(false);
      fetchClients(); // Recargar la lista de clientes
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      toast.error("Error al actualizar cliente");
    }
  };
  
  // Función para eliminar un cliente
  const handleDelete = async (clientId) => {
    if (window.confirm("¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.")) {
      try {
        await clientsService.deleteClient(clientId);
        toast.success("Cliente eliminado exitosamente");
        fetchClients(); // Recargar la lista de clientes
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        toast.error("Error al eliminar cliente");
      }
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <Header 
        texto={"Clientes"} 
        buscador={true} 
        onSearch={handleSearch} 
      />
      
      <div className="users-container container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Gestión de Clientes</h2>
        </div>
        
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center my-5 py-5">
            <i className="bi bi-people fs-1 text-muted"></i>
            <p className="mt-3">No hay clientes disponibles</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client._id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phoneNumber}</td>
                    <td>{client.address}</td>
                    <td>
                      <span className={`badge ${client.isVerified ? 'bg-success' : 'bg-warning'}`}>
                        {client.isVerified ? 'Verificado' : 'No verificado'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => handleEdit(client)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(client._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="modal-backdrop show" onClick={() => setShowEditModal(false)}></div>
      )}
      
      <div className={`modal ${showEditModal ? 'show' : ''}`} 
        tabIndex="-1" 
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Cliente</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveChanges}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    required
                    maxLength="50"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Teléfono</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="phoneNumber" 
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleEditFormChange}
                    required
                    maxLength="9"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Dirección</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="address" 
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="birthday" className="form-label">Fecha de nacimiento</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    id="birthday" 
                    name="birthday"
                    value={editFormData.birthday}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                
                <div className="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="isVerified" 
                    name="isVerified"
                    checked={editFormData.isVerified}
                    onChange={handleEditFormChange}
                  />
                  <label className="form-check-label" htmlFor="isVerified">Verificado</label>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botones flotantes */}
      <div className="fab-container">
        <Fab handleClick={handleClick} botones={botones} />
      </div>
    </>
  );
};

export default Users;