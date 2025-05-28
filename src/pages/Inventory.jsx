import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "../assets/Components/Fab";
import ProductsCard from "../assets/Components/ProductsCard"; // Importando el componente ProductsCard

const Inventory = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/Home");
  };

  const [loading, setLoading] = useState(true);
  const [botones, setBotones] = useState(false);
  const [productos, setProductos] = useState([]);

  // Fetch productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products"); // Corregido
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cargar productos");
      }
      const data = await response.json(); // Declaración de data
      setProductos(data);
      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
  };

  // Eliminar un producto
  const borrarProducto = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      fetchProductos();
    } catch (error) {
      console.error("Error al borrar producto:", error);
    }
  };

  // Función para manejar el click en el Fab principal
  const handleClick = () => {
    setBotones(!botones);
  };

  // Llamar a la API para obtener productos cuando se monta el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <>
      <Header texto={"Inventario"} buscador={true} />

      <div className="container" style={{ paddingTop: "50px" }}>
        <div className="row">
          {productos.map((producto) => (
            <div className="col-md-4" key={producto._id}>
              <ProductsCard
                producto={producto}
                borrarProducto={() => borrarProducto(producto._id)}
                actualizarProducto={() => console.log("Actualizar producto", producto)} // Placeholder
              />
            </div>
          ))}
        </div>
      </div>

      <Fab
        bottom={20}
        right={20}
        icon={"three-dots-vertical"}
        onClick={handleClick}
      />

      {botones && (
        <div>
          <Fab
            bottom={130}
            right={20}
            titulo={"Regresar"}
            icon="arrow-90deg-left"
            onClick={goBack}
          ></Fab>

          <Fab
            bottom={240}
            right={20}
            titulo={"Agregar"}
            icon="plus"
          ></Fab>
        </div>
      )}
    </>
  );
};

export default Inventory;
