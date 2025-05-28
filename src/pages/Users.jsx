import React, { useEffect, useState, useRef, useContext } from "react";
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
  
  // React Hook Form para validación
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting }
  } = useForm({
    mode: "onBlur", // Validar al perder el foco
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      address: "",
      birthday: "",
      isVerified: false
    }
  });
  
  // No necesitamos watch() para este componente

  // Efecto para hacer focus en el primer campo con error
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  // Recuperar lista de clientes
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getClients();
      setClients(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError("No se pudieron cargar los clientes. Intente nuevamente.");
      toast.error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

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
  const handleEditClient = (client) => {
    // Formatear la fecha para el input tipo date
    let formattedDate = "";
    if (client.birthday) {
      const date = new Date(client.birthday);
      formattedDate = date.toISOString().split('T')[0];
    }

    // Resetear el formulario con los datos del cliente
    reset({
      name: client.name || "",
      phoneNumber: client.phoneNumber || "",
      email: client.email || "",
      password: "", // No mostramos la contraseña existente
      address: client.address || "",
      birthday: formattedDate,
      isVerified: client.isVerified || false
    });
    
    setSelectedClient(client);
    setModalMode("edit");
    setShowModal(true);
  };

  // Abrir el modal de confirmación de eliminación
  const handleDeleteConfirm = (client) => {
    setSelectedClient(client);
    setDeleteConfirmModal(true);
  };

  // Eliminar un cliente
  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    try {
      await clientsService.deleteClient(selectedClient._id);
      toast.success("Cliente eliminado con éxito");
      fetchClients(); // Recargar la lista
      setDeleteConfirmModal(false);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar cliente");
    }
  };

  // Guardar los datos del formulario (crear o editar)
  const onSubmit = async (data) => {
    try {
      if (modalMode === "create") {
        await clientsService.createClient(data);
        toast.success("Cliente creado con éxito");
      } else {
        // Si estamos editando y no se proporcionó una nueva contraseña, la eliminamos del objeto
        const dataToUpdate = {...data};
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
        }
        await clientsService.updateClient(selectedClient._id, dataToUpdate);
        toast.success("Cliente actualizado con éxito");
      }

      setShowModal(false);
      fetchClients(); // Recargar la lista
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      toast.error(error.message || "Error al guardar cliente");
    }
  };

  // Filtrar clientes según el término de búsqueda
  const filteredClients = clients.filter(client => 
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
      <div className="d-flex justify-content-between align-items-center p-3 header">
        <h1 className="h2 m-0">Usuarios</h1>
        <div className="d-flex gap-3 align-items-center">
          <div className="search-container">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar..." 
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Buscar usuarios"
            />
          </div>
          <button 
            className="btn btn-cerrar-sesion" 
            onClick={logout}
            aria-label="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
          </button>
        </div>
      </div>

      <div className="px-2" role="main" aria-label="Gestión de clientes">
        {loading ? (
          <div className="text-center mt-5" aria-live="polite">
            <Spinner animation="border" variant="primary" aria-hidden="true" />
            <p className="mt-2">Cargando clientes...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" aria-live="assertive">{error}</Alert>
        ) : (
          <div className="tabla-usuarios" role="region" aria-label="Lista de clientes">
            {/* Encabezado */}
            <div className="fila encabezado" role="rowheader">
              <div>Nombre</div>
              <div>Correo electrónico</div>
              <div>Teléfono</div>
              <div>Acciones</div>
            </div>

            {filteredClients.length === 0 ? (
              <div className="text-center py-4" aria-live="polite">
                <p>No se encontraron clientes</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div className="fila" key={client._id} role="row" tabIndex="0">
                  <div className="user-data">{client.name || "Sin nombre"}</div>
                  <div className="user-data">{client.email || "Sin email"}</div>
                  <div className="user-data">{client.phoneNumber || "Sin teléfono"}</div>
                  <div className="actions">
                    <button 
                      className="btn action-btn btn-outline-info"
                      onClick={() => handleEditClient(client)}
                      aria-label={`Editar cliente ${client.name}`}
                    >
                      <i className="bi bi-pencil-fill" aria-hidden="true"></i>
                    </button>
                    <button 
                      className="btn action-btn btn-outline-danger"
                      onClick={() => handleDeleteConfirm(client)}
                      aria-label={`Eliminar cliente ${client.name}`}
                    >
                      <i className="bi bi-trash-fill" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Botón flotante */}
      <div className="fab-container">
        <Fab
          bottom={20}
          right={20}
          icon={"three-dots-vertical"}
          onClick={handleClick}
          aria-label="Menú de opciones"
        />

        {botones && (
          <div aria-live="polite">
            <Fab
              bottom={130}
              right={20}
              titulo={"Regresar"}
              icon="arrow-90deg-left"
              onClick={goBack}
              aria-label="Regresar a inicio"
            />
            <Fab
              bottom={240}
              right={20}
              titulo={"Agregar"}
              icon="plus"
              onClick={handleCreateClient}
              aria-label="Agregar nuevo cliente"
            />
          </div>
        )}
      </div>

      {/* Modal para crear/editar cliente */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        aria-labelledby="client-form-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="client-form-modal-title">
            {modalMode === "create" ? "Crear Nuevo Cliente" : "Editar Cliente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                        message: "El nombre no puede tener más de 25 caracteres"
                      }
                    })}
                    ref={errors.name ? firstErrorRef : null}
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
                    type="text"
                    placeholder="Número de teléfono"
                    isInvalid={!!errors.phoneNumber}
                    {...register("phoneNumber", { 
                      required: "El teléfono es obligatorio",
                      maxLength: {
                        value: 9,
                        message: "El teléfono no puede tener más de 9 dígitos"
                      },
                      pattern: {
                        value: /^[0-9]{8,9}$/,
                        message: "Formato de teléfono inválido"
                      }
                    })}
                    aria-describedby={errors.phoneNumber ? "phone-error" : ""}
                  />
                  {errors.phoneNumber && (
                    <Form.Control.Feedback type="invalid" id="phone-error">
                      {errors.phoneNumber.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="correo@ejemplo.com"
                isInvalid={!!errors.email}
                {...register("email", { 
                  required: "El correo electrónico es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Formato de correo electrónico inválido"
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
                {modalMode === "create" ? "Contraseña" : "Nueva contraseña (dejar en blanco para mantener actual)"}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={modalMode === "create" ? "Contraseña (mínimo 8 caracteres)" : "Nueva contraseña"}
                isInvalid={!!errors.password}
                {...register("password", { 
                  required: modalMode === "create" ? "La contraseña es obligatoria" : false,
                  minLength: {
                    value: modalMode === "create" ? 8 : 0,
                    message: "La contraseña debe tener al menos 8 caracteres"
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
    </>
  );
};

export default Users;