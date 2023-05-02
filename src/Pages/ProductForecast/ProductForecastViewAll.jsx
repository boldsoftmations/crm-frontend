import React, { useState } from "react";
import { CustomTabs } from "../../Components/CustomTabs";
import { ProductNotHavingForecastView } from "./ProductNotHavingForecastView";
import { ProductHavingForecastView } from "./ProductHavingForecastView";
import { DeadCustomerView } from "./DeadCustomerView";
import { ProductWiseForecastView } from "./ProductWiseForecastView";
import { CurrentMonthForecastView } from "./CurrentMonthForecastView";
import { DescriptionWiseForecastView } from "./DescriptionWiseForecastView";

export const ProductForecastViewAll = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Current Month Forecast" },
    { label: "Customer Having Forecast" },
    { label: "Customer Not Having Forecast" },
    { label: "Dead Customer" },
    { label: "Product Wise Forecast" },
    { label: "Description Wise Forecast" },
  ];

  return (
    <div>
      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div>
        {activeTab === 0 && (
          <div>
            <CurrentMonthForecastView />
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <ProductHavingForecastView />
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <ProductNotHavingForecastView />
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <DeadCustomerView />
          </div>
        )}
        {activeTab === 4 && (
          <div>
            <ProductWiseForecastView />
          </div>
        )}
        {activeTab === 5 && (
          <div>
            <DescriptionWiseForecastView />
          </div>
        )}
      </div>
    </div>
  );
};
