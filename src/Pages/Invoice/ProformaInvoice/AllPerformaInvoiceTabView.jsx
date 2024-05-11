import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../../Components/CustomTabs";
import { ApprovePi } from "./ApprovePi";
import { ActivePI } from "./ActivePI";
import { PriceApprovalPI } from "./PriceApprovalPI";
import { AllProformaInvoice } from "./AllProformaInvoice";
export const AllPerformaInvoiceTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allTabs = isInGroups("Director", "Accounts");
  const activeAndAllPiTabs = isInGroups(
    "Sales Manager",
    "Sales Deputy Manager",
    "Sales Assistant Deputy Manager",
    "Sales Executive",
    "Sales Manager without Leads",
    "Sales Manager with Lead"
  );
  const approveAndAllTab = isInGroups("Accounts Billing Department");
  const onlyActivePiTab = isInGroups("Customer Service");
  const [activeTab, setActiveTab] = useState(allTabs ? 0 : 4);

  const tabs = [
    {
      label: "Approve PI",
      visible: allTabs || approveAndAllTab,
      index: 0,
    },
    {
      label: "Active PI",
      visible: activeAndAllPiTabs || allTabs || onlyActivePiTab,
      index: 1,
    },
    {
      label: "Price Approval PI",
      visible: allTabs,
      index: 2,
    },
    {
      label: "All PI",
      visible: activeAndAllPiTabs || allTabs || approveAndAllTab,
      index: 3,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const tabComponents = {
    0: <ApprovePi />,
    1: <ActivePI />,
    2: <PriceApprovalPI />,
    3: <AllProformaInvoice />,
  };

  return (
    <div>
      <CustomTabs
        tabs={visibleTabs}
        activeTab={activeTab}
        onTabChange={(index) => setActiveTab(visibleTabIndexes[index])}
      />
      {visibleTabIndexes.includes(activeTab) && (
        <div>{tabComponents[activeTab]}</div>
      )}
    </div>
  );
};
