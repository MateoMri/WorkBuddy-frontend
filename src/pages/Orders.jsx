import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "../assets/Components/Header";
import Button from "../assets/Components/Button";
import Fab from "../assets/Components/Fab";
import "../assets/Components/CSS/Orders.css";
import { AuthContext } from "../contexts/AuthContext";
import { ordersService } from "../services/ordersService";

const Orders = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [botones, setBotones] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1
  });
  
  // Obtener las órdenes al cargar el componente
  useEffect(() => {
    fetchOrders();
  }, [filters.page, filters.status]);
  
  // Función para obtener las órdenes desde el API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersService.getAllOrders();
      console.log("Órdenes obtenidas:", response);
      setOrders(response);
      
      // Si hay respuesta con paginación (como en getUserOrders)
      if (response.orders && response.total) {
        setOrders(response.orders);
        setPagination({
          total: response.total,
          pages: response.pages,
          currentPage: response.page
        });
      }
      
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
      toast.error("Error al cargar las órdenes");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para cambiar filtro de estado
  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };
  
  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };
  
  // Manejar botones flotantes
  const handleClick = () => {
    setBotones(!botones);
  };

  const goBack = () => {
    navigate("/Home");
  };
  
  // Función para mostrar el estado en español y con color
  const renderStatus = (status) => {
    const statusMap = {
      'pending': { text: 'Pendiente', color: '#f0ad4e', bgColor: '#fff3cd' },
      'paid': { text: 'Pagada', color: '#0275d8', bgColor: '#d9edf7' },
      'processing': { text: 'Procesando', color: '#5bc0de', bgColor: '#d1ecf1' },
      'shipped': { text: 'Enviada', color: '#5cb85c', bgColor: '#d4edda' },
      'delivered': { text: 'Entregada', color: '#5cb85c', bgColor: '#d4edda' },
      'cancelled': { text: 'Cancelada', color: '#d9534f', bgColor: '#f8d7da' }
    };
    
    const statusInfo = statusMap[status] || { text: status, color: '#6c757d', bgColor: '#e9ecef' };
    
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '0.25em 0.6em',
          fontSize: '0.75em',
          fontWeight: 'bold',
          color: statusInfo.color,
          backgroundColor: statusInfo.bgColor,
          borderRadius: '0.25rem',
          textTransform: 'capitalize'
        }}
      >
        {statusInfo.text}
      </span>
    );
  };
  
  // Función para mostrar el método de pago en español
  const renderPaymentMethod = (method) => {
    const methodMap = {
      'credit_card': 'Tarjeta de crédito',
      'paypal': 'PayPal',
      'efectivo': 'Efectivo'
    };
    
    return methodMap[method] || method;
  };
  
  // Función para manejar la actualización del estado de una orden
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersService.updateOrderStatus(orderId, newStatus);
      toast.success(`Estado de la orden actualizado a ${newStatus}`);
      fetchOrders(); // Recargar órdenes
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error("Error al actualizar el estado de la orden");
    }
  };
  
  // Función para ver detalles de una orden
  const viewOrderDetails = (orderId) => {
    // Aquí podrías implementar un modal o navegar a una página de detalles
    toast.success(`Ver detalles de orden ${orderId}`);
  };

  return (
    <>
      <Header texto={"Órdenes"} buscador={true} />
      
      <div className="orders-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Gestión de Órdenes</h2>
          
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm" 
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagadas</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviadas</option>
              <option value="delivered">Entregadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center my-5 py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="mt-3">No hay órdenes disponibles</p>
          </div>
        ) : (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {orders.map(order => (
                <div className="col" key={order._id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <span className="text-truncate">
                        <strong>ID:</strong> {order._id.substring(0, 8)}...
                      </span>
                      {renderStatus(order.status)}
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <small className="text-muted">Fecha:</small>
                        <p className="mb-0">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      
                      <div className="mb-2">
                        <small className="text-muted">Método de pago:</small>
                        <p className="mb-0">{renderPaymentMethod(order.paymentInfo?.method)}</p>
                      </div>
                      
                      {order.shippingAddress && (
                        <div className="mb-2">
                          <small className="text-muted">Dirección:</small>
                          <p className="mb-0 text-truncate">
                            {order.shippingAddress.street}, {order.shippingAddress.city}
                          </p>
                        </div>
                      )}
                      
                      <div className="mb-0">
                        <small className="text-muted">Total:</small>
                        <p className="mb-0 fw-bold">${order.totalAmount?.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="card-footer bg-white d-flex justify-content-between">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => viewOrderDetails(order._id)}
                      >
                        <i className="bi bi-eye me-1"></i> Ver detalles
                      </button>
                      
                      {order.status === "pending" && (
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown">
                            Actualizar estado
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" onClick={() => handleUpdateStatus(order._id, "paid")}>Marcar como pagada</button></li>
                            <li><button className="dropdown-item" onClick={() => handleUpdateStatus(order._id, "cancelled")}>Cancelar orden</button></li>
                          </ul>
                        </div>
                      )}
                      
                      {order.status === "paid" && (
                        <button 
                          className="btn btn-sm btn-outline-success" 
                          onClick={() => handleUpdateStatus(order._id, "processing")}
                        >
                          Procesar orden
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Paginación */}
            {pagination.pages > 1 && (
              <nav className="mt-4" aria-label="Paginación de órdenes">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(pagination.currentPage - 1)}>
                      Anterior
                    </button>
                  </li>
                  
                  {[...Array(pagination.pages).keys()].map(page => (
                    <li key={page + 1} className={`page-item ${pagination.currentPage === page + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                        {page + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${pagination.currentPage === pagination.pages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(pagination.currentPage + 1)}>
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
      
      {/* Botones flotantes */}
      <Fab
        bottom={"20px"}
        right={"20px"}
        icon={"three-dots-vertical"}
        onClick={handleClick}
      />

      {botones && (
        <div>
          <Fab
            bottom={"130px"}
            right={"20px"}
            titulo={"Regresar"}
            icon="arrow-90deg-left"
            onClick={goBack}
          />
        </div>
      )}
    </>
  );
};

export default Orders;
