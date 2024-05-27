import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { PackingListView } from "./PackingList/PackingListView";
import { SafetyStockView } from "./SafetyStockLevel/SafetyStockView";
import { GRNRegisterView } from "./GRNRegister/GRNRegisterView";
import { StoresInventoryView } from "./Stores Inventory/StoresInventoryView";
import { StoresInventoryConsView } from "./Stores Inventory/StoresInventoryConsView";
import { ProductionInventoryView } from "./Production Inventory/ProductionInventoryView";
import { ProductionInventoryConsView } from "./Production Inventory/ProductionInventoryConsView";
import { DescriptionStoreInventoryView } from "./Description Store Inventory/DescriptionStoreInventoryView";
import { JobWorkerStoreInventoryView } from "./Job Worker Store Inventory/JobWorkerStoreInventoryView";

export const InventoryAllTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Pending GRN",
      roles: ["Director", "Accounts", "Stores", "Stores Delhi"],
      component: <PackingListView />,
    },
    {
      label: "Safety Stock Level",
      roles: ["Director", "Purchase", "Stores"],
      component: <SafetyStockView />,
    },
    {
      label: "GRN Register",
      roles: [
        "Director",
        "Accounts",
        "Purchase",
        "Stores",
        "Stores Delhi",
        "Accounts Executive",
      ],
      component: <GRNRegisterView />,
    },
    {
      label: "Stores Inventory",
      roles: ["Director", "Accounts", "Accounts Executive"],
      component: <StoresInventoryView />,
    },
    {
      label: "Stores Inventory (Cons)",
      roles: [
        "Director",
        "Accounts",
        "Purchase",
        "Stores",
        "Stores Delhi",
        "Production Delhi",
        "Production",
        "Accounts Executive",
      ],
      component: <StoresInventoryConsView />,
    },
    {
      label: "Description Stores Inventory",
      roles: ["Director", "Accounts", "Accounts Executive"],
      component: <DescriptionStoreInventoryView />,
    },
    {
      label: "Job Worker Stores Inventory",
      roles: ["Director", "Accounts", "Accounts Executive"],
      component: <JobWorkerStoreInventoryView />,
    },
    {
      label: "Production Inventory",
      roles: ["Director", "Accounts", "Accounts Executive"],
      component: <ProductionInventoryView />,
    },
    {
      label: "Production Inventory (Cons)",
      roles: [
        "Director",
        "Accounts",
        "Purchase",
        "Stores Delhi",
        "Production Delhi",
        "Production",
        "Accounts Executive",
      ],
      component: <ProductionInventoryConsView />,
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
