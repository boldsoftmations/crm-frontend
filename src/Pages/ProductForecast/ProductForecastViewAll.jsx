import React, { useState } from "react";
import { CustomTabs } from "../../Components/CustomTabs";
import { ProductNotHavingForecastView } from "./ProductNotHavingForecastView";
import { ProductHavingForecastView } from "./ProductHavingForecastView";
import { DeadCustomerView } from "./DeadCustomerView";
import { ProductWiseForecastView } from "./ProductWiseForecastView";
import { CurrentMonthForecastView } from "./CurrentMonthForecastView";
import { DescriptionWiseForecastView } from "./DescriptionWiseForecastView";
import { useSelector } from "react-redux";

export const ProductForecastViewAll = () => {
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const isAdmin =
    userData.is_staff === true ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Sales") ||
    userData.groups.includes("Customer Service");

  const isPurchase =
    userData.is_staff === true ||
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Purchase");

  const [activeTab, setActiveTab] = useState(isAdmin ? 0 : 4);

  const tabs = [
    { label: "Current Month Forecast", visible: isAdmin, index: 0 },
    { label: "Customer Having Forecast", visible: isAdmin, index: 1 },
    { label: "Customer Not Having Forecast", visible: isAdmin, index: 2 },
    { label: "Dead Customer", visible: isAdmin, index: 3 },
    { label: "Product Wise Forecast", visible: isPurchase, index: 4 },
    { label: "Description Wise Forecast", visible: isPurchase, index: 5 },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);
  const tabComponents = {
    0: <CurrentMonthForecastView />,
    1: <ProductHavingForecastView />,
    2: <ProductNotHavingForecastView />,
    3: <DeadCustomerView />,
    4: <ProductWiseForecastView />,
    5: <DescriptionWiseForecastView />,
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
