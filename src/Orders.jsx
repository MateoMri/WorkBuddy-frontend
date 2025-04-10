import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "./assets/Components/Fab";
import Button from "./assets/Components/Button";
import TextField from "./assets/Components/TextField";

const Orders = () => {
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
      <Header texto={"Ordenes"} buscador={true} />
      <Fab
        bottom={"20px"}
        right={"20px"}
        icon={"three-dots-vertical"}
        onClick={handleClick}
      />

<TextField hint={"ID del producto"} type={"text"} />
<br />
<br />
<TextField hint={"Tipo de descuento"} type={"text"} />
<br />
<br />
<TextField hint={"Fecha de inicio"} type={"text"} />
<br />
<br />
<TextField hint={"Fecha de finalización"} type={"text"} />
<br />
<br />
<br />
<br />
<div className="d-flex gap-5">
  <Button texto={"SUBIR"}/>
  <Button texto={"LIMPIAR"}/>
</div>

      {botones && (
        <div>
          <Fab
            bottom={"130px"}
            right={"20px"}
            titulo={"Regresar"}
            icon="arrow-90deg-left"
            onClick={goBack}
          ></Fab>

          <Fab
            bottom={"240px"}
            right={"20px"}
            titulo={"Agregar"}
            icon="plus"
          ></Fab>
        </div>
      )}
    </>
  );
};
export default Orders;
