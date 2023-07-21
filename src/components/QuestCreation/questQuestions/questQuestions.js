import React from "react";
import { useRouter, useParams } from "next/navigation";
import {Box, Button} from "@mui/material";
import {useTranslations} from 'next-intl';

export const QuestQuestions = () => {
  const questId = useParams().questId
  const t = useTranslations("createSteps");
  const router = useRouter();

  return (
    <Box
      component="div"
      sx={{
        m: "0 auto",
        mb: { xs: 2, sm: 3 },
        textAlign: "center",
        width: { xs: 1 / 1, sm: 400 },
      }}
    >
      <Button
        fullWidth
        variant="contained"
        size="medium"
        sx={{ mt: 4, py: 2, mb: 1 }}
        onClick={() =>
          router.push(`/panel/create-quest/${questId}/create-step/text-step/`)
        }
      >
        {t("text_task.question")}
      </Button>
      <Button
        fullWidth
        variant="contained"
        size="medium"
        sx={{ mt: 4, py: 2, mb: 1 }}
        onClick={() =>
          router.push(`/panel/create-quest/${questId}/create-step/image-step/`)
        }
      >
        {t("img_task.question")}
      </Button>
      <Button
        fullWidth
        variant="contained"
        size="medium"
        sx={{ mt: 4, py: 2, mb: 1 }}
        onClick={() =>
          router.push(`/panel/create-quest/${questId}/create-step/qr-step/`)
        }
      >
        {t("qr_task.question")}
      </Button>
      <Button
        fullWidth
        variant="contained"
        size="medium"
        sx={{ mt: 4, py: 2, mb: 1 }}
        onClick={() =>
          router.push(`/panel/create-quest/${questId}/create-step/audio-step/`)
        }
      >
        {t("audio_task.question")}
      </Button>
    </Box>
  );
};
