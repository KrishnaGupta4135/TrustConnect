import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        {/* <Navbar /> */}

        <div className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Create />} />
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </div>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
