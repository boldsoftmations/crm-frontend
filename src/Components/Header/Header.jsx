import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  CssBaseline,
  Divider,
  Drawer,
  MenuItem,
  // Menu,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logoutUser } from "../../Redux/Action/Action";
import "./Header.css";
import { ListItems } from "./ListItems";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const Header = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const auth = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
  };

  return (
    <div>
      <CssBaseline />
      {/* sidebar */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          component="nav"
          style={{ width: "100%", marginBottom: "2em" }}
          disablePadding
        >
          <ListItems />
        </List>
      </Drawer>
      {/* Header */}
      {auth.user && (
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#006ba1" }}
          className="not-scrolled"
        >
          <Toolbar>
            <IconButton
              edge="start"
              style={{
                fontFamily: "Open Sans; sans-serif",
                fontWeight: "700px",
                size: "18px",
                marginLeft: "38px",
              }}
              color="inherit"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" style={{ marginRight: "auto" }}>
              Bold-SoftMation
            </Typography>
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="false"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                // anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={anchorEl}
                onClose={handleClose}
              >
                <MenuItem
                  component={RouterLink}
                  to={"/user/profile"}
                  onClick={handleClose}
                >
                  Profile
                </MenuItem>
                <MenuItem component={RouterLink} to={"/"} onClick={logout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
};
