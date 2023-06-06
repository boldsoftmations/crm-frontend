import React, { useEffect, useState } from "react";
import CustomerServices from "../../../services/CustomerService";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTabs } from "../../../Components/CustomTabs";
import { CustomerPendingFollowup } from "./CustomerPendingFollowup";
import { CustomerTodayFollowup } from "./CustomerTodayFollowup";
import { CustomerUpcomingFollowup } from "./CustomerUpcomingFollowup";

export const CustomerFollowup = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [pendingFollowUp, setPendingFollowUp] = useState([]);
  const [todayFollowUp, setTodayFollowUp] = useState([]);
  const [upcomingFollowUp, setUpcomingFollowUp] = useState([]);
  const [product, setProduct] = useState([]);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  useEffect(() => {
    getProduct();
    getFollowUp();
  }, []);

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

  const getFollowUp = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getCustomerFollowUp();
      setPendingFollowUp(res.data.pending_followups);
      setTodayFollowUp(res.data.todays_followups);
      setUpcomingFollowUp(res.data.upcoming_followups);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.error("error followup", err);
    }
  };

  const tabs = [
    { label: "Customer Pending Followup" },
    { label: "Customer Today Followup" },
    { label: "Customer Upcoming Followup" },
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
              <CustomerPendingFollowup
                product={product}
                pendingFollowUp={pendingFollowUp}
                getFollowUp={getFollowUp}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <CustomerTodayFollowup
                product={product}
                todayFollowUp={todayFollowUp}
                getFollowUp={getFollowUp}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <CustomerUpcomingFollowup
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
