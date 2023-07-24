"use client";

import {MyTheme} from "@/themes/theme";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {usePathname} from "next/navigation";
import {updateCurrentAppTheme} from "@reducers/currentAppThemeSlice";

export const ThemeContext = React.createContext();

export function AppThemeProvider({children}) {
    let path = usePathname();
    const dispatch = useDispatch();

    const [curTheme, setCurTheme] = useState(
        useSelector((state) => state.currentAppThemeReducer.theme)
    );

    // const { theme } = useSelector((state) => state.currentQuestReducer.currentQuest);

    const examplePageTheme = useSelector(
        (state) => state.currentQuestReducer.currentQuest.theme
    );

    const exequtionPageTheme = useSelector(
        (state) => state.questExecutionReducer.questTheme
    );

    useEffect(() => {
        let theme = 'standart'
        if (path.includes("questExample")) {
            theme = examplePageTheme
            console.log("Theme example:", examplePageTheme)
        } else if (path.includes("questExecution")) {
            theme = exequtionPageTheme ?? "standart"
            console.log("Theme execution:", exequtionPageTheme)
        }
        setCurTheme(theme);
        console.log("Path:", path)
        console.log("Theme in provider:", theme)
    }, [path, exequtionPageTheme, examplePageTheme]);

    useEffect(() => {
        dispatch(updateCurrentAppTheme(curTheme));
    }, [curTheme])

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
