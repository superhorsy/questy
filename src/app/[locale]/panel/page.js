"use client";

import { useRouter } from "next/navigation";
import {
  CardActionArea,
  Box,
  Grid,
  CardContent,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import {useTranslations} from 'next-intl';
import Rocket from "@images/panel/rocket.png";
import Archive from "@images/panel/archive.png";
import Book from "@images/panel/book.png";
import Question from "@images/panel/question.png";

export default function PanelIndex() {
  const t = useTranslations("quests");
  const router = useRouter();
  const goToMyQuests = () => {
    router.push("/panel/my-quests");
  };

  const goToArchive = () => {
    router.push("/panel/archive");
  };

  const goToAvailableQuests = () => {
    router.push("/panel/available-quests");
  };

  const goToCreateQuest = () => {
    router.push("/panel/create-quest");
  };

  const panelRouting = [
    {
      name: t("create_new_quest"),
      description: t("quests.questy_constructor"),
      image: Rocket,
      alt: "Rocket",
      topage: goToCreateQuest,
    },
    {
      name: t("quests.my"),
      description: t("quests.view_created"),
      image: Question,
      alt: "Question",
      topage: goToMyQuests,
    },
    {
      name: t("quests.available"),
      description: t("quests.view_avaible"),
      image: Book,
      alt: "Book",
      topage: goToAvailableQuests,
    },
    {
      name: t("quests.archive"),
      description: t("quests.view_completed"),
      image: Archive,
      alt: "Archive",
      topage: goToArchive,
    },
  ];

  const BlueCard = ({ nav }) => {
    return (
      <Card
        sx={{
          bgcolor: "#3595F3;",
          borderRadius: { xs: "11px", sm: "22px" },
          color: "#ffffff",
          boxShadow: " 0px 20px 75px rgba(56, 118, 180, 0.27)",
        }}
      >
        <CardActions nav={nav} />
      </Card>
    );
  };

  const CardActions = ({ nav }) => {
    return (
      <CardActionArea
        sx={{
          height: "100%",
          p: "6% 5% 7%",
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          alignItems: { xs: "center", sm: "flex-start" },
          justifyContent: "left",
        }}
        onClick={nav.topage}
      >
        <Box
          sx={{
            width: { xs: "40px", sm: "25%" },
            height: { xs: "40px", sm: "25%" },
            mr: { xs: "10px", sm: 0 },
          }}
        >
          <CardMedia
            sx={{ height: { xs: "40px", sm: "25%" }, objectFit: "contain" }}
            component="img"
            image={nav.image.src}
          />
        </Box>
        <CardContent sx={{ height: "100%", p: { xs: 0, sm: "10% 0 0 0" } }}>
          <Typography
            variant="h5"
            component="p"
            sx={{
              lineHeight: 1.4,
              fontWeight: 700,
              fontSize: { xs: "18px", sm: "2vw", md: "30px" },
              mb: "7px",
            }}
          >
            {nav.name}
          </Typography>
          <Typography
            variant="default"
            component="p"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "12", sm: "1.5vw", md: "16px" },
            }}
          >
            {nav.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    );
  };

  const StandartCard = ({ nav }) => {
    return (
      <Card
        sx={{
          borderRadius: { xs: "11px", sm: "22px" },
          boxShadow: " 0px 20px 75px rgba(56, 118, 180, 0.27)",
          color: "#404040",
        }}
      >
        <CardActions nav={nav} />
      </Card>
    );
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{ margin: "auto", p: "0 24px 24px 0" }}
          alignItems="stretch"
        >
          {panelRouting.map((nav) => (
            <Grid key={nav.name} item xs={12} sm={6}>
              {nav.alt === "Rocket" ? (
                <BlueCard nav={nav} />
              ) : (
                <StandartCard nav={nav} />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
