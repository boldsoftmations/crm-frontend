import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CompanyDetails } from "./CompanyDetails";
import { UnassignedCustomer } from "./UnassignedCustomer";
import { InActiveCustomer } from "./InActiveCustomer";
import { IncompleteKycDetails } from "./IncompleteKycDetails";
import { CustomTabs } from "../../../Components/CustomTabs";

export const AllCustomerTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allCustomerTabs = isInGroups("Director", "Sales Manager", "Accounts");
  const customerAndIncompleteKycTabs = isInGroups(
    "Director",
    "Sales Deputy Manager",
    "Sales Assistant Deputy Manager",
    "Sales Executive",
    "Sales Manager without Leads",
    "Sales Manager with Lead"
  );
  const customerOnlyTab = isInGroups(
    "Director",
    "Customer Service",
    "Accounts Billing Department"
  );

  const [activeTab, setActiveTab] = useState(allCustomerTabs ? 0 : 4);

  const tabs = [
    {
      label: "Company Details",
      visible:
        allCustomerTabs || customerAndIncompleteKycTabs || customerOnlyTab,
      index: 0,
    },
    {
      label: "Unassigned Customer",
      visible: allCustomerTabs,
      index: 1,
    },
    {
      label: "InActive Employees",
      visible: allCustomerTabs,
      index: 2,
    },
    {
      label: "InComplete KYC",
      visible: allCustomerTabs || customerAndIncompleteKycTabs,
      index: 3,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const tabComponents = {
    0: <CompanyDetails />,
    1: <UnassignedCustomer />,
    2: <InActiveCustomer />,
    3: <IncompleteKycDetails />,
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
