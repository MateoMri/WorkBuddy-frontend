import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Header from "../assets/Components/Header";
import Button from "../assets/Components/Button";
import Fab from "../assets/Components/Fab";
import "../assets/Components/CSS/Orders.css";
import { AuthContext } from "../contexts/AuthContext";

// Componente simplificado para solucionar la pantalla en blanco
const Orders = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [botones, setBotones] = useState(false);
  
  console.log("Rendering Orders component", { auth });
  
  // Datos de prueba
  useEffect(() => {
    console.log("Orders component mounted");
    setTimeout(() => {
      setOrders([
        {
          _id: "12345678901234567890",
          createdAt: new Date().toISOString(),
          status: "pending",
          totalAmount: 150.75,
          paymentInfo: { method: "credit_card" }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Manejar botones flotantes
  const handleClick = () => {
    setBotones(!botones);
  };

  const goBack = () => {
    navigate("/Home");
  };
  
  return (
    <>
      <Header texto={"Órdenes"} buscador={true} />
      
      <div className="orders-container">
        <h2>Gestión de Órdenes</h2>
        
        {loading ? (
          <p>Cargando órdenes...</p>
        ) : orders.length === 0 ? (
          <p>No hay órdenes disponibles</p>
        ) : (
          <div>
            <p>Órdenes disponibles: {orders.length}</p>
            <ul>
              {orders.map(order => (
                <li key={order._id}>
                  ID: {order._id.substring(0, 8)}... - 
                  Fecha: {new Date(order.createdAt).toLocaleDateString()} - 
                  Total: ${order.totalAmount}
                </li>
              ))}
            </ul>
          </div>
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
