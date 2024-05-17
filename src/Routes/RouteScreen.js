import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChangePassword } from "./../Pages/Auth/ChangePassword";
import { ForgotPassword } from "./../Pages/Auth/ForgotPassword";
import { CompanyDetails } from "../Pages/Cutomers/CompanyDetails/CompanyDetails";
import { SellerAccount } from "./../Pages/Invoice/Seller Account/SellerAccount";
import { CustomerOrderBookDetails } from "../Pages/OrderBooks/CustomerOrderBookDetails";
import { ProductOrderBookDetails } from "./../Pages/OrderBooks/ProductOrderBookDetails";
import { SalesInvoiceView } from "./../Pages/Invoice/SalesInvoice/SalesInvoiceView";
import { Auths } from "../Pages/Auth/Auths";
import { Profile } from "./../Pages/Profile/Profile";
import { ViewDispatch } from "./../Pages/Dispatch/ViewDispatch";
import { Dispatched } from "./../Pages/Dispatch/Dispatched";
import { SalesRegisterView } from "./../Pages/Dispatch/SalesRegisterView";
import { PIOrderBookDetails } from "../Pages/OrderBooks/PIOrderBookDetails";
import { VendorView } from "../Pages/Vendor/VendorInventoryDetail/VendorView";
import { StoresInventoryView } from "../Pages/Inventory/Stores Inventory/StoresInventoryView";
import { ProductionInventoryView } from "../Pages/Inventory/Production Inventory/ProductionInventoryView";
import { ProductionInventoryConsView } from "../Pages/Inventory/Production Inventory/ProductionInventoryConsView";
import { StoresInventoryConsView } from "../Pages/Inventory/Stores Inventory/StoresInventoryConsView";
import { ProductForecastViewAll } from "../Pages/ProductForecast/ProductForecastViewAll";
import { TaskView } from "../Pages/Task/TaskView";
import { UnassignedCustomer } from "../Pages/Cutomers/CompanyDetails/UnassignedCustomer";
import { AllProformaInvoice } from "./../Pages/Invoice/ProformaInvoice/AllProformaInvoice";
import { Followup } from "../Pages/FollowUp/Followup";
import { ActivePI } from "../Pages/Invoice/ProformaInvoice/ActivePI";
import { ApprovePi } from "../Pages/Invoice/ProformaInvoice/ApprovePi";
import { ActiveUsers } from "./../Pages/Users/ActiveUsers";
import { InActiveUsers } from "./../Pages/Users/InActiveUsers";
import { IncompleteKycDetails } from "../Pages/Cutomers/CompanyDetails/IncompleteKycDetails";
import { CompetitorView } from "../Pages/MarketAnalysis/CompetitorView";
import { PriceApprovalPI } from "../Pages/Invoice/ProformaInvoice/PriceApprovalPI";
import { UserProfileView } from "../Pages/Profile/UserProfile/UserProfileView";
import { InActiveCustomer } from "../Pages/Cutomers/CompanyDetails/InActiveCustomer";
import { FaqAllTab } from "../Pages/Faq/FaqAllTab/FaqAllTab";
import { DailySaleReviewView } from "../Pages/DailySaleReview/DailySaleReviewView";
import { HrModelTabs } from "../Pages/HrModel/HrModelTabs";
import { DesignationView } from "../Pages/HrModel/Designation/DesignationView";
import { DepartmentView } from "../Pages/HrModel/Department/DepartmentView";
import { SourceView } from "../Pages/HrModel/CandidateSource/SourceView";
import { CurrencyView } from "../Pages/Currency/CurrencyView";
import { SafetyStockView } from "../Pages/Inventory/SafetyStockLevel/SafetyStockView";
import { WhatsappGroupView } from "../Pages/WhatsappGroup/WhatsappGroupView";
import { WhatsappGroup } from "../Pages/WhatsappGroup/WhatsappGroup";
import { CustomerNoWhatsappGroup } from "../Pages/WhatsappGroup/CustomerNoWhatsappGroup";
import { CustomerNotInGroup } from "../Pages/WhatsappGroup/CustomerNotInGroup";
import { SalesPersonNotInGroup } from "../Pages/WhatsappGroup/SalesPersonNotInGroup";
import { Automation } from "../Pages/WhatsappGroup/Automation";
import { PhysicalInventoryView } from "../Pages/Physcical Inventory/PhysicalInventoryView";
import { AllLeadsTabView } from "../Pages/Leads/AllLeadsTabView";
import { AllProductsTabView } from "../Pages/Products/AllProductsTabView";
import { PriceList } from "../Pages/PriceList/PriceList";
import { AllSKUCodesTabView } from "../Pages/SKU Codes/AllSKUCodesTabView";
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
            path="/user/personal-profile"
            exact
            element={
              <PrivateRoute>
                <UserProfileView />
              </PrivateRoute>
            }
          />
          // Additional Private Routes
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
            path="/products/all-sku-codes"
            element={
              <PrivateRoute>
                <AllSKUCodesTabView />
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
            path="/customers/company-details"
            element={
              <PrivateRoute>
                <CompanyDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/incomplete-kyc-details"
            element={
              <PrivateRoute>
                <IncompleteKycDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/unassigned-company-details"
            element={
              <PrivateRoute>
                <UnassignedCustomer />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/inactive-company-details"
            element={
              <PrivateRoute>
                <InActiveCustomer />
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
            path="/invoice/all-performa-invoice"
            element={
              <PrivateRoute>
                <AllProformaInvoice />
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
            path="/invoice/customer-order-book"
            element={
              <PrivateRoute>
                <CustomerOrderBookDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/product-order-book"
            element={
              <PrivateRoute>
                <ProductOrderBookDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice/pi-order-book"
            element={
              <PrivateRoute>
                <PIOrderBookDetails />
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
            path="/dispatch/view-dispatch"
            element={
              <PrivateRoute>
                <ViewDispatch />
              </PrivateRoute>
            }
          />
          <Route
            path="/dispatch/view-dispatched"
            element={
              <PrivateRoute>
                <Dispatched />
              </PrivateRoute>
            }
          />
          <Route
            path="/dispatch/view-sales-register"
            element={
              <PrivateRoute>
                <SalesRegisterView />
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
            path="/inventory/view-stores-inventory"
            element={
              <PrivateRoute>
                <StoresInventoryView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-stores-inventory-cons"
            element={
              <PrivateRoute>
                <StoresInventoryConsView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-production-inventory"
            element={
              <PrivateRoute>
                <ProductionInventoryView />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory/view-production-inventory-cons"
            element={
              <PrivateRoute>
                <ProductionInventoryConsView />
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
            path="/inventory/view-safety-stock"
            element={
              <PrivateRoute>
                <SafetyStockView />
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
            path="/user/active-user"
            element={
              <PrivateRoute>
                <ActiveUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/inactive-user"
            element={
              <PrivateRoute>
                <InActiveUsers />
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
            path="/hr-model/designation"
            element={
              <PrivateRoute>
                <DesignationView />
              </PrivateRoute>
            }
          />
          <Route
            path="/hr-model/department"
            element={
              <PrivateRoute>
                <DepartmentView />
              </PrivateRoute>
            }
          />
          <Route
            path="/hr-model/source"
            element={
              <PrivateRoute>
                <SourceView />
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
          <Route
            path="/customers/whatsapp-group"
            element={
              <PrivateRoute>
                <WhatsappGroupView />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/not-in-whatsapp-group"
            element={
              <PrivateRoute>
                <CustomerNotInGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/no-sales-person-group"
            element={
              <PrivateRoute>
                <SalesPersonNotInGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/no-whatsapp-group"
            element={
              <PrivateRoute>
                <CustomerNoWhatsappGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/whatsapp"
            element={
              <PrivateRoute>
                <WhatsappGroup />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/automation"
            element={
              <PrivateRoute>
                <Automation />
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
