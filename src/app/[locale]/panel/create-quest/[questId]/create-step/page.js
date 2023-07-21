"use client"

import React from "react";
import { QuestQuestions } from "@components/QuestCreation/questQuestions/questQuestions";
import { useTranslations } from 'next-intl';

const CreateStep = () => {
    const t = useTranslations("createSteps");
    return (
        <div className="pageContainer">
            <div className="mainContainer">
                <h1 className="title">{t("step_creation")}</h1>
                <QuestQuestions />
            </div>
        </div>
    );
};
export default CreateStep