import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TallyInvoice } from "./TallyInvoice";
import { SalesInvoiceView } from "./SalesInvoiceView";
import { CustomTabs } from "../../../Components/CustomTabs";

export const SalesInvoiceAllTab = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Sales Invoice",
      roles: ["Director", "Accounts", "Accounts Billing Department"],
      component: <SalesInvoiceView />,
    },
    {
      label: "Tally Invoice Export",
      roles: ["Director", "Accounts", "Accounts Billing Department"],
      component: <TallyInvoice />,
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
