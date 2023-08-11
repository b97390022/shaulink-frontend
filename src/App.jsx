import './App.css';
import HashPage from "./hashPage";
import Home from "./home"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route
            path="/image"
            element={ <Home /> }
          />
          <Route
            path="/video"
            element={ <Home /> }
          />
          <Route
            path="/:hash"
            element={ <HashPage /> }
          />
          <Route
            path="/"
            element={ <Home /> }
          />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
