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

export const ListItems = (props) => {
  const { setOpen } = props;
  const [expand, setExpand] = useState(false);
  const [expandDashboard, setExpandDashboard] = useState(false);
  const [expandFollowUp, setExpandFollowUp] = useState(false);
  const [expandProduct, setExpandProduct] = useState(false);
  const [expandCustomer, setExpandCustomer] = useState(false);
  const [expandProformaInvoice, setExpandProformaInvoice] = useState(false);
  const [expandSalesInvoice, setExpandSalesInvoice] = useState(false);
  const [expandOrderBook, setExpandOrderBook] = useState(false);
  const [sellerAccount, setSellerAccount] = useState(false);
  const [dispatchDetails, setDispatchDetails] = useState(false);
  const [expandInventory, setExpandInventory] = useState(false);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  return (
    <div>
      {/* Staff */}
      {userData.is_staff === true ? (
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
            <ListItemText primary="Dashboard Details" />
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
                  primary="Dasboard"
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
                to="/leads/view-lead"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Lead"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/leads/view-assignedto"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Assigned To"
                />
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
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Today FollowUp"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-pending-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Pending FollowUp"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-upcoming-followup"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Upcoming FollowUp"
                    />
                  </ListItem>
                </List>
              </Collapse>
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
                  primary="Company Details"
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
                to="/invoice/performa-invoice"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Customer Performa Invoice"
                />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/invoice/leads-performa-invoice"
                style={{ width: 300 }}
              >
                <ListItemText
                  component={Button}
                  onClick={() => setOpen(false)}
                  inset
                  primary="Leads Performa Invoice"
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
          {/* Seller Account */}
          <ListItem
            button
            onClick={() => setSellerAccount(!sellerAccount)}
            style={{ width: 300 }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Seller Account Details" />
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
            </List>
          </Collapse>
        </>
      ) : (
        <>
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
                    to="/leads/view-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Lead"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-assignedto"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Assigned To"
                    />
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
                        <ListItemText
                          component={Button}
                          onClick={() => setOpen(false)}
                          inset
                          primary="Today FollowUp"
                        />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/leads/view-pending-followup"
                        style={{ width: 300 }}
                      >
                        <ListItemText
                          component={Button}
                          onClick={() => setOpen(false)}
                          inset
                          primary="Pending FollowUp"
                        />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/leads/view-upcoming-followup"
                        style={{ width: 300 }}
                      >
                        <ListItemText
                          component={Button}
                          onClick={() => setOpen(false)}
                          inset
                          primary="Upcoming FollowUp"
                        />
                      </ListItem>
                    </List>
                  </Collapse>
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
                      primary="Company Details"
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
                    to="/invoice/performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Performa Invoice"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/leads-performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Leads Performa Invoice"
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
                  <ListItemText primary="Seller Account Details" />
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
                </List>
              </Collapse>
            </>
          )}

          {/* sales  */}
          {userData.groups.includes("Sales") && (
            <>
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
                    to="/leads/view-lead"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Lead"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/leads/view-assignedto"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Assigned To"
                    />
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
                        <ListItemText
                          component={Button}
                          onClick={() => setOpen(false)}
                          inset
                          primary="Today FollowUp"
                        />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/leads/view-pending-followup"
                        style={{ width: 300 }}
                      >
                        <ListItemText
                          component={Button}
                          onClick={() => setOpen(false)}
                          inset
                          primary="Pending FollowUp"
                        />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/leads/view-upcoming-followup"
                        style={{ width: 300 }}
                      >
                        <ListItemText
                          component={Button}
                          onClick={() => setOpen(false)}
                          inset
                          primary="Upcoming FollowUp"
                        />
                      </ListItem>
                    </List>
                  </Collapse>
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
                      primary="Company Details"
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
                    to="/invoice/performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Performa Invoice"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/leads-performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Leads Performa Invoice"
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
            </>
          )}

          {/* accounts */}
          {userData.groups.includes("Accounts") && (
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
                      primary="Company Details"
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
                    to="/invoice/performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Customer Performa Invoice"
                    />
                  </ListItem>
                  <ListItem
                    button
                    component={RouterLink}
                    to="/invoice/leads-performa-invoice"
                    style={{ width: 300 }}
                  >
                    <ListItemText
                      component={Button}
                      onClick={() => setOpen(false)}
                      inset
                      primary="Leads Performa Invoice"
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
              {/* Seller Account */}

              <ListItem
                button
                onClick={() => setSellerAccount(!sellerAccount)}
                style={{ width: 300 }}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Seller Account Details" />
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
                </List>
              </Collapse>
            </>
          )}
        </>
      )}
    </div>
  );
};
