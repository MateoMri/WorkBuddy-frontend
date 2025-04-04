import "bootstrap-icons/font/bootstrap-icons.css";
const Fab = ({icon, titulo, onClick}) =>{
    return(
        <div
        className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border round shadow-sm"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "150px", // Ajusta el tamaño del botón
        }}
        onClick={onClick}
      >
        {/* Icono de cerrar sesión */}
        <i
          className={"bi bi-" + icon}
          style={{ fontSize: "2rem", color: "black", marginBottom: "10px" }}
        ></i>

        {/* Título */}
        <h3 className="mb-0" style={{ color: "#333", fontSize: "0.9rem" }}>
          {titulo}
        </h3>
      </div>
    )
}
export default Fab;