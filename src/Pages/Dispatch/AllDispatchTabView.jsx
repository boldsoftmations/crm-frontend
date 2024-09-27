import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { ViewDispatch } from "./ViewDispatch";
import { Dispatched } from "./Dispatched";
import { SalesRegisterView } from "./SalesRegisterView";

export const AllDispatchTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allTabs = isInGroups(
    "Director",
    "Accounts",
    "Sales Manager",
    "Sales Executive",
    "Customer Relationship Manager",
    "Customer Relationship Executive",
    "Sales Deputy Manager",
    "Sales Assistant Deputy Manager",
    "Business Development Manager",
    "Business Development Executive"
  );

  const twoTabs = isInGroups(
    "Factory-Delhi-Dispatch",
    "Factory-Mumbai-Dispatch",
    "Stores Delhi",
    "Production Delhi"
  );
  const customerServiceTab = isInGroups("Customer Service");
  const [activeTab, setActiveTab] = useState(allTabs ? 0 : 4);

  const tabs = [
    {
      label: "Pending Dispatch",
      visible: allTabs || twoTabs || customerServiceTab,
      index: 0,
    },

    {
      label: "Dispatched",
      visible: allTabs || twoTabs || customerServiceTab,
      index: 1,
    },

    {
      label: "Sales Register",
      visible: allTabs || customerServiceTab,
      index: 2,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const tabComponents = {
    0: <ViewDispatch />,
    1: <Dispatched />,
    2: <SalesRegisterView />,
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
