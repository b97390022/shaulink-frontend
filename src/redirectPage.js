import Container from 'react-bootstrap/Container';
import { useTranslation } from "react-i18next";

const RedirectPage = () => {
    const { t } = useTranslation();

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center p-3 min-vh-100 position-relative">
            <img src="logo.png" className="img-fluid" alt="..." />
            <div className='fs-5 p-3'>{t("The Simplest and Fastest Short URL service.")}</div>
            <div className='lds-dual-ring'></div>
            <div className='fs-5 p-3'>{t("Heading to the destination...")}</div>
        </Container>
    );

}

export default RedirectPage;