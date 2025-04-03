import React from "react";
import icon from "./assets/favicon.png";
import TextField from "./assets/Components/TextField";
const Home = () => {
  return (
    <>
      <header
        style={{
          display: "flex",
          minWidth: "100%",
          justifyItems: "center",
          alignItems: "center",
          backgroundColor: "#B7A18B",
          position: "absolute",
          top: "0",
          left: "0",
        }}
      >
        <img
          src={icon}
          width="100"
          height="100"
          style={{ marginRight: "20px" }}
        />
        <h1>Consola administrativa</h1>
        <div style={{ position: "absolute", right: "0", marginRight: "25px" }}>
          <TextField type="search" hint="Buscar"></TextField>
        </div>
      </header>
    </>
  );
};

export default Home;
