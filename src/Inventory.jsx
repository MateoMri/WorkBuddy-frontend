import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "./assets/Components/Fab";

const Inventory = () => {
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
      <Header texto={"Inventario"} buscador={true} />
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
export default Inventory;
