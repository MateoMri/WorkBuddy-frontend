import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "../assets/Components/Fab";
import "./Users.css"; // Asegúrate de tener este CSS (te lo dejo abajo)

const Users = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/Home");
  };
  const [botones, setBotones] = useState(false);

  const handleClick = () => {
    setBotones(!botones);
  };

  return (
    <>
      <Header texto={"Usuarios"} buscador={true} />

      <div className="tabla-usuarios">
        {/* Encabezado */}
        <div className="fila encabezado">
          <div>Usuario</div>
          <div>Correo electrónico</div>
          <div>Teléfono</div>
          <div>Acciones</div>
        </div>

        {/* Fila 1 */}
        <div className="fila">
          <input type="text" value="usuario1" className="input" disabled />
          <input
            type="email"
            value="correo1@ejemplo.com"
            className="input"
            disabled
          />
          <input type="text" value="12345678" className="input" disabled />
        </div>

        {/* Fila 2 */}
        <div className="fila">
          <input type="text" value="usuario2" className="input" disabled />
          <input
            type="email"
            value="correo2@ejemplo.com"
            className="input"
            disabled
          />
          <input type="text" value="87654321" className="input" disabled />
        </div>
      </div>

      {/* Primer Fab (el de tres puntos) */}
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
          <Fab
            bottom={"240px"}
            right={"20px"}
            titulo={"Agregar"}
            icon="plus"
          />
        </div>
      )}
    </>
  );
};

export default Users;