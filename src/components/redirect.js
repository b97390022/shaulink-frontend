import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RedirectComponent = () => {
    const { hash } = useParams();
    const [redirectStatus, setredirectStatus] = useState(true);
    const [redirectPath, setRedirectPath] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/v1/${hash}`);
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
            {redirectStatus ? <div>is loading</div> : <div>not found</div>}
        </div>
    )
};

export default RedirectComponent;