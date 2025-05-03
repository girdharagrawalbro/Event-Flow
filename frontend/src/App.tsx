import React from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

// Components
import Navbar from "./components/Navbar";
import Notifications from "./components/Notification";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
      <Notifications />

    </>
  );
};

export default App;
