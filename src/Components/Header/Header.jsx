import React, { useState } from "react";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { Collapse, Divider, Drawer } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Redux/Action/Action";
import "./Header.css";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const Header = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);
  const [expandFollowUp, setExpandFollowUp] = useState(false);
  const [expandProduct, setExpandProduct] = useState(false);
  const [expandCustomer, setExpandCustomer] = useState(false);
  const [expandInvoice, setExpandInvoice] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [isHover, setIsHover] = useState(false);
  // const auth = sessionStorage.getItem("accessToken");
  const boxStyle = {
    backgroundColor: isHover ? "rgb(0, 191, 255)" : "rgb(0, 191, 255)",
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const logout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
  };
  return (
    <div>
      <CssBaseline />
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
          {/* Products */}
          <ListItem button onClick={() => setExpandProduct(!expandProduct)} style={{ width: 300 }}>
            {/* <ListItemIcon style={menuItemIcon}></ListItemIcon> */}
            <ListItemText primary="Products" />
            {expandProduct ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandProduct} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-colors"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Colors" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-brand"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Brand" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-basic-unit"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Basic Unit" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-unit"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Unit" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-packing-unit"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Packing Unit" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-description"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Description" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-product-code"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Product Code" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-consumable"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Consumable" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-finish-goods"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Finish Goods" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-raw-materials"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Raw Materials" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-price-list"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Price List" />
              </ListItem>
            </List>
          </Collapse>
          {/* Leads */}
          <ListItem button onClick={() => setExpand(!expand)} style={{ width: 300 }}>
            <ListItemText primary="Leads" />
            {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expand} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/leads/view-lead"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Lead" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/leads/view-assignedto"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Assigned To" />
              </ListItem>
              <ListItem
                button
                onClick={() => setExpandFollowUp(!expandFollowUp)}
                style={{ width: 300 }}
              >
                <ListItemText inset primary="FollowUp" />
                {expandFollowUp ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandFollowUp} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-today-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText inset primary="Today FollowUp" />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-pending-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText inset primary="Pending FollowUp" />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-upcoming-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText inset primary="Upcoming FollowUp" />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </Collapse>
          {/* Customer */}
          <ListItem button onClick={() => setExpandCustomer(!expandCustomer)} style={{ width: 300 }}>
            <ListItemText primary="Customer" />
            {expandCustomer ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandCustomer} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/customers/company-details"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Company Details" />
              </ListItem>
            </List>
          </Collapse>
              {/* Invoice  */}
              <ListItem button onClick={() => setExpandInvoice(!expandInvoice)} style={{ width: 300 }}>
            <ListItemText primary="Invoice" />
            {expandInvoice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandInvoice} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/seller-account"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Seller Account" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Customer Performa Invoice" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/leads-performa-invoice"
                style={{ width: 300 }}
              >
                <ListItemText inset primary="Leads Performa Invoice" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
      <AppBar position="fixed" color="primary" className="not-scrolled">
        <Toolbar>
          {auth.user && (
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
          )}
          <Typography variant="h6" style={{ marginRight: "auto" }}>
            Bold-SoftMation
          </Typography>
          <>
            {!auth.user ? (
              <>
                <Button
                  {...{
                    color: "inherit",
                    to: "/login",
                    component: RouterLink,
                  }}
                  style={{
                    ...boxStyle,
                    fontFamily: "Open Sans; sans-serif",
                    fontWeight: "bold",
                    size: "18px",
                    marginLeft: "38px",
                  }}
                  color="inherit"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Login
                </Button>
                <Button
                  {...{
                    color: "inherit",
                    to: "/signup",
                    component: RouterLink,
                  }}
                  style={{
                    ...boxStyle,

                    fontFamily: "Open Sans; sans-serif",
                    fontWeight: "bold",
                    size: "18px",
                    marginLeft: "38px",
                  }}
                  className="menuButton"
                  color="inherit"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Signup
                </Button>
              </>
            ) : (
              <Button
                {...{
                  color: "inherit",
                  to: "/",
                  component: RouterLink,
                }}
                style={{
                  ...boxStyle,
                  fontFamily: "Open Sans; sans-serif",
                  fontWeight: "bold",
                  size: "18px",
                  marginLeft: "38px",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                color="inherit"
                onClick={logout}
              >
                Logout
              </Button>
            )}
          </>
        </Toolbar>
      </AppBar>
    </div>
  );
};
