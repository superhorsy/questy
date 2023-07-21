"use client";

import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import { updateProfileQuest } from "@reducers/currentQuestSlice";
import { useDispatch } from "react-redux";
import {useTranslations} from 'next-intl';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 300, md: 400 },
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
  fontSize: { xs: "14px", md: "20px" },
  transition: 'transform 3s'
};

export const ModalQuestProfileEditor = ({ questData, buttonProps, recipients }) => {
  const t = useTranslations("createQuest");

  const [open, setOpen] = React.useState(false);
  const [questProfileForm, setQuestProfileForm] = useState({
    name: questData.name,
    description: questData.description,
  });
  const [error] = useState(null);
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isEmptyField = !questProfileForm.name || !questProfileForm.description;

  const handleSubmitQuestProfileForm = async (event) => {
    event.preventDefault();
    dispatch(updateProfileQuest(questProfileForm));
    handleClose();
  }

  const LowerCaseButton = styled(Button)({
    textTransform: 'none',
    fontWeight: '600',
  });

  return (
    <div>
      <LowerCaseButton
        disabled={recipients?.length > 0}
        {...buttonProps}
        onClick={handleOpen}
      >
        {t('edit')}
      </LowerCaseButton>
      <Modal
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backdropFilter: 'blur(10px)' }
          },
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          noValidate={false}
          autoComplete="off"
          onSubmit={handleSubmitQuestProfileForm}
          sx={style}>
          <TextField
            disabled={false}
            required
            fullWidth
            sx={{ mb: { xs: 3, sm: 4 } }}
            id="outlined-basic-form-name"
            type="text"
            label={t("quest.name")}
            variant="outlined"
            value={questProfileForm.name}
            onChange={(e) => setQuestProfileForm({ ...questProfileForm, name: e.target.value })}
          />
          <TextField
            disabled={false}
            required
            fullWidth
            sx={{ mb: { xs: 3, sm: 4 } }}
            id="outlined-basic-form-description"
            type="text"
            label={t("quest.description")}
            variant="outlined"
            value={questProfileForm.description}
            onChange={(e) => setQuestProfileForm({ ...questProfileForm, description: e.target.value })}
          />
          <Button
            fullWidth
            type="submit"
            sx={{ mb: 4 }}
            variant="contained"
            size="large"
            disabled={isEmptyField}
          >
            {t('save')}
          </Button>
          {error ?
            <Typography
              id="modal-modal-title-error"
              variant="h6"
              component="h2"
              color="error"
              sx={{ fontSize: "inherit" }}
            >
              {t('error')}: {error}
            </Typography>
            :
            <></>
          }
        </Box>
      </Modal>
    </div >
  );
};
