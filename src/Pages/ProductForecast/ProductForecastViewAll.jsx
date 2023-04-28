import React, { useState } from "react";
import { CustomTabs } from "../../Components/CustomTabs";
import { ProductNotHavingForecastView } from "./ProductNotHavingForecastView";
import { ProductHavingForecastView } from "./ProductHavingForecastView";
import { ProductForecastView } from "./ProductForecastView";
import { DeadCustomerView } from "./DeadCustomerView";
import { ProductWiseForecastView } from "./ProductWiseForecastView";
import { CurrentMonthForecastView } from "./CurrentMonthForecastView";

export const ProductForecastViewAll = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Product Forecast" },
    { label: "Customer Not Having Forecast" },
    { label: "Customer Having Forecast" },
    { label: "Dead Customer" },
    { label: "Product Wise Forecast" },
    { label: "Current Month Forecast" },
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
            <ProductForecastView />
          </div>
        )}
        {activeTab === 1 && (
          <div>
            <ProductNotHavingForecastView />
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <ProductHavingForecastView />
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
            <CurrentMonthForecastView />
          </div>
        )}
      </div>
    </div>
  );
};
