import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { CustomerOrderBookDetails } from "./CustomerOrderBookDetails";
import { ProductOrderBookDetails } from "./ProductOrderBookDetails";
import { PIOrderBookDetails } from "./PIOrderBookDetails";

export const AllOrderBookTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allTabs = isInGroups(
    "Director",
    "Factory-Delhi-Orderbook",
    "Factory-Mumbai-Orderbook",
    "Stores Delhi",
    "Production Delhi",
    "Sales Manager",
    "Sales Deputy Manager",
    "Sales Assistant Deputy Manager",
    "Sales Executive",
    "Sales Manager without Leads",
    "Sales Manager with Lead",
    "Accounts",
    "Accounts Billing Department",
    "Production"
  );

  const customerServiceTabs = isInGroups("Customer Service");
  const [activeTab, setActiveTab] = useState(allTabs ? 0 : 4);

  const tabs = [
    {
      label: "Customer Wise Orderbook",
      visible: allTabs || customerServiceTabs,
      index: 0,
    },
    {
      label: "Product Wise Orderbook",
      visible: allTabs || customerServiceTabs,
      index: 1,
    },
    {
      label: "PI Wise Orderbook",
      visible: allTabs,
      index: 2,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const tabComponents = {
    0: <CustomerOrderBookDetails />,
    1: <ProductOrderBookDetails />,
    2: <PIOrderBookDetails />,
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
