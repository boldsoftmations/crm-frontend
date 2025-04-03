import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ViewSRF } from "./ViewSRF";
import { CustomTabs } from "../../../Components/CustomTabs";
export const AllSRFTab = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Sample Request Form",
      roles: [
        "Director",
        "Sales Manager",
        "Production",
        "Customer Service",
        "Sales Executive",
        "Customer Relationship Executive",
        "Customer Relationship Manager",
        "Business Development Manager",
        "Business Development Executive",
      ],
      component: <ViewSRF />,
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
