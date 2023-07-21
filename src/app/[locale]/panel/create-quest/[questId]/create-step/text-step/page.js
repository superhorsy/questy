"use client"
import React from "react";
import { TextQuestionCreateForm } from "@components/QuestCreation/stepCreation/textQuestionCreateForm/textQuestionCreateForm";
import { useTranslations } from 'next-intl';

const TextStep = () => {
  const t = useTranslations("createSteps");
  return (
    <div className="pageContainer">
      <div className="mainContainer">
        <h1 className="title" dangerouslySetInnerHTML={{ __html: t.raw('text_task.creation') }} />
        <TextQuestionCreateForm />
      </div>
    </div>
  );
};
export default TextStep
