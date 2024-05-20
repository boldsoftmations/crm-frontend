import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
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
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import WorkIcon from "@mui/icons-material/Work";
import AddToPhotosRoundedIcon from "@mui/icons-material/AddToPhotosRounded";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FactoryIcon from "@mui/icons-material/Factory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BusinessIcon from "@mui/icons-material/Business";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StorageIcon from "@mui/icons-material/Storage";
import AssessmentIcon from "@mui/icons-material/Assessment";
export const ListItems = (props) => {
  const { setOpen } = props;
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if userData and userData.groups are defined before rendering
  if (!userData || !userData.groups) {
    // You can return a loader, empty fragment, or any placeholder
    return <div>Loading...</div>; // or <></> for an empty fragment
  }

  return (
    <div>
      {/* Staff */}
      {userData.groups.includes("Director") ? (
        <>
          {/* Report  */}
          <ListItem
            button
            component={RouterLink}
            to="/user/report"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/user/report")}
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItem>

          {/* Analytics  */}
          <ListItem
            button
            component={RouterLink}
            to="/user/analytics"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/user/analytics")}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>

          {/* Products */}
          <ListItem
            button
            component={RouterLink}
            to="/products/all-product"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/products/all-product")}
          >
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>

          {/* SKU CODES */}
          <ListItem
            button
            component={RouterLink}
            to="/products/all-sku-codes"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/products/all-sku-codes")}
          >
            <ListItemIcon>
              <ConfirmationNumberIcon />
            </ListItemIcon>
            <ListItemText primary="SKU Code" />
          </ListItem>

          {/* Price List */}
          <ListItem
            button
            component={RouterLink}
            to="/products/view-price-list"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/products/view-price-list")}
          >
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="Price List" />
          </ListItem>

          {/* Leads */}
          <ListItem
            button
            component={RouterLink}
            to="/leads/all-lead"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/leads/all-lead")}
          >
            <ListItemIcon>
              <AssignmentIndIcon />
            </ListItemIcon>
            <ListItemText primary="Leads" />
          </ListItem>

          {/* Customer */}
          <ListItem
            button
            component={RouterLink}
            to="/customers/all-customer"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/customers/all-customer")}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Customer" />
          </ListItem>

          {/* All Followup */}
          <ListItem
            button
            component={RouterLink}
            to="/followp/view-followup"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/followp/view-followup")}
          >
            <ListItemIcon>
              <FollowTheSignsIcon />
            </ListItemIcon>
            <ListItemText primary="Followup" />
          </ListItem>

          {/*Proforma Invoice  */}
          <ListItem
            button
            component={RouterLink}
            to="/invoice/performa-invoice-tab"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/invoice/performa-invoice-tab")}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText primary="Performa Invoice" />
          </ListItem>

          {/*Sales Invoice  */}
          <ListItem
            button
            component={RouterLink}
            to="/invoice/sales-invoice"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/invoice/sales-invoice")}
          >
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Invoice" />
          </ListItem>

          {/* Forecast */}
          <ListItem
            button
            component={RouterLink}
            to="/forecast/view-product-forecast"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/forecast/view-product-forecast")}
          >
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Forecast" />
          </ListItem>

          {/* Seller Account */}
          <ListItem
            button
            component={RouterLink}
            to="/invoice/seller-account"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/invoice/seller-account")}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Seller Account" />
          </ListItem>

          {/* Order book */}
          <ListItem
            button
            component={RouterLink}
            to="/invoice/orderbook-tab"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/invoice/orderbook-tab")}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Order Book" />
          </ListItem>

          {/* Dispatch */}
          <ListItem
            button
            component={RouterLink}
            to="/dispatch/tab-view"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/dispatch/tab-view")}
          >
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary="Dispatch" />
          </ListItem>

          {/* Vendor */}
          <ListItem
            button
            component={RouterLink}
            to="/inventory/view-vendor"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/inventory/view-vendor")}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Vendor" />
          </ListItem>

          {/* Purchase */}
          <ListItem
            button
            component={RouterLink}
            to="/inventory/view-purchase"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/inventory/view-purchase")}
          >
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Purchase" />
          </ListItem>

          {/* Production */}
          <ListItem
            button
            component={RouterLink}
            to="/inventory/view-production"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/inventory/view-production")}
          >
            <ListItemIcon>
              <FactoryIcon />
            </ListItemIcon>
            <ListItemText primary="Production" />
          </ListItem>

          {/* Inventory */}
          <ListItem
            button
            component={RouterLink}
            to="/inventory/view-inventory"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/inventory/view-inventory")}
          >
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>

          {/* Physical Inventory */}
          <ListItem
            button
            component={RouterLink}
            to="/inventory/physical"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/inventory/physical")}
          >
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Physical Inventory" />
          </ListItem>

          {/* sales return */}
          <ListItem
            button
            component={RouterLink}
            to="/inventory/sales-return"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/inventory/sales-return")}
          >
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Return" />
          </ListItem>

          {/* Currency */}
          <ListItem
            button
            component={RouterLink}
            to="/inventory/view-currency"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/inventory/view-currency")}
          >
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Currency" />
          </ListItem>

          {/* Tasks */}
          <ListItem
            button
            component={RouterLink}
            to="/task/view-task"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/task/view-task")}
          >
            <ListItemIcon>
              <AssignmentTurnedInIcon />
            </ListItemIcon>
            <ListItemText primary="Task" />
          </ListItem>

          {/* Market Analysis */}
          <ListItem
            button
            component={RouterLink}
            to="/market-analysis/competitor"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/market-analysis/competitor")}
          >
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Market Analysis" />
          </ListItem>

          {/* Users */}
          <ListItem
            button
            component={RouterLink}
            to="/user/profile-tab"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/user/profile-tab")}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          {/* Script */}
          <ListItem
            button
            component={RouterLink}
            to="/user/faq"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/user/faq")}
          >
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Script" />
          </ListItem>

          {/* Daily Sale Review */}
          <ListItem
            button
            component={RouterLink}
            to="/user/sale-review"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/user/sale-review")}
          >
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Review" />
          </ListItem>
          {/* Whatsapp Group */}
          <ListItem
            button
            component={RouterLink}
            to="/customers/whatsapp-tabs"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/customers/whatsapp-tabs")}
          >
            <ListItemIcon>
              <WhatsAppIcon />
            </ListItemIcon>
            <ListItemText primary="Whatsapp" />
          </ListItem>

          {/* <ListItem
            button
            component={RouterLink}
            to="/user/sales-history"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Sales History" />
          </ListItem> */}

          {/* Hr Recruitment Model */}
          <ListItem
            button
            component={RouterLink}
            to="/hr-model/hr-master"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/hr-model/hr-master")}
          >
            <ListItemIcon>
              <AddToPhotosRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Master Table" />
          </ListItem>
          <ListItem
            button
            component={RouterLink}
            to="/hr-model"
            style={{ width: 300 }}
            onClick={() => setOpen(false)}
            selected={isActive("/hr-model")}
          >
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Recruitment" />
          </ListItem>
        </>
      ) : (
        <>
          {/* Hr */}
          {userData.groups.includes("HR") && (
            <>
              {/* Users */}
              <ListItem
                button
                component={RouterLink}
                to="/user/profile-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/profile-tab")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>

              {/* Hr Recruitment Model */}
              <ListItem
                button
                component={RouterLink}
                to="/hr-model/hr-master"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/hr-model/hr-master")}
              >
                <ListItemIcon>
                  <AddToPhotosRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Master Table" />
              </ListItem>
              <ListItem
                button
                component={RouterLink}
                to="/hr-model"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/hr-model")}
              >
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Recruitment" />
              </ListItem>
            </>
          )}
          {/* Factory orderbook */}
          {(userData.groups.includes("Factory-Delhi-OrderBook") ||
            userData.groups.includes("Factory-Mumbai-OrderBook")) && (
            <>
              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              {/* <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem> */}
            </>
          )}

          {/* factory dispatch */}
          {(userData.groups.includes("Factory-Mumbai-Dispatch") ||
            userData.groups.includes("Factory-Delhi-Dispatch")) && (
            <>
              {/* Dispatch */}
              <ListItem
                button
                component={RouterLink}
                to="/dispatch/tab-view"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/dispatch/tab-view")}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}

          {/* customer services */}
          {userData.groups.includes("Customer Service") && (
            <>
              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/* Leads */}
              <ListItem
                button
                component={RouterLink}
                to="/leads/all-lead"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/leads/all-lead")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItem>

              {/* All Followup */}
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/followp/view-followup")}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Seller Account */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/seller-account"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/seller-account")}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Seller Account" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Dispatch */}
              <ListItem
                button
                component={RouterLink}
                to="/dispatch/tab-view"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/dispatch/tab-view")}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>

              {/* Script */}
              <ListItem
                button
                component={RouterLink}
                to="/user/faq"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/faq")}
              >
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Script" />
              </ListItem>

              {/* Whatsapp Group */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/whatsapp-tabs"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/whatsapp-tabs")}
              >
                <ListItemIcon>
                  <WhatsAppIcon />
                </ListItemIcon>
                <ListItemText primary="Whatsapp" />
              </ListItem>
            </>
          )}

          {/* purchase */}
          {userData.groups.includes("Purchase") && (
            <>
              {/* Vendor */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-vendor"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-vendor")}
              >
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Vendor" />
              </ListItem>

              {/* Purchase */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-purchase"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-purchase")}
              >
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase" />
              </ListItem>

              {/* Production */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-production")}
              >
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary="Production" />
              </ListItem>

              {/* Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-inventory"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-inventory")}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>

              {/* Currency */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-currency"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-currency")}
              >
                <ListItemIcon>
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText primary="Currency" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}

          {/* stores */}
          {userData.groups.includes("Stores") && (
            <>
              {/* Production */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-production")}
              >
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary="Production" />
              </ListItem>

              {/* Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-inventory"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-inventory")}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}

          {/* stores */}
          {(userData.groups.includes("Stores Delhi") ||
            userData.groups.includes("Production Delhi")) && (
            <>
              {/* Purchase */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-purchase"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-purchase")}
              >
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase" />
              </ListItem>

              {/* Production */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-production")}
              >
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary="Production" />
              </ListItem>

              {/* Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-inventory"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-inventory")}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Dispatch */}
              <ListItem
                button
                component={RouterLink}
                to="/dispatch/tab-view"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/dispatch/tab-view")}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}

          {/* production */}
          {userData.groups.includes("Production") && (
            <>
              {/* Production */}

              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-production")}
              >
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary="Production" />
              </ListItem>

              {/* Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-inventory"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-inventory")}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>

              {/* Physical Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/physical"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/physical")}
              >
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Physical Inventory" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}

          {/* Sales Manager */}
          {userData.groups.includes("Sales Manager") && (
            <>
              {/* Report  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/report"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/report")}
              >
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Report" />
              </ListItem>

              {/* Analytics  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/analytics"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/analytics")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>

              {/* Leads */}
              <ListItem
                button
                component={RouterLink}
                to="/leads/all-lead"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/leads/all-lead")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItem>

              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/* All Followup */}
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/followp/view-followup")}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>

              {/* Market Analysis */}
              <ListItem
                button
                component={RouterLink}
                to="/market-analysis/competitor"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/market-analysis/competitor")}
              >
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Market Analysis" />
              </ListItem>

              {/* Script */}
              <ListItem
                button
                component={RouterLink}
                to="/user/faq"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/faq")}
              >
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Script" />
              </ListItem>

              {/* Daily Sale Review */}
              <ListItem
                button
                component={RouterLink}
                to="/user/sale-review"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/sale-review")}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Review" />
              </ListItem>

              {/* Hr Recruitment Model */}
              <ListItem
                button
                component={RouterLink}
                to="/hr-model"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText primary="Recruitment" />
              </ListItem>
            </>
          )}

          {/* Sales Deputy Manager */}
          {userData.groups.includes("Sales Deputy Manager") && (
            <>
              {/* Analytics  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/analytics"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/analytics")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>

              {/* Leads */}
              <ListItem
                button
                component={RouterLink}
                to="/leads/all-lead"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/leads/all-lead")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItem>

              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/* All Followup */}
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/followp/view-followup")}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
              {/* Script */}
              <ListItem
                button
                component={RouterLink}
                to="/user/faq"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/faq")}
              >
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Script" />
              </ListItem>
              {/* Daily Sale Review */}
              <ListItem
                button
                component={RouterLink}
                to="/user/sale-review"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/sale-review")}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Review" />
              </ListItem>
            </>
          )}

          {/* Sales Assistant Deputy Manager */}
          {userData.groups.includes("Sales Assistant Deputy Manager") && (
            <>
              {/* Analytics  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/analytics"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/analytics")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>

              {/* Leads */}
              <ListItem
                button
                component={RouterLink}
                to="/leads/all-lead"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/leads/all-lead")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItem>

              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/* All Followup */}
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/followp/view-followup")}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>

              {/* Script */}
              <ListItem
                button
                component={RouterLink}
                to="/user/faq"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/faq")}
              >
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Script" />
              </ListItem>

              {/* Daily Sale Review */}
              <ListItem
                button
                component={RouterLink}
                to="/user/sale-review"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/sale-review")}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Review" />
              </ListItem>
            </>
          )}

          {/* Sales Executives */}
          {userData.groups.includes("Sales Executive") && (
            <>
              {/* Analytics  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/analytics"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/analytics")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>

              {/* Leads */}
              <ListItem
                button
                component={RouterLink}
                to="/leads/all-lead"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/leads/all-lead")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItem>

              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/* All Followup */}
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/followp/view-followup")}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>

              {/* Script */}
              <ListItem
                button
                component={RouterLink}
                to="/user/faq"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/faq")}
              >
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Script" />
              </ListItem>

              {/* Daily Sale Review */}
              <ListItem
                button
                component={RouterLink}
                to="/user/sale-review"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/sale-review")}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Review" />
              </ListItem>
            </>
          )}
          {/* Sales Manager without Leads  */}
          {userData.groups.includes("Sales Manager without Leads") && (
            <>
              {/* Analytics  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/analytics"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/analytics")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>

              {/* Leads */}
              <ListItem
                button
                component={RouterLink}
                to="/leads/all-lead"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/leads/all-lead")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItem>

              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/* All Followup */}
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/followp/view-followup")}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>

              {/* Script */}
              <ListItem
                button
                component={RouterLink}
                to="/user/faq"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/faq")}
              >
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Script" />
              </ListItem>

              {/* Daily Sale Review */}
              <ListItem
                button
                component={RouterLink}
                to="/user/sale-review"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/sale-review")}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Review" />
              </ListItem>
            </>
          )}
          {/* Sales Manager with Leads  */}
          {userData.groups.includes("Sales Manager with Lead") && (
            <>
              {/* Analytics  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/analytics"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/analytics")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>

              {/* Leads */}
              <ListItem
                button
                component={RouterLink}
                to="/leads/all-lead"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/leads/all-lead")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Leads" />
              </ListItem>

              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/* All Followup */}
              <ListItem
                button
                component={RouterLink}
                to="/followp/view-followup"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/followp/view-followup")}
              >
                <ListItemIcon>
                  <FollowTheSignsIcon />
                </ListItemIcon>
                <ListItemText primary="Followup" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>

              {/* Script */}
              <ListItem
                button
                component={RouterLink}
                to="/user/faq"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/faq")}
              >
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Script" />
              </ListItem>

              {/* Daily Sale Review */}
              {/* <ListItem
                button
                component={RouterLink}
                to="/user/sale-review"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Review" />
              </ListItem> */}
            </>
          )}
          {/* accounts */}
          {userData.groups.includes("Accounts") && (
            <>
              {/* Report  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/report"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/report")}
              >
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Report" />
              </ListItem>
              {/* Analytics  */}
              <ListItem
                button
                component={RouterLink}
                to="/user/analytics"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/user/analytics")}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>
              {/* Products */}
              <ListItem
                button
                component={RouterLink}
                to="/products/all-product"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/all-product")}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItem>
              {/* SKU CODES */}
              <ListItem
                button
                component={RouterLink}
                to="/products/all-sku-codes"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/all-sku-codes")}
              >
                <ListItemIcon>
                  <ConfirmationNumberIcon />
                </ListItemIcon>
                <ListItemText primary="SKU Code" />
              </ListItem>
              {/* Price List */}
              <ListItem
                button
                component={RouterLink}
                to="/products/view-price-list"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/view-price-list")}
              >
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="Price List" />
              </ListItem>
              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>
              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>
              {/*Sales Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/sales-invoice"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/sales-invoice")}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Invoice" />
              </ListItem>
              {/* Forecast */}
              <ListItem
                button
                component={RouterLink}
                to="/forecast/view-product-forecast"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/forecast/view-product-forecast")}
              >
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Forecast" />
              </ListItem>
              {/* Seller Account */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/seller-account"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/seller-account")}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Seller Account" />
              </ListItem>
              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>
              {/* Dispatch */}
              <ListItem
                button
                component={RouterLink}
                to="/dispatch/tab-view"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/dispatch/tab-view")}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText primary="Dispatch" />
              </ListItem>
              {/* Vendor */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-vendor"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-vendor")}
              >
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Vendor" />
              </ListItem>
              {/* Purchase */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-purchase"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-purchase")}
              >
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase" />
              </ListItem>
              {/* Production */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-production")}
              >
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary="Production" />
              </ListItem>
              {/* Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-inventory"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-inventory")}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>
              {/* Physical Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/physical"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/physical")}
              >
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Physical Inventory" />
              </ListItem>

              {/* sales return */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/sales-return"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/sales-return")}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Return" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}

          {/* Accounts Billing Department*/}
          {userData.groups.includes("Accounts Billing Department") && (
            <>
              {/* Products */}
              <ListItem
                button
                component={RouterLink}
                to="/products/all-product"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/all-product")}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItem>

              {/* SKU CODES */}
              <ListItem
                button
                component={RouterLink}
                to="/products/all-sku-codes"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/all-sku-codes")}
              >
                <ListItemIcon>
                  <ConfirmationNumberIcon />
                </ListItemIcon>
                <ListItemText primary="SKU Code" />
              </ListItem>

              {/* Price List */}
              <ListItem
                button
                component={RouterLink}
                to="/products/view-price-list"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/view-price-list")}
              >
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="Price List" />
              </ListItem>

              {/* Customer */}
              <ListItem
                button
                component={RouterLink}
                to="/customers/all-customer"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/customers/all-customer")}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
              </ListItem>

              {/*Proforma Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/performa-invoice-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/performa-invoice-tab")}
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText primary="Performa Invoice" />
              </ListItem>

              {/*Sales Invoice  */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/sales-invoice"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/sales-invoice")}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Invoice" />
              </ListItem>

              {/* Order book */}
              <ListItem
                button
                component={RouterLink}
                to="/invoice/orderbook-tab"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/invoice/orderbook-tab")}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary="Order Book" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}

          {/* accounts */}
          {userData.groups.includes("Accounts Executive") && (
            <>
              {/* Products */}
              <ListItem
                button
                component={RouterLink}
                to="/products/all-product"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/all-product")}
              >
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItem>

              {/* SKU CODES */}
              <ListItem
                button
                component={RouterLink}
                to="/products/all-sku-codes"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/all-sku-codes")}
              >
                <ListItemIcon>
                  <ConfirmationNumberIcon />
                </ListItemIcon>
                <ListItemText primary="SKU Code" />
              </ListItem>

              {/* Price List */}
              <ListItem
                button
                component={RouterLink}
                to="/products/view-price-list"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/products/view-price-list")}
              >
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="Price List" />
              </ListItem>

              {/* Vendor */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-vendor"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-vendor")}
              >
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Vendor" />
              </ListItem>

              {/* Purchase */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-purchase"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-purchase")}
              >
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase" />
              </ListItem>

              {/* Production */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-production"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-production")}
              >
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary="Production" />
              </ListItem>

              {/* Inventory */}
              <ListItem
                button
                component={RouterLink}
                to="/inventory/view-inventory"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/inventory/view-inventory")}
              >
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItem>

              {/* Tasks */}
              <ListItem
                button
                component={RouterLink}
                to="/task/view-task"
                style={{ width: 300 }}
                onClick={() => setOpen(false)}
                selected={isActive("/task/view-task")}
              >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Task" />
              </ListItem>
            </>
          )}
        </>
      )}
    </div>
  );
};
