import icon from "../../assets/favicon.png";
import TextField from "./TextField";
import "./CSS/style.css";
const Header = ({ texto, buscador }) => {
  return (
    <header className="header">
      <img
        src={icon}
        width="100"
        height="100"
        style={{ marginRight: "20px" }}
      />
      <h1>{texto}</h1>
      <div style={{ position: "absolute", right: "0", marginRight: "25px" }}>
        {/* si buscador es true, se renderiza el buscador. Caso contrario se queda vacio */}
        {buscador && <TextField type="search" hint="Buscar" />}
      </div>
    </header>
  );
};

export default Header;
