import React,{useEffect} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button} from "@mui/material";
import {useTranslations} from 'next-intl';

export const SendQuestDialog = ({
  isOpen,
  handleClose,
  questNameToSend,
  handleSendQuest,
  friendName,
  setFriendName,
  email,
  setEmail,
  emailError,
  setEmailError,
  formValid,
  setFormValid
}) => {
  const t = useTranslations("quests");

  const emailHandler = (e) => {
    setEmail(e.target.value)
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!re.test(String(e.target.value).toLowerCase())){
      setEmailError(t("incorrect_email"))
    } else {
      setEmailError("")
    }
  }

  //есть ли разница в модальном окне это или в том где вызывается
  useEffect(() => {
    if (emailError) {
      setFormValid(false)
    } else {
      setFormValid(true)
    }
  }, [emailError, setFormValid])

  const isEmptyField = !friendName || !email;

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{t("send_quest")} {questNameToSend}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("send_quest_hint")}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t("friends_name")}
          fullWidth
          variant="standard"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="name"
          label={t("friends_email")}
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => emailHandler(e)}
        />
        {emailError && <DialogContentText>{emailError}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>{t("cancel")}</Button>
        <Button onClick={() => handleSendQuest()} disabled={isEmptyField || !formValid} >{t("send")}</Button>
      </DialogActions>
    </Dialog>
  );
};
