"use client"

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import { useTranslations } from 'next-intl';
import {
  addOneStep,
  editStep,
} from "@reducers/currentQuestSlice";
import { clearMedia } from "@reducers/mediaSlice";
import { Box, TextField, Button } from "@mui/material";
import { FileUploader } from "@components/FileUploader/fileUpoader.js";
import { useParams, useRouter } from "next/navigation";

export const ImageQuestionCreateForm = ({ stepData, handleClose }) => {

  const t = useTranslations("createSteps");

  const questId = useParams().questId

  const [taskName, setTaskName] = useState(
    stepData?.description ? stepData.description : ""
  );
  const [taskAnswersString, setTaskAnswersString] = useState(
    stepData?.answer_content ? stepData.answer_content : ""
  );

  const currentQuest = useSelector(
    (state) => state.currentQuestReducer.currentQuest
  );
  const { media } = useSelector((state) => state.mediaReducer);

  const dispatch = useDispatch();

  const router = useRouter();

  const isEmptyField = !taskName || !taskAnswersString || !media;

  const onCreateTaskSubmit = (event) => {
    event.preventDefault();

    const arrayOfAnswers = taskAnswersString
      .toString()
      .toLowerCase()
      .split(",");

    let stepN = stepData
      ? currentQuest.steps.length
      : currentQuest.steps.length + 1;

    let step = {
      quest_id: questId,
      id: !stepData ? v4() : stepData.id,
      sort: stepN,
      description: taskName,
      question_type: "image",
      question_content: media.link,
      answer_type: "text",
      answer_content: arrayOfAnswers,
    };

    if (!stepData) {
      dispatch(addOneStep(step));
      dispatch(clearMedia());
      router.push(`/panel/quest-profile/${questId}`);
    } else {
      dispatch(editStep(step));
      handleClose();
    }
  };

  return (
    <Box
      component="form"
      sx={{
        m: "0 auto",
        mb: { xs: 2, sm: 3 },
        textAlign: "center",
        width: { xs: 1 / 1, sm: 500 },
      }}
      noValidate={false}
      autoComplete="off"
      onSubmit={onCreateTaskSubmit}
    >
      <TextField
        fullWidth
        id="outlined-basic"
        label={t("task_name")}
        variant="outlined"
        helperText={t("img_task.hint")}
        sx={{ mb: { xs: 3, sm: 7 } }}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      <TextField
        fullWidth
        id="outlined-basic"
        label={t("answers")}
        variant="outlined"
        helperText={t("img_task.answers_hint")}
        sx={{ mb: { xs: 3, sm: 7 } }}
        value={taskAnswersString}
        onChange={(e) => setTaskAnswersString(e.target.value)}
      />
      <FileUploader type={"image"} media={media} />
      <Button
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
