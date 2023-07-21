"use client"

import React, { useState, useEffect } from "react";

import { QuestExecution } from "@components/QuestExecution/newStepper/newStepper";
import { QuestionsSlider } from "@components/QuestionsSlider/questionsSlider";

import Question from "@images/themesIcons/common/question-512.png";
import QR from "@images/themesIcons/common/qr-code-256.png";
import Image from 'next/image';
import styles from "./commonThemePage.module.scss";


export const CommonThemePage = ({ example }) => {
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
          src={QR}
          alt="QR-code"
        />
        <Image
          className={styles.decoratedPage__stikerBottomRight}
          src={Question}
          alt="Question"
        />
        {!isExample && <QuestExecution />}
        {isExample && <QuestionsSlider />}
      </div>
    </>
  );
};
