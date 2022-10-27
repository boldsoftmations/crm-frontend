import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import { AssignTo } from "../Pages/Leads/AssignTo";
import { CreateBasicUnit } from "./../Pages/Products/BasicUnit/CreateBasicUnit";
import { CreateBrand } from "./../Pages/Products/Brand/CreateBrand";
import { CreateColor } from "../Pages/Products/Color/CreateColor";
import { CreateConsumable } from "../Pages/Products/Consumable/CreateConsumable";
import { CreateDescription } from "./../Pages/Products/Description/CreateDescription";
import { CreateFinishGoods } from "./../Pages/Products/FinishGoods/CreateFinishGoods";
import { CreateLeads } from "../Pages/Leads/CreateLeads";
import { CreatePackingUnit } from "./../Pages/Products/PackingUnit/CreatePackingUnit";
import { CreateProductCode } from "./../Pages/Products/ProductCode/CreateProductCode";
import { CreateRawMaterials } from "../Pages/Products/RawMaterials/CreateRawMaterials";
import { CreateUnit } from "./../Pages/Products/Unit/CreateUnit";
import { Customers } from "../Pages/Customers";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import { ForgotPassword } from "../Pages/Auth/ForgotPassword";
import { Home } from "../Pages/Home";
import { Login } from "../Pages/Auth/Login";
import { PageNotFound } from "../Components/Page/PageNotFound";
import { PendingFollowup } from "../Pages/FollowUp/PendingFollowup";
import { SignUp } from "../Pages/Auth/SignUp";
import { TodayFollowup } from "../Pages/FollowUp/TodayFollowup";
import { UpcomingFollowup } from "../Pages/FollowUp/UpcomingFollowup";
import { UpdateBasicUnit } from "./../Pages/Products/BasicUnit/UpdateBasicUnit";
import { UpdateBrand } from "./../Pages/Products/Brand/UpdateBrand";
import { UpdateColor } from "../Pages/Products/Color/UpdateColor";
import { UpdateConsumable } from "../Pages/Products/Consumable/UpdateConsumable";
import { UpdateDescription } from "./../Pages/Products/Description/UpdateDescription";
import { UpdateFinishGoods } from "./../Pages/Products/FinishGoods/UpdateFinishGoods";
import { UpdateLeads } from "./../Pages/Leads/UpdateLeads";
import { UpdatePackingUnit } from "./../Pages/Products/PackingUnit/UpdatePackingUnit";
import { UpdateProductCode } from "./../Pages/Products/ProductCode/UpdateProductCode";
import { UpdateRawMaterials } from "./../Pages/Products/RawMaterials/UpdateRawMaterials";
import { UpdateUnit } from "./../Pages/Products/Unit/UpdateUnit";
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

export const RouteScreen = () => {
  const token = useSelector((state) => state.auth);
  return (
    <div className="appcontainer">
      <Routes>
        <Route path="/crm-frontend" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {token.user && (
          <>
            <Route path="/user/dashoard" element={<Dashboard />} />
            {/* Leads Routes */}
            <Route path="/leads/create-lead" element={<CreateLeads />} />
            <Route path="/leads/view-lead" element={<Viewleads />} />
            <Route path="/leads/update-lead/:id" element={<UpdateLeads />} />
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
            <Route path="/user/customer" element={<Customers />} />
            {/* Products Routes */}
            <Route path="/products/create-colors" element={<CreateColor />} />
            <Route path="/products/view-colors" element={<ViewColors />} />
            <Route
              path="/products/update-color/:id"
              element={<UpdateColor />}
            />
            <Route path="/products/create-brand" element={<CreateBrand />} />
            <Route path="/products/view-brand" element={<ViewBrand />} />
            <Route
              path="/products/update-brand/:id"
              element={<UpdateBrand />}
            />
            <Route
              path="/products/create-basic-unit"
              element={<CreateBasicUnit />}
            />
            <Route
              path="/products/view-basic-unit"
              element={<ViewBasicUnit />}
            />
            <Route
              path="/products/update-basic-unit/:id"
              element={<UpdateBasicUnit />}
            />
            <Route path="/products/create-unit" element={<CreateUnit />} />
            <Route path="/products/view-unit" element={<ViewUnit />} />
            <Route path="/products/update-unit/:id" element={<UpdateUnit />} />
            <Route
              path="/products/create-packing-unit"
              element={<CreatePackingUnit />}
            />
            <Route
              path="/products/view-packing-unit"
              element={<ViewPackingUnit />}
            />
            <Route
              path="/products/update-packing-unit/:id"
              element={<UpdatePackingUnit />}
            />
            <Route
              path="/products/create-description"
              element={<CreateDescription />}
            />
            <Route
              path="/products/view-description"
              element={<ViewDescription />}
            />
            <Route
              path="/products/update-description/:id"
              element={<UpdateDescription />}
            />
            <Route
              path="/products/create-product-code"
              element={<CreateProductCode />}
            />
            <Route
              path="/products/view-product-code"
              element={<ViewProductCode />}
            />
            <Route
              path="/products/update-product-code/:id"
              element={<UpdateProductCode />}
            />
            <Route
              path="/products/create-consumable"
              element={<CreateConsumable />}
            />
            <Route
              path="/products/view-consumable"
              element={<ViewConsumable />}
            />
            <Route
              path="/products/update-consumable/:id"
              element={<UpdateConsumable />}
            />
            <Route
              path="/products/create-finish-goods"
              element={<CreateFinishGoods />}
            />
            <Route
              path="/products/view-finish-goods"
              element={<ViewFinishGoods />}
            />
            <Route
              path="/products/update-finish-goods/:id"
              element={<UpdateFinishGoods />}
            />
            <Route
              path="/products/create-raw-materials"
              element={<CreateRawMaterials />}
            />
            <Route
              path="/products/view-raw-materials"
              element={<ViewRawMaterials />}
            />
            <Route
              path="/products/update-raw-materials/:id"
              element={<UpdateRawMaterials />}
            />
            <Route path="*" element={<PageNotFound />} />
          </>
        )}
      </Routes>
    </div>
  );
};
