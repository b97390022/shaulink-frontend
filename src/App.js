import './App.css';
import RedirectComponent from "./components/redirect";
import Home from "./home"
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route
            path="/:hash"
            element={ <RedirectComponent /> }
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
