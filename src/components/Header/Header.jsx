"use client";

import {
  AppBar,
  Avatar,
  Box,
  CardActionArea,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Image from 'next/image';
import { LangSwitcher } from "@components/LangSwitcher/langSwitcher";
import Logo from "@images/Logonew.png";
import { authSlice } from "@reducers/authSlice";
import { fetchUserProfile } from "@actions/actions";
import { useTranslations } from 'next-intl';

export const Header = () => {
  const t = useTranslations("common");

  const router = useRouter()
  const [anchorElUser, setAnchorElUser] = useState(false);
  const dispatch = useDispatch();

  const { isAuth } = useSelector((state) => state.authReducer);
  const { profile } = useSelector((state) => state.userProfileReducer);
  const { checkAuth, logOut } = authSlice.actions;

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchUserProfile());
    }
  }, [isAuth]);

  const handleLogout = () => {
    dispatch(logOut());
    router.push("/");
    handleCloseUserMenu();
  };

  const handleToMain = () => {
    router.push("/");
  };

  const handleToPanel = () => {
    router.push("/panel");
  };

  const goToProfile = () => {
    handleCloseUserMenu();
    router.push("/panel/profile");
  };

  const goToPanel = () => {
    handleCloseUserMenu();
    router.push("/panel");
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(false);
  };

  const userMenu = [
    {
      name: t("profile"),
      function: goToProfile,
      icon: <Settings />,
    },
    {
      name: t("panel"),
      function: goToPanel,
      icon: <DashboardIcon />,
    },
    {
      name: t("sign_out"),
      function: handleLogout,
      icon: <Logout />,
    },
  ];

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuth]);

  return (
    <>
      <AppBar
        color="header"
        sx={{
          boxShadow: "0px -1px 65px rgba(30, 109, 186, 0.1)",
          position: "sticky",
          top: 0
        }}
      >
        <Box sx={{ maxWidth: "960px", width: "100%", margin: "0 auto", p: " 0 30px", boxSizing: "border-box" }}>
          <Toolbar
            sx={{ justifyContent: "space-between", p: 0 }}
            disableGutters
          >
            <Box
              sx={{
                flexGrow: 1,
                maxWidth: "220px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ flexGrow: 1, maxWidth: "120px" }}>
                <CardActionArea onClick={isAuth ? handleToPanel : handleToMain}>
                  <Image priority src={Logo} alt="logo" />
                </CardActionArea>
              </Box>
              <LangSwitcher />
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {isAuth && (
                <>
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline-block" } }}>
                    {t("hello")},
                    {" " + profile?.first_name[0].toUpperCase() +
                      profile?.first_name.slice(1)}
                    👋🏻
                  </Box>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                    <Avatar
                      sx={{
                        fontSize: "16px",
                        width: "40px",
                        fontWeight: 400,
                        height: "40px",
                        backgroundColor: "header.avatarBg",
                      }}
                    >
                      {profile?.first_name[0].toUpperCase()}
                      {profile?.last_name[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {userMenu.map((nav) => (
                      <MenuItem onClick={nav.function} key={nav.name}>
                        <ListItemIcon>{nav.icon}</ListItemIcon>
                        {nav.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    </>
  );
};
