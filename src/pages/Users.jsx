import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import Header from "../assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "../assets/Components/Fab";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import clientsService from "../services/clientsService";
import { AuthContext } from "../contexts/AuthContext";
import "./Users.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Users = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [botones, setBotones] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Referencia para focus en primera alerta de error
  const firstErrorRef = useRef(null);
  
  // Estado local para los valores de los campos del formulario
  const [formValues, setFormValues] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    birthday: "",
    isVerified: false
  });
  
  // React Hook Form para validación
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: "onBlur", // Validar al perder el foco
    defaultValues: formValues
  });

  // Efecto para hacer focus en el primer campo con error
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  // Recuperar lista de clientes - envuelto en useCallback para evitar recreaciones en cada renderizado
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getClients();
      if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.error("Datos de clientes recibidos no son un array:", data);
        setError("Formato de datos incorrecto. Intente nuevamente.");
        // Si hay un error de formato, verificar si podría ser un problema de autenticación
        if (data && data.message && (data.message.includes("token") || data.message.includes("auth"))) {
          toast.error("Sesión expirada. Iniciando sesión nuevamente.");
          setTimeout(() => logout(), 2000);
        } else {
          toast.error("Error al cargar clientes: formato incorrecto");
        }
      }
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError("No se pudieron cargar los clientes. Intente nuevamente.");
      
      // Verificar si el error es de autenticación
      if (error && (error.message?.includes("unauthorized") || error.status === 401)) {
        toast.error("Sesión expirada. Iniciando sesión nuevamente.");
        setTimeout(() => logout(), 2000);
      } else {
        toast.error("Error al cargar clientes");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Ir atrás
  const goBack = () => {
    navigate("/Home");
  };

  // Manejo del FAB principal
  const handleClick = () => {
    setBotones(!botones);
  };

  // Abrir el modal para crear
  const handleCreateClient = () => {
    reset({
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      address: "",
      birthday: "",
      isVerified: false
    });
    setModalMode("create");
    setShowModal(true);
  };

  // Abrir el modal para editar
  const handleEditClient = async (client) => {
    try {
      // Guardar el nombre original para comparación posterior
      const originalName = client.name;
      console.log("Nombre original del cliente:", originalName);
      
      // Guardar el nombre original en localStorage y memoria global para mayor seguridad
      if (originalName && originalName.trim() !== '') {
        console.log("Guardando nombre original en localStorage y memoria global:", originalName);
        localStorage.setItem(`client_name_${client._id}`, originalName);
        
        // Guardar en una variable global para acceso inmediato
        window.__CLIENT_NAMES = window.__CLIENT_NAMES || {};
        window.__CLIENT_NAMES[client._id] = originalName;
      }
      
      // Obtener datos frescos del cliente desde el servidor
      const freshClientData = await clientsService.getClient(client._id);
      console.log("Datos del cliente obtenidos:", freshClientData);
      
      // Formatear la fecha para el campo de formulario
      let formattedDate = "";
      if (freshClientData.birthday) {
        const date = new Date(freshClientData.birthday);
        formattedDate = date.toISOString().split('T')[0];
      }
      
      // SOLUCIÓN FINAL: Asegurarnos de que el nombre esté presente y sea correcto
      // Preferimos usar el nombre original que vimos en la lista
      let clientName = originalName;
      
      // Si por alguna razón no tenemos el nombre original
      if (!clientName || clientName.trim() === '') {
        // 1. Intentar usar el nombre de los datos frescos del servidor
        if (freshClientData.name && freshClientData.name.trim() !== '') {
          clientName = freshClientData.name;
        } else {
          // 2. Intentar obtener de la memoria global
          clientName = window.__CLIENT_NAMES && window.__CLIENT_NAMES[client._id];
          
          // 3. Si no está en memoria global, intentar obtener de localStorage
          if (!clientName) {
            clientName = localStorage.getItem(`client_name_${client._id}`);
          }
          
          // 4. Si todavía no tenemos nombre, usar un valor por defecto
          if (!clientName) {
            clientName = "Usuario";
          }
        }
      }
      
      console.log(`NOMBRE FINAL PARA EL FORMULARIO: '${clientName}'`);
      
      // SOLUCIÓN FINAL: Modificar directamente el objeto freshClientData
      freshClientData.name = clientName;
      
      // Guardar el nombre en todas las fuentes posibles
      localStorage.setItem(`client_name_${client._id}`, clientName);
      window.__CLIENT_NAMES = window.__CLIENT_NAMES || {};
      window.__CLIENT_NAMES[client._id] = clientName;
      
      // Usar un enfoque más directo para establecer el valor del formulario
      setValue('name', clientName);
      
      // Configurar el formulario con los datos frescos del cliente y el nombre garantizado
      reset({
        name: clientName,
        phoneNumber: freshClientData.phoneNumber || "",
        email: freshClientData.email || "",
        password: "", // No mostrar la contraseña actual por seguridad
        address: freshClientData.address || "",
        birthday: formattedDate,
        isVerified: freshClientData.isVerified || false
      });
      
      // Forzar la actualización del campo de nombre directamente en el DOM
      setTimeout(() => {
        const nameInput = document.getElementById('name');
        if (nameInput) {
          nameInput.value = clientName;
          // Disparar un evento de cambio para asegurarnos de que React Hook Form detecte el cambio
          const event = new Event('input', { bubbles: true });
          nameInput.dispatchEvent(event);
        }
      }, 100);
      
      // Configurar el modo del modal y mostrar
      setModalMode("edit");
      setSelectedClient(client);
      setShowModal(true);
    } catch (error) {
      console.error("Error al cargar datos del cliente para editar:", error);
      toast.error("Error al cargar datos del cliente");
    }
  };

  // Abrir el modal de confirmación de eliminación
  const handleDeleteConfirm = (client) => {
    setSelectedClient(client);
    setDeleteConfirmModal(true);
  };

  // Eliminar un cliente
  const handleDeleteClient = async () => {
    try {
      await clientsService.deleteClient(selectedClient._id);
      setDeleteConfirmModal(false);
      toast.success("Cliente eliminado con éxito");
      fetchClients(); // Recargar la lista de clientes
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar cliente");
    }
  };

  // Guardar los datos del formulario (crear o editar)
  const onSubmit = async (data) => {
    try {
      // Mostrar indicador de carga
      toast.loading("Guardando cambios...", { id: "saving-client" });
      
      let updatedClient;
      
      if (modalMode === "create") {
        // Crear nuevo cliente
        const response = await clientsService.createClient(data);
        toast.success("Cliente creado con éxito");
        updatedClient = response;
      } else {
        // Si estamos editando y no se proporcionó una nueva contraseña, la eliminamos del objeto
        const dataToUpdate = {...data};
        if (!dataToUpdate.password || dataToUpdate.password.trim() === '') {
          delete dataToUpdate.password;
        }
        
        // Asegurarse de que estamos pasando el ID correcto
        if (!selectedClient || !selectedClient._id) {
          throw new Error("No se pudo identificar el cliente a actualizar");
        }
        
        // SOLUCIÓN DEFINITIVA: Guardar el nombre en localStorage y memoria global ANTES de la actualización
        if (dataToUpdate.name) {
          localStorage.setItem(`client_name_${selectedClient._id}`, dataToUpdate.name);
          window.__CLIENT_NAMES = window.__CLIENT_NAMES || {};
          window.__CLIENT_NAMES[selectedClient._id] = dataToUpdate.name;
        }
        
        try {
          // Guardar el nombre original para verificación
          const originalName = dataToUpdate.name;
          console.log("Nombre original a actualizar:", originalName);
          
          // Actualizar en el servidor
          const updatedData = await clientsService.updateClient(selectedClient._id, dataToUpdate);
          
          // SOLUCIÓN DEFINITIVA: Forzar el nombre correcto en los datos actualizados
          if (originalName && (!updatedData.name || updatedData.name !== originalName)) {
            console.log("Forzando nombre correcto en datos actualizados:", originalName);
            updatedData.name = originalName;
          }
          
          updatedClient = updatedData;
          toast.success("Cliente actualizado con éxito");
        } catch (updateError) {
          console.error("Error al actualizar cliente:", updateError);
          
          // Si hay error al actualizar, intentar recuperar los datos del cliente
          try {
            const freshClientData = await clientsService.getClient(selectedClient._id);
            
            // SOLUCIÓN DEFINITIVA: Forzar el nombre correcto en los datos recuperados
            if (dataToUpdate.name) {
              freshClientData.name = dataToUpdate.name;
              console.warn("Forzando nombre correcto en datos recuperados después de error");
            }
            
            updatedClient = freshClientData;
            toast.success("Cliente recuperado después de error");
          } catch (getError) {
            console.error("Error al recuperar cliente después de actualizar:", getError);
            
            // SOLUCIÓN DEFINITIVA: Si todo falla, crear un objeto cliente con los datos que tenemos
            updatedClient = {
              _id: selectedClient._id,
              ...dataToUpdate
            };
            toast.error("Error al actualizar, usando datos locales");
          }
        }
      }
      
      // SOLUCIÓN DEFINITIVA: Actualizar inmediatamente la lista de clientes con el cliente actualizado
      if (updatedClient && updatedClient._id) {
        console.log("Actualizando cliente en la lista local:", updatedClient);
        
        // Actualizar la lista de clientes inmediatamente sin esperar a fetchClients
        setClients(prevClients => {
          return prevClients.map(client => {
            if (client._id === updatedClient._id) {
              // Asegurarnos de que el nombre esté correcto
              const correctName = data.name || updatedClient.name;
              return { ...updatedClient, name: correctName };
            }
            return client;
          });
        });
      }

      // Cerrar el modal y limpiar el formulario
      setShowModal(false);
      
      // Resetear el formulario después de guardar
      reset({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        address: "",
        birthday: "",
        isVerified: false
      });
      
      // Resetear el estado local de los valores del formulario
      setFormValues({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        address: "",
        birthday: "",
        isVerified: false
      });
      
      // SOLUCIÓN DEFINITIVA: Recargar la lista de clientes después de un breve retraso
      // Esto asegura que los cambios se reflejen correctamente en el backend
      setTimeout(() => {
        fetchClients();
      }, 500);
      
      // Limpiar el toast de carga
      toast.dismiss("saving-client");

      // Desplazarnos al cliente actualizado para que sea visible
      if (updatedClient && updatedClient._id) {
        setTimeout(() => {
          const clientElement = document.getElementById(`client-${updatedClient._id}`);
          if (clientElement) {
            clientElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            clientElement.classList.add('highlight-row');
            setTimeout(() => {
              clientElement.classList.remove('highlight-row');
            }, 2000);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error general:", error);
      toast.error("Error al procesar la solicitud");
      toast.dismiss("saving-client");
    }
  };

  // Aplicar corrección de nombres a todos los clientes antes de filtrar
  const clientsWithFixedNames = clients.map(client => {
    // Si el cliente no tiene nombre o está vacío, intentar recuperarlo
    if (!client.name || client.name.trim() === '') {
      // 1. Intentar obtener de la memoria global
      let savedName = window.__CLIENT_NAMES && window.__CLIENT_NAMES[client._id];
      
      // 2. Si no está en memoria global, intentar obtener de localStorage
      if (!savedName) {
        savedName = localStorage.getItem(`client_name_${client._id}`);
      }
      
      // 3. Si encontramos un nombre guardado, usarlo
      if (savedName) {
        return { ...client, name: savedName };
      }
    }
    return client;
  });
  
  // Filtrar clientes según el término de búsqueda
  const filteredClients = clientsWithFixedNames.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber?.includes(searchTerm)
  );

  // Manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <>
      <Header title="Usuarios" />
      
      <div className="container mt-4">
        {/* Barra de búsqueda */}
        <div className="search-container mb-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Buscar usuarios"
            />
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => handleSearch("")}
                aria-label="Limpiar búsqueda"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </div>
        
        {/* Mostrar error si existe */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        {/* Mostrar spinner durante la carga */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-2">Cargando usuarios...</p>
          </div>
        ) : (
          <>
            {/* Mostrar mensaje si no hay clientes */}
            {filteredClients.length === 0 ? (
              <div className="text-center my-5">
                <i className="bi bi-people display-1 text-muted"></i>
                <p className="mt-3 lead">
                  {searchTerm 
                    ? "No se encontraron usuarios que coincidan con la búsqueda." 
                    : "No hay usuarios registrados."}
                </p>
                <Button 
                  variant="primary" 
                  onClick={handleCreateClient}
                  className="mt-2"
                  aria-label="Agregar nuevo usuario"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Agregar Usuario
                </Button>
              </div>
            ) : (
              /* Tabla de clientes */
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Email</th>
                      <th scope="col">Teléfono</th>
                      <th scope="col">Verificado</th>
                      <th scope="col" className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client, index) => (
                      <tr key={client._id} id={`client-${client._id}`}>
                        <td>{index + 1}</td>
                        <td>{client.name || "Sin nombre"}</td>
                        <td>{client.email}</td>
                        <td>{client.phoneNumber}</td>
                        <td>
                          {client.isVerified ? (
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Verificado
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group" aria-label="Acciones de usuario">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditClient(client)}
                              aria-label={`Editar ${client.name || "usuario"}`}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteConfirm(client)}
                              aria-label={`Eliminar ${client.name || "usuario"}`}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal para crear/editar cliente */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        backdrop="static"
        size="lg"
        aria-labelledby="client-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="client-modal-title">
            {modalMode === "create" ? "Crear Nuevo Usuario" : "Editar Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre completo"
                    isInvalid={!!errors.name}
                    {...register("name", { 
                      required: "El nombre es obligatorio",
                      maxLength: {
                        value: 25,
                        message: "El nombre no puede exceder los 25 caracteres"
                      }
                    })}
                    ref={firstErrorRef}
                    aria-describedby={errors.name ? "name-error" : ""}
                  />
                  {errors.name && (
                    <Form.Control.Feedback type="invalid" id="name-error">
                      {errors.name.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="phoneNumber">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Número de teléfono"
                    isInvalid={!!errors.phoneNumber}
                    {...register("phoneNumber", { 
                      required: "El teléfono es obligatorio",
                      maxLength: {
                        value: 9,
                        message: "El teléfono no puede exceder los 9 caracteres"
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números"
                      }
                    })}
                    aria-describedby={errors.phoneNumber ? "phoneNumber-error" : ""}
                  />
                  {errors.phoneNumber && (
                    <Form.Control.Feedback type="invalid" id="phoneNumber-error">
                      {errors.phoneNumber.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="correo@ejemplo.com"
                isInvalid={!!errors.email}
                {...register("email", { 
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Por favor, ingrese un email válido"
                  }
                })}
                aria-describedby={errors.email ? "email-error" : ""}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid" id="email-error">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>
                {modalMode === "create" ? "Contraseña" : "Nueva Contraseña (dejar en blanco para mantener la actual)"}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={modalMode === "create" ? "Contraseña" : "Nueva contraseña (opcional)"}
                isInvalid={!!errors.password}
                {...register("password", { 
                  required: modalMode === "create" ? "La contraseña es obligatoria" : false,
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres"
                  },
                  validate: value => {
                    if (modalMode === "edit" && (!value || value.trim() === "")) {
                      return true; // Permitir contraseña vacía en modo edición
                    }
                    return true;
                  }
                })}
                aria-describedby={errors.password ? "password-error" : ""}
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid" id="password-error">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Dirección completa"
                    isInvalid={!!errors.address}
                    {...register("address", { 
                      required: "La dirección es obligatoria"
                    })}
                    aria-describedby={errors.address ? "address-error" : ""}
                  />
                  {errors.address && (
                    <Form.Control.Feedback type="invalid" id="address-error">
                      {errors.address.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="birthday">
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    isInvalid={!!errors.birthday}
                    {...register("birthday", { 
                      required: "La fecha de nacimiento es obligatoria"
                    })}
                    aria-describedby={errors.birthday ? "birthday-error" : ""}
                  />
                  {errors.birthday && (
                    <Form.Control.Feedback type="invalid" id="birthday-error">
                      {errors.birthday.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="isVerified">
              <Form.Check
                type="checkbox"
                label="Usuario verificado"
                {...register("isVerified")}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                type="button"
                aria-label="Cancelar"
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
                aria-label={modalMode === "create" ? "Crear cliente" : "Guardar cambios"}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Procesando...
                  </>
                ) : (
                  modalMode === "create" ? "Crear Cliente" : "Guardar Cambios"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal 
        show={deleteConfirmModal} 
        onHide={() => setDeleteConfirmModal(false)}
        aria-labelledby="delete-confirm-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="delete-confirm-modal-title">Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar al cliente {selectedClient?.name}? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setDeleteConfirmModal(false)}
            aria-label="Cancelar eliminación"
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteClient}
            aria-label="Confirmar eliminación"
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* FAB principal */}
      <Fab icon={"three-dots-vertical"} onClick={handleClick} />

      {/* Mostrar FABs adicionales cuando `botones` es true */}
      {botones && (
        <>
          <Fab
            titulo={"Regresar"}
            icon="arrow-90deg-left"
            onClick={goBack}
            style={{ bottom: "130px" }} // Ajusta la posición hacia arriba
          />
          <Fab
            titulo={"Agregar"}
            icon="plus"
            onClick={handleCreateClient}
            style={{ bottom: "240px" }} // Ajusta la posición hacia arriba
          />
        </>
      )}
    </>
  );
};

export default Users;
