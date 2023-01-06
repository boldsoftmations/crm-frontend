import { Collapse, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from 'react'

export const ListItems = () => {
    const [expand, setExpand] = useState(false);
    const [expandFollowUp, setExpandFollowUp] = useState(false);
    const [expandProduct, setExpandProduct] = useState(false);
    const [expandCustomer, setExpandCustomer] = useState(false);
    const [expandInvoice, setExpandInvoice] = useState(false);
    const [expandOrderBook, setExpandOrderBook] = useState(false);
    const [sellerAccount, setSellerAccount] = useState(false);
  return (
    <div> {/* Products */}
    <ListItem
      button
      onClick={() => setExpandProduct(!expandProduct)}
      style={{ width: 300 }}
    >
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
    <ListItem
      button
      onClick={() => setExpand(!expand)}
      style={{ width: 300 }}
    >
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
    <ListItem
      button
      onClick={() => setExpandCustomer(!expandCustomer)}
      style={{ width: 300 }}
    >
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
    <ListItem
      button
      onClick={() => setExpandInvoice(!expandInvoice)}
      style={{ width: 300 }}
    >
      <ListItemText primary="Invoice" />
      {expandInvoice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </ListItem>
    <Collapse in={expandInvoice} timeout="auto" unmountOnExit>
      <Divider />
      <List component="div" disablePadding>
        {/* <ListItem
          button
          component={RouterLink}
          to="/invoice/seller-account"
          style={{ width: 300 }}
        >
          <ListItemText inset primary="Seller Account" />
        </ListItem> */}
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
        <ListItem
          button
          component={RouterLink}
          to="/invoice/sales-invoice"
          style={{ width: 300 }}
        >
          <ListItemText inset primary="Sales Invoice" />
        </ListItem>
      </List>
    </Collapse>
    {/* Seller Account */}
    <ListItem
      button
      onClick={() => setSellerAccount(!sellerAccount)}
      style={{ width: 300 }}
    >
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
          <ListItemText inset primary="Seller Account" />
        </ListItem>
      </List>
    </Collapse>
    {/* Order book */}
    <ListItem
      button
      onClick={() => setExpandOrderBook(!expandOrderBook)}
      style={{ width: 300 }}
    >
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
          <ListItemText inset primary="Customer Wise Order Book" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="/invoice/product-order-book"
          style={{ width: 300 }}
        >
          <ListItemText inset primary="Product Wise Order Book" />
        </ListItem>
      </List>
    </Collapse></div>
  )
}
