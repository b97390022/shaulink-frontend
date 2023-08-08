import Container from 'react-bootstrap/Container';
import { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "./Theme.js";

const NotFoundPage = () => {
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();

    return (
        <Container id='notFoundContainer' className="d-flex flex-column justify-content-center align-items-center p-3 min-vh-100 position-relative">
            <h1><b>404</b></h1>
            <h1> <span class="ascii">(╯°□°）╯︵ ┻━┻</span></h1>
            <nav id="backHomeLink">
                <NavLink
                    to="/"
                    className={`text-${theme === "dark" ? "light" : "dark"}`}
                >
                    {t("Back to Home page, is better.")}
                </NavLink>
            </nav>
        </Container>
    );

}

export default NotFoundPage;