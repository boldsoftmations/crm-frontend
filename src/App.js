import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Header } from "./Components/Header/Header";
import { RouteScreen } from "./Routes/RouteScreen";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename="/crm-frontend">
      <Header />
      <main id="app">
        <RouteScreen />
      </main>
    </BrowserRouter>
  );
}

export default App;
