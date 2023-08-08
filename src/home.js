import FormComponent from "./components/form";
import React, { useContext } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import { ThemeContext } from "./Theme.js";


const Home = () => {
  const { DarkModeSwitchItem } = useContext(ThemeContext);
  const { t } = useTranslation();
  console.log(i18n.language)
  return (
    <Container className="p-3 min-vh-100 position-relative">
      <Navbar expand="lg" className="ps-4 pe-4 min-vw-100 position-fixed top-0 start-0">
          <Navbar.Brand href="/">Shaulink</Navbar.Brand>
            
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">{t("Shorten URL")}</Nav.Link>
                <Nav.Link href="/image">{t("Shorten Image")}</Nav.Link>
                <Nav.Link href="/viedo">{t("Shorten Video")}</Nav.Link>
              </Nav>
              <Nav>
                <DarkModeSwitchItem />
                <NavDropdown align="end" title={t("Language")} id="nav-dropdown">
                  <NavDropdown.Item href="#" onClick={()=>{i18n.changeLanguage('en')}}>{t("English")}</NavDropdown.Item>
                  <NavDropdown.Item href="#" onClick={()=>{i18n.changeLanguage('zh')}}>{t("Traditional Chinese")}</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
      </Navbar>
      <Container
        className="w-75 d-flex flex-column justify-content-center align-items-center p-5 mb-4 rounded-3"
        style={{'maxWidth': '800px', 'height': 'calc(100vh - 256px)', 'marginTop': '56px'}}
      >
        <img src="logo.png" className="img-fluid" alt="..." style={{'minWidth':'300px'}}/>
        <div className='fs-5 p-3 text-nowrap'>{t("The BEST URL Shortener")}</div>
        <FormComponent />
        <Nav
          activeKey="/home"
        >
          <Nav.Item>
            <Nav.Link className="text-decoration-underline fs-6 text-info text-nowrap" href={i18n.language === "en" ? "/privacy-policy.html" : "privacy-policy-TW.html"} target='_blank'>{t("Privacy Policy")}</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
      
      <footer 
        className="text-light min-vw-100 position-fixed bottom-0 start-0"
        style={{
          'minHeight': '100px',
          'background': '#4BBEE2'
        }}
      >
        <Container className="text-center">
          <div className="waves">
            <div className="wave" id="wave1"></div>
            <div className="wave" id="wave2"></div>
            <div className="wave" id="wave3"></div>
            <div className="wave" id="wave4"></div>
          </div>
        </Container>
      </footer>
    </Container>
  );
};

export default Home;