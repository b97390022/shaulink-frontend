import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './App.css';
import RedirectComponent from "./components/redirect";
import Home from "./home"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const ExampleToast = ({ children }) => {
  const [show, toggleShow] = useState(true);

  return (
    <>
      {!show && <Button onClick={() => toggleShow(true)}>Show Toast</Button>}
      <Toast show={show} onClose={() => toggleShow(false)}>
        <Toast.Header>
          <strong className="mr-auto">React-Bootstrap</strong>
        </Toast.Header>
        <Toast.Body>{children}</Toast.Body>
      </Toast>
    </>
  );
};

const App = () => {
  return (
    <Container className="p-3">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <div className="App">
          <div>
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
          </div>
        </div>
        <h1 className="header">Welcome To React-Bootstrap</h1>
        <ExampleToast>
          We now have Toasts
          <span role="img" aria-label="tada">
            🎉
          </span>
        </ExampleToast>
      </Container>
    </Container>
    
  );
}

export default App;
