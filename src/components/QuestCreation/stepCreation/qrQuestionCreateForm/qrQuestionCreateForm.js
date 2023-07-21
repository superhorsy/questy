"use client"

import React, { useState } from "react";

import QRCode from "qrcode";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from 'uuid';
import { useTranslations } from 'next-intl';

import { addOneStep, editStep } from "@reducers/currentQuestSlice";

import { Box, TextField, Button } from "@mui/material";
import Image from 'next/image';
import styles from "./qrQuestionCreateForm.module.scss";
import { useParams, useRouter } from "next/navigation";

export const QRQuestionCreateForm = ({ stepData, handleClose }) => {
  const t = useTranslations("createSteps");
  const questId = useParams().questId

  const [taskName, setTaskName] = useState(stepData?.description ? stepData.description : "");
  const [taskDescription, setTaskDescription] = useState(stepData?.question_content ? stepData.question_content : "");
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [qrCodeCreated, setQRCodeCreated] = useState(false);

  // для qr-code
  const imageSaveName = `qr-code-${taskDescription}.png`;

  const currentQuest = useSelector(state => state.currentQuestReducer.currentQuest);

  const dispatch = useDispatch();

  const router = useRouter();

  const isDisabled = !taskName || !taskDescription || !qrCodeCreated;

  const handleCreateQRCode = async () => {
    const response = await QRCode.toDataURL(taskDescription);
    setQrImageUrl(response);
    setQRCodeCreated(true);
  };

  const onCreateTaskSubmit = (event) => {
    event.preventDefault();

    let stepN = currentQuest.steps.length + 1;

    const step = {
      quest_id: questId,
      id: !stepData ? v4() : stepData.id,
      sort: stepN,
      description: taskName,
      question_type: "qr",
      question_content: taskDescription,
      answer_type: "text",
      answer_content: [taskDescription],
    };
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
        helperText={t("qr_task.hint")}
        sx={{ mb: { xs: 3, sm: 7 } }}
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <TextField
        fullWidth
        id="outlined-basic"
        label={t("qr_task.enter_qr_string")}
        variant="outlined"
        helperText={t("qr_task.enter_qr_hint")}
        multiline
        rows={4}
        sx={{ mb: { xs: 3, sm: 6 } }}
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <Box
        component="div"
        sx={{
          m: "0 auto",
          mb: { xs: 2, sm: 5 },
          textAlign: "center",
          width: { xs: 1 / 1, sm: 500 },
        }}
      >
        <div className={styles.qrCodeBox}>
          <Button
            variant="contained"
            size="large"
            disabled={!taskDescription}
            onClick={handleCreateQRCode}
          >
            {t("qr_task.create_qr_code")}
          </Button>
          {qrImageUrl && (
            <div className={styles.qrCodeBox__qr}>
              <a href={qrImageUrl} download={imageSaveName}>
                <Image width="150" height="150" src={qrImageUrl} alt="QR Code" />
              </a>
            </div>
          )}
          {qrImageUrl && <span>{t("qr_task.save_qr_hint")}</span>}
        </div>
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isDisabled}
      >
        {t("save")}
      </Button>
    </Box>
  );
};
