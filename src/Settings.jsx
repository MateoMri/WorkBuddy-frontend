import React, { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "./assets/Components/Fab";

const Settings = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/Home");
  };
  return (
    <>
      <Header texto={"Configuración"} buscador={true} />
      <Fab
        bottom={"20px"}
        right={"20px"}
        icon={"arrow-90deg-left"}
        titulo={"Regresar"}
        onClick={goBack}
      ></Fab>
    </>
  );
};
export default Settings;
