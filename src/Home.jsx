import React from "react";
import icon from "./assets/favicon.png";
import TextField from "./assets/Components/TextField";
import "bootstrap-icons/font/bootstrap-icons.css";

const Home = () => {
  return (
    <>
      <header
        style={{
          display: "flex",
          minWidth: "100%",
          justifyItems: "center",
          alignItems: "center",
          backgroundColor: "#B7A18B",
          position: "absolute",
          top: "0",
          left: "0",
        }}
      >
        <img
          src={icon}
          width="100"
          height="100"
          style={{ marginRight: "20px" }}
        />
        <h1>Consola administrativa</h1>
        <div style={{ position: "absolute", right: "0", marginRight: "25px" }}>
          <TextField type="search" hint="Buscar"></TextField>
        </div>
      </header>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "3em",
        }}
      >
        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          style={{
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
            width: "200px",
            textAlign: "center",
          }}
        >
          {/* Icono de estadísticas */}
          <i
            className="bi bi-graph-up-arrow"
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            Estadísticas
          </h3>
        </div>

        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          style={{
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
            width: "200px",
            textAlign: "center",
          }}
        >
          {/* Icono de usuarios */}
          <i
            className="bi bi-people"
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            Usuarios
          </h3>
        </div>

        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          style={{
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
            width: "200px",
            textAlign: "center",
          }}
        >
          {/* Icono de paquetes */}
          <i
            className="bi bi-box-seam"
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            Ordenes
          </h3>
        </div>

        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          style={{
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
            width: "200px",
            textAlign: "center",
          }}
        >
          {/* Icono de cheque */}
          <i
            className="bi bi-check2-square"
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            Inventario
          </h3>
        </div>

        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          style={{
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
            width: "200px",
            textAlign: "center",
          }}
        >
          {/* Icono de descuentos */}
          <i
            className="bi bi-percent"
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            Descuentos
          </h3>
        </div>
        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          style={{
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
            width: "200px",
            textAlign: "center",
          }}
        >
          {/* Icono de bandera */}
          <i
            className="bi bi-flag"
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            Reportes
          </h3>
        </div>

        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          style={{
            backgroundColor: "#f8f9fa",
            cursor: "pointer",
            width: "200px",
            textAlign: "center",
          }}
        >
          {/* Icono de tuerca */}
          <i
            className="bi bi-gear"
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            Configuración
          </h3>
        </div>
      </div>
    </>
  );
};

export default Home;
