import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChangePassword } from "./../Pages/Auth/ChangePassword";
import { ForgotPassword } from "./../Pages/Auth/ForgotPassword";
import { SellerAccount } from "./../Pages/Invoice/Seller Account/SellerAccount";
import { SalesInvoiceView } from "./../Pages/Invoice/SalesInvoice/SalesInvoiceView";
import { Auths } from "../Pages/Auth/Auths";
import { Profile } from "./../Pages/Profile/Profile";
import { VendorView } from "../Pages/Vendor/VendorInventoryDetail/VendorView";
import { ProductForecastViewAll } from "../Pages/ProductForecast/ProductForecastViewAll";
import { TaskView } from "../Pages/Task/TaskView";
import { Followup } from "../Pages/FollowUp/Followup";
import { ActivePI } from "../Pages/Invoice/ProformaInvoice/ActivePI";
import { ApprovePi } from "../Pages/Invoice/ProformaInvoice/ApprovePi";
import { CompetitorView } from "../Pages/MarketAnalysis/CompetitorView";
import { PriceApprovalPI } from "../Pages/Invoice/ProformaInvoice/PriceApprovalPI";
import { FaqAllTab } from "../Pages/Faq/FaqAllTab/FaqAllTab";
import { DailySaleReviewView } from "../Pages/DailySaleReview/DailySaleReviewView";
import { HrModelTabs } from "../Pages/HrModel/HrModelTabs";
import { CurrencyView } from "../Pages/Currency/CurrencyView";
import { PhysicalInventoryView } from "../Pages/Physcical Inventory/PhysicalInventoryView";
import { AllLeadsTabView } from "../Pages/Leads/AllLeadsTabView";
import { AllProductsTabView } from "../Pages/Products/AllProductsTabView";
import { PriceList } from "../Pages/PriceList/PriceList";
import { AllCustomerTabView } from "../Pages/Cutomers/CompanyDetails/AllCustomerTabView";
import { AllPerformaInvoiceTabView } from "../Pages/Invoice/ProformaInvoice/AllPerformaInvoiceTabView";
import { PurchaseAllTabView } from "../Pages/Purchase/PurchaseAllTabView";
import { ProductionAllTabView } from "../Pages/Production/ProductionAllTabView";
import { InventoryAllTabView } from "../Pages/Inventory/InventoryAllTabView";
import { HrMasterTabView } from "../Pages/HrModel/HrMasterTabView";
import { AllWhatsappTabs } from "../Pages/WhatsappGroup/AllWhatsappTabs";
import { AllOrderBookTabView } from "../Pages/OrderBooks/AllOrderBookTabView";
import { Report } from "../Pages/Report/Report";
import { AnalyticsAllTabView } from "../Pages/Analytics/AnalyticsAllTabView";
import { AllDispatchTabView } from "../Pages/Dispatch/AllDispatchTabView";
import { AllProfileTabView } from "../Pages/Users/AllProfileTabView";
import { SalesReturnAllTabView } from "../Pages/SalesReturn/SalesReturnAllTabView";
import { DebitCreditAllTabView } from "../Pages/DebitCredit/DebitCreditAllTabView";
import { AllCCFtab } from "../Pages/CCF/AllCCFtab";
import { AllComplaintListView } from "../Pages/CCF/AllComplaintListView";

const PrivateRoute = ({ children, redirectTo = "/" }) => {
  const tokenData = useSelector((state) => state.auth);
  const token = tokenData.user;
  return token ? children : <Navigate to={redirectTo} replace />;
};

export const RouteScreen = () => {
  const tokenData = useSelector((state) => state.auth);
  const token = tokenData.user;

  return (
    <Routes>
      {token ? (
        <>
          {/* Preferred private route when token exists */}
          <Route
            path="/user/analytics"
            exact
            element={
              <PrivateRoute>
                <AnalyticsAllTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/report"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/profile"
            exact
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/profile-tab"
            exact
            element={
              <PrivateRoute>
                <AllProfileTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/leads/all-lead"
            element={
              <PrivateRoute>
                <AllLeadsTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/all-product"
            element={
              <PrivateRoute>
                <AllProductsTabView />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/view-price-list"
            element={
              <PrivateRoute>
                <PriceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/all-customer"
            element={
              <PrivateRoute>
                <AllCustomerTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/followp/view-followup"
            element={
              <PrivateRoute>
                <Followup />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/seller-account"
            element={
              <PrivateRoute>
                <SellerAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/performa-invoice-tab"
            element={
              <PrivateRoute>
                <AllPerformaInvoiceTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/approve-pi"
            element={
              <PrivateRoute>
                <ApprovePi />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/active-pi"
            element={
              <PrivateRoute>
                <ActivePI />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/price-approval-pi"
            element={
              <PrivateRoute>
                <PriceApprovalPI />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/sales-invoice"
            element={
              <PrivateRoute>
                <SalesInvoiceView />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/orderbook-tab"
            element={
              <PrivateRoute>
                <AllOrderBookTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/dispatch/tab-view"
            element={
              <PrivateRoute>
                <AllDispatchTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-purchase"
            element={
              <PrivateRoute>
                <PurchaseAllTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-production"
            element={
              <PrivateRoute>
                <ProductionAllTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-inventory"
            element={
              <PrivateRoute>
                <InventoryAllTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-vendor"
            element={
              <PrivateRoute>
                <VendorView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-currency"
            element={
              <PrivateRoute>
                <CurrencyView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/physical"
            element={
              <PrivateRoute>
                <PhysicalInventoryView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/sales-return"
            element={
              <PrivateRoute>
                <SalesReturnAllTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/credit-debit-note"
            element={
              <PrivateRoute>
                <DebitCreditAllTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/complaints/ccp-capa"
            element={
              <PrivateRoute>
                <AllCCFtab />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/complaints/ccp-capa/master"
            element={
              <PrivateRoute>
                <AllComplaintListView />
              </PrivateRoute>
            }
          />
          <Route
            path="/forecast/view-product-forecast"
            element={
              <PrivateRoute>
                <ProductForecastViewAll />
              </PrivateRoute>
            }
          />
          <Route
            path="/task/view-task"
            element={
              <PrivateRoute>
                <TaskView />
              </PrivateRoute>
            }
          />
          <Route
            path="/market-analysis/competitor"
            element={
              <PrivateRoute>
                <CompetitorView />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/faq"
            element={
              <PrivateRoute>
                <FaqAllTab />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/sale-review"
            element={
              <PrivateRoute>
                <DailySaleReviewView />
              </PrivateRoute>
            }
          />
          <Route
            path="/hr-model"
            element={
              <PrivateRoute>
                <HrModelTabs />
              </PrivateRoute>
            }
          />
          <Route
            path="/hr-model/hr-master"
            element={
              <PrivateRoute>
                <HrMasterTabView />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/whatsapp-tabs"
            element={
              <PrivateRoute>
                <AllWhatsappTabs />
              </PrivateRoute>
            }
          />
        </>
      ) : (
        <>
          {/* Public and authentication routes */}
          <Route path="/" exact element={<Auths />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/change-password/:id/:token"
            element={<ChangePassword />}
          />
        </>
      )}
      {/* Redirect unknown routes to login or analytics based on token presence */}
      <Route
        path="*"
        element={
          token ? (
            <PrivateRoute>
              <AnalyticsAllTabView />
            </PrivateRoute>
          ) : (
            <Auths />
          )
        }
      />
    </Routes>
  );
};
