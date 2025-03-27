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
              key={index}
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
      condition: userData.groups.includes("Director"),
      items: [
        renderListItem("/user/report", <AssessmentIcon />, "Report"),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderListItem(
          "/master/customer-visit",
          <DirectionsRunIcon />,
          "Field Sales"
        ),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
          { to: "/inventory/view-currency", text: "Currency Master" },
          { to: "/user/profile-tab", text: "Employees Master" },
          { to: "/hr-model/hr-master", text: "HR Master" },
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
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }]
        ),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
          { to: "/market-analysis/competitor", text: "Market Analysis" },
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
      condition: userData.groups.includes("HR"),
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
      condition: userData.groups.includes("HR Recruiter"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/hr-model/hr-master", text: "HR Master" },
        ]),
        renderListItem("/hr-model", <WorkIcon />, "Recruitment"),
      ],
    },

    // Store and Production menus
    {
      condition:
        userData.groups.includes("Stores") ||
        userData.groups.includes("Production") ||
        userData.groups.includes("Stores Delhi") ||
        userData.groups.includes("Production Delhi"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
        ]),
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
      condition:
        userData.groups.includes("Factory-Delhi-OrderBook") ||
        userData.groups.includes("Factory-Mumbai-OrderBook"),
      items: [
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
      ],
    },
    {
      condition:
        userData.groups.includes("Factory-Mumbai-Dispatch") ||
        userData.groups.includes("Factory-Delhi-Dispatch"),
      items: [
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
      ],
    },

    //QA menus
    {
      condition: userData.groups.includes("QA"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
        ]),
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
      condition:
        userData.groups.includes("Factory-Mumbai-Dispatch") ||
        userData.groups.includes("Factory-Delhi-Dispatch"),
      items: [
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
      ],
    },
    // Service Menus

    {
      condition: userData.groups.includes("Customer Service"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
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

    // Purchase Menus

    {
      condition: userData.groups.includes("Purchase"),
      items: [
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
      condition: userData.groups.includes("Accounts"),
      items: [
        renderListItem("/user/report", <AssessmentIcon />, "Report"),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
          { to: "/inventory/view-currency", text: "Currency Master" },
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
      condition: userData.groups.includes("Accounts Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
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
      condition: userData.groups.includes("Accounts Billing Department"),
      items: [
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
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
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
      condition:
        userData.groups.includes("Business Development Manager") ||
        userData.groups.includes("Business Development Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
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
    //Customer Relationship Manager
    {
      condition: userData.groups.includes("Customer Relationship Manager"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
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
      condition: userData.groups.includes("Customer Relationship Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
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
      condition: userData.groups.includes("Sales Deputy Manager"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
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
    //Sales Manager withouth Leads
    {
      condition: userData.groups.includes("Sales Manager withouth Leads"),
      items: [
        renderListItem("/user/report", <AssessmentIcon />, "Report"),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          { to: "/invoice/seller-account", text: "Company Master" },
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
      condition: userData.groups.includes("Sales Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
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
      condition: userData.groups.includes("Digital Marketing"),
      items: [
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
            <React.Fragment key={index}>{menu.items}</React.Fragment>
          )
      )}
    </div>
  );
};
