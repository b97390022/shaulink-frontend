import React from "react";
import URLFormComponent from "./components/URLForm";
import ImageFormComponent from "./components/imageForm";
import VideoFormComponent from "./components/videoForm";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import NavbarComponent from "./components/Navbar";
import {useLocation} from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const getFormComponent = () => {
    if (location.pathname === '/image') {
      return <ImageFormComponent />;
    } else if (location.pathname === '/video') {
      return <VideoFormComponent />;
    } else {
      return <URLFormComponent />;
    }
  };

  return (
    <>
      <Container className="p-3 min-vh-100 position-relative">
        <NavbarComponent />
        <Container
          className="w-100 d-flex flex-column justify-content-center align-items-center p-5 mb-4 rounded-3"
          style={{'maxWidth': '800px', 'height': 'calc(100vh - 256px)', 'marginTop': '56px'}}
        >
          <img src="logo.png" className="img-fluid" alt="..." style={{'minWidth':'300px'}}/>
          <div className='fs-5 p-3 text-nowrap'>{t("The BEST URL Shortener")}</div>

          {getFormComponent()}
          
          <Nav
            activeKey="/home"
          >
            <Nav.Item>
              <Nav.Link className="text-decoration-underline fs-6 text-info text-nowrap" href={i18n.language === "en" ? "/privacy-policy.html" : "privacy-policy-TW.html"} target='_blank'>{t("Privacy Policy")}</Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        </Container>
        <footer 
          className="text-light min-vw-100 sticky-bottom"
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
      
    </>
  );
};

export default Home;