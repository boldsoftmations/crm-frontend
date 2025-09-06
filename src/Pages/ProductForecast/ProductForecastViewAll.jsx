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
    userData.groups.includes("Customer Service") ||
    userData.groups.includes("Customer Relationship Executive") ||
    userData.groups.includes("Customer Relationship Manager") ||
    userData.groups.includes("Business Development Manager") ||
    userData.groups.includes("Business Development Executive");

  const isPurchase =
    userData.groups.includes("Director") ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Purchase");

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
  const [activeTab, setActiveTab] = useState(isAdmin ? 0 : 4);

  const tabs = [
    { label: "Curr. Month Forecast", visible: isAdmin, index: 0 }, // Shortened "Current" to "Curr."
    { label: "Customers w/ Forecast", visible: isAdmin, index: 1 }, // Used "w/" as shorthand for "with"
    { label: "Customers w/o Forecast", visible: isAdmin, index: 2 }, // Used "w/o" as shorthand for "without"
    { label: "Dead Customers", visible: isAdmin, index: 3 }, // Used "Inactive" as a clearer term for "Dead"
    { label: "Prod. Forecast", visible: isPurchase, index: 4 }, // Shortened "Product" to "Prod."
    { label: "Desc. Forecast", visible: isPurchase, index: 5 }, // Shortened "Description" to "Desc."
    { label: "Lead Forecast", visible: isVisible, index: 6 },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);
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
        activeTab={activeTab}
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
