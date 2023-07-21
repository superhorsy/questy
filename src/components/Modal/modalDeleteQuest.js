import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import React from "react";
import {useTranslations} from 'next-intl';

;

export const DeleteQuestDialog = ({
  isOpenDialog,
  handleClose,
  questNameToDelete,
  handleAction,
}) => {
  const t = useTranslations("quests");
  return (
    <Dialog open={isOpenDialog} onClose={() => handleClose()}>
      <DialogTitle>
        {t("delete_quest_hint1")} : {questNameToDelete} ?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t("delete_quest_hint2")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>{t("cancel")}</Button>
        <Button onClick={() => handleAction()}>{t("remove")}</Button>
      </DialogActions>
    </Dialog>
  );
};
