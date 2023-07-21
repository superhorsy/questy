"use client";

import { Box, Button } from "@mui/material";
import React, { useState } from "react";

import { CustomField } from "@components/CustomTextField/customTextField";
import { CustomFieldMultiline } from "@components/CustomTextFieldMultiline/customTextField";
import { createQuest } from "@actions/actions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

export const CreateQuestForm = () => {
  const t = useTranslations("createQuest");

  const dispatch = useDispatch();
  const [questName, setQuestName] = useState("");
  const [questDesctiption, setQuestDescription] = useState("");

  const router = useRouter();

  const isEmptyField = !questDesctiption || !questName;

  const handleCreateQuestSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: questName,
      description: questDesctiption,
      steps: [],
      theme: "standart",
    };
    dispatch(createQuest(data)).then((data) => {
      const questId = data.payload.data.id;
      router.push(`/panel/quest-profile/${questId}`);
    });
  };

  return (
    <Box
      component="form"
      sx={{
        m: "0 auto",
        mb: "20px",
        width: { xs: 1 },
        bgcolor: "#ffffff",
        boxShadow: "0px 20px 75px rgba(105, 159, 211, 0.15)",
        borderRadius: { xs: "11px", sm: "22px" },
        p: { xs: "5%", sm: "8.5% 8.5% 7%" },
        boxSizing: "border-box",
      }}
      noValidate={false}
      autoComplete="off"
      onSubmit={handleCreateQuestSubmit}
    >
      <CustomField
        label={t("quest.name")}
        helperText={t("quest.name_hint")}
        value={questName}
        multiline={true}
        handler={setQuestName}
        handleClear={setQuestName}
        sx={{ mb: 3 }}
      />

      <CustomFieldMultiline
        label={t("quest.description")}
        helperText={t("quest.description_hint")}
        multiline={true}
        rows={9}
        value={questDesctiption}
        handler={setQuestDescription}
        handleClear={setQuestDescription}
        sx={{ mb: 3 }}
      />

      <Button
        sx={{
          bgcolor: "#3595F3",
          width: "149px",
          borderRadius: "100px",
          textTransform: "none",
        }}
        type="submit"
        variant="contained"
        size="large"
        disabled={isEmptyField}
      >
        {t("save")}
      </Button>
    </Box>
  );
};
