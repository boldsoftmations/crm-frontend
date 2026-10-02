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
import {
  canUseTransporterFinder,
  canViewPinMaster,
  canViewTransporterMaster,
} from "../../utility/masterAccess";
export const ListItems = ({ setOpen }) => {
  const { profile: userData } = useSelector((state) => state.auth);

  const userGroups =
    userData && Array.isArray(userData.groups) ? userData.groups : [];

  // Function to check if the user is in a specific group
  const isInGroups = (...groups) => groups.some((g) => userGroups.includes(g));

  const canViewPinMasterAccess = canViewPinMaster(userData);
  const canViewTransportMasterAccess = canViewTransporterMaster(userData);
  const canUseTransportFinderAccess = canUseTransporterFinder(userData);

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
          {items.filter(Boolean).map(({ to, text }, index) => (
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
            to: "/master/package-master",
            text: "Package Master",
          },

          // {
          //   to: "/",
          // },
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          {
            to: "/master/activity-list",
            text: "Master Activity",
          },
          {
            to: "/master/beat",
            text: "Beat Master",
          },
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,

          { to: "lead/list-references", text: "Lead Master" },
        ]),

        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
        ]),
        // renderListItem(
        //   "/Transport-Finder",
        //   <StickyNote2Icon />,
        //   "Transport Finder",
        // ),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
          { to: "/inventory/physical", text: "Physical Inventory" },
          { to: "/inventory/stock-alert", text: "Stock Summary" },
          // { to: "/inventory/stock-Report", text: "Stock Reprts" },
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
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
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
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
        renderSubmenu("ReturnOrder", <DescriptionIcon />, "ReturnOrder", [
          { to: "/inventory/sales-return", text: "Sales Return" },
          { to: "/inventory/purchase-return", text: "Purchase Return" },
        ]),

        renderListItem(
          "/master/customer-visit",
          <DirectionsRunIcon />,
          "Field Sales",
        ),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
        renderListItem(
          "/customers/whatsapp-tabs",
          <WhatsAppIcon />,
          "Whatsapp",
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
        "Production Delhi",
      ),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
          { to: "/inventory/stock-alert", text: "Stock Summary" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderSubmenu("ReturnOrder", <DescriptionIcon />, "ReturnOrder", [
          { to: "/inventory/sales-return", text: "Sales Return" },
          { to: "/inventory/purchase-return", text: "Purchase Return" },
        ]),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
      ],
    },

    //Factory Menus
    {
      condition: isInGroups(
        "Factory-Delhi-Dispatch",
        "Factory-Mumbai-Dispatch",
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
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderSubmenu("inventory", <FactoryIcon />, "Inventory", [
          { to: "/inventory/stock-alert", text: "Stock Summary" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
        renderSubmenu("ReturnOrder", <DescriptionIcon />, "ReturnOrder", [
          { to: "/inventory/sales-return", text: "Sales Return" },
        ]),
      ],
    },

    //factory  orderbook Menus

    {
      condition: isInGroups(
        "Factory-Delhi-OrderBook",
        "Factory-Mumbai-OrderBook",
      ),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        renderSubmenu("inventory", <FactoryIcon />, "Inventory", [
          { to: "/inventory/stock-alert", text: "Stock Summary" },
        ]),
      ],
    },
    //Factory Menus

    {
      condition: isInGroups(
        "Factory-Delhi-Dispatch",
        "Factory-Mumbai-Dispatch",
      ),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
      ],
    },
    // customer Service Menus

    {
      condition: isInGroups("Customer Service"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          {
            to: "/customer/complaints/ccp-capa/master",
            text: "CCF Complaint Master",
          },
          { to: "/user/profile-tab", text: "Employees Master" },
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
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
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
        renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
        renderListItem(
          "/customers/whatsapp-tabs",
          <WhatsAppIcon />,
          "Whatsapp",
        ),
      ],
    },
    //Operations & Supply Chain Manager

    {
      condition: isInGroups("Operations & Supply Chain Manager"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
          { to: "/inventory/stock-alert", text: "Stock Summary" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),

        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
          { to: "/inventory/view-vendor", text: "Vendor" },
          { to: "/inventory/view-purchase", text: "Purchase" },
          { to: "/inventory/stock-alert", text: "Stock Summary" },
        ]),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),

        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
        renderListItem(
          "/customers/whatsapp-tabs",
          <WhatsAppIcon />,
          "Whatsapp",
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
          "Currency",
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
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
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
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
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
        renderSubmenu("ReturnOrder", <DescriptionIcon />, "ReturnOrder", [
          { to: "/inventory/sales-return", text: "Sales Return" },
          { to: "/inventory/purchase-return", text: "Purchase Return" },
        ]),
        renderListItem("/task/view-task", <AssignmentTurnedInIcon />, "Task"),
      ],
    },

    // Accounts Billing Department Menus

    {
      condition: isInGroups("Accounts Billing Department"),
      items: [
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/products/all-product", text: "Inventory Master" },
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          { to: "/user/profile-tab", text: "Employees Master" },
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        renderSubmenu("accounts", <AttachMoneyIcon />, "Accounts", [
          { to: "/products/view-price-list", text: "Price List" },
        ]),

        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
        ]),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),

        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
      ],
    },
    // Accounts Executive Menus
    {
      condition: isInGroups("Accounts Executive"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,

        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),

        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "Inventory" },
        ]),
        // renderSubmenu(
        //   "customer_complaint",
        //   <ComplaintIcon />,
        //   "Customer Complaint",
        //   [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        // ),
        renderSubmenu("production", <FactoryIcon />, "Production", [
          { to: "/inventory/view-production", text: "Production" },
        ]),
        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          // { to: "/leads/all-lead", text: "Leads" },
          { to: "/customers/all-customer", text: "Customer" },
          // { to: "/followp/view-followup", text: "Followup" },

          // { to: "/market-analysis/competitor", text: "Market Analysis" },
        ]),
        // renderSubmenu("purchase", <PurchaseIcon />, "Purchase", [
        //   { to: "/inventory/view-vendor", text: "Vendor" },
        //   { to: "/inventory/view-purchase", text: "Purchase" },
        // ]),
        renderListItem("/invoice/orderbook-tab", <ReceiptIcon />, "Order Book"),
        renderListItem("/dispatch/tab-view", <LocalShippingIcon />, "Dispatch"),
        // renderListItem(
        //   "/inventory/sales-return",
        //   <DescriptionIcon />,
        //   "Sales Return",
        // ),
      ],
    },
    // Sales Manager
    {
      condition: isInGroups("Sales Manager"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          { to: "lead/list-references", text: "Lead summary Master" },

          {
            to: "/master/activity-list",
            text: "Master Activity",
          },
          {
            to: "/master/beat",
            text: "Beat Master",
          },
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        renderListItem(
          "/master/customer-visit",
          <DirectionsRunIcon />,
          "Field Sales",
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
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
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
      condition: isInGroups("Sales Manager(Retailer)"),
      items: [
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          { to: "lead/list-references", text: "Lead summary Master" },

          {
            to: "/master/activity-list",
            text: "Master Activity",
          },
          {
            to: "/master/beat",
            text: "Beat Master",
          },
          canViewTransportMasterAccess
            ? {
                to: "/master/transport",
                text: "Transport Master",
              }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        renderListItem(
          "/master/customer-visit",
          <DirectionsRunIcon />,
          "Field Sales",
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
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
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
        // renderListItem("/user/report", <AssessmentIcon />, "Report"),
        renderListItem("/user/analytics", <DashboardIcon />, "Analytics"),
        renderSubmenu("master", <BusinessIcon />, "Master", [
          { to: "/user/profile-tab", text: "Employees Master" },
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
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
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ), //9-->
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
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,

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
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,

        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),

        renderListItem("/customer/srf", <StickyNote2Icon />, "SRF"),

        renderSubmenu("sales", <TrendingUpIcon />, "Sales", [
          { to: "/customers/all-customer", text: "Customer" },
          { to: "/followp/view-followup", text: "Followup" },
          { to: "/forecast/view-product-forecast", text: "Forecast" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),

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
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
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
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
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
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
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
          canViewTransportMasterAccess
            ? { to: "/master/transport", text: "Transport Master" }
            : null,
        ]),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        renderSubmenu("invoice", <InsertDriveFileIcon />, "Invoice", [
          { to: "/invoice/performa-invoice-tab", text: "Performa Invoice" },
          { to: "/invoice/sales-invoice", text: "Sales Invoice" },
        ]),
        renderSubmenu("accounts", <AttachMoneyIcon />, "Accounts", [
          { to: "/invoice/credit-debit-note", text: "Debit-Credit" },
        ]),
        renderSubmenu("inventory", <InventoryIcon />, "Inventory", [
          { to: "/inventory/view-inventory", text: "In ventory" },
        ]),
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
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
        renderSubmenu("ReturnOrder", <DescriptionIcon />, "ReturnOrder", [
          { to: "/inventory/sales-return", text: "Sales Return" },
          { to: "/inventory/purchase-return", text: "Purchase Return" },
        ]),
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
          canViewPinMasterAccess
            ? {
                to: "/county-state-city/master-tab",
                text: "Country Master",
              }
            : null,
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
        renderSubmenu(
          "customer_complaint",
          <ComplaintIcon />,
          "Customer Complaint",
          [{ to: "/customer/complaints/ccp-capa", text: "CCF-CAPA" }],
        ),
        canUseTransportFinderAccess
          ? renderListItem(
              "/Transport-Finder",
              <StickyNote2Icon />,
              "Transport Finder",
            )
          : null,
        // renderListItem("/user/faq", <HelpOutlineIcon />, "Script"),
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
            <React.Fragment key={index}>{menu.items}</React.Fragment>
          ),
      )}
    </div>
  );
};
