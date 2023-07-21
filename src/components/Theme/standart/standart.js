"use client"

import React, { useState, useEffect } from "react";
import { QuestExecution } from "@components/QuestExecution/newStepper/newStepper";
import { QuestionsSlider } from "@components/QuestionsSlider/questionsSlider";

export const StandartPage = ({ example }) => {
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
      {isExample ? <QuestionsSlider />: <QuestExecution />}
    </>
  );
};
