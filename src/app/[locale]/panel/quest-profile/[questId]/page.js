import { QuestProfile } from "@components/QuestProfile/questProfile";
import React from "react";
import { useTranslations } from 'next-intl';


const QuestPage = () => {
  const t = useTranslations("createQuest");

  return (
    <div className="pageContainer">
      <div className="mainContainer">
        <h1 className="title">{t('quest.profile')}</h1>
        <QuestProfile />
      </div>
    </div>
  );
};
export default QuestPage