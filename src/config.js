import React from "react";

const ConfigContext = React.createContext(null);

const ConfigProvider = ({ children }) => {
    
    const config = 
        process.env.NODE_ENV === "production"
        ? {
            "backendUrl": "/api/v1",
        }
        : {
            "frontendUrl": `http://localhost:${process.env.REACT_APP_FRONTEND_PORT}`,
            "backendUrl": `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/v1`,
        }
    return (
        <ConfigContext.Provider
            value={{config}}
        >
        {children}
        </ConfigContext.Provider>
    );
};

export { ConfigContext, ConfigProvider };