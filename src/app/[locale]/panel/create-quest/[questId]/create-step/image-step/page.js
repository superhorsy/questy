
import React from "react";
import { ImageQuestionCreateForm } from "@components/QuestCreation/stepCreation/imageQuestionCreateForm/imageQuestionCreateForm";
import { useTranslations } from 'next-intl';

const ImageStep = () => {
    const t = useTranslations("createSteps");
    return (
        <div className="pageContainer">
            <div className="mainContainer">
                <h1 className="title" dangerouslySetInnerHTML={{ __html: t.raw('img_task.creation') }} />
                <ImageQuestionCreateForm />
            </div>
        </div>
    );
};
export default ImageStep