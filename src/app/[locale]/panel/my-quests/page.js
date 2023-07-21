"use client";

// UI
import {
  Badge,
  Box,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Tooltip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteQuest, fetchCreatedQuests, sendQuest } from "@actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { DeleteQuestDialog } from "@components/Modal/modalDeleteQuest.js";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Loader } from "@components/Loader/loader.js";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { SendQuestDialog } from "@components/Modal/modalSendQuest.js";
import { SuccessWindow } from "@components/SendQuestSuccessWindow/sendQuestSuccessWindow.js";
import style from "./userQuestsPage.module.scss";
import { styled } from "@mui/material/styles";
import { updateRecipientsInfo } from "@reducers/createdQuestsSlice";
import { useCallback } from "react";
import { useTranslations } from 'next-intl';

const MyQuestsPage = () => {
  const t = useTranslations("quests");
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const perPage = 7;
  const quests = useSelector((state) => state.createdQuestsReducer.quests);
  const totalQuests = useSelector((state) => state.createdQuestsReducer.total);
  const isLoading = useSelector(
    (state) => state.createdQuestsReducer.isLoading
  );
  const getPageOnload = () => {
    return searchParams.has("page") ? parseInt(searchParams.get("page")) : 1;
  };
  const [page, setPage] = useState(getPageOnload());
  const [settings, setSettings] = useState({
    limit: perPage,
    offset: perPage * (page - 1),
  });

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchCreatedQuests(settings));
    };
    if (page) {
      fetchData();
    }
  }, [page, settings, dispatch]);

  const handleChange = (event, val) => {
    event.preventDefault();
    setPage(val);
    setSettings({
      limit: perPage,
      offset: perPage * (val - 1),
    });
    router.push(`/panel/my-quests?` + createQueryString('page', val))
  };

  const getPages = () => {
    return Math.ceil(totalQuests / perPage);
  };

  const isQuestsExist = quests && quests !== null;

  // модальные окна
  const [email, setEmail] = useState("");
  const [friendName, setFriendName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [questIdToSend, setQuestIdToSend] = useState("");
  const [questNameToSend, setQuestNameToSend] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [questIdToDelete, setQuestIdToDelete] = useState("");
  const [questNameToDelete, setQuestNameToDelete] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleDialogOpen = (questId, questName) => {
    setQuestNameToDelete(questName);
    setQuestIdToDelete(questId);
    setIsOpenDialog(true);
  };

  const handleDialogClose = () => {
    setIsOpenDialog(false);
  };

  const handleOpen = (questId, questName) => {
    setQuestNameToSend(questName);
    setQuestIdToSend(questId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setFriendName("");
    setEmail("");
    setIsOpen(false);
  };

  const handleSendQuest = () => {
    const data = {
      questId: questIdToSend,
      data: { email: email, name: friendName },
    };
    dispatch(sendQuest(data));
    dispatch(updateRecipientsInfo(data));
    setIsOpen(false);
    setFriendName("");
    setEmail("");
  };

  const handleDeleteQuest = () => {
    dispatch(deleteQuest(questIdToDelete));
    setIsOpenDialog(false);
  };

  const generateSecondAction = (quest) => {
    return (
      <>
        {quest.recipients !== null && (
          <Tooltip
            placement="left"
            title={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <em>{t("sent_to_emails")}</em>
                {quest.recipients.map((item, idx) => {
                  return <em key={idx}>{item.email}</em>;
                })}
              </Box>
            }
          >
            <span>
              <IconButton edge="start" sx={{ color: "#bdbdbd" }}>
                <InfoOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {quest.recipients === null && (
          <Tooltip title={t("possible_multi_send")} placement="left">
            <span>
              <IconButton
                aria-label="send"
                sx={{ color: "#8FBC8F" }}
                onClick={() => handleOpen(quest.id, quest.name)}
              >
                <EmailOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {quest.recipients === null && (
          <IconButton
            onClick={() => handleDialogOpen(quest.id, quest.name)}
            edge="end"
            aria-label="delete"
            sx={{ color: "#F08080" }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        )}
        {quest.recipients !== null && (
          <Tooltip title={t("can_send_again")} placement="top">
            <span>
            <IconButton
              edge="end"
              sx={{ color: "#4E7AD2" }}
              onClick={() => handleOpen(quest.id, quest.name)}
            >
              <Badge badgeContent={quest.recipients.length} color="info">
                <MarkEmailReadOutlinedIcon />
              </Badge>
            </IconButton>
            </span>
          </Tooltip>
        )}
      </>
    );
  };

  const CustomizedList = styled(List)`
    & {
      width: 100%;
    }
    & .MuiListItem-root > .MuiListItemButton-root {
      padding-right: 96px;
      min-height: 73px;
    }
  `;

  return (
    <div className="pageContainer">
      <SuccessWindow />
      <h1 className="title">{t("quests.my")}</h1>
      <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ maxWidth: "600px" }}>
          {isLoading && <Loader />}
          {!isLoading && isQuestsExist && (
            <CustomizedList>
              {quests &&
                quests.map((quest, idx) => (
                  <ListItem
                    disablePadding
                    key={idx}
                    divider
                    secondaryAction={generateSecondAction(quest)}
                  >
                    <ListItemButton
                      onClick={() =>
                        router.push(`/panel/quest-profile/${quest.id}`)
                      }
                    >
                      <ListItemText>{quest.name}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                ))}
            </CustomizedList>
          )}
          {!isLoading && quests === null && (
            <Box
              sx={{
                width: 1,
                textAlign: "center",
                fontSize: { xs: 15, sm: 20 },
              }}
            >
              {t("quests.no_created")}
            </Box>
          )}
          {getPages() >= 2 && (
            <Grid item xs={12}>
              <Pagination
                className={style.pagination}
                page={page}
                count={getPages()}
                onChange={handleChange}
                size="small"
              />
            </Grid>
          )}
        </Grid>
        {isOpen && (
          <SendQuestDialog
            isOpen={isOpen}
            handleClose={handleClose}
            email={email}
            setEmail={setEmail}
            friendName={friendName}
            setFriendName={setFriendName}
            emailError={emailError}
            setEmailError={setEmailError}
            questNameToSend={questNameToSend}
            formValid={formValid}
            setFormValid={setFormValid}
            handleSendQuest={handleSendQuest}
          />
        )}
        {isOpenDialog && (
          <DeleteQuestDialog
            isOpenDialog={isOpenDialog}
            handleClose={handleDialogClose}
            questNameToDelete={questNameToDelete}
            handleAction={handleDeleteQuest}
          />
        )}
      </Container>
    </div>
  );
};
export default MyQuestsPage