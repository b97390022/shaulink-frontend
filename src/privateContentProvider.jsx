import React from "react";
import { getCookie } from './cookies.js';
import PrivateContentForm from "./components/privateContentForm.jsx";

const PrivateContent = ({ children, hash, password  }) => {
    
    const [isCorrect, setIsCorrect] = React.useState(false);

    return (
        isCorrect
        ? children
        : <PrivateContentForm
            hash={hash}
            password={password}
            setIsCorrect={setIsCorrect}
        />
    )
}

export { PrivateContent };