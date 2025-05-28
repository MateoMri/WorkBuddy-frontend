import React from "react";
import { Card, Button } from "react-bootstrap";

const ProductosCard = ({ producto, borrarProducto, actualizarProducto }) => {
  return (
    <Card className="mb-3 shadow-sm">
      {producto.imagery?.url ? (
        <Card.Img
          variant="top"
          src={producto.imagery.url}
          alt={producto.name || "Producto"}
          style={{ height: "200px", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            height: "200px",
            backgroundColor: "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}
        >
          Sin imagen
        </div>
      )}

      <Card.Body>
        <Card.Title>{producto.name || "Producto sin nombre"}</Card.Title>
        <Card.Text>
          <strong>Descripción:</strong> {producto.description || "N/A"}
          <br />
          <strong>Categoría:</strong> {producto.category || "N/A"}
          <br />
          <strong>Precio:</strong> ${producto.price?.toFixed(2) || "0.00"}
          <br />
          <strong>Stock:</strong> {producto.stock ?? "N/A"}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Button variant="danger" onClick={borrarProducto}>
            <i className="bi bi-trash3-fill me-1"></i> Eliminar
          </Button>
          <Button variant="warning" onClick={actualizarProducto}>
            <i className="bi bi-pencil-fill me-1"></i> Editar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductosCard;
