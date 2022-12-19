import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import { AssignTo } from "../Pages/Leads/AssignTo";
import { ChangePassword } from "./../Pages/Auth/ChangePassword";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import { ForgotPassword } from "./../Pages/Auth/ForgotPassword";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Auth/Login";
import { PageNotFound } from "../Components/Page/PageNotFound";
import { PendingFollowup } from "../Pages/FollowUp/PendingFollowup";
import { SignUp } from "../Pages/Auth/SignUp";
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
import { ViewCustomerProformaInvoice } from '../Pages/Invoice/CustomerPerformaInvoice/ViewCustomerProformaInvoice';
import { ViewLeadsProformaInvoice } from './../Pages/Invoice/LeadsPerformaInvoice/ViewLeadsProformaInvoice';

export const RouteScreen = () => {
  const token = useSelector((state) => state.auth);
  return (
    <div className="appcontainer">
      <Routes>
        <Route path="/crmfrontend-glutape" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/change-password/:id/:token"
          element={<ChangePassword />}
        />

        {token.user && (
          <>
            <Route path="/user/dashoard" element={<Dashboard />} />
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
            <Route path="*" element={<PageNotFound />} />
          </>
        )}
      </Routes>
    </div>
  );
};
