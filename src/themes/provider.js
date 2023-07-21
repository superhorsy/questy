"use client";

import { MyTheme } from "@/themes/theme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export const ThemeContext = React.createContext();

export function AppThemeProvider({ children }) {

    const curTheme = useSelector((state) => state.currentAppThemeReducer.theme);
    const [theme, setTheme] = useState("standart");
    const selectedTheme = useMemo(() => createTheme(MyTheme[theme]), [theme]);

    useEffect(() => {
        setTheme(curTheme);
    }, [curTheme]);

    return <ThemeProvider theme={selectedTheme}>
        <ThemeContext.Provider value={MyTheme}>
            {children}
        </ThemeContext.Provider>
    </ThemeProvider>
}