import * as React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";

export const TasksList = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}>
      <List>
        <ListItem disablePadding>
          <ListItemIcon>
            <TitleOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Текстовый вопрос" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <ImageOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Вопрос с картинкой" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <AudioFileOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Вопрос с аудио" />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <QrCode2OutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Вопрос с QR-кодом" />
        </ListItem>
      </List>
    </Box>
  );
};
