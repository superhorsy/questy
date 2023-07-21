"use client";

import React, { useState } from 'react';
import { Box, TextField, Button } from "@mui/material";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const PassRecoveryPage = () => {
  const t = useTranslations("common");
  const [email, setEmail] = useState('');

  const isEmptyField = !email;

  const sendData = (event) => {
    event.preventDefault();
    // Пока что отправляем в консоль
    console.log(
      {
        email: email
      }
    )
  }

  return (
    <div className="pageContainer">
      <div className="mainContainer">
        <h1 className="title">Восстановить пароль</h1>
        <Box
          component="form"
          sx={{
            m: '0 auto',
            textAlign: "center",
            width: { xs: 1 / 1, sm: 500 },
          }}
          noValidate={false}
          autoComplete="off"
          onSubmit={sendData}
        >
          <div>
            <TextField
              required
              fullWidth
              sx={{ mb: { xs: 3, sm: 4 } }}
              id="outlined-basic"
              label="Ваш email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <Button
                fullWidth
                type="submit"
                sx={{ mb: { xs: 4, sm: 6 } }}
                size="large"
                variant="contained"
                disabled={isEmptyField}
              >{t("restore_password")}
              </Button>
              <div>
                <span>{t("no_account")} </span>
                <Link href="/signup">{t("sign_in")}</Link>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default PassRecoveryPage;