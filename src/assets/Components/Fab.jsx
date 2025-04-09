import "bootstrap-icons/font/bootstrap-icons.css";

const Fab = ({ icon, titulo, onClick,  bottom, right}) => {
  return (
    <div
      className="botonsote d-flex flex-column align-items-center justify-content-center p-2 border shadow-sm" // Eliminado "round" porque lo controlamos en el estilo
      style={{
        position: "absolute",
        bottom: bottom,
        right: right,
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          textAlign: "center"
        }}
      >
        {titulo}
        </h3>
    </div>
  );
};

export default Fab;
