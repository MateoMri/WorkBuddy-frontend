import "bootstrap-icons/font/bootstrap-icons.css";
const GrayButton = ({icon, titulo, onClick}) =>{
    return(
        <div
          className="botonsote d-flex flex-column align-items-center justify-content-center p-4 border rounded shadow-sm"
          onClick={onClick}
        >
          {/* Icono de usuarios */}
          <i
            className={"bi bi-" + icon}
            style={{ fontSize: "3rem", color: "black", marginBottom: "10px" }}
          ></i>

          {/* Título */}
          <h3 className="mb-0" style={{ color: "#333" }}>
            {titulo}
          </h3>
        </div>
    )
}
export default GrayButton