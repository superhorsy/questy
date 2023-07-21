import {
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";

import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import React from "react";
import {useTranslations} from 'next-intl';

;

export const MainFooter = () => {
  const t = useTranslations("common");
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "myfooter.main",
        position: "relative",
        zIndex: "2",
        boxSizing: "border-box",
        p: { xs: "27px 30px", sm: 0 },
      }}
    >
      <Box
        component="footer"
        sx={{
          backgroundColor: "myfooter.main",
          boxShadow: "none",
          minHeight: "72px",
        }}
      >
        <Toolbar
          sx={{
            boxSizing: "border-box",
            maxWidth: "md",
            margin: "0 auto",
            width: 1,
            p: 0,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontSize: { xs: "12px" },
              fontWeight: 400,
              lineHeight: "140%",
              color: "myfooter.text",
              order: { xs: 2, sm: 1 },
            }}
          >
            {t("copyright")}
          </Typography>
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" }, order: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              order: { xs: 1, sm: 3 },
              mb: { xs: "18px", sm: 0 },
            }}
          >
            <Button
              key="Email"
              component="a"
              variant="contained"
              startIcon={<MailOutlinedIcon />}
              sx={{
                textTransform: "none",
                padding: "10px 20px",
                background: "#E9F2FB",
                borderRadius: "100px",
                color: "myfooter.text",
                boxShadow: "none",
                fontSize: { xs: "12px" },
                fontWeight: 400,
                lineHeight: "140%",
                width: { xs: " 300px", sm: "122px" },
              }}
              href="mailto:no-reply@questy.fun"
              aria-label="mail"
            >
              {t("help")}
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </Box>
  );
};
