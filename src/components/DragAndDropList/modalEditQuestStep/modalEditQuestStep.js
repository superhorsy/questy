import React, { useState } from "react";
import {Box, Modal, IconButton} from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

import { TextQuestionCreateForm } from "@components/QuestCreation/stepCreation/textQuestionCreateForm/textQuestionCreateForm";
import { QRQuestionCreateForm } from "@components/QuestCreation/stepCreation/qrQuestionCreateForm/qrQuestionCreateForm";
import { ImageQuestionCreateForm } from "@components/QuestCreation/stepCreation/imageQuestionCreateForm/imageQuestionCreateForm";
import { AudioQuestionCreateForm } from "@components/QuestCreation/stepCreation/audioQuestionCreateForm/audioQuestionCreateForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 300, sm: 500 },
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  fontSize: { xs: "14px", md: "20px" },
  transition: "transform 3s",
};

export const ModalEditQuestStep = ({ stepData, recipients }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const selectTypeOfStep = () => {
    switch (stepData?.question_type) {
      case "text": {
        return (
          <TextQuestionCreateForm
            stepData={stepData}
            handleClose={handleClose}
          />
        );
      }
      case "qr": {
        return (
          <QRQuestionCreateForm stepData={stepData} handleClose={handleClose} />
        );
      }
      case "image": {
        return (
          <ImageQuestionCreateForm
            stepData={stepData}
            handleClose={handleClose}
          />
        );
      }
      case "audio": {
        return (
          <AudioQuestionCreateForm
            stepData={stepData}
            handleClose={handleClose}
          />
        );
      }
    }
  };

  return (
    <div>
      <IconButton
        disabled={recipients?.length > 0}
        sx={{ color: "#cfd8dc", p: { xs: 0.5 } }}
        onClick={handleOpen}
      >
        <ModeEditOutlineOutlinedIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backdropFilter: "blur(10px)" },
          },
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{selectTypeOfStep()}</Box>
      </Modal>
    </div>
  );
};
