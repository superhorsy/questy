"use client";

import { Box, Button, Divider, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { fetchQuest, updateQuest } from "@actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { CouponConstructor } from "@components/CouponConstructor/couponConstructor";
import { DragAndDropList } from "@components/DragAndDropList/dragAndDropList";
import { FinalQuestMessage } from "@components/FinalQuestMessage/finalQuestMessage";
import { Loader } from "@components/Loader/loader.js";
import { ModalQuestProfileEditor } from "@components/Modal/modalQuestProfileEditor";
import { MyModal } from "@components/Modal/MyModal";
import { ThemeSelector } from "@components/QuestCreation/themeSelector/themeSelector";
import styles from "./questProfile.module.scss";
import { useTranslations } from 'next-intl';

export const QuestProfile = () => {
    const t = useTranslations("createQuest")

    const questId = useParams().questId

    const currentQuest = useSelector(
        (state) => state.currentQuestReducer.currentQuest
    );
    const isLoading = useSelector((state) => state.currentQuestReducer.isLoading);

    const recipients = currentQuest.recipients;
    const currentTheme = currentQuest.theme;


    const router = useRouter();
    const dispatch = useDispatch();

    const handleSaveQuest = () => {
        dispatch(updateQuest(currentQuest));
        router.push("/panel/my-quests");
    };

    useEffect(() => {
        if (!currentQuest?.steps?.length) {
            dispatch(fetchQuest(questId));
        }
        if (currentQuest.id !== questId) {
            dispatch(fetchQuest(questId));
        }
    }, [currentQuest.id, currentQuest?.steps?.length, dispatch, questId]);

    const handleBack = () => {
        router.push('/panel/my-quests')
    };
    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && currentQuest && (
                <>
                    <div className={styles.questInfo}>
                        <div className={styles.questInfo__item}>
                            <div className={styles.questInfo__title}>
                                {t('quest.quest')}: {currentQuest.name}
                            </div>
                        </div>
                        <div className={styles.questInfo__item}>
                            <div className={styles.questInfo__desc}>
                                {currentQuest.description}
                            </div>
                        </div>
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                width: "100%",
                                m: "0 auto",
                                textAlign: "center",
                                // width: { xs: 150, sm: 200 },
                            }}
                        >
                            <ModalQuestProfileEditor
                                buttonProps={{
                                    fullWidth: true,
                                    variant: "text",
                                    size: "large",
                                    sx: { textDecoration: 'underline' }
                                }}
                                recipients={recipients}
                                questData={{
                                    name: currentQuest.name,
                                    description: currentQuest.description,
                                }}
                            />
                        </Box>
                    </div>
                    <Divider sx={{ backgroundColor: "black", opacity: 0.15, mb: 4, mt: 2 }} />
                    <div className={styles.questBlock}>
                        <p className={styles.questBlock__subtitle}>{t('set_theme')}</p>
                        <ThemeSelector recipients={recipients} />
                    </div>
                    <Divider sx={{ backgroundColor: "black", opacity: 0.15, mb: 4, mt: 3 }} />
                    <div className={styles.questBlock}>
                        <div className={styles.questBlock__flex}>
                            <p className={styles.questBlock__subtitle}>{t('quest.steps')}</p>
                            <Button
                                disabled={recipients?.length > 0}
                                endIcon={<AddCircleOutlineIcon />}
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() =>
                                    router.push(`/panel/create-quest/${questId}/create-step`)
                                }
                            >
                                {t('create_step')}
                            </Button>
                        </div>
                        <DragAndDropList recipients={recipients} />
                    </div>
                    <Divider sx={{ backgroundColor: "black", opacity: 0.15, mb: 4, mt: 3 }} />
                    <div className={styles.questBlock}>
                        <p className={styles.questBlock__subtitle}>{t("final_message.create")}</p>
                        <FinalQuestMessage />
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                width: "100%",
                            }}
                        >
                            <p>
                                {!currentQuest.rewards ? t('coupon.no_added') : t('coupon.added')}
                            </p>
                            <MyModal
                                buttonProps={{
                                    fullWidth: true,
                                    variant: "text",
                                    size: "large",
                                    sx: { textDecoration: 'underline', textTransform: 'unset', fontWeight: 600 },
                                }}
                                buttonTitle={currentQuest.rewards ? {
                                    title: t('coupon.edit'),
                                }
                                    : { title: t('coupon.create') }}
                            >

                                <CouponConstructor questTheme={currentTheme} />

                            </MyModal>
                        </Box>
                    </div>
                    <Divider sx={{ backgroundColor: "black", opacity: 0.15, mb: 4, mt: 3 }} />

                    <Box
                        component="div"
                        sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
                    >
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                width: '47%',
                                mt: 3,
                                mb: 1,
                            }}
                            onClick={() => handleBack()}
                        >
                            {t('back')}
                        </Button>
                        {recipients?.length > 0 && (
                            <Tooltip
                                title={t("save_hint2")}
                                placement="top"
                            >
                                <span>
                                    <Button
                                        disabled={recipients?.length > 0}
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            width: '47%',
                                            mt: 3,
                                            mb: 1,
                                            px: 4,
                                            py: 2
                                        }}
                                        onClick={handleSaveQuest}
                                    >
                                        {t('save')}
                                    </Button>
                                </span>
                            </Tooltip>
                        )}

                        {recipients?.length === 0 && (
                            <Tooltip
                                title={t("save_hint1")}
                                placement="top"
                            >
                                <span>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        sx={{
                                            width: '47%',
                                            mt: 3,
                                            mb: 1,
                                            px: 4,
                                            py: 2
                                        }}
                                        onClick={handleSaveQuest}
                                    >
                                        {t('save')}
                                    </Button>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                    {currentQuest.steps?.length > 0 && (
                        <Button
                            variant="text"
                            size="large"
                            sx={{
                                textDecoration: "underline",
                                textTransform: "none",
                                fontWeight: "600",
                                m: "0 auto",
                                mb: { xs: 1, sm: 2 },
                            }}
                            onClick={() => router.push(`/panel/questExample/${questId}`)}
                        >
                            {t("quest.preview_hint")}
                        </Button>
                    )}
                </>
            )}
        </>
    );
};
