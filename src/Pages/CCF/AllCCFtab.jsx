import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { CustomTabs } from "../../Components/CustomTabs";
import { CapaView } from "./CAPA/CapaView";
import { ClosedComplaint } from "./Close-Complaint/ClosedComplaint";
import { CCFView } from "./CCF/CCFView";
import TrainingCapaView from "./TrainingCAPA/TrainingCapaView";

export const AllCCFtab = () => {
  const userData = useSelector((state) => state.auth.profile);
  const location = useLocation();

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  // Read query params once
  const params = new URLSearchParams(location.search);
  const tabParam = parseInt(params.get("tab"), 10);
  const statusParam = params.get("status") || "";

  const tabs = [
    {
      label: "Customer Complaint Form",
      roles: [
        "Director",
        "Sales Manager",
        "Sales Manager(Retailer)",
        "Accounts",
        "Production",
        "Customer Service",
        "QA",
        "Operations & Supply Chain Manager",
        "Sales Executive",
      ],
      component: <CCFView />,
    },
    {
      label: "CAPA",
      roles: [
        "Director",
        "Accounts",
        "Customer Service",
        "Production",
        "QA",
        "Operations & Supply Chain Manager",
      ],
      component: <CapaView defaultStatus={statusParam} />, // 👈 pass status
    },
    {
      label: "Closed Complaints",
      roles: [
        "Director",
        "Accounts",
        "Sales Manager",
        "Sales Manager(Retailer)",
        "Customer Service",
        "Production",
        "QA",
        "Operations & Supply Chain Manager",
        "Sales Executive",
      ],
      component: <ClosedComplaint />,
    },
    {
      label: "Training CAPA",
      roles: [
        "Director",
        "Production",
        "QA",
        "Operations & Supply Chain Manager",
      ],
      component: <TrainingCapaView defaultStatus={statusParam} />,
    },
  ];

  ///tp/tp+fp
  //tp/tp+fn

  const visibleTabs = tabs.filter((tab) => isInGroups(...tab.roles));

  const getInitialTab = () => {
    if (!isNaN(tabParam) && tabParam >= 0 && tabParam < visibleTabs.length) {
      return tabParam;
    }
    return 0; //(2.2)/1.1-->1.1-
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

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
