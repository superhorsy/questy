import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addSteps, deleteStep } from "@reducers/currentQuestSlice";
import {useTranslations} from 'next-intl';

import { IconButton, Box } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Image from 'next/image';


import TextIcon from "@images/questions/text-icon.png";
import QRIcon from "@images/questions/qr-icon.png";
import SoundIcon from "@images/questions/sound-icon.png";
import styles from "./dragAndDropList.module.scss";
import { ModalEditQuestStep } from "./modalEditQuestStep/modalEditQuestStep";

export const DragAndDropList = ({ recipients }) => {
  const t = useTranslations("createQuest");
  const steps = useSelector(
    (state) => state.currentQuestReducer.currentQuest.steps
  );
  const dispatch = useDispatch();

  //save reference for dragitem and dragOverItem
  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);

  const handleSort = () => {
    //duplicate items
    let _steps = structuredClone(steps);

    // remove and save the dragged item content
    let draggedItemContent = _steps.splice(dragItem.current, 1)[0];

    // switch the position
    _steps.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    // update the actual array
    _steps = _steps.map((item, ind) => {
      item.sort = ind + 1;
      return item;
    });
    dispatch(addSteps(_steps));
  };

  return (
    <Box
      component="div"
      sx={{
        maxWidth: 600,
        width: 1,
        boxSizing: "border-box",
        mt: { xs: 1, sm: 3 },
      }}
    >
      <Box sx={{ width: 1, mb: 2 }}>
        {steps &&
          steps.map((step, index) => (
            <Box
              component="div"
              draggable
              onDragStart={(e) => (dragItem.current = index)}
              onDragEnter={(e) => (dragOverItem.current = index)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
              key={index}
              // button
              sx={{
                display: "flex",
                width: 1,
                flexDirection: "column",
                boxSizing: "border-box",
                mb: 1,
                minHeight: 60,
                p: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  width: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: 30,
                    mr: 1,
                  }}
                >
                  {step.question_type === "text" && (
                    <Image width="30" height="30" src={TextIcon} alt="текст" />
                  )}
                  {step.question_type === "qr" && <Image width="30" height="30" src={QRIcon} alt="qr" />}
                  {step.question_type === "image" && (
                    <Image width="30" height="30" className={styles.question__image} src={`${step.question_content}`} alt="картинка" />
                  )}
                  {step.question_type === "audio" && <Image width="30" height="30" src={SoundIcon} alt="sound" />}
                </Box>
                <div className={styles.question__title}>
                  <p>{step.description}</p>
                  {step.question_type !== "image" &&
                    step.question_type !== "audio" && (
                      <div className={styles.question__desc}>
                        {step.question_content}
                      </div>
                    )}
                </div>
                <Box
                  sx={{
                    width: { xs: 2 / 9, sm: 1 / 9 },
                    ml: 2,
                    display: "flex",
                    alignItems: "start",
                    justifyContent: { sm: "center" },
                    flexDirection: { sm: "row" },
                  }}
                >
                  <ModalEditQuestStep stepData={step} recipients={recipients} />

                  <IconButton
                    disabled={recipients?.length > 0}
                    aria-label="delete"
                    sx={{ color: "#ff6090", p: { xs: 0.5 } }}
                    onClick={() => dispatch(deleteStep(step.id))}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        {!steps?.length && <p>{t('no_steps_added')}</p>}
      </Box>
    </Box>
  );
};
