import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from 'uuid';

import { addOneStep, editStep } from "@reducers/currentQuestSlice";

import { Box, TextField, Button } from "@mui/material";
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

export const TextQuestionCreateForm = ({ stepData, handleClose }) => {
  const t = useTranslations("createSteps");
  const dispatch = useDispatch();
  const router = useRouter();
  const questId = useParams().questId;

  const [taskName, setTaskName] = useState(stepData?.description ? stepData.description : "");
  const [taskDescription, setTaskDescription] = useState(stepData?.question_content ? stepData.question_content : "");
  const [taskAnswersString, setTaskAnswersString] = useState(stepData?.answer_content ? stepData.answer_content : "");

  const currentQuest = useSelector(state => state.currentQuestReducer.currentQuest);

  const isEmptyField = !taskName || !taskDescription || !taskAnswersString;

  const onCreateTaskSubmit = (event) => {
    event.preventDefault();

    const arrayOfAnswers = taskAnswersString.toString().toLowerCase().split(",");

    let stepN = stepData ? currentQuest.steps.length : currentQuest.steps.length + 1;

    let step = {
      quest_id: questId,
      id: !stepData ? v4() : stepData.id,
      sort: stepN,
      description: taskName,
      question_type: "text",
      question_content: taskDescription,
      answer_type: "text",
      answer_content: arrayOfAnswers
    }

    if (!stepData) {
      dispatch(addOneStep(step));
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
        helperText={t("text_task.hint")}
        sx={{ mb: { xs: 3, sm: 7 } }}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <TextField
        fullWidth
        id="outlined-basic"
        label={t("task_desc")}
        variant="outlined"
        helperText={t("text_task.desc_hint")}
        multiline
        rows={4}
        sx={{ mb: { xs: 3, sm: 7 } }}
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <TextField
        fullWidth
        id="outlined-basic"
        label={t("answers")}
        variant="outlined"
        helperText={t("answers_hint")}
        sx={{ mb: { xs: 3, sm: 7 } }}
        value={taskAnswersString}
        onChange={(e) => setTaskAnswersString(e.target.value)}
      />
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
