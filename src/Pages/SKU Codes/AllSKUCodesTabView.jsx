import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { ViewConsumable } from "./Consumable/ViewConsumable";
import { ViewRawMaterials } from "./RawMaterials/ViewRawMaterials";
import { ViewFinishGoods } from "./FinishGoods/ViewFinishGoods";

export const AllSKUCodesTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  // Function to check if user belongs to any of the specified groups
  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  // Determine the user's roles and permissions
  const isAdmin = isInGroups(
    "Director",
    "Accounts",
    "Accounts Billing Department",
    "Accounts Executive"
  );

  // Initial active tab based on user role
  const [activeTab, setActiveTab] = useState(isAdmin ? 0 : 4);

  // Define all possible tabs with visibility conditions
  const tabs = [
    {
      label: "Consumable",
      visible: isAdmin,
      index: 0,
    },
    {
      label: "Raw Materials",
      visible: isAdmin,
      index: 1,
    },
    {
      label: "Finish Goods",
      visible: isAdmin,
      index: 2,
    },
  ];

  // Filter tabs based on visibility
  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  // Tab components mapping
  const tabComponents = {
    0: <ViewConsumable />,
    1: <ViewRawMaterials />,
    2: <ViewFinishGoods />,
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
