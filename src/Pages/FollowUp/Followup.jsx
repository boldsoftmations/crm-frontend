import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTabs } from "../../Components/CustomTabs";
import InvoiceServices from "../../services/InvoiceService";
import { getSellerAccountData } from "../../Redux/Action/Action";
import { useDispatch, useSelector } from "react-redux";
import ProductService from "../../services/ProductService";
import LeadServices from "../../services/LeadService";
import { AllFollowup } from "./AllFollowup";
import { PendingFollowup } from "./PendingFollowup";
import { UpcomingFollowup } from "./UpcomingFollowup";
import { TodayFollowup } from "./TodayFollowup";

export const Followup = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [assigned, setAssigned] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [product, setProduct] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProduct();
    getAssignedData();
    getDescriptionNoData();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      dispatch(getSellerAccountData(response.data));
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const getAssignedData = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getDescriptionNoData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      setDescriptionMenuData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const isUserInGroups = (groups, userGroups) => {
    return groups.some((group) => userGroups.includes(group));
  };

  const SalesTabs = [
    { label: "Overdue Followup" },
    { label: "Today Followup" },
    { label: "Upcoming Followup" },
  ];

  const StaffTabs = [
    { label: "Overdue Followup" },
    { label: "Today Followup" },
    { label: "Upcoming Followup" },
    { label: "All Followup" },
  ];

  const visibleTabs = isUserInGroups(
    ["Director", "Sales Manager", "Sales Deputy Manager"],
    userData.groups
  )
    ? StaffTabs
    : SalesTabs;

  return (
    <div>
      <CustomLoader open={open} />
      <div>
        <CustomTabs
          tabs={visibleTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div>
          {activeTab === 0 && (
            <div>
              <PendingFollowup />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <TodayFollowup />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <UpcomingFollowup />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <AllFollowup />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
