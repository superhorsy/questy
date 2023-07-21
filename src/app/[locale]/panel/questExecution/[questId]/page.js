"use client"

import React, { useEffect } from "react";
import { getInitQuest, getStatusQuest } from "@actions/actions";
import { useDispatch, useSelector } from "react-redux";

import { BirthdayPage } from "@components/Theme/birthday/birthday";
import { Box } from "@mui/material";
import { ChristmasPage } from "@components/Theme/christmas/christmasPage";
import { CommonThemePage } from "@components/Theme/common/commonThemePage";
import { HalloweenPage } from "@components/Theme/halloween/halloween";
import { StandartPage } from "@components/Theme/standart/standart";
import { ValentainPage } from "@components/Theme/valentain/valentain";
import { useParams } from "next/navigation";

const DecoratedPage = () => {
    const dispatch = useDispatch();
    const questId = useParams().questId
    const questStatus = useSelector((state) => state.questExecutionReducer.questStatus);
    const theme = useSelector((state) => state.questExecutionReducer.questTheme);

    useEffect(() => {
        dispatch(getStatusQuest(questId));
    }, []);

    useEffect(() => {
        if (questStatus === "not_started") {
            dispatch(getInitQuest(questId));
        }
    }, [questStatus]);

    return (
        <Box sx={{ mt: 0 }}>
            {theme === "christmas" && <ChristmasPage example={false} />}
            {theme === "birthday" && <BirthdayPage example={false} />}
            {theme === "valentain" && <ValentainPage example={false} />}
            {theme === "halloween" && <HalloweenPage example={false} />}
            {theme === "common" && <CommonThemePage example={false} />}
            {theme === "standart" && <StandartPage example={false} />}
        </Box>
    );
};

export default DecoratedPage;
