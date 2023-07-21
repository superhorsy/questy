"use client"

import React, { useState, useEffect } from "react";

import { createTheme } from "@mui/material/styles";
import Image from 'next/image';
import { QuestExecution } from "@components/QuestExecution/newStepper/newStepper";
import { QuestionsSlider } from "../../QuestionsSlider/questionsSlider";

import Christmas from "@images/themesIcons/newYear/christmas.png";
import ChristmasCatBall from "@images/themesIcons/newYear/christmas-catball-256.png";
import Cat from "@images/themesIcons/newYear/cat-256.png";
import Gift from "@images/themesIcons/newYear/gift-128.png";

import styles from "./christmasPage.module.scss";

const linksData = [
  {
    linkUrl: "https://www.flaticon.com/free-stickers/christmas",
    linkText: "Christmas stickers created by Tatsiana Harbunova - Flaticon",
    linkTitle: "christmas stickers",
  },
];

const christmasTheme = createTheme({
  palette: {
    primary: {
      light: "#60ad5e",
      main: "#2e7d32",
      dark: "#005005",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#ff6434",
      main: "#dd2c00",
      dark: "#a30000",
      contrastText: "#ffffff",
    },
  },
});

export const ChristmasPage = ({ example }) => {
  const [isExample, setIsExample] = useState();

  useEffect(() => {
    if (example) {
      setIsExample(true);
    } else {
      setIsExample(false);
    }
  }, [example]);

  return (
    <>
      <div className={styles.decoratedPage}>
        <Image
          className={styles.decoratedPage__stikerTopLeft}
          src={ChristmasCatBall}
          alt="snowball"
        />
        <Image
          className={styles.decoratedPage__stikerTopRight}
          src={Gift}
          alt="gift"
        />
        <Image
          className={styles.decoratedPage__stikerBottomLeft}
          src={Cat}
          alt="cat"
        />
        <Image
          className={styles.decoratedPage__stikerBottomRight}
          src={Christmas}
          alt="tree"
        />
        {isExample ? <QuestionsSlider /> : <QuestExecution />}
      </div>
    </>
  );
};
