import React from "react";
import { AudioQuestionCreateForm } from "@components/QuestCreation/stepCreation/audioQuestionCreateForm/audioQuestionCreateForm";
import { useTranslations } from 'next-intl';

const AudioStep = () => {
  const t = useTranslations("createSteps");
  return (
    <div className="pageContainer">
      <div className="mainContainer">
        <h1 className="title" dangerouslySetInnerHTML={{ __html: t.raw('audio_task.creation') }} />
        <AudioQuestionCreateForm />
      </div>
    </div>
  );
};
export default AudioStep