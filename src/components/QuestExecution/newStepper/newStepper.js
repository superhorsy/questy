import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { addAnswerFromQRCodeReader } from "@reducers/questExecutionSlice";
import { getNextQuest } from "@actions/actions";
import { clearAvailableQuests, clearFinishedQuests } from "@reducers/availableQuests";
import { Typography, Button, Box, Input } from "@mui/material";

import { QRStep } from "../questionsContent/qrStep/qrStep";
import { Loader } from "@components/Loader/loader";
import { Notification } from "../notification/notification";

import styles from "./newStepper.module.scss";
import { Coupon } from "@components/CouponConstructor/coupon/coupon";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const QuestExecution = () => {
  const t = useTranslations("quests");
  const {
    current,
    questionCount,
    questStatus,
    qrCodeAnswer,
    isLoading,
    notification,
    finalMessage,
    questTheme,
    rewards,
  } = useSelector((state) => state.questExecutionReducer);
  const toComplete = t("complete_quest");
  const toAnswer = t("submit_answer");

  const [answer, setAnswer] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { questId } = useParams();

  /**
   * Handlers
   */
  const handleNext = () => {
    if (current.question_type !== "qr") {
      dispatch(
        getNextQuest({ questId: questId, answer_type: "text", answer: answer })
      );
      setAnswer("");
    }
    if (current.question_type === "qr" && qrCodeAnswer !== null) {
      dispatch(
        getNextQuest({
          questId: questId,
          answer_type: "text",
          answer: qrCodeAnswer,
        })
      );
      dispatch(addAnswerFromQRCodeReader(null));
    }
  };

  const questFinishedLast = () => {
    dispatch(clearAvailableQuests());
    dispatch(clearFinishedQuests());

    router.push("/panel/available-quests");
  }

  const renderCompleteQuest = () => (
    <Box sx={{ mt: 10, width: 1, display: "flex", flexDirection: "column" }}>
      {finalMessage ? (
        <Typography sx={{ textAlign: "center", fontSize: { xs: 20, sm: 30 }, p: "0 5px" }}>
          {finalMessage}
        </Typography>
      ) : (
        <Typography sx={{ textAlign: "center", color: "primary.main", fontSize: { xs: 20, sm: 30 }, p: "0 5px" }}>
          {t("congratulations_quest_complete")}
        </Typography>
      )}
      {rewards && <Coupon sx={{ paddingTop: '50px' }} questTheme={questTheme} data={rewards[0]} />}
      <Button
        size="large"
        variant="contained"
        onClick={questFinishedLast}
        sx={{ m: "0 auto", mt: 5 }}
      >
        {t("return_back")}
      </Button>
    </Box>
  );

  const renderQuestSteps = () => (
    <Box
      sx={{
        maxWidth: 600,
        // minHeight: "55vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <>
        <Box
          component="div"
          sx={{ display: "flex", width: 1, p: 2, boxSizing: "border-box" }}
        >
          <Box
            sx={{
              display: "block",
              mr: 2,
              width: { xs: 20, sm: 25 },
              height: { xs: 20, sm: 25 },
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
                backgroundColor: "primary.main",
                width: { xs: 20, sm: 25 },
                height: { xs: 20, sm: 25 },
                textAlign: "center",
                position: "relative",
                color: "primary.contrastText",
              }}
            >
              <Box
                sx={{
                  fontWeight: 700,
                  lineHeight: 1,
                  fontSize: { xs: 12, sm: 14 },
                  display: "block",
                  position: "absolute",
                  transform: "translate(0, 0)",
                }}
              >
                {current?.sort}
              </Box>
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 12, sm: 14 }, color: "secondary.main" }}>
            {current?.description}
          </Typography>
        </Box>

        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 1,
            // minHeight: "30vh",
            minHeight: "40vh",
            padding: "0 15px",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <Box component="div">
            {current.question_type === "text" && (
              <Typography sx={{ textAlign: "center", color: "secondary.main" }}>
                {current?.question_content}
              </Typography>
            )}
          </Box>
          <Box component="div">
            {current.question_type === "qr" && (
              <QRStep qrCodeAnswer={qrCodeAnswer} />
            )}
          </Box>
          {current.question_type === "image" && (
            <Box component="div" className={styles.imageBox}>
              <Image
                src={`${current.question_content}`}
                width="450"
                height="450"
                alt="задание с картинкой"
              />
            </Box>
          )}
          <Box component="div">
            {current.question_type === "audio" && (
              <audio controls>
                <source src={current.question_content} type="audio/mp3" />
                <source src={current.question_content} type="audio/wav" />
                <source src={current.question_content} type="audio/webm" />
              </audio>
            )}
          </Box>
        </Box>
        <Box
          component="div"
          sx={{ position: "relative", height: "10vh", width: "100%" }}
        >
          {current.question_type !== "qr" && (
            <Input
              required
              sx={{
                mb: { xs: 1, sm: 2 },
                mt: { xs: 3, sm: 4 },
                position: "absolute",
                bottom: 40,
                left: 15,
                color: "primary.main"
              }}
              id="outlined-basic-answer"
              placeholder={t("your_answer")}
              size="small"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          )}
          <Notification notification={notification}></Notification>

          {current.question_type !== "qr" && (
            <Button
              size="middle"
              variant="contained"
              sx={{ position: "absolute", bottom: 0, right: 20 }}
              disabled={!answer.length}
              onClick={handleNext}
            >
              {current.sort === questionCount ? toComplete : toAnswer}
            </Button>
          )}
          {current.question_type === "qr" && (
            <Button
              size="middle"
              variant="contained"
              sx={{ position: "absolute", bottom: 0, right: 20 }}
              disabled={!qrCodeAnswer?.length}
              onClick={handleNext}
            >
              {current.sort === questionCount ? toComplete : toAnswer}
            </Button>
          )}
          <Button
            size="middle"
            variant="outlined"
            sx={{ position: "absolute", bottom: 0, left: 20 }}
            onClick={questFinishedLast}
          >
            {t("return_back")}
          </Button>
        </Box>
      </>
    </Box>
  );

  return (
    <div className="pageContainer">
      <div className="mainContainer">
        <Typography variant="h4" sx={{ color: "primary.main", mt: 3, mb: 3, textAlign: "center", textTransform: "upperCase", fontWeight: "bold" }}>{t("quest_execution")}</Typography>
        {isLoading ? (
          <Loader />
        ) : questStatus === "finished" ? (
          renderCompleteQuest()
        ) : (
          renderQuestSteps()
        )}
      </div>
    </div>
  );
};
