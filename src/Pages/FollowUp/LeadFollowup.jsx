import React, { useEffect, useRef, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTabs } from "../../Components/CustomTabs";
import InvoiceServices from "../../services/InvoiceService";
import { getSellerAccountData } from "../../Redux/Action/Action";
import { useDispatch } from "react-redux";
import ProductService from "../../services/ProductService";
import LeadServices from "../../services/LeadService";
import { LeadPendingFollowup } from "./LeadPendingFollowup";
import { LeadTodayFollowup } from "./LeadTodayFollowup";
import { LeadUpcomingFollowup } from "./LeadUpcomingFollowup";

export const LeadFollowup = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [pendingFollowUp, setPendingFollowUp] = useState([]);
  const [todayFollowUp, setTodayFollowUp] = useState([]);
  const [upcomingFollowUp, setUpcomingFollowUp] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [product, setProduct] = useState([]);
  const dispatch = useDispatch();

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
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  const tabs = [
    { label: "Lead Pending Followup" },
    { label: "Lead Today Followup" },
    { label: "Lead Upcoming Followup" },
  ];

  return (
    <div>
      <CustomLoader open={open} />
      <div>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div>
          {activeTab === 0 && (
            <div>
              <LeadPendingFollowup
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
              <LeadTodayFollowup
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
              <LeadUpcomingFollowup
                assigned={assigned}
                descriptionMenuData={descriptionMenuData}
                product={product}
                upcomingFollowUp={upcomingFollowUp}
                getFollowUp={getFollowUp}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
