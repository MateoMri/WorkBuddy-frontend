import React, { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./assets/Components/Header";
import { useNavigate } from "react-router-dom";
import Fab from "./assets/Components/fab";

const Reports = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/Home")
  }
  return(
<>
<Header texto={"Reportes"} buscador={true} />
<Fab icon={"arrow-90deg-left"} titulo={"Regresar"} onClick={goBack}></Fab>
</>
);
};
export default Reports;
