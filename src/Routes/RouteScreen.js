import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import { UnassignedLead } from "../Pages/Leads/UnassignedLead";
import { ChangePassword } from "./../Pages/Auth/ChangePassword";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import { ForgotPassword } from "./../Pages/Auth/ForgotPassword";
import { ViewBasicUnit } from "./../Pages/Products/BasicUnit/ViewBasicUnit";
import { ViewBrand } from "./../Pages/Products/Brand/ViewBrand";
import { ViewColors } from "../Pages/Products/Color/ViewColors";
import { ViewConsumable } from "../Pages/Products/Consumable/ViewConsumable";
import { ViewDescription } from "./../Pages/Products/Description/ViewDescription";
import { ViewFinishGoods } from "./../Pages/Products/FinishGoods/ViewFinishGoods";
import { ViewPackingUnit } from "./../Pages/Products/PackingUnit/ViewPackingUnit";
import { ViewProductCode } from "./../Pages/Products/ProductCode/ViewProductCode";
import { ViewRawMaterials } from "./../Pages/Products/RawMaterials/ViewRawMaterials";
import { ViewUnit } from "./../Pages/Products/Unit/ViewUnit";
import { CompanyDetails } from "../Pages/Cutomers/CompanyDetails/CompanyDetails";
import { PriceList } from "./../Pages/Products/PriceList/PriceList";
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
import { Home } from "../Pages/Home";
import { VendorView } from "../Pages/Inventory/VendorInventoryDetail/VendorView";
import { PackingListView } from "../Pages/Inventory/PackingList/PackingListView";
import { GRNView } from "../Pages/Inventory/GRN/GRNView";
import { PurchaseInvoiceView } from "../Pages/Inventory/Purchase Invoice/PurchaseInvoiceView";
import { StoresInventoryView } from "../Pages/Inventory/Stores Inventory/StoresInventoryView";
import { MaterialRequisitionFormView } from "../Pages/Inventory/Material Requisition Form/MaterialRequisitionFormView";
import { BillofMaterialsView } from "../Pages/Inventory/Bill of Materials/BillofMaterialsView";
import { ProductionEntryView } from "../Pages/Inventory/Production Entry/ProductionEntryView";
import { MaterialTransferNoteView } from "../Pages/Inventory/Material Transfer Note/MaterialTransferNoteView";
import { ProductionInventoryView } from "../Pages/Inventory/Production Inventory/ProductionInventoryView";
import { ProductionInventoryConsView } from "../Pages/Inventory/Production Inventory/ProductionInventoryConsView";
import { StoresInventoryConsView } from "../Pages/Inventory/Stores Inventory/StoresInventoryConsView";
import { ProductionInventoryGAndLView } from "../Pages/Inventory/Production Entry/ProductionInventoryGAndLView";
import { ProductionShortFallView } from "../Pages/Inventory/ProductionShortFall/ProductionShortFallView";
import { ProductForecastViewAll } from "../Pages/ProductForecast/ProductForecastViewAll";
import { TaskView } from "../Pages/Task/TaskView";
import { DailyProductionReport } from "../Pages/Inventory/ProductionReport/DailyProductionReport";
import { WeeklyProductionReport } from "../Pages/Inventory/ProductionReport/WeeklyProductionReport";
import { UnassignedCustomer } from "../Pages/Cutomers/CompanyDetails/UnassignedCustomer";
import { NewLeads } from "../Pages/Leads/NewLeads";
import { OpenLead } from "../Pages/Leads/OpenLead";
import { ClosedLead } from "../Pages/Leads/ClosedLead";
import { AllProformaInvoice } from "./../Pages/Invoice/ProformaInvoice/AllProformaInvoice";
import { DuplicateLead } from "../Pages/Leads/DuplicateLead";
import { Followup } from "../Pages/FollowUp/Followup";
import { ActivePI } from "../Pages/Invoice/ProformaInvoice/ActivePI";
import { ApprovePi } from "../Pages/Invoice/ProformaInvoice/ApprovePi";
import { HotLeads } from "../Pages/Leads/HotLeads";
import { ActiveUsers } from "./../Pages/Users/ActiveUsers";
import { InActiveUsers } from "./../Pages/Users/InActiveUsers";
import { IncompleteKycDetails } from "../Pages/Cutomers/CompanyDetails/IncompleteKycDetails";
import { CompetitorView } from "../Pages/MarketAnalysis/CompetitorView";
import { PriceApprovalPI } from "../Pages/Invoice/ProformaInvoice/PriceApprovalPI";
import { TeamWiseDashboard } from "../Pages/TeamWiseDashboard";
import { UserProfileView } from "../Pages/Profile/UserProfile/UserProfileView";
import { IndiaMartLeads } from "../Pages/Leads/IndiaMartLeads";
import { InActiveCustomer } from "../Pages/Cutomers/CompanyDetails/InActiveCustomer";
import { FaqAllTab } from "../Pages/Faq/FaqAllTab/FaqAllTab";

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
            <Route path="/user/analytics" exact element={<Home />} />
            <Route
              path="/user/team-analytics"
              exact
              element={<TeamWiseDashboard />}
            />
            <Route path="/user/dashoard" element={<Dashboard />} />
            <Route path="/user/profile" exact element={<Profile />} />
            <Route
              path="/user/personal-profile"
              exact
              element={<UserProfileView />}
            />
            {/* Leads Routes */}
            <Route path="/leads/hot-lead" element={<HotLeads />} />
            <Route path="/leads/new-lead" element={<NewLeads />} />
            <Route path="/leads/indiamart-lead" element={<IndiaMartLeads />} />
            <Route path="/leads/open-lead" element={<OpenLead />} />
            <Route path="/leads/closed-lead" element={<ClosedLead />} />
            <Route path="/leads/duplicate-lead" element={<DuplicateLead />} />
            <Route
              path="/leads/view-unassigned-lead"
              element={<UnassignedLead />}
            />
            {/* Products Routes */}
            <Route path="/products/view-colors" element={<ViewColors />} />
            <Route path="/products/view-brand" element={<ViewBrand />} />
            <Route
              path="/products/view-basic-unit"
              element={<ViewBasicUnit />}
            />
            <Route path="/products/view-unit" element={<ViewUnit />} />
            <Route
              path="/products/view-packing-unit"
              element={<ViewPackingUnit />}
            />
            <Route
              path="/products/view-description"
              element={<ViewDescription />}
            />
            <Route
              path="/products/view-product-code"
              element={<ViewProductCode />}
            />
            <Route
              path="/products/view-consumable"
              element={<ViewConsumable />}
            />
            <Route
              path="/products/view-finish-goods"
              element={<ViewFinishGoods />}
            />
            <Route
              path="/products/view-raw-materials"
              element={<ViewRawMaterials />}
            />
            <Route path="/products/view-price-list" element={<PriceList />} />
            {/* Customers Route */}
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
            <Route path="/dispatch/view-dispatch" element={<ViewDispatch />} />
            <Route path="/dispatch/view-dispatched" element={<Dispatched />} />
            <Route
              path="/dispatch/view-sales-register"
              element={<SalesRegisterView />}
            />
            {/* inventory Routes */}
            <Route path="/inventory/view-vendor" element={<VendorView />} />
            <Route
              path="/inventory/view-packing_list"
              element={<PackingListView />}
            />
            <Route path="/inventory/view-grn" element={<GRNView />} />
            <Route
              path="/inventory/view-purchase-invoice"
              element={<PurchaseInvoiceView />}
            />
            <Route
              path="/inventory/view-stores-inventory"
              element={<StoresInventoryView />}
            />
            <Route
              path="/inventory/view-stores-inventory-cons"
              element={<StoresInventoryConsView />}
            />
            <Route
              path="/inventory/view-material-requisition-form"
              element={<MaterialRequisitionFormView />}
            />
            <Route
              path="/inventory/view-bill-of-materials"
              element={<BillofMaterialsView />}
            />
            <Route
              path="/inventory/view-production-entry"
              element={<ProductionEntryView />}
            />
            <Route
              path="/inventory/view-material-transfer-note"
              element={<MaterialTransferNoteView />}
            />
            <Route
              path="/inventory/view-production-inventory"
              element={<ProductionInventoryView />}
            />
            <Route
              path="/inventory/view-production-inventory-cons"
              element={<ProductionInventoryConsView />}
            />
            <Route
              path="/inventory/view-production-inventory-g&l"
              element={<ProductionInventoryGAndLView />}
            />
            <Route
              path="/inventory/view-production-shortfall"
              element={<ProductionShortFallView />}
            />
            <Route
              path="/inventory/view-daily-production"
              element={<DailyProductionReport />}
            />
            <Route
              path="/inventory/view-weekly-production"
              element={<WeeklyProductionReport />}
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
            <Route path="*" element={<Home />} />
          </>
        )}
        <Route path="*" element={<Auths />} />
      </Routes>
    </div>
  );
};
