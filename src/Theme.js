import React, { useEffect, createContext, useState } from "react";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const ThemeContext = createContext();

const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
}

const getTheme = () => {
    const theme = localStorage.getItem("theme");
    if(theme) return theme;

    const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEME.DARK
        : THEME.LIGHT
    console.log(defaultTheme)
    localStorage.setItem("theme", defaultTheme);
    return defaultTheme;
};

const ThemeProvider = ({ children }) => {
    const IS_SERVER = typeof window === 'undefined'
    const [theme, setTheme] = useState(getTheme);
    const [isDarkMode, setDarkMode] = useState(theme === THEME.DARK ? true : false);

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        toggleTheme()
    };
    
    const DarkModeSwitchItem = () => {
        return (
            <div className="d-flex align-items-center">
                <DarkModeSwitch
                    style={{ }}
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    size={24}
                />
            </div>
            
        )
    }

    function toggleTheme() {
        if (IS_SERVER) return
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    useEffect(() => {
        const refreshTheme = () => {
            localStorage.setItem("theme", theme);
            document.documentElement.setAttribute('data-bs-theme', theme)
        };

        refreshTheme();
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
                DarkModeSwitchItem,
            }}
        >
        {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };