import "bootstrap-icons/font/bootstrap-icons.css";

const Fab = ({ icon, titulo, onClick, style }) => {
  return (
    <div
      className="botonsote d-flex flex-column align-items-center justify-content-center p-2 border shadow-sm"
      style={{
        position: "fixed", // Fijado en la pantalla
        bottom: "20px", // Espacio desde el borde inferior (se puede sobrescribir desde el estilo)
        right: "20px", // Espacio desde el borde derecho
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Para asegurarse que siempre esté por encima de otros elementos
        ...style, // Aquí aplicamos el estilo pasado como prop
      }}
      onClick={onClick}
    >
      {/* Icono de cerrar sesión */}
      <i
        className={"bi bi-" + icon}
        style={{ fontSize: "1.4rem", color: "black", marginBottom: "5px" }}
      ></i>

      {/* Título */}
      <h3
        style={{
          color: "#333",
          fontSize: "0.7rem",
          marginBottom: 0,
          fontWeight: "500",
          letterSpacing: "0.5px",
          textAlign: "center",
        }}
      >
        {titulo}
      </h3>
    </div>
  );
};

export default Fab;
