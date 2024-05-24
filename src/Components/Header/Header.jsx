import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  CssBaseline,
  Divider,
  Drawer,
  MenuItem,
  Badge,
  // Menu,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { logoutUser } from "../../Redux/Action/Action";
import "./Header.css";
import { ListItems } from "./ListItems";
import TaskService from "../../services/TaskService";
import TaskPopup from "./TaskPopup";
import { Popup } from "../Popup";

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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const auth = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [task, setTask] = useState([]);
  const ProfileName = auth.profile ? auth.profile : [];
  const [popupOpen, setPopupOpen] = useState(false);

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleBellClick = () => {
    setPopupOpen(true);
  };

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
    navigate("/"); // Navigate to home page after logout
  };

  useEffect(() => {
    if (auth.user) getAllTaskDetails();
  }, [auth.user]);

  const getAllTaskDetails = async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllTaskData("all");
      setTask(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
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
          <ListItems setOpen={setOpen} />
        </List>
      </Drawer>
      {/* Header */}
      {auth.user && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#006ba1",
            height: { xs: "40px", sm: "54px" },
          }}
          className="not-scrolled"
        >
          <Toolbar sx={{ minHeight: { xs: "40px", sm: "54px" } }}>
            <IconButton
              edge="start"
              sx={{
                color: "inherit",
                marginLeft: { xs: "0px", sm: "38px" }, // Adjust marginLeft for smaller screens
                "& .MuiSvgIcon-root": {
                  // Adjusting icon sizes directly
                  fontSize: { xs: "1.2rem", sm: "1.5rem" }, // Adjust based on your needs
                },
              }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                marginRight: "auto",
                fontSize: { xs: "0.75rem", sm: "1rem" }, // Adjust font size for responsiveness
              }}
            >
              Bold-SoftMation
            </Typography>
            <>
              {/* Other Icons */}
              <IconButton color="inherit" onClick={handleBellClick}>
                <Badge badgeContent={task.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="false"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  "& span": {
                    // Adjusting span styles directly
                    marginRight: "auto",
                    fontSize: { xs: "0.75rem", sm: "1rem" }, // Adjust font size for responsiveness
                  },
                }}
              >
                <span>
                  {ProfileName.first_name} {ProfileName.last_name}
                </span>
                <ExpandMoreIcon />
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

      <Popup
        openPopup={popupOpen}
        setOpenPopup={setPopupOpen}
        title="Notifications"
        maxWidth="md"
      >
        <TaskPopup tasks={task} closePopup={closePopup} />
      </Popup>
    </div>
  );
};
