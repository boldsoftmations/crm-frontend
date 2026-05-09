import React, { useState } from "react";
import { CustomTabs } from "../../Components/CustomTabs";
import { DeadCustomerView } from "./DeadCustomerView";
import { ProductWiseForecastView } from "./ProductWiseForecastView";
import { CurrentMonthForecastView } from "./CurrentMonthForecastView";
import { DescriptionWiseForecastView } from "./DescriptionWiseForecastView";
import { useSelector } from "react-redux";
import { CustomerNotHavingForecastView } from "./CustomerNotHavingForecastView";
import { CustomerHavingForecastView } from "./CustomerHavingForecastView";
import { LeadForecastView } from "../Leads/LeadForecast/LeadForecastView";

export const ProductForecastViewAll = () => {
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const isAdmin =
    userData.groups.includes("Director") ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Sales Executive") ||
    userData.groups.includes("Sales Manager without Leads") ||
    userData.groups.includes("Sales Manager") ||
    userData.groups.includes("Sales Manager(Retailer)") ||
    userData.groups.includes("Sales Deputy Manager") ||
    userData.groups.includes("Sales Assistant Deputy Manager") ||
    // userData.groups.includes("Customer Service") ||
    userData.groups.includes("Customer Relationship Executive") ||
    userData.groups.includes("Customer Relationship Manager") ||
    userData.groups.includes("Business Development Manager") ||
    userData.groups.includes("Business Development Executive");

  const isPurchase =
    userData.groups.includes("Director") ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Purchase");
  const isSalesmanager =
    userData.groups.includes("Sales Manager") ||
    userData.groups.includes("Sales Manager(Retailer)");
  const isVisible =
    userData.groups.includes("Director") ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Sales Executive") ||
    userData.groups.includes("Sales Manager without Leads") ||
    userData.groups.includes("Sales Manager") ||
    userData.groups.includes("Sales Manager(Retailer)") ||
    userData.groups.includes("Sales Deputy Manager") ||
    userData.groups.includes("Sales Assistant Deputy Manager") ||
    userData.groups.includes("Customer Service");
  const Supplychain =
    userData.groups.includes("Director") ||
    userData.groups.includes("Operations & Supply Chain Manager");
  const isCustomerService =
    userData.groups.includes("Customer Service") ||
    userData.groups.includes("Director");
  const tabs = [
    {
      label: "Curr. Month Forecast",
      visible: isAdmin || Supplychain || isCustomerService,
      index: 0,
    },
    {
      label: "Customers w/ Forecast",
      visible: Supplychain || isSalesmanager,
      index: 1,
    },
    {
      label: "Customers w/o Forecast",
      visible: isAdmin || Supplychain,
      index: 2,
    },
    { label: "Dead Customers", visible: isAdmin, index: 3 },
    { label: "Prod. Forecast", visible: isPurchase, index: 4 },
    { label: "Desc. Forecast", visible: isPurchase, index: 5 },
    { label: "Lead Forecast", visible: isVisible, index: 6 },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const getInitialTab = () => {
    if (isAdmin) return 0;
    if (isPurchase) return 4;
    if (isCustomerService) return 0;
    return visibleTabs.length > 0 ? visibleTabs[0].index : 0;
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const tabComponents = {
    0: <CurrentMonthForecastView />,
    1: <CustomerHavingForecastView />,
    2: <CustomerNotHavingForecastView />,
    3: <DeadCustomerView />,
    4: <ProductWiseForecastView />,
    5: <DescriptionWiseForecastView />,
    6: <LeadForecastView />,
  };

  return (
    <div>
      <CustomTabs
        tabs={visibleTabs}
        activeTab={visibleTabIndexes.indexOf(activeTab)} // 👈 convert back to visual position
        onTabChange={(index) => {
          setActiveTab(visibleTabIndexes[index]);
        }}
      />
      <div>
        {visibleTabIndexes.includes(activeTab) && (
          <div>{tabComponents[activeTab]}</div>
        )}
      </div>
    </div>
  );
};
