import React from "react";
import { QRQuestionCreateForm } from "@components/QuestCreation/stepCreation/qrQuestionCreateForm/qrQuestionCreateForm";
import { useTranslations } from 'next-intl';


const CreateStep = () => {
  const t = useTranslations("createSteps");
  return (
    <div className="pageContainer">
      <div className="mainContainer">
        <h1 className="title" dangerouslySetInnerHTML={{ __html: t.raw('qr_task.creation') }} />
        <QRQuestionCreateForm />
      </div>
    </div>
  );
};
export default CreateStep