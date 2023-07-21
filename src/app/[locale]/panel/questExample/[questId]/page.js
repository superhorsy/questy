"use client"

import { BirthdayPage } from "@components/Theme/birthday/birthday";
import { Box } from "@mui/material";
import { ChristmasPage } from "@components/Theme/christmas/christmasPage";
import { CommonThemePage } from "@components/Theme/common/commonThemePage";
import { HalloweenPage } from "@components/Theme/halloween/halloween";
import React from "react";
import { StandartPage } from "@components/Theme/standart/standart";
import { ValentainPage } from "@components/Theme/valentain/valentain";
import { useSelector } from "react-redux";

const ExamplePage = () => {
  const { theme } = useSelector((state) => state.currentQuestReducer.currentQuest);

  return (
    <Box sx={{ mt: 0 }}>
      {theme === "christmas" && <ChristmasPage example={true} />}
      {theme === "birthday" && <BirthdayPage example={true} />}
      {theme === "valentain" && <ValentainPage example={true} />}
      {theme === "halloween" && <HalloweenPage example={true} />}
      {theme === "common" && <CommonThemePage example={true} />}
      {theme === "standart" && <StandartPage example={true} />}
    </Box>
  );
};

export default ExamplePage;