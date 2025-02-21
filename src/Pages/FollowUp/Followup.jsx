import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { CustomerFollowup } from "./CustomerFollow";
import { LeadFollowup } from "./LeadFollowup";
export const Followup = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Customer Followup",
      roles: [
        "Director",
        "Sales Manager",
        "Business Development Manager",
        "Business Development Executive",
        "Customer Relationship Executive",
        "Customer Relationship Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Sales Manager without Leads",
        "Sales Manager with Lead",
      ],
      component: <CustomerFollowup />,
    },
    {
      label: "Lead Followup",
      roles: [
        "Director",
        "Sales Manager",
        "Business Development Manager",
        "Business Development Executive",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Sales Manager without Leads",
        "Sales Manager with Lead",
      ],
      component: <LeadFollowup />,
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
