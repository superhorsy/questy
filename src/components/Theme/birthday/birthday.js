"use client"

import React, { useState, useEffect } from "react";

import { QuestExecution } from "@components/QuestExecution/newStepper/newStepper";
import { QuestionsSlider } from "@components/QuestionsSlider/questionsSlider";
import Image from 'next/image';
import HappyBithday from "@images/themesIcons/bithday/happy-birthday-256.png";
import Balloons from "@images/themesIcons/bithday/balloon-512.png";
import Confetti from "@images/themesIcons/bithday/confetti-256.png";
import styles from "./birthday.module.scss";

export const BirthdayPage = ({ example }) => {
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
          src={HappyBithday}
          alt="Happy Bithday"
        />
        <Image
          className={styles.decoratedPage__stikerBottomLeft}
          src={Confetti}
          alt="confetti"
        />
        <Image
          className={styles.decoratedPage__stikerBottomRight}
          src={Balloons}
          alt="baloons"
        />
        {isExample ? <QuestionsSlider /> : <QuestExecution />}
      </div>
    </>
  );
};
