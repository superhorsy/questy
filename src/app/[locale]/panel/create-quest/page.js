"use client";
import './createQuestPage.module.scss'
import React from "react";
import { useTranslations } from 'next-intl';
import { CreateQuestForm } from "@components/QuestCreation/questCreateForm/questCreateForm";
import { Box, Typography } from "@mui/material";

const CreateQuestPage = () => {
  const t = useTranslations("createQuest");
  return (
    <div className="pageContainer">
      <Box
        sx={{
          margin: "0 auto",
          maxWidth: "691px",
          width: 1,
          mt: '22px'
        }}
      >
        <Box
          sx={{
            p: "4% 8.5%",
            bgcolor: "#FFFFFF",
            boxShadow: "0px 20px 75px rgba(105, 159, 211, 0.15)",
            borderRadius: { xs: "11px", sm: "22px" },
            mb: "28px"
          }}
        >
          {" "}
          <Typography
            variant="h1"
            sx={{ fontWeight: 700, fontSize: { xs: "24px", sm: "30px" }, lineHeight: "140%", p: 0 }}
          >
            {t("quest.creation")}
          </Typography>
        </Box>

        <CreateQuestForm />
      </Box>
    </div>
  );
};
export default CreateQuestPage