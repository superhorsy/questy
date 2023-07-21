"use client"; 

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MainFooter } from "@components/Footer/Main";
import { Links } from "@components/Footer/Links";
import { linksData } from "@/constants/footerLinksData.js";
import { updateCurrentAppTheme } from "@reducers/currentAppThemeSlice";
import { usePathname } from "next/navigation";

export const Footer = () => {
  let path = usePathname();
  const dispatch = useDispatch();

  const [curAppTheme, setCurAppTheme] = useState(
    useSelector((state) => state.currentAppThemeReducer.theme)
  );

  const examplePageTheme = useSelector(
    (state) => state.currentQuestReducer.currentQuest.theme
  );

  const exequtionPageTheme = useSelector(
    (state) => state.questExecutionReducer.questTheme
  );

  useEffect(() => {
    let theme = 'standart'
    if (path.startsWith("/questExample")) {
      theme = examplePageTheme 
    } else if (path.startsWith("/questExecution")) {
      theme = exequtionPageTheme
    }
    setCurAppTheme(theme);
  }, [path, exequtionPageTheme, examplePageTheme]);

  useEffect(() => {
    dispatch(updateCurrentAppTheme(curAppTheme));
  }, [curAppTheme])


  return (
    <>
      {curAppTheme !== "standart" && <Links linksData={linksData[curAppTheme]} />}
      {curAppTheme === "standart" && <MainFooter />}
    </>
  );
};
