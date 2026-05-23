import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Eventos from "./pages/Eventos";
import EventoDetalhe from "./pages/EventoDetalhe";
import Galeria from "./pages/Galeria";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:slug" element={<EventoDetalhe />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}