import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";

import { MasterTransportView } from "./TransportMaster/MasterTransportView";
import TransPortMapping from "./TransPortMapping/TransPortMapping";
import ContactTransportView from "./TransportContact/ContactTransportView";
export const AllTransportMasterTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Transport Master",
      roles: [
        "Director",
        "Sales Manager",
        "Sales Manager(Retailer)",
        "Business Development Manager",

        "Customer Relationship Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Operations & Supply Chain Manager",
        "Sales Manager without Leads",
        "Sales Manager with Lead",
      ],
      component: <MasterTransportView />,
    },
    {
      label: "Transport Mapping",
      roles: [
        "Director",
        "Sales Manager",
        "Sales Manager(Retailer)",
        "Business Development Manager",

        "Customer Relationship Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Operations & Supply Chain Manager",

        "Sales Manager without Leads",
        "Sales Manager with Lead",
      ],
      component: <TransPortMapping />,
    },

    {
      label: "Transport Contact",
      roles: [
        "Director",
        "Sales Manager",
        "Sales Manager(Retailer)",
        "Business Development Manager",

        "Customer Relationship Executive",
        "Customer Relationship Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Operations & Supply Chain Manager",
        "Sales Manager without Leads",
        "Sales Manager with Lead",
      ],
      component: <ContactTransportView />,
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
