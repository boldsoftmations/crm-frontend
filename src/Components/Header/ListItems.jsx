import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Dashboard as DashboardIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  HelpOutline as HelpOutlineIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  Factory as FactoryIcon,
  Business as BusinessIcon,
  WhatsApp as WhatsAppIcon,
  Assessment as AssessmentIcon,
  ShoppingCart as PurchaseIcon,
  ReportProblem as ComplaintIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
export const ListItems = ({ setOpen }) => {
  const { profile: userData } = useSelector((state) => state.auth);

  // Function to check if the user is in a specific group
  const isInGroups = (...groups) =>
    groups.some((g) => userData.groups.includes(g));

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [submenuOpen, setSubmenuOpen] = useState({
    master: false,
    invoice: false,
    accounts: false,
    inventory: false,
    production: false,
    customer_complaint: false,
    sales: false,
    purchase: false,
  });

  const handleSubmenuClick = (menu) =>
    setSubmenuOpen((prev) => ({ [menu]: !prev[menu] }));

  if (!userData || !userData.groups) {
    return <div>Loading...</div>;
  }

  const renderListItem = (to, icon, primaryText) => (
    <ListItem
      button
      component={RouterLink}
      to={to}
      style={{ width: 300 }}
      onClick={() => setOpen(false)}
      selected={isActive(to)}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={primaryText} />
    </ListItem>
  );

  const renderSubmenu = (menuKey, icon, primaryText, items) => (
    <>
      <ListItem button onClick={() => handleSubmenuClick(menuKey)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primaryText} />
        {submenuOpen[menuKey] ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={submenuOpen[menuKey]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map(({ to, text }, index) => (
            <ListItem
              button
              component={RouterLink}
              to={to}
              onClick={() => setOpen(false)}
              selected={isActive(to)}
              activeClassName="Mui-selected"
              sx={{ pl: 8 }}
              key={to}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );

  const menuItems = [
    // Director menus
    {
      condition: isInGroups("Director"),
      items: [
        renderListItem("/user/report", <AssessmentIcon />, "Report"),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
          { to: "/inventory/view-currency", text: "Currency Master" },
          { to: "/user/profile-tab", text: "Employees Master" },
          { to: "/hr-model/hr-master", text: "HR Master" },
          { to: "/master/factory", text: "Machine Master" },
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
          {
            to: "/county-state-city/master-tab",
            text: "Country Master",
          },
          {
            to: "/master/activity-list",
            text: "Master Activity",
          },
          {
            to: "/master/beat",
            text: "Beat Master",
          },
          { to: "lead/list-references", text: "Lead Master" },
        ]),

        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
          { to: "/inventory/physical", text: "Physical Inventory" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("accounts", <AttachMoneyIcon />, "Accounts", [
          { to: "/invoice/credit-debit-note", text: "Debit-Credit" },
          { to: "/products/view-price-list", text: "Price List" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
          { to: "/market-analysis/competitor", text: "Market Analysis" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),

        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),

        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),

        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderListItem(
          "/inventory/sales-return",
          <DescriptionIcon />,
          "Sales Return"
        ),

        renderListItem(
          "/master/customer-visit",
          <DirectionsRunIcon />,
          "Field Sales"
        ),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
        renderListItem(
          "/customers/whatsapp-tabs",
          <WhatsAppIcon />,
          "Whatsapp"
        ),
        renderListItem("/hr-model", <WorkIcon />, "Recruitment"),
      ],
    },
    // Hr menus
    {
      condition: isInGroups("HR"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          { to: "/hr-model/hr-master", text: "HR Master" },
        ]),
        renderListItem("/hr-model", <WorkIcon />, "Recruitment"),
      ],
    },

    //menus for Hr Recruitment
    {
      condition: isInGroups("HR Recruiter"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/hr-model/hr-master", text: "HR Master" },
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderListItem("/hr-model", <WorkIcon />, "Recruitment"),
      ],
    },

    // Store and Production menus
    {
      condition: isInGroups(
        "Stores",
        "Production",
        "Stores Delhi",
        "Production Delhi"
      ),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem(
          "/inventory/sales-return",
          <DescriptionIcon />,
          "Sales Return"
        ),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
      ],
    },

    //Factory Menus
    {
      condition: isInGroups(
        "Factory-Delhi-Dispatch",
        "Factory-Mumbai-Dispatch"
      ),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
      ],
    },

    //QA menus
    {
      condition: isInGroups("QA"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
      ],
    },

    //factory  orderbook Menus

    {
      condition: isInGroups(
        "Factory-Delhi-OrderBook",
        "Factory-Mumbai-OrderBook"
      ),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
      ],
    },
    //Factory Menus

    {
      condition: isInGroups(
        "Factory-Delhi-Dispatch",
        "Factory-Mumbai-Dispatch"
      ),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
      ],
    },
    // customer Service Menus

    {
      condition: isInGroups("Customer Service"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
        renderListItem(
          "/customers/whatsapp-tabs",
          <WhatsAppIcon />,
          "Whatsapp"
        ),
      ],
    },
    //Operations & Supply Chain Manager

    {
      condition: isInGroups("Operations & Supply Chain Manager"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
        ]),

        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
        ]),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),

        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderListItem(
          "/customers/whatsapp-tabs",
          <WhatsAppIcon />,
          "Whatsapp"
        ),
      ],
    },

    // Purchase Menus

    {
      condition: isInGroups("Purchase"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
          { to: "/inventory/physical", text: "Physical Inventory" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
        ]),
        renderListItem(
          "/inventory/view-currency",
          <AttachMoneyIcon />,
          "Currency"
        ),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
      ],
    },
    // Accounts Menus
    {
      condition: isInGroups("Accounts"),
      items: [
        renderListItem("/user/report", <AssessmentIcon />, "Report"),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
          { to: "/inventory/view-currency", text: "Currency Master" },
          { to: "/user/profile-tab", text: "Employees Master" },
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
          {
            to: "/county-state-city/master-tab",
            text: "Country Master",
          },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),
        renderSubmenu("accounts", <AttachMoneyIcon />, "Accounts", [
          { to: "/invoice/credit-debit-note", text: "Debit-Credit" },
          { to: "/products/view-price-list", text: "Price List" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
          { to: "/inventory/physical", text: "Physical Inventory" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem(
          "/inventory/sales-return",
          <DescriptionIcon />,
          "Sales Return"
        ),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
      ],
    },

    // Accounts Executive Menus

    {
      condition: isInGroups("Accounts Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),
        renderSubmenu("accounts", <AttachMoneyIcon />, "Accounts", [
          { to: "/invoice/credit-debit-note", text: "Debit-Credit" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem(
          "/inventory/sales-return",
          <DescriptionIcon />,
          "Sales Return"
        ),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
      ],
    },
    // Accounts Billing Department Menus
    {
      condition: isInGroups("Accounts Billing Department"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem(
          "/inventory/sales-return",
          <DescriptionIcon />,
          "Sales Return"
        ),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
      ],
    },
    // Sales Manager
    {
      condition: userData.groups.includes("Sales Manager"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          {
            to: "/county-state-city/master-tab",
            text: "Country Master",
          },
          { to: "lead/list-references", text: "Lead summary Master" },

          {
            to: "/master/activity-list",
            text: "Master Activity",
          },
          {
            to: "/master/beat",
            text: "Beat Master",
          },
        ]),
        renderListItem(
          "/master/customer-visit",
          <DirectionsRunIcon />,
          "Field Sales"
        ),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
          // { to: "/market-analysis/competitor", text: "Market Analysis" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
        renderListItem("/hr-model", <WorkIcon />, "Recruitment"),
      ],
    },

    // Sales Manager(Retailer)
    {
      condition: userData.groups.includes("Sales Manager(Retailer)"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          {
            to: "/county-state-city/master-tab",
            text: "Country Master",
          },
          { to: "lead/list-references", text: "Lead summary Master" },

          {
            to: "/master/activity-list",
            text: "Master Activity",
          },
          {
            to: "/master/beat",
            text: "Beat Master",
          },
        ]),
        renderListItem(
          "/master/customer-visit",
          <DirectionsRunIcon />,
          "Field Sales"
        ),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
          // { to: "/market-analysis/competitor", text: "Market Analysis" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
        renderListItem("/hr-model", <WorkIcon />, "Recruitment"),
      ],
    },

    //Business Development Manager Menus and Excutive Menus
    {
      condition: isInGroups("Business Development Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },

          // { to: "/market-analysis/competitor", text: "Market Analysis" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
      ],
    },

    //business development manager
    {
      condition: isInGroups("Business Development Manager"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),

        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },

          // { to: "/market-analysis/competitor", text: "Market Analysis" },
        ]),
      ],
    },
    //Customer Relationship Manager
    {
      condition: isInGroups("Customer Relationship Manager"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
      ],
    },
    //Customer Relationship Executive
    {
      condition: isInGroups("Customer Relationship Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
      ],
    },
    //Sales Deputy Manager"
    {
      condition: isInGroups("Sales Deputy Manager"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
          // { to: "/market-analysis/competitor", text: "Market Analysis" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
      ],
    },

    // Sales Assistant Deputy Manager

    {
      condition: isInGroups("Sales Assistant Deputy Manager"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
      ],
    },
    //Sales Manager withouth Leads
    {
      condition: isInGroups("Sales Manager withouth Leads"),
      items: [
        renderListItem("/user/report", <AssessmentIcon />, "Report"),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),
        renderSubmenu("accounts", <AttachMoneyIcon />, "Accounts", [
          { to: "/invoice/credit-debit-note", text: "Debit-Credit" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem(
          "/inventory/sales-return",
          <DescriptionIcon />,
          "Sales Return"
        ),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
      ],
    },
    //Sales Executive
    {
      condition: isInGroups("Sales Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
      ],
    },
    //Digital marketing menus
    {
      condition: isInGroups("Digital Marketing"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          { to: "lead/list-references", text: "Lead summary Master" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
        ]),
      ],
    },
  ];

  return (
    <div>
      {menuItems.map(
        (menu, index) =>
          menu.condition && (
            <React.Fragment key={menu.to}>{menu.items}</React.Fragment>
          )
      )}
    </div>
  );
};
