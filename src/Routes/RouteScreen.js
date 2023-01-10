import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { AssignTo } from "../Pages/Leads/AssignTo";
import { ChangePassword } from "./../Pages/Auth/ChangePassword";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import { ForgotPassword } from "./../Pages/Auth/ForgotPassword";
import { PageNotFound } from "../Components/Page/PageNotFound";
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
import LeadServices from "./../services/LeadService";
import { getProfileUser } from "./../Redux/Action/Action";

export const RouteScreen = () => {
  const dispatch = useDispatch();
  const tokenData = useSelector((state) => state.auth);
  const token = tokenData.user;

  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token]);

  const getUsers = async () => {
    try {
      const res = await LeadServices.getProfile();
      dispatch(getProfileUser(res.data));
      // setUserData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
            {/* <Route path="/" exact element={<Dashboard />} /> */}
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
            <Route path="*" element={<Dashboard />} />
          </>
        )}
        <Route path="*" element={<Auths />} />
      </Routes>
    </div>
  );
};
