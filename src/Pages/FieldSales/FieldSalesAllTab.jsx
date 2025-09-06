import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { CompanyDetails } from "./CompanyVisitList";
import { ViewBeatCustomer } from "./BeatMaster/ViewBeatCustomer";
import { LeadVisitPlan } from "./LeadVisitList";
export const FieldSalesAllTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Beat Customer",
      roles: ["Director", "Sales Manager", "Sales Manager(Retailer)"],
      component: <ViewBeatCustomer />,
    },

    {
      label: "Customer Visit List",
      roles: ["Director", "Sales Manager", "Sales Manager(Retailer)"],
      component: <CompanyDetails />,
    },
    {
      label: "Lead Visit List",
      roles: ["Director", "Sales Manager", "Sales Manager(Retailer)"],
      component: <LeadVisitPlan />,
    },
  ];

  const visibleTabs = tabs.filter((tab) => isInGroups(...tab.roles));

  // Simplified active tab state to always start with the first item of visibleTabs if available
  const [activeTab, setActiveTab] = useState(0);

  const onTabChange = (newIndex) => {
    setActiveTab(newIndex);
  };

  return (
    <>
      <CustomTabs
        tabs={visibleTabs.map((tab) => ({
          label: tab.label,
          index: tab.index,
        }))}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      {visibleTabs.length > 0 && visibleTabs[activeTab] ? (
        <div>{visibleTabs[activeTab].component}</div>
      ) : null}
    </>
  );
};
