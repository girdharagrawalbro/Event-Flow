import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <Routes>
      <Navbar />
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Dashboard />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default App;
