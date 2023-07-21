"use client"

import React, { useState, useEffect } from "react";

import { QuestExecution } from "@components/QuestExecution/newStepper/newStepper";
import { QuestionsSlider } from "@components/QuestionsSlider/questionsSlider";

import Avocado from "@images/themesIcons/valentain/avocado-256.png";
import LoveBalloons from "@images/themesIcons/valentain/balloon-512.png";
import February14 from "@images/themesIcons/valentain/february-14-256.png";
import Image from 'next/image';
import styles from "./valentain.module.scss";

export const ValentainPage = ({ example }) => {
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
          className={styles.decoratedPage__stikerTopLeftRotaded}
          src={February14}
          alt="February 14"
        />
        {/* <Image
        className={styles.decoratedPage__stikerTopRight}
        src={Confetti}
        alt="confetti"
      /> */}
        <Image
          className={styles.decoratedPage__stikerBottomLeft}
          src={Avocado}
          alt="avocado"
        />
        <Image
          className={styles.decoratedPage__stikerBottomRight}
          src={LoveBalloons}
          alt="baloons"
        />
        {isExample ? <QuestionsSlider /> : <QuestExecution />}
      </div>
    </>
  );
};
