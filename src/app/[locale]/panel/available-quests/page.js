"use client";

import {
  CircularProgress,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotStartedOutlinedIcon from '@mui/icons-material/NotStartedOutlined';
import { fetchAvailableQuests } from "@actions/actions";
import { questExecutionSlice } from "@reducers/questExecutionSlice";
import style from "./availableQuestsPage.module.scss";
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';

const AvaliableQuestsPage = () => {
  const t = useTranslations("quests");
  const from = t("from");

  const perPage = 7;
  const dispatch = useDispatch();
  const quests = useSelector((state) => state.questsAvailableReducer.quests);
  const totalQuests = useSelector(
    (state) => state.questsAvailableReducer.total
  );
  const searchParams = useSearchParams();
  const getPageOnload = () => {
    return searchParams.has("page") ? parseInt(searchParams.get("page")) : 1;
  }
  const [page, setPage] = useState(getPageOnload());
  const [settings, setSettings] = useState({ limit: perPage, offset: perPage * (page - 1) });
  const loading = useSelector((state) => state.questsAvailableReducer.loading);

  const { clearStateSteps } = questExecutionSlice.actions;

  const router = useRouter();

  useEffect(() => {
    if (page) {
      dispatch(fetchAvailableQuests(settings));
    }
    dispatch(clearStateSteps()); // Очистка стейта шагов квеста. Слайсер questExecutionSlice
  }, [clearStateSteps, dispatch, page, settings]);

  const handleChange = (event, val) => {
    event.preventDefault();
    setPage(val);
    setSettings({
      limit: perPage,
      offset: perPage * (val - 1)
    });
    setSearchParams({ "page": val })
  };

  const getPages = () => {
    return Math.ceil(totalQuests / perPage);
  };

  const handleQuestStart = (questId) => {
    router.push(`/panel/quest-info/${questId}`);
  };

  const generateSecondAction = (status, owner) => {
    const statuses = {
      'not_started': {
        title: t("status.not_started"),
        icon: <NotStartedOutlinedIcon sx={{ color: "#4E7AD2" }} />
      },
      'in_progress': {
        title: t("status.inprogress"),
        icon: <AccessTimeIcon sx={{ color: "#FFE600" }} />
      },
      'finished': {
        title: t("status.complete"),
        icon: <CheckCircleOutlineIcon sx={{ color: "#31A42F" }} />
      }
    }
    return <>
      <Tooltip key="owner" title={<>{from} <b>{owner.name}</b></>} placement="left">
        <IconButton>
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip key="status" title={statuses[status].title} placement="top">
        <IconButton>
          {statuses[status].icon}
        </IconButton>
      </Tooltip>
    </>
  }

  const CustomizedList = styled(List)`
    &{
      width: 100%
    }
    & .MuiListItem-root>.MuiListItemButton-root {
      padding-right: 96px;
      min-height: 73px;
    }
  `;

  return (
    <div className="pageContainer">
      <h1 className="title">{t("quests.available")}</h1>
      <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ maxWidth: "600px" }}>
          {loading && <CircularProgress disableShrink sx={{ m: "0 auto", mt: 10 }} />}
          {(!loading && quests.length > 0) && (
            <CustomizedList>
              {quests.map((quest) => (
                <ListItem
                  disablePadding
                  key={quest.quest_id}
                  divider
                  secondaryAction={generateSecondAction(quest.status, quest.owner)}
                >
                  <ListItemButton onClick={() => handleQuestStart(quest.quest_id)}>
                    <ListItemText>{quest.quest_name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </CustomizedList>
          )}
          {!loading && !quests.length && (
            <Typography align="center" sx={{ width: "100%", mt: 2 }}>{t("quests.no_available")}</Typography>
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
      </Container >
    </div >
  );
};

export default AvaliableQuestsPage