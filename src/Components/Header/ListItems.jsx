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
import CallIcon from "@mui/icons-material/Call";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FactoryIcon from "@mui/icons-material/Factory";
import BookIcon from "@mui/icons-material/Book";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
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
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  return (
    <div>
      {userData.is_staff === true ? (
        <>
          {/* Seller Account */}
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
              <CallIcon />
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
              <PeopleAltIcon />
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
              <PaymentIcon />
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
              <ReceiptIcon />
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
              <FactoryIcon />
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
              <BookIcon />
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
              <TransferWithinAStationIcon />
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
      ) : (
        <>
          {userData.groups.toString() === "Factory-Mumbai-OrderBook" ||
          userData.groups.toString() === "Factory-Delhi-OrderBook" ||
          userData.groups.toString() === "Factory-Mumbai-Dispatch" ||
          userData.groups.toString() === "Factory-Delhi-Dispatch" ||
          userData.groups.toString() === "Customer Service" ? (
            <>
              {userData.groups.toString() !== "Customer Service" ? (
                <>
                  {userData.groups.toString() === "Factory-Mumbai-OrderBook" ||
                  userData.groups.toString() === "Factory-Delhi-OrderBook" ? (
                    // userData.groups.toString() !== "Factory-Delhi-Dispatch" ||
                    // userData.groups.toString() !== "Factory-Mumbai-Dispatch" ? (
                    <>
                      {/* Order book */}
                      <ListItem
                        button
                        onClick={() => setExpandOrderBook(!expandOrderBook)}
                        style={{ width: 300 }}
                      >
                        <ListItemIcon>
                          <BookIcon />
                        </ListItemIcon>
                        <ListItemText primary="Order Book" />
                        {expandOrderBook ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </ListItem>
                      <Collapse
                        in={expandOrderBook}
                        timeout="auto"
                        unmountOnExit
                      >
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
                  ) : (
                    <>
                      {/* Dispatch */}
                      <ListItem
                        button
                        onClick={() => setDispatchDetails(!dispatchDetails)}
                        style={{ width: 300 }}
                      >
                        <ListItemIcon>
                          <TransferWithinAStationIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dispatch" />
                        {dispatchDetails ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </ListItem>

                      <Collapse
                        in={dispatchDetails}
                        timeout="auto"
                        unmountOnExit
                      >
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
                </>
              ) : (
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
                        <CallIcon />
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
                        {expandFollowUp ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </ListItem>
                      <Collapse
                        in={expandFollowUp}
                        timeout="auto"
                        unmountOnExit
                      >
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
                      <PeopleAltIcon />
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
                    onClick={() =>
                      setExpandProformaInvoice(!expandProformaInvoice)
                    }
                    style={{ width: 300 }}
                  >
                    <ListItemIcon>
                      <PaymentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Proforma Invoice" />
                    {expandProformaInvoice ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItem>
                  <Collapse
                    in={expandProformaInvoice}
                    timeout="auto"
                    unmountOnExit
                  >
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
                      <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sales Invoice" />
                    {expandSalesInvoice ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItem>
                  <Collapse
                    in={expandSalesInvoice}
                    timeout="auto"
                    unmountOnExit
                  >
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
                        <FactoryIcon />
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
                      <BookIcon />
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
                      <TransferWithinAStationIcon />
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
            </>
          ) : (
            <>
              {/* Products */}
              {userData.groups.toString() !== "Sales" && (
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
              )}

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
                    <CallIcon />
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
                  <PeopleAltIcon />
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
                  <PaymentIcon />
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
                  <ReceiptIcon />
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
                    <FactoryIcon />
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
                  <BookIcon />
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
                  <TransferWithinAStationIcon />
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
        </>
      )}
    </div>
  );
};
