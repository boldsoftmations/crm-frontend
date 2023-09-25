import {
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";

export const ListItems = (props) => {
  const { setOpen } = props;
  const [expand, setExpand] = useState(false);
  const [expandDashboard, setExpandDashboard] = useState(false);
  const [expandProduct, setExpandProduct] = useState(false);
  const [expandCustomer, setExpandCustomer] = useState(false);
  const [expandProformaInvoice, setExpandProformaInvoice] = useState(false);
  const [expandSalesInvoice, setExpandSalesInvoice] = useState(false);
  const [expandOrderBook, setExpandOrderBook] = useState(false);
  const [sellerAccount, setSellerAccount] = useState(false);
  const [productForecast, setProductForecast] = useState(false);
  const [dispatchDetails, setDispatchDetails] = useState(false);
  const [expandInventory, setExpandInventory] = useState(false);
  const [expandFollowup, setExpandFollowup] = useState(false);
  const [expandTask, setExpandTask] = useState(false);
  const [expandUser, setExpandUser] = useState(false);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  return (
    <div>
      {/* Staff */}
      {userData.groups.includes("Director") ? (
        <>
          {/* Dashboard */}
          <ListItem
            button
            onClick={() => setExpandDashboard(!expandDashboard)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
            {expandDashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandDashboard} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/user/dashoard"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Reports"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/user/home"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Analytics"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Products */}
          <ListItem
            button
            onClick={() => setExpandProduct(!expandProduct)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
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
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Colors"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-brand"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Brand"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-basic-unit"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Basic Unit"
                />
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
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Packing Unit"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-description"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Description"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-product-code"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Product Code"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-consumable"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Consumable"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-finish-goods"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Finish Goods"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-raw-materials"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Raw Materials"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/products/view-price-list"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Price List"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Leads */}
          <ListItem
            button
            onClick={() => setExpand(!expand)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <AssignmentIndIcon />
            </ListItemIcon>
            <ListItemText primary="Leads" />
            {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expand} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/leads/new-lead"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="New Leads"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/leads/open-lead"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Opened Leads"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/leads/hot-lead"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Hot Leads"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/leads/closed-lead"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Dropped Leads"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/leads/duplicate-lead"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Duplicate Leads"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/leads/view-unassigned-lead"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Unassigned Leads"
                />
              </ListItem>
            </List>
          </Collapse>

          {/* Customer */}
          <ListItem
            button
            onClick={() => setExpandCustomer(!expandCustomer)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
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
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Customer"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/customers/unassigned-company-details"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Unassigned Customer"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/customers/incomplete-kyc-details"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Incomplete Kyc"
                />
              </ListItem>
            </List>
          </Collapse>

          {/* All Followup */}
          <ListItem
            button
            onClick={() => setExpandFollowup(!expandFollowup)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <FollowTheSignsIcon />
            </ListItemIcon>
            <ListItemText primary="Followup" />
            {expandFollowup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandFollowup} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Followup"
                />
              </ListItem>
            </List>
          </Collapse>
          {/*Proforma Invoice  */}
          <ListItem
            button
            onClick={() => setExpandProformaInvoice(!expandProformaInvoice)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText primary="Proforma Invoice" />
            {expandProformaInvoice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandProformaInvoice} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/approve-pi"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Approve PI"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/active-pi"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Active PI"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/all-performa-invoice"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="All PI"
                />
              </ListItem>
            </List>
          </Collapse>
          {/*Sales Invoice  */}
          <ListItem
            button
            onClick={() => setExpandSalesInvoice(!expandSalesInvoice)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Invoice" />
            {expandSalesInvoice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandSalesInvoice} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/sales-invoice"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Sales Invoice"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Forecast */}
          <ListItem
            button
            onClick={() => setProductForecast(!productForecast)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Forecast" />
            {productForecast ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={productForecast} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Forecast"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Seller Account */}
          <ListItem
            button
            onClick={() => setSellerAccount(!sellerAccount)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Seller Account" />
            {sellerAccount ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={sellerAccount} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/seller-account"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Seller Account"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Order book */}
          <ListItem
            button
            onClick={() => setExpandOrderBook(!expandOrderBook)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Order Book" />
            {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/customer-order-book"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Customer Wise Order Book"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/product-order-book"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Product Wise Order Book"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/pi-order-book"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="PI Wise Order Book"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Dispatch */}
          <ListItem
            button
            onClick={() => setDispatchDetails(!dispatchDetails)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="Dispatch" />
            {dispatchDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={dispatchDetails} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/dispatch/view-dispatch"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Pending Dispatch"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/dispatch/view-dispatched"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Dispatched"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/dispatch/view-sales-register"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Sales Register"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Inventory - stores  */}
          <ListItem
            button
            onClick={() => setExpandInventory(!expandInventory)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
            {expandInventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>

          <Collapse in={expandInventory} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-vendor"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Vendor"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-packing_list"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Packing List"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-grn"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="GRN"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-purchase-invoice"
                style={{ width: 300 }}
              >
                <ListItemText
                  inset
                  component={Button}
                  onClick={() => setOpen(false)}
                  primary="Purchase Invoice"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production-entry"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="ProductionEntry"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-material-requisition-form"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Material Requisition Form"
                />
              </ListItem>

              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-stores-inventory"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Stores Inventory"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-stores-inventory-cons"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Stores Inventory (Cons)"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production-inventory"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Production Inventory"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production-inventory-cons"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Production Inventory (Cons)"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-bill-of-materials"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Bill of Materials"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-material-transfer-note"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Material Transfer Note"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production-inventory-g&l"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Production Inventory (G&L)"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production-shortfall"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Production ShortFall"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-daily-production"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Daily Production Report"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-weekly-production"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Weekly Production Report"
                />
              </ListItem>
            </List>
          </Collapse>

          {/* Tasks */}
          <ListItem
            button
            onClick={() => setExpandTask(!expandTask)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <AssignmentTurnedInIcon />
            </ListItemIcon>
            <ListItemText primary="Task" />
            {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>

          <Collapse in={expandTask} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Task"
                />
              </ListItem>
            </List>
          </Collapse>
          {/* Users */}
          <ListItem
            button
            onClick={() => setExpandUser(!expandUser)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
            {expandUser ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>

          <Collapse in={expandUser} timeout="auto" unmountOnExit>
            <Divider />
            <List component="div" disablePadding>
              <ListItem
                button
                component={RouterLink}
                to="/user/active-user"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Active Users"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/user/inactive-user"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="InActive Users"
                />
              </ListItem>
            </List>
          </Collapse>
        </>
      ) : (
        <>
          {/* Hr */}
          {userData.groups.includes("HR") && (
            <>
              {/* Users */}
              <ListItem
                button
                onClick={() => setExpandUser(!expandUser)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
                {expandUser ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandUser} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/user/active-user"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Active Users"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/user/inactive-user"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="InActive Users"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Tasks */}
              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}
          {/* Factory orderbook */}
          {(userData.groups.includes("Factory-Delhi-OrderBook") ||
            userData.groups.includes("Factory-Mumbai-OrderBook")) && (
            <>
              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/pi-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="PI Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* factory dispatch */}
          {(userData.groups.includes("Factory-Mumbai-Dispatch") ||
            userData.groups.includes("Factory-Delhi-Dispatch")) && (
            <>
              {/* Dispatch */}
              <ListItem
                button
                onClick={() => setDispatchDetails(!dispatchDetails)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
                {dispatchDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={dispatchDetails} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatch"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Pending Dispatch"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatched"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Dispatched"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* customer services */}
          {userData.groups.includes("Customer Service") && (
            <>
              <ListItem
                button
                onClick={() => setExpandProduct(!expandProduct)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Colors"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-brand"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Brand"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-basic-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Basic Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-packing-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Packing Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-description"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Description"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-product-code"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Code"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-consumable"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Consumable"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-finish-goods"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Finish Goods"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-raw-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Raw Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-price-list"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Price List"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Leads */}
              {userData.groups.toString() !== "Accounts" && (
                <ListItem
                  button
                  onClick={() => setExpand(!expand)}
                  style={{ width: 300 }}
                >
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Leads" />
                  {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
              )}
              <Collapse in={expand} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/new-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="New Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/open-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Open Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/hot-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Hot Leads"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Customer */}
              <ListItem
                button
                onClick={() => setExpandCustomer(!expandCustomer)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* All Followup */}
              <ListItem
                button
                onClick={() => setExpandFollowup(!expandFollowup)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
                {expandFollowup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandFollowup} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/followp/view-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Followup"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/*Proforma Invoice  */}
              <ListItem
                button
                onClick={() => setExpandProformaInvoice(!expandProformaInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Proforma Invoice" />
                {expandProformaInvoice ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse in={expandProformaInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/active-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Active PI"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/*Sales Invoice  */}
              <ListItem
                button
                onClick={() => setExpandSalesInvoice(!expandSalesInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Invoice" />
                {expandSalesInvoice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandSalesInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/sales-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Sales Invoice"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Forecast */}
              <ListItem
                button
                onClick={() => setProductForecast(!productForecast)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
                {productForecast ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={productForecast} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/forecast/view-product-forecast"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Forecast"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Seller Account */}
              {userData.groups.toString() !== "Sales" && (
                <ListItem
                  button
                  onClick={() => setSellerAccount(!sellerAccount)}
                  style={{ width: 300 }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Seller Account" />
                  {sellerAccount ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
              )}
              <Collapse in={sellerAccount} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/seller-account"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Seller Account"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Dispatch */}
              <ListItem
                button
                onClick={() => setDispatchDetails(!dispatchDetails)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
                {dispatchDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={dispatchDetails} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  {/* <ListItem
               button
               component={RouterLink}
               to="/dispatch/view-dispatch"
               style={{ width: 300 }}
             >
               <ListItemText inset primary="Peding Dispatch" />
             </ListItem> */}
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatched"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Dispatched"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-sales-register"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Sales Register"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* purchase */}
          {userData.groups.includes("Purchase") && (
            <>
              {/* For PURCHASE Role */}
              <ListItem
                button
                onClick={() => setExpandInventory(!expandInventory)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
                {expandInventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandInventory} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-packing_list"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Packing List"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-shortfall"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production ShortFall"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-stores-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Stores Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory (Cons)"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Forecast */}
              <ListItem
                button
                onClick={() => setProductForecast(!productForecast)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
                {productForecast ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={productForecast} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/forecast/view-product-forecast"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Forecast"
                    />
                  </ListItem>
                </List>
              </Collapse>
              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* stores */}
          {userData.groups.includes("Stores") && (
            <>
              {/* For STORES Role */}
              <ListItem
                button
                onClick={() => setExpandInventory(!expandInventory)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
                {expandInventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandInventory} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-grn"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="GRN"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-stores-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Stores Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-requisition-form"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Requisition Form"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-transfer-note"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Transfer Note"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-shortfall"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production ShortFall"
                    />
                  </ListItem>
                </List>
              </Collapse>
              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* stores */}
          {(userData.groups.includes("Stores Delhi") ||
            userData.groups.includes("Production Delhi")) && (
            <>
              {/* For STORES or PRODUCTION Delhi Role */}
              <ListItem
                button
                onClick={() => setExpandInventory(!expandInventory)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
                {expandInventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandInventory} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-grn"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="GRN"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-stores-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Stores Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-requisition-form"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Requisition Form"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-bill-of-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Bill of Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-entry"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="ProductionEntry"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-transfer-note"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Transfer Note"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-shortfall"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production ShortFall"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/pi-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="PI Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Dispatch */}
              <ListItem
                button
                onClick={() => setDispatchDetails(!dispatchDetails)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
                {dispatchDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={dispatchDetails} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatch"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Pending Dispatch"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatched"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Dispatched"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* production */}
          {userData.groups.includes("Production") && (
            <>
              {/* For PRODUCTION Role */}
              <ListItem
                button
                onClick={() => setExpandInventory(!expandInventory)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
                {expandInventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandInventory} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-requisition-form"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Requisition Form"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-bill-of-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Bill of Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-entry"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="ProductionEntry"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-transfer-note"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Transfer Note"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-shortfall"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production ShortFall"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* Sales Manager */}
          {userData.groups.includes("Sales Manager") && (
            <>
              {/* Dashboard */}
              <ListItem
                button
                onClick={() => setExpandDashboard(!expandDashboard)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                {expandDashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandDashboard} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/user/dashoard"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Reports"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/user/home"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Analytics"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Leads */}
              <ListItem
                button
                onClick={() => setExpand(!expand)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expand} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/new-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="New Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/open-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Opened Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/hot-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Hot Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/closed-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Dropped Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/duplicate-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Duplicate Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-unassigned-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unassigned Leads"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Customer */}
              <ListItem
                button
                onClick={() => setExpandCustomer(!expandCustomer)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/customers/unassigned-company-details"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unassigned Customer"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/customers/incomplete-kyc-details"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Incomplete Kyc"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* All Followup */}
              <ListItem
                button
                onClick={() => setExpandFollowup(!expandFollowup)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
                {expandFollowup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandFollowup} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/followp/view-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Followup"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/*Proforma Invoice  */}
              <ListItem
                button
                onClick={() => setExpandProformaInvoice(!expandProformaInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Proforma Invoice" />
                {expandProformaInvoice ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse in={expandProformaInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/approve-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Approve PI"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/active-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Active PI"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/all-performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="All PI"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Forecast */}
              <ListItem
                button
                onClick={() => setProductForecast(!productForecast)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
                {productForecast ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={productForecast} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/forecast/view-product-forecast"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Forecast"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Seller Account */}
              <ListItem
                button
                onClick={() => setSellerAccount(!sellerAccount)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Seller Account" />
                {sellerAccount ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={sellerAccount} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/seller-account"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Seller Account"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/pi-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="PI Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Dispatch */}
              <ListItem
                button
                onClick={() => setDispatchDetails(!dispatchDetails)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
                {dispatchDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={dispatchDetails} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatch"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Pending Dispatch"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatched"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Dispatched"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-sales-register"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Sales Register"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Tasks */}
              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* Sales Deputy Manager */}
          {userData.groups.includes("Sales Deputy Manager") && (
            <>
              {/* Dashboard */}
              <ListItem
                button
                onClick={() => setExpandDashboard(!expandDashboard)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                {expandDashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandDashboard} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/user/home"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Analytics"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Leads */}
              <ListItem
                button
                onClick={() => setExpand(!expand)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expand} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/new-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="New Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/open-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Opened Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/hot-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Hot Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/closed-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Dropped Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/duplicate-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Duplicate Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-unassigned-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unassigned Leads"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Customer */}
              <ListItem
                button
                onClick={() => setExpandCustomer(!expandCustomer)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/customers/incomplete-kyc-details"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Incomplete Kyc"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* All Followup */}
              <ListItem
                button
                onClick={() => setExpandFollowup(!expandFollowup)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
                {expandFollowup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandFollowup} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/followp/view-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Followup"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/*Proforma Invoice  */}
              <ListItem
                button
                onClick={() => setExpandProformaInvoice(!expandProformaInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Proforma Invoice" />
                {expandProformaInvoice ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse in={expandProformaInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/approve-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Approve PI"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/active-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Active PI"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/all-performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="All PI"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Forecast */}
              <ListItem
                button
                onClick={() => setProductForecast(!productForecast)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
                {productForecast ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={productForecast} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/forecast/view-product-forecast"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Forecast"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Seller Account */}
              <ListItem
                button
                onClick={() => setSellerAccount(!sellerAccount)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Seller Account" />
                {sellerAccount ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={sellerAccount} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/seller-account"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Seller Account"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/pi-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="PI Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Tasks */}
              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* Sales Executives */}
          {(userData.groups.includes("Sales Assistant Deputy Manager") ||
            userData.groups.includes("Sales Executive")) && (
            <>
              {/* Dashboard */}

              <ListItem
                button
                onClick={() => setExpandDashboard(!expandDashboard)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                {expandDashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandDashboard} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/user/home"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Analytics"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Leads */}

              <ListItem
                button
                onClick={() => setExpand(!expand)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expand} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/new-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="New Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/open-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Open Leads"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/hot-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Hot Leads"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Customer */}
              <ListItem
                button
                onClick={() => setExpandCustomer(!expandCustomer)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/customers/incomplete-kyc-details"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Incomplete Kyc"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* All Followup */}
              <ListItem
                button
                onClick={() => setExpandFollowup(!expandFollowup)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
                {expandFollowup ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandFollowup} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/followp/view-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Followup"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/*Proforma Invoice  */}
              <ListItem
                button
                onClick={() => setExpandProformaInvoice(!expandProformaInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Proforma Invoice" />
                {expandProformaInvoice ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse in={expandProformaInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/active-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Active PI"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Forecast */}
              <ListItem
                button
                onClick={() => setProductForecast(!productForecast)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
                {productForecast ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={productForecast} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/forecast/view-product-forecast"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Forecast"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/pi-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="PI Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Task */}
              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* accounts */}
          {userData.groups.includes("Accounts") && (
            <>
              {/* Dashboard */}
              <ListItem
                button
                onClick={() => setExpandDashboard(!expandDashboard)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
                {expandDashboard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandDashboard} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/user/dashoard"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Reports"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Products */}
              <ListItem
                button
                onClick={() => setExpandProduct(!expandProduct)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Colors"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-brand"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Brand"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-basic-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Basic Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-packing-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Packing Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-description"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Description"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-product-code"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Code"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-consumable"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Consumable"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-finish-goods"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Finish Goods"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-raw-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Raw Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-price-list"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Price List"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Customer */}
              <ListItem
                button
                onClick={() => setExpandCustomer(!expandCustomer)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/customers/unassigned-company-details"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unassigned Customer"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/customers/incomplete-kyc-details"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Incomplete Kyc"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/*Proforma Invoice  */}
              <ListItem
                button
                onClick={() => setExpandProformaInvoice(!expandProformaInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Proforma Invoice" />
                {expandProformaInvoice ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse in={expandProformaInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/approve-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Approve PI"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/active-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Active PI"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/all-performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="All PI"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/*Sales Invoice  */}
              <ListItem
                button
                onClick={() => setExpandSalesInvoice(!expandSalesInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Invoice" />
                {expandSalesInvoice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandSalesInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/sales-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Sales Invoice"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Forecast */}
              <ListItem
                button
                onClick={() => setProductForecast(!productForecast)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
                {productForecast ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={productForecast} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/forecast/view-product-forecast"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Forecast"
                    />
                  </ListItem>
                </List>
              </Collapse>
              {/* Seller Account */}
              <ListItem
                button
                onClick={() => setSellerAccount(!sellerAccount)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Seller Account" />
                {sellerAccount ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={sellerAccount} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/seller-account"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Seller Account"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/pi-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="PI Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Dispatch */}
              <ListItem
                button
                onClick={() => setDispatchDetails(!dispatchDetails)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
                {dispatchDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={dispatchDetails} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatch"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Pending Dispatch"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-dispatched"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Dispatched"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/dispatch/view-sales-register"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Sales Register"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Inventory */}
              <ListItem
                button
                onClick={() => setExpandInventory(!expandInventory)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
                {expandInventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandInventory} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-vendor"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Vendor"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-packing_list"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Packing List"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-grn"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="GRN"
                    />
                  </ListItem>

                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-entry"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="ProductionEntry"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-requisition-form"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Requisition Form"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-purchase-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      inset
                      component={Button}
                      onClick={() => setOpen(false)}
                      primary="Purchase Invoice"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-stores-inventory"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Stores Inventory"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-stores-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Stores Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-bill-of-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Bill of Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-transfer-note"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Transfer Note"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory-g&l"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory (G&L)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-shortfall"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production ShortFall"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-daily-production"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Daily Production Report"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-weekly-production"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Weekly Production Report"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* Accounts Billing Department*/}
          {userData.groups.includes("Accounts Billing Department") && (
            <>
              {/* Products */}
              <ListItem
                button
                onClick={() => setExpandProduct(!expandProduct)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Colors"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-brand"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Brand"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-basic-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Basic Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-packing-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Packing Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-description"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Description"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-product-code"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Code"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-consumable"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Consumable"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-finish-goods"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Finish Goods"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-raw-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Raw Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-price-list"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Price List"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Customer */}
              <ListItem
                button
                onClick={() => setExpandCustomer(!expandCustomer)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/*Proforma Invoice  */}
              <ListItem
                button
                onClick={() => setExpandProformaInvoice(!expandProformaInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Proforma Invoice" />
                {expandProformaInvoice ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItem>
              <Collapse in={expandProformaInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/approve-pi"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Approve PI"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/all-performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="All PI"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/*Sales Invoice  */}
              <ListItem
                button
                onClick={() => setExpandSalesInvoice(!expandSalesInvoice)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Invoice" />
                {expandSalesInvoice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandSalesInvoice} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/sales-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Sales Invoice"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Order book */}
              <ListItem
                button
                onClick={() => setExpandOrderBook(!expandOrderBook)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
                {expandOrderBook ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandOrderBook} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/customer-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/product-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Wise Order Book"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/pi-order-book"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="PI Wise Order Book"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {/* accounts */}
          {userData.groups.includes("Accounts Executive") && (
            <>
              {/* Products */}
              <ListItem
                button
                onClick={() => setExpandProduct(!expandProduct)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Colors"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-brand"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Brand"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-basic-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Basic Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-packing-unit"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Packing Unit"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-description"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Description"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-product-code"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Product Code"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-consumable"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Consumable"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-finish-goods"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Finish Goods"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-raw-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Raw Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/products/view-price-list"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Price List"
                    />
                  </ListItem>
                </List>
              </Collapse>

              {/* Inventory */}
              <ListItem
                button
                onClick={() => setExpandInventory(!expandInventory)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
                {expandInventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandInventory} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-vendor"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Vendor"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-purchase-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      inset
                      component={Button}
                      onClick={() => setOpen(false)}
                      primary="Purchase Invoice"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-stores-inventory"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Stores Inventory"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-stores-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Stores Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory-cons"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory (Cons)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-bill-of-materials"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Bill of Materials"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-material-transfer-note"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Material Transfer Note"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-production-inventory-g&l"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Production Inventory (G&L)"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-daily-production"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Daily Production Report"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/inventory/view-weekly-production"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Weekly Production Report"
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                onClick={() => setExpandTask(!expandTask)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
                {expandTask ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>

              <Collapse in={expandTask} timeout="auto" unmountOnExit>
                <Divider />
                <List component="div" disablePadding>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/task/view-task"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Task"
                    />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}
        </>
      )}
    </div>
  );
};
