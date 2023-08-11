import React from "react";
import { getCookie } from './cookies.js';
import PrivateContentForm from "./components/privateContentForm.jsx";

const PrivateContent = ({ children, hash, password  }) => {
    
    const getCorrectStatus = (hash) => {
        const value = getCookie(hash);
        if (value !== undefined) {
            return true;
        }
        return false;
    }
    
    const [isCorrect, setIsCorrect] = React.useState(getCorrectStatus(hash));

    return (isCorrect ? children : <PrivateContentForm hash={hash} password={password} setIsCorrect={setIsCorrect} />)
}

export { PrivateContent };