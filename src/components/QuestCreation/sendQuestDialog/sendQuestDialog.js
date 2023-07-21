import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

import SendIcon from "@mui/icons-material/Send";
import {useTranslations} from 'next-intl';

;

export const SendQuestDialog = () => {
  const t = useTranslations("quests");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 2, mb: { xs: 2, sm: 3 }, py: 2 }}
        endIcon={<SendIcon />}
        onClick={handleClickOpen}
      >
        {t("send_quest")}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("send_quest")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("send_quest_hint")}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button onClick={handleClose}>{t("send")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
