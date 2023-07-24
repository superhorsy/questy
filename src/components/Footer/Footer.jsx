"use client"

import React, {useEffect, useState} from "react";
import {MainFooter} from "@components/Footer/Main";
import {Links} from "@components/Footer/Links";
import {linksData} from "@/constants/footerLinksData.js";
import {useSelector} from "react-redux";

export const Footer = () => {
    const [theme] = useState(
        useSelector((state) => state.currentAppThemeReducer.theme)
    );

    useEffect(() => {

    }, [theme])

    console.log(theme)
    return (<>
        {theme !== "standart" && <Links linksData={linksData[theme]}/>}
        {theme === "standart" && <MainFooter/>}
    </>);
};
