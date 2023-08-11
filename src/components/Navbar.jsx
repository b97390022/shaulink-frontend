import React from "react";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Theme";

const NavbarComponent = () => {
    const { DarkModeSwitchItem } = React.useContext(ThemeContext);
    const { t } = useTranslation();

    return (
        <Navbar expand="lg" className="ps-4 pe-4 min-vw-100 position-fixed top-0 start-0 justify-content-start"> 
            <Navbar.Toggle aria-controls="navbar-nav" className="me-2" />
            <Navbar.Brand href="/">Shaulink</Navbar.Brand>
            <Navbar.Collapse className="justify-content-between" id="navbar-nav">
                <Nav>
                    <Nav.Link href="/">{t("Shorten URL")}</Nav.Link>
                    <Nav.Link href="/image">{t("Shorten Image")}</Nav.Link>
                    <Nav.Link href="/video">{t("Shorten Video")}</Nav.Link>
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
    )
}

export default NavbarComponent;