import React, { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";
import Header from "../assets/Components/Header";
import GrayButton from "../assets/Components/GrayButton";
import Fab from "../assets/Components/Fab";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const Home = () => {
  const navigate = useNavigate();

  //funcion para redirigir a usuarios
  const goToUsers = () => {
    navigate("/Users");
  };

  const goToLogIn = () => {
    navigate("/");
  };
  const goToInventory = () => {
    navigate("/Inventory");
  };
  const goToOrders = () => {
    navigate("/Orders");
  };
  const goToOffers = () => {
    navigate("/Offers");
  };
  const goToStats = () => {
    navigate("/Stats");
  };
  const goToReports = () => {
    navigate("/Reports");
  };
  const goToSettings = () => {
    navigate("/Settings");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada correctamente");

      // Forzar un refresco completo de la página para limpiar cualquier estado
      // incluidas las cookies persistentes
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");

      // Incluso en caso de error, intentar limpiar el estado
      localStorage.removeItem("authToken");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };
  useEffect(() => {
    // Cambiamos el color de fondo cuando el componente se monte
    document.body.style.backgroundColor = "#ffffff"; // Color blanco
    return () => {
      //esto es opcional, son cosas que se ejecutan cuando el componente de desmonta
    };
  }, []);

  return (
    <>
      <Header texto={"Consola administrativa"} buscador={false}></Header>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "start",
          gap: "3.3em",
        }}
      >
        <GrayButton
          icon={"graph-up-arrow"}
          titulo={"Estadísticas"}
          onClick={goToStats}
        ></GrayButton>
        <GrayButton
          icon={"people"}
          titulo={"Usuarios"}
          onClick={goToUsers}
        ></GrayButton>
        <GrayButton
          icon={"box-seam"}
          titulo={"Ordenes"}
          onClick={goToOrders}
        ></GrayButton>
        <GrayButton
          icon={"check2-square"}
          titulo={"Inventario"}
          onClick={goToInventory}
        ></GrayButton>
        <GrayButton
          icon={"percent"}
          titulo={"Descuentos"}
          onClick={goToOffers}
        ></GrayButton>
        <GrayButton
          icon={"flag"}
          titulo={"Reportes"}
          onClick={goToReports}
        ></GrayButton>
        <GrayButton
          icon={"gear"}
          titulo={"Configuración"}
          onClick={goToSettings}
        ></GrayButton>
      </div>

      <Fab
        bottom={"20px"}
        right={"20px"}
        icon={"box-arrow-right"}
        titulo={"Cerrar sesión"}
        onClick={goToLogIn}
      ></Fab>
    </>
  );
};

export default Home;
