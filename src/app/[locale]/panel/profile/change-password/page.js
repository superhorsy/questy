"use client"

import { useTranslations } from 'next-intl';

const ChangePassword = () => {
    const t = useTranslations("common")
    return <h1>{t("change_password")}</h1>;
};
export default ChangePassword