"use client"

import React, { useState, useEffect } from "react";

import { QuestExecution } from "@components/QuestExecution/newStepper/newStepper";
import { QuestionsSlider } from "@components/QuestionsSlider/questionsSlider";

import Castle from "@images/themesIcons/halloween/castle-house-512.png";
import Pumpkin from "@images/themesIcons/halloween/pumpkin-256.png";
import Vampire from "@images/themesIcons/halloween/vampire-256.png";
import Image from 'next/image';
import styles from "./halloween.module.scss";

export const HalloweenPage = ({ example }) => {
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
          src={Vampire}
          alt="Vampire"
        />
        <Image
          className={styles.decoratedPage__stikerBottomLeft}
          src={Pumpkin}
          alt="Pumpkin"
        />
        <Image
          className={styles.decoratedPage__stikerBottomRight}
          src={Castle}
          alt="Happy Halloween"
        />
        {isExample ? <QuestionsSlider /> : <QuestExecution />}
      </div>
    </>
  );
};
