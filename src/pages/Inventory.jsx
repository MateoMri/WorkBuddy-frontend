import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "../assets/Components/Fab";
import { toast } from "react-hot-toast";
import { Modal, Button, Form } from "react-bootstrap";
import ProductsCard from "../assets/Components/ProductsCard"; // Importando el componente ProductsCard
const Inventory = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/Home");
  };

  const [loading, setLoading] = useState(true);
  const [botones, setBotones] = useState(false); // Estado para los FABs adicionales
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    image: null, // Aquí se guardará la imagen seleccionada
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  // Fetch productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:4000/wb/products"); // Corregido
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
      const response = await fetch(`http://localhost:4000/wb/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      fetchProductos();
      toast.success("Producto eliminado con éxito");
    } catch (error) {
      console.error("Error al borrar producto:", error);
    }
  };

  // Función para manejar el click en el Fab principal
  const handleClick = () => {
    setBotones(!botones);
  };
  const cerrarModal = () => {
    setShowModal(false);
    setModoEdicion(false);
    setNuevoProducto({
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      image: null,
    });
  };
  const crearProducto = async () => {
    try {
      const formData = new FormData();

      // Agregar los datos del formulario al FormData
      formData.append("name", nuevoProducto.name);
      formData.append("description", nuevoProducto.description);
      formData.append("category", nuevoProducto.category);
      formData.append("price", nuevoProducto.price);
      formData.append("stock", nuevoProducto.stock);

      // Agregar la imagen si existe
      if (nuevoProducto.image) {
        formData.append("image", nuevoProducto.image);
      }

      const response = await fetch("http://localhost:4000/wb/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Producto creado con éxito");
        fetchProductos()
        cerrarModal(); // Cerrar modal y resetear formulario
      } else {
        toast.error(data.message || "Error creando el producto");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      toast.error("Error creando el producto");
    }
  };
  
  const guardarCambiosProducto = async () => {
    try {
      const formData = new FormData();
  
      formData.append("name", nuevoProducto.name);
      formData.append("description", nuevoProducto.description);
      formData.append("category", nuevoProducto.category);
      formData.append("price", nuevoProducto.price);
      formData.append("stock", nuevoProducto.stock);
  
      // Solo incluir la imagen si fue modificada
      if (nuevoProducto.image) {
        formData.append("image", nuevoProducto.image);
      }
  
      const response = await fetch(`http://localhost:4000/wb/products/${nuevoProducto._id}`, {
        method: "PUT",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Producto actualizado con éxito");
        cerrarModal();
        fetchProductos(); // Refrescar lista
      } else {
        toast.error(data.message || "Error actualizando el producto");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      toast.error("Error actualizando el producto");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevoProducto({
        ...nuevoProducto,
        image: file, // Guardamos el archivo de imagen
      });
    }
  };
  // Llamar a la API para obtener productos cuando se monta el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading)
    return (
      <>
        <Header texto={"Inventario"} buscador={true} />
        <h1>Cargando...</h1>
      </>
    );
  return (
    <>
      <Header texto={"Inventario"} buscador={true} />

      <div className="container" style={{ paddingTop: "100px" }}>
        <div className="row">
          {productos.map((producto) => (
            <div className="col-md-4" key={producto._id}>
              <ProductsCard
                producto={producto}
                borrarProducto={() => borrarProducto(producto._id)}
                actualizarProducto={() => {
                  setNuevoProducto({
                    ...producto,
                    image: null, // Por defecto no se actualiza la imagen
                  });
                  setModoEdicion(true);
                  setShowModal(true);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: modoEdicion ? "#ffc107" : "#0d6efd",
            color: "white",
          }}
        >
          <Modal.Title>
            {modoEdicion ? "Editar Producto" : "Agregar Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Campo para seleccionar imagen */}
            <Form.Group className="mb-2">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            {/* Otros campos del formulario */}
            {[
              { label: "Nombre", key: "name" },
              { label: "Descripción", key: "description" },
              { label: "Categoría", key: "category" },
              { label: "Precio", key: "price", type: "number" },
              { label: "Stock", key: "stock", type: "number" },
            ].map((campo) => (
              <Form.Group className="mb-2" key={campo.key}>
                <Form.Label>{campo.label}</Form.Label>
                <Form.Control
                  type={campo.type || "text"}
                  value={nuevoProducto[campo.key] || ""}
                  onChange={(e) =>
                    setNuevoProducto({
                      ...nuevoProducto,
                      [campo.key]:
                        campo.type === "number"
                          ? parseFloat(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={modoEdicion ? guardarCambiosProducto : crearProducto}>
            {modoEdicion ? "Actualizar" : "Guardar"}
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
            style={{ bottom: "240px" }}
            onClick={() => setShowModal(true)} // Ajusta la posición hacia arriba
          />
        </>
      )}
    </>
  );
};

export default Inventory;
