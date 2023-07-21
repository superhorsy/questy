"use client"

import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Button, Box, TextField } from "@mui/material";
import { registration } from "@actions/actions";
import { Loader } from "@components/Loader/loader";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
    const t = useTranslations("common");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const { isLoading } = useSelector((state) => state.authReducer)
    const dispatch = useDispatch();
    const router = useRouter();

    const sendData = (event) => {
        event.preventDefault();

        dispatch(registration({
            first_name: firstName,
            last_name: lastName,
            nickname: nickname,
            password: pass,
            email: email,
        }))

        setFirstName('');
        setLastName('');
        setEmail('');
        setNickname('');
        setPass('');
        setPassConfirm('');
        router.push('/signin')
    }

    const isEmptyField = !firstName || !lastName || !email || !nickname || !pass || !passConfirm;
    const isPassMatched = passConfirm === pass;


    return (
        <div className="pageContainer">

            <div className="mainContainer">

                <h1 className="title">{t("registration")}</h1>
                {!isLoading ?
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
                                id="outlined-basic-firstname"
                                label={t("user_name")}
                                variant="outlined"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                required
                                fullWidth
                                sx={{ mb: { xs: 3, sm: 4 } }}
                                id="outlined-basic-lastname"
                                label={t("user_lastname")}
                                variant="outlined"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                required
                                fullWidth
                                sx={{ mb: { xs: 3, sm: 4 } }}
                                id="outlined-basic-email"
                                type="email"
                                label={t("your_email")}
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                required
                                fullWidth
                                sx={{ mb: { xs: 3, sm: 4 } }}
                                id="outlined-basic-nickname"
                                label={t("user_nickname")}
                                variant="outlined"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            <TextField
                                required
                                fullWidth
                                sx={{ mb: { xs: 3, sm: 4 } }}
                                id="outlined-basic-password"
                                type="password"
                                label={t("password")}
                                variant="outlined"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                            />
                            <TextField
                                error={!isPassMatched && Boolean(passConfirm)}
                                required
                                fullWidth
                                sx={{ mb: { xs: 3, sm: 4 } }}
                                id="outlined-basic-password-confirm"
                                type="password"
                                label={t("confirm_password")}
                                variant="outlined"
                                value={passConfirm}
                                onChange={(e) => setPassConfirm(e.target.value)}
                            />
                            <div>
                                <Button
                                    fullWidth
                                    type="submit"
                                    sx={{ mb: { xs: 4, sm: 6 } }}
                                    variant="contained"
                                    size="large"
                                    disabled={isEmptyField || !isPassMatched}
                                >{t("sign_up")}
                                </Button>
                                <div>
                                    <span>{t("have_account")} </span>
                                    <Link href="/signin">{t("sign_in")}</Link>
                                </div>
                            </div>
                        </div>
                    </Box>
                    :
                    <Loader />}
            </div>
        </div>
    )
};

export default SignUpPage;