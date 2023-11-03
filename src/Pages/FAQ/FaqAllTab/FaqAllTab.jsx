import React, { useState } from "react";
import { ScriptView } from "./../Scripts/ScriptView";
import { ObjectionsView } from "./../Objections/ObjectionsView";
import { ProductObjectionsView } from "./../ProductObjections/ProductObjectionsView";
import { CustomTabs } from "../../../Components/CustomTabs";

export const FaqAllTab = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Scripts" },
    { label: "Objection" },
    { label: "Product Objection" },
  ];

  return (
    <div>
      <div>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div style={{ marginTop: "10px" }}>
          {activeTab === 0 && (
            <div>
              <ScriptView />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <ObjectionsView />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <ProductObjectionsView />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
