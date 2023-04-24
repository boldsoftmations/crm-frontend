import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import { AssignTo } from "../Pages/Leads/AssignTo";
import { ChangePassword } from "./../Pages/Auth/ChangePassword";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import { ForgotPassword } from "./../Pages/Auth/ForgotPassword";
// import { PageNotFound } from "../Components/Page/PageNotFound";
import { PendingFollowup } from "../Pages/FollowUp/PendingFollowup";
import { TodayFollowup } from "../Pages/FollowUp/TodayFollowup";
import { UpcomingFollowup } from "../Pages/FollowUp/UpcomingFollowup";
import { ViewBasicUnit } from "./../Pages/Products/BasicUnit/ViewBasicUnit";
import { ViewBrand } from "./../Pages/Products/Brand/ViewBrand";
import { ViewColors } from "../Pages/Products/Color/ViewColors";
import { ViewConsumable } from "../Pages/Products/Consumable/ViewConsumable";
import { ViewDescription } from "./../Pages/Products/Description/ViewDescription";
import { ViewFinishGoods } from "./../Pages/Products/FinishGoods/ViewFinishGoods";
import { Viewleads } from "../Pages/Leads/ViewLeads";
import { ViewPackingUnit } from "./../Pages/Products/PackingUnit/ViewPackingUnit";
import { ViewProductCode } from "./../Pages/Products/ProductCode/ViewProductCode";
import { ViewRawMaterials } from "./../Pages/Products/RawMaterials/ViewRawMaterials";
import { ViewUnit } from "./../Pages/Products/Unit/ViewUnit";

import "../App.css";
import { CompanyDetails } from "../Pages/Cutomers/CompanyDetails/CompanyDetails";
import { PriceList } from "./../Pages/Products/PriceList/PriceList";
import { SellerAccount } from "./../Pages/Invoice/Seller Account/SellerAccount";
import { ViewCustomerProformaInvoice } from "../Pages/Invoice/CustomerPerformaInvoice/ViewCustomerProformaInvoice";
import { ViewLeadsProformaInvoice } from "./../Pages/Invoice/LeadsPerformaInvoice/ViewLeadsProformaInvoice";
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
import { ProductForecastView } from "../Pages/ProdutForecast/ProductForecastView";

export const RouteScreen = () => {
  const tokenData = useSelector((state) => state.auth);
  const token = tokenData.user;

  return (
    <div className="appcontainer">
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
            <Route path="/user/home" exact element={<Home />} />
            <Route path="/user/dashoard" element={<Dashboard />} />
            <Route path="/user/profile" exact element={<Profile />} />
            {/* Leads Routes */}
            <Route path="/leads/view-lead" element={<Viewleads />} />
            <Route
              path="/leads/view-today-followup"
              element={<TodayFollowup />}
            />
            <Route
              path="/leads/view-pending-followup"
              element={<PendingFollowup />}
            />{" "}
            <Route
              path="/leads/view-upcoming-followup"
              element={<UpcomingFollowup />}
            />
            <Route path="/leads/view-assignedto" element={<AssignTo />} />
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
            {/* Invoice - Seller Account Route */}
            <Route path="/invoice/seller-account" element={<SellerAccount />} />
            <Route
              path="/invoice/performa-invoice"
              element={<ViewCustomerProformaInvoice />}
            />
            <Route
              path="/invoice/leads-performa-invoice"
              element={<ViewLeadsProformaInvoice />}
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
            {/* ProductForecast Route */}
            <Route
              path="/forecast/view-product-forecast"
              element={<ProductForecastView />}
            />
            <Route path="*" element={<Home />} />
          </>
        )}
        <Route path="*" element={<Auths />} />
      </Routes>
    </div>
  );
};
