import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RedirectPage from '../redirectPage';
import NotFoundPage from '../notFoundPage';

const RedirectComponent = () => {
    const { hash } = useParams();
    const [ redirectStatus, setredirectStatus ] = useState(true);
    const [ redirectPath, setRedirectPath ] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    process.env.NODE_ENV === "production" ? `/api/v1/${hash}` : `http://localhost:8000/v1/${hash}`
                );
                if (response.status === 200) {
                    setRedirectPath(response.data["long_url"]);
                    setredirectStatus(true);
                }
            } catch (error) {
                setRedirectPath("");
                setredirectStatus(false);
                // console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [hash]);

    if (redirectPath !== "") {
        window.location.replace(redirectPath);
    }
    return (
        <div>
            {redirectStatus ? <RedirectPage /> : <NotFoundPage />}
        </div>
    )
};

export default RedirectComponent;