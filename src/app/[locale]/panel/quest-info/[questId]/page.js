"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuestInfo } from "@actions/actions";
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    CircularProgress
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";

const QuestInfo = ({ params }) => {
    const t = useTranslations("quests");

    const router = useRouter();
    const dispatch = useDispatch();
    const questId = params.questId;
    const quest = useSelector((state) => state.questInfoReducer.quest);
    const loading = useSelector((state) => state.questInfoReducer.loading);
    const statuses = {
        'not_started': {
            title: t("status.not_started"),
            btn: t("start_quest"),
            color: '#4E7AD2'
        },
        'in_progress': {
            title: t("status.inprogress"),
            btn: t("continue_quest"),
            color: '#FFE600'
        },
        'finished': {
            title: t("status.complete"),
            btn: false,
            color: '#31A42F'
        }
    }
    useEffect(() => {
        if (quest.id !== questId) {
            dispatch(fetchQuestInfo(questId));
        }
    }, [dispatch, quest.id, questId]);

    const handleQuestStart = () => {
        router.push(`/panel/questExecution/${questId}`);
    };

    return <div className="pageContainer">
        <Container maxWidth="sm">
            <Grid container spacing={2} sx={{ maxWidth: "600px" }}>
                {loading && <CircularProgress disableShrink sx={{ m: "0 auto", mt: 10 }} />}
                {(!loading && quest) && (
                    <>
                        <h1 className="title">{quest.quest_name}</h1>
                        <Typography align="left" sx={{ width: "100%", mt: 2 }}>{quest.quest_description}</Typography>
                        {quest.quest_status &&
                            <>
                                <Typography align="left" sx={{ width: "100%", mt: 2, fontWeight: '600' }}>{t("status.status")}: <Box component="span" sx={{ color: statuses[quest.quest_status].color }}>{statuses[quest.quest_status].title}</Box></Typography>
                                {statuses[quest.quest_status].btn &&
                                    <Button onClick={handleQuestStart} sx={{ m: "0 auto", mt: 6 }} size="large" variant="contained">{statuses[quest.quest_status].btn}</Button>
                                }
                            </>
                        }
                    </>
                )}
            </Grid>
        </Container >
    </div >;
};
export default QuestInfo;