import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
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

export const RouteScreen = () => {
  const tokenData = useSelector((state) => state.auth);
  const token = tokenData.user;

  return (
    <div>
      <Routes>
        {!token && (
          <>
            <Route path="/" exact element={<Auths />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/change-password/:id/:token"
              element={<ChangePassword />}
            />
          </>
        )}

        {token && (
          <>
            <Route
              path="/user/analytics"
              exact
              element={<AnalyticsAllTabView />}
            />
            <Route path="/user/report" element={<Report />} />
            <Route path="/user/profile" exact element={<Profile />} />
            <Route
              path="/user/profile-tab"
              exact
              element={<AllProfileTabView />}
            />
            <Route
              path="/user/personal-profile"
              exact
              element={<UserProfileView />}
            />
            {/* Leads Routes */}
            <Route path="/leads/all-lead" element={<AllLeadsTabView />} />
            {/* Products Routes */}
            <Route
              path="/products/all-product"
              element={<AllProductsTabView />}
            />
            {/* SKU Codes Routes */}
            <Route
              path="/products/all-sku-codes"
              element={<AllSKUCodesTabView />}
            />
            <Route path="/products/view-price-list" element={<PriceList />} />
            {/* Customers Route */}
            <Route
              path="/customers/all-customer"
              element={<AllCustomerTabView />}
            />
            <Route
              path="/customers/company-details"
              element={<CompanyDetails />}
            />
            <Route
              path="/customers/incomplete-kyc-details"
              element={<IncompleteKycDetails />}
            />
            <Route
              path="/customers/unassigned-company-details"
              element={<UnassignedCustomer />}
            />
            <Route
              path="/customers/inactive-company-details"
              element={<InActiveCustomer />}
            />
            <Route path="/followp/view-followup" element={<Followup />} />
            {/* Invoice - Seller Account Route */}
            <Route path="/invoice/seller-account" element={<SellerAccount />} />
            <Route
              path="/invoice/performa-invoice-tab"
              element={<AllPerformaInvoiceTabView />}
            />
            <Route path="/invoice/approve-pi" element={<ApprovePi />} />
            <Route path="/invoice/active-pi" element={<ActivePI />} />
            <Route
              path="/invoice/price-approval-pi"
              element={<PriceApprovalPI />}
            />
            <Route
              path="/invoice/all-performa-invoice"
              element={<AllProformaInvoice />}
            />
            <Route
              path="/invoice/sales-invoice"
              element={<SalesInvoiceView />}
            />
            {/* Order Book */}
            <Route
              path="/invoice/orderbook-tab"
              element={<AllOrderBookTabView />}
            />
            <Route
              path="/invoice/customer-order-book"
              element={<CustomerOrderBookDetails />}
            />
            <Route
              path="/invoice/product-order-book"
              element={<ProductOrderBookDetails />}
            />
            <Route
              path="/invoice/pi-order-book"
              element={<PIOrderBookDetails />}
            />
            {/* Dispatch Routes */}
            <Route path="/dispatch/tab-view" element={<AllDispatchTabView />} />
            <Route path="/dispatch/view-dispatch" element={<ViewDispatch />} />
            <Route path="/dispatch/view-dispatched" element={<Dispatched />} />
            <Route
              path="/dispatch/view-sales-register"
              element={<SalesRegisterView />}
            />
            {/* inventory Routes */}
            <Route
              path="/inventory/view-purchase"
              element={<PurchaseAllTabView />}
            />
            <Route
              path="/inventory/view-production"
              element={<ProductionAllTabView />}
            />
            <Route
              path="/inventory/view-inventory"
              element={<InventoryAllTabView />}
            />
            <Route path="/inventory/view-vendor" element={<VendorView />} />
            <Route
              path="/inventory/view-stores-inventory"
              element={<StoresInventoryView />}
            />
            <Route
              path="/inventory/view-stores-inventory-cons"
              element={<StoresInventoryConsView />}
            />
            <Route
              path="/inventory/view-production-inventory"
              element={<ProductionInventoryView />}
            />
            <Route
              path="/inventory/view-production-inventory-cons"
              element={<ProductionInventoryConsView />}
            />
            <Route path="/inventory/view-currency" element={<CurrencyView />} />
            <Route
              path="/inventory/view-safety-stock"
              element={<SafetyStockView />}
            />
            <Route
              path="/inventory/physical"
              element={<PhysicalInventoryView />}
            />
            {/* ProductForecast Route */}
            <Route
              path="/forecast/view-product-forecast"
              element={<ProductForecastViewAll />}
            />
            {/* task Routes */}
            <Route path="/task/view-task" element={<TaskView />} />
            <Route path="/user/active-user" element={<ActiveUsers />} />
            <Route path="/user/inactive-user" element={<InActiveUsers />} />
            <Route
              path="/market-analysis/competitor"
              element={<CompetitorView />}
            />
            // FAQ Routes
            <Route path="/user/faq" element={<FaqAllTab />} />
            {/* Daily sale review */}
            <Route path="/user/sale-review" element={<DailySaleReviewView />} />
            <Route path="/hr-model" element={<HrModelTabs />} />
            <Route path="/hr-model/hr-master" element={<HrMasterTabView />} />
            <Route path="/hr-model/designation" element={<DesignationView />} />
            <Route path="/hr-model/department" element={<DepartmentView />} />
            <Route path="/hr-model/source" element={<SourceView />} />
            <Route
              path="/customers/whatsapp-tabs"
              element={<AllWhatsappTabs />}
            />
            <Route
              path="/customers/whatsapp-group"
              element={<WhatsappGroupView />}
            />
            <Route
              path="/customers/not-in-whatsapp-group"
              element={<CustomerNotInGroup />}
            />
            <Route
              path="/customers/no-sales-person-group"
              element={<SalesPersonNotInGroup />}
            />
            <Route
              path="/customers/no-whatsapp-group"
              element={<CustomerNoWhatsappGroup />}
            />
            <Route path="/customers/whatsapp" element={<WhatsappGroup />} />
            <Route path="/customers/automation" element={<Automation />} />
          </>
        )}
        <Route path="*" element={<Auths />} />
      </Routes>
    </div>
  );
};
