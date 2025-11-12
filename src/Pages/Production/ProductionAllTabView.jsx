import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { MaterialRequisitionFormView } from "./Material Requisition Form/MaterialRequisitionFormView";
import { ProductionEntryView } from "./Production Entry/ProductionEntryView";
import { MaterialTransferNoteView } from "./Material Transfer Note/MaterialTransferNoteView";
import { BillofMaterialsView } from "./Bill of Materials/BillofMaterialsView";
import { ProductionInventoryGAndLView } from "./Production Entry/ProductionInventoryGAndLView";
import { ProductionShortFallView } from "./ProductionShortFall/ProductionShortFallView";
import { DailyProductionReport } from "./ProductionReport/DailyProductionReport";
import { WeeklyProductionReport } from "./ProductionReport/WeeklyProductionReport";
import { ViewMRFProduct } from "./MRFProduct/ViewMRFProduct";

export const ProductionAllTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Material Requisition Form",
      roles: [
        "Director",
        "Accounts",
        "Stores",
        "Stores Delhi",
        "Production Delhi",
        "Operations & Supply Chain Manager",
        "Production",
      ],
      component: <MaterialRequisitionFormView />,
    },
    {
      label: "Bill of Materials",
      roles: [
        "Director",
        "Operations & Supply Chain Manager",
        "Accounts",
        "Stores Delhi",
        "Production Delhi",
        "Production",
        "Accounts Executive",
      ],
      component: <BillofMaterialsView />,
    },
    {
      label: "Production Entry",
      roles: [
        "Director",
        "Operations & Supply Chain Manager",
        "Accounts",
        "Stores Delhi",
        "Production Delhi",
        "Production",
      ],
      component: <ProductionEntryView />,
    },
    {
      label: "Material Transfer Note",
      roles: [
        "Director",
        "Accounts",
        "Operations & Supply Chain Manager",
        "Stores",
        "Stores Delhi",
        "Production",
        "Production Delhi",
        "Accounts Executive",
        "Accounts Billing Department",
      ],
      component: <MaterialTransferNoteView />,
    },
    {
      label: "MRF Products",
      roles: [
        "Director",
        "Operations & Supply Chain Manager",
        "Accounts",
        "Accounts Billing Department",
        "Production",
      ],
      component: <ViewMRFProduct />,
    },
    {
      label: "Production Inventory (G&L)",
      roles: [
        "Director",
        "Accounts",
        "Accounts Executive",
        "Operations & Supply Chain Manager",
      ],
      component: <ProductionInventoryGAndLView />,
    },
    {
      label: "Production ShortFall",
      roles: [
        "Director",
        "Accounts",
        "Purchase",
        "Stores",
        "Stores Delhi",
        "Operations & Supply Chain Manager",
        "Production Delhi",
        "Production",
      ],
      component: <ProductionShortFallView />,
    },
    {
      label: "Daily Production Report",
      roles: [
        "Director",
        "Operations & Supply Chain Manager",
        "Accounts",
        "Accounts Executive",
      ],
      component: <DailyProductionReport />,
    },
    {
      label: "Weekly Production Report",
      roles: [
        "Director",
        "Operations & Supply Chain Manager",
        "Accounts",
        "Accounts Executive",
      ],
      component: <WeeklyProductionReport />,
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
