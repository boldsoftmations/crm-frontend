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
  const [pendingFollowUp, setPendingFollowUp] = useState([]);
  const [todayFollowUp, setTodayFollowUp] = useState([]);
  const [upcomingFollowUp, setUpcomingFollowUp] = useState([]);
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
    getFollowUp();
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

  const getFollowUp = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllFollowUp();
      setPendingFollowUp(res.data.pending_followups);
      setTodayFollowUp(res.data.todays_followups);
      setUpcomingFollowUp(res.data.upcoming_followups);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("error followup", err);
    }
  };

  const SalesTabs = [
    { label: "Pending Followup" },
    { label: "Today Followup" },
    { label: "Upcoming Followup" },
  ];

  const StaffTabs = [
    { label: "Pending Followup" },
    { label: "Today Followup" },
    { label: "Upcoming Followup" },
    { label: "All Followup" },
  ];

  return (
    <div>
      <CustomLoader open={open} />
      <div>
        <CustomTabs
          tabs={userData.is_staff === true ? StaffTabs : SalesTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div>
          {activeTab === 0 && (
            <div>
              <PendingFollowup
                assigned={assigned}
                descriptionMenuData={descriptionMenuData}
                product={product}
                pendingFollowUp={pendingFollowUp}
                getFollowUp={getFollowUp}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <TodayFollowup
                assigned={assigned}
                descriptionMenuData={descriptionMenuData}
                product={product}
                todayFollowUp={todayFollowUp}
                getFollowUp={getFollowUp}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <UpcomingFollowup
                assigned={assigned}
                descriptionMenuData={descriptionMenuData}
                product={product}
                upcomingFollowUp={upcomingFollowUp}
                getFollowUp={getFollowUp}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <AllFollowup
                assigned={assigned}
                descriptionMenuData={descriptionMenuData}
                product={product}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
