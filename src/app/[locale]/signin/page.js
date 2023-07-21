"use client";

import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

import Link from 'next/link';
import { login } from "@actions/actions";
import { useTranslations } from "next-intl";
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const t = useTranslations("common");
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { isAuth } = useSelector(state => state.authReducer)
  const router = useRouter();
  const dispatch = useDispatch();
  const isEmptyField = !email || !pass;

  const sendData = (event) => {

    dispatch(login({ password: pass, email }));
    event.preventDefault();
  };

  useEffect(() => {
    if (isAuth) {
      router.push("/panel")
    }
  }, [isAuth])

  return (
    <div className="pageContainer">
      <div className="mainContainer">
        <h1 className="title">{t("authorization")}</h1>
        <Box
          component="form"
          sx={{
            m: '0 auto',
            textAlign: "center",
            width: { xs: 1 / 1, sm: 367 },
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
              id="outlined-basic-email"
              label={t("your_email")}
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              fullWidth
              sx={{ mb: { xs: 3, sm: 4 } }}
              id="outlined-basic-password"
              label={t("password")}
              type="password"
              variant="outlined"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <div>
              <Button
                fullWidth
                type="submit"
                sx={{ mb: { xs: 4, sm: 6 } }}
                variant="contained"
                size="large"
                disabled={isEmptyField}
              >{t("sign_in")}
              </Button>
              <div>
                <span>{t("no_account")} </span>
                <Link href="/signup"> {t("sign_up")}</Link>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </div>
  )
};

export default LoginPage;
