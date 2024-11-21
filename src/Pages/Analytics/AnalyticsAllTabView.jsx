import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SalesPersonDashboard } from "./SalesPersonDashboard";
import { TeamWiseDashboard } from "./TeamWiseDashboard";
import { RetailCustomerData } from "./RetailCustomerData";
import { DashboardLeadData } from "./DashboardLeadData";
import { CustomTabs } from "../../Components/CustomTabs";
import { TopCustomerView } from "./TopCustomerView";
import { CRReport } from "./CRreport";
import { ViewSalesQuantityAnalysis } from "./Sales Quantity Analysis/ViewSalesQuantityAnalysis";

export const AnalyticsAllTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Sales Person Analytics",
      roles: [
        "Director",
        "Sales Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Sales Manager without Leads",
        "Sales Manager with Lead",
        "HR",
        "Factory-Mumbai-OrderBook",
        "Factory-Delhi-OrderBook",
        "Factory-Delhi-Dispatch",
        "Factory-Mumbai-Dispatch",
        "Customer Service",
        "Purchase",
        "Stores",
        "Production Delhi",
        "Stores Delhi",
        "Production",
        "Accounts",
        "Accounts Billing Department",
        "Accounts Executive",
        "Customer Relationship Executive",
        "Customer Relationship Manager",
        "Business Development Manager",
        "Business Development Executive",
      ],
      component: <SalesPersonDashboard />,
    },
    {
      label: "Sales Team Analytics",
      roles: [
        "Director",
        "Sales Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Manager without Leads",
        "Sales Manager with Lead",
        "Business Development Manager",
        "Business Development Executive",
      ],
      component: <TeamWiseDashboard />,
    },
    {
      label: "Distribution Customer",
      roles: ["Director"],
      component: <RetailCustomerData />,
    },
    {
      label: "Lead",
      roles: ["Director"],
      component: <DashboardLeadData />,
    },
    {
      label: "Top Customer",
      roles: [
        "Director",
        "Customer Relationship Manager",
        "Customer Relationship Executive",
      ],
      component: <TopCustomerView />,
    },
    {
      label: "CR Report",
      roles: [
        "Director",
        "Customer Relationship Manager",
        "Customer Relationship Executive",
      ],
      component: <CRReport />,
    },
    {
      label: "Sales Qty Analysis",
      roles: [
        "Director",
        "Customer Relationship Executive",
        "Customer Relationship Manager",
        "Business Development Manager",
        "Business Development Executive",
        "Sales Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Sales Manager without Leads",
        "Sales Manager with Lead",
      ],
      component: <ViewSalesQuantityAnalysis />,
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
