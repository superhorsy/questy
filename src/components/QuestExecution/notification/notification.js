import React from "react";
import { useDispatch } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { hideAnswerNotification } from "@reducers/questExecutionSlice";
import { useTranslations } from "next-intl";

export const Notification = ({ notification }) => {
  const t = useTranslations("quests");
  const translatedMessage = notification.message == "" ? "" : t(notification.message);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideAnswerNotification(true));
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={notification.visible}
      autoHideDuration={1000}
      onClose={handleClose}
      in={"false"}
    >
      <Alert severity={notification.success ? "success" : "error"} sx={{ width: "100%", mt: 30 }}>
        {translatedMessage}
      </Alert>
    </Snackbar>
  );
};
