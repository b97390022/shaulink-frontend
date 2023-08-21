import React from 'react';
import Container from 'react-bootstrap/Container';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageComponent from './components/image';
import VideoComponent from './components/video';
import RedirectPage from './redirectPage';
import NotFoundPage from './notFoundPage';
import { PrivateContent } from './privateContentProvider';
import NavbarComponent from "./components/Navbar";

const HashPage = () => {
    const { hash } = useParams();
    const [ redirectStatus, setredirectStatus ] = React.useState(true);
    const [ redirectType, setRedirectType ] = React.useState(null);
    const [ redirectContent, setRedirectContent ] = React.useState(null);
    const [ redirectPassword, setRedirectPassword ] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    process.env.NODE_ENV === "production" ? `/api/v1/${hash}` : `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/v1/${hash}`
                );
                if (response.status === 200) {
                    const { 
                        type,
                        data,
                        password 
                    } = response.data;
                    setRedirectType(type);
                    setRedirectContent(data)
                    setredirectStatus(true);
                    setRedirectPassword(password);
                }

            } catch (error) {
                setRedirectType(null);
                setRedirectContent(null);
                setRedirectPassword('');
                setredirectStatus(false);
                // console.error('Error fetching data:', error);
            };
        };
        fetchData();
    }, [hash]);

    React.useEffect(() => {
        // 更新 Open Graph 資訊
        document.querySelector('meta[property="og:title"]').setAttribute('content', "title");
        document.querySelector('meta[property="og:image"]').setAttribute('content', "image");
        document.querySelector('meta[property="og:description"]').setAttribute('content', "description");
        document.querySelector('meta[property="og:url"]').setAttribute('content', "url");
      }, []);

    if (redirectType === 1) {
        window.location.replace(redirectContent[0]["object_name"]);
        
    } else if (redirectType === 2) {
        return (
            <>
                <header>
                    < NavbarComponent />
                </header>
                <Container
                    className="d-flex flex-column align-items-center p-5 mb-4"
                    style={{'minHeight': 'calc(100vh - 56px)'}}
                >
                    <PrivateContent
                        hash={hash}
                        password={redirectPassword}
                    >
                        <ImageComponent content={redirectContent}/>
                    </PrivateContent>
                </Container>
            </>
        );
    } else if (redirectType === 3) {
        return (
            <>
                <Container
                    className="d-flex flex-column align-items-center p-5 mb-4"
                    style={{'minHeight': 'calc(100vh - 56px)'}}
                >
                    <header>
                        < NavbarComponent />
                    </header>
                    <PrivateContent hash={hash} password={redirectPassword} >
                        <VideoComponent />
                    </PrivateContent>
                </Container>
            </>
        );
    };

    return (
        <div>
            {
                redirectStatus ? <RedirectPage/> :
                <>
                    <header>
                        < NavbarComponent />
                    </header>
                    <NotFoundPage />
                </>
            }
        </div>
    );
};

export default HashPage;