"use client";

import {Box, Button, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Link from 'next/link';
// @ts-ignore
import {registration} from "@actions/actions";
import styledEmotion from "@emotion/styled";
import {useRouter} from "next/navigation";
import {useTranslations} from 'next-intl';

const StyledLink = styledEmotion(Link)`
  color: #3595F3;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  @media(max-width: 600px){
    font-size: 12px;
  }
`;

const Login = () => {
    const t = useTranslations("common");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState("");
    const [passConfirm, setPassConfirm] = useState('');
    // @ts-ignore
    const {isAuth} = useSelector((state) => state.authReducer);
    const router = useRouter();
    const dispatch = useDispatch();
    const isEmptyField = !email || !password || !nickname || !passConfirm;
    const isPassMatched = passConfirm === password;

    const sendData = (event) => {
        // @ts-ignore
        dispatch(registration({password, email, nickname}));
        event.preventDefault();
    };

    useEffect(() => {
        if (isAuth) {
            router.push("/panel");
        }
    }, [isAuth, router]);

    return (
        <Box sx={{width: "100%", maxWidth: {xs: "300px", sm: "367px"}}}>
            <h2 className="newTitle">{t("registration")}</h2>
            <Box
                component="form"
                sx={{
                    m: "0 auto",
                    textAlign: "center",
                    width: 1,
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: {xs: "300px", sm: "367px"},
                }}
                noValidate={false}
                autoComplete="off"
                onSubmit={sendData}
            >
                <TextField
                    required
                    size="small"
                    sx={{mb: {xs: 4}, width: 1}}
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
                    sx={{mb: {xs: 3, sm: 4}}}
                    id="outlined-basic-nickname"
                    label={t("user_nickname")}
                    variant="outlined"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <TextField
                    required
                    size="small"
                    sx={{mb: {xs: 4}, width: 1}}
                    id="outlined-basic-password"
                    label={t("password")}
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    error={!isPassMatched && Boolean(passConfirm)}
                    required
                    fullWidth
                    sx={{mb: {xs: 3, sm: 4}}}
                    id="outlined-basic-password-confirm"
                    type="password"
                    label={t("confirm_password")}
                    variant="outlined"
                    value={passConfirm}
                    onChange={(e) => setPassConfirm(e.target.value)}
                />
                <Box
                    sx={{
                        position: "relative",
                        width: 1,
                        display: "flex",
                        flexDirection: {xs: "column", sm: "row"},
                        justifyContent: {xs: "center", sm: "space-between"},
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: {xs: 1, sm: "129px"},
                            maxWidth: {xs: "300px", sm: "129px"},
                            mb: {xs: "37px", sm: 0},
                        }}
                    >
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                borderRadius: "100px",
                                textTransform: "none",
                                backgroundColor: "#3595F3",
                            }}
                            variant="contained"
                            disabled={isEmptyField}
                        >
                            {t("sign_up")}
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            width: {xs: "50%", sm: "auto"},
                            display: {xs: "none", sm: "block"},
                            fontSize: "14px",
                            color: "#B3ACBC",
                        }}
                    >
                        <StyledLink href="/">{t("have_account")}</StyledLink>
                    </Box>
                </Box>
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        mt: {xs: 0, sm: "30px"},*/}
                {/*        width: 1,*/}

                {/*        display: {xs: "flex", sm: "block"},*/}
                {/*        justifyContent: "space-between",*/}
                {/*        textAlign: "start",*/}
                {/*        position: "relative",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <StyledLink href="/restore">{t("forgot_password")}</StyledLink>*/}
                {/*    <Box*/}
                {/*        sx={{*/}
                {/*            display: {xs: "block", sm: "none"},*/}
                {/*            fontSize: {xs: "12px", sm: "14px"},*/}
                {/*            color: "#B3ACBC",*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        {t("no_account")}*/}
                {/*        <StyledLink href="/?signup=true">{t("sign_up")}</StyledLink>*/}
                {/*    </Box>*/}
                {/*</Box>*/}
            </Box>
        </Box>
    );
};

export default Login;
