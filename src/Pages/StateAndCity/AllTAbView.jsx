import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { ViewCountry } from "./ViewCountry";
import { ViewState } from "./State/ViewState";
import { ViewCity } from "./City/ViewCity";
import { ViewPincode } from "./Pincode/ViewPincode";
import ZoneListView from "./ZoneList/ZoneListView";

export const AllTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const tabs = [
    {
      label: "Country",
      roles: ["Director", "Accounts"],
      component: <ViewCountry />,
    },
    {
      label: "Zone",
      roles: ["Director", "Accounts"],
      component: <ZoneListView />,
    },
    {
      label: "State",
      roles: ["Director", "Accounts"],
      component: <ViewState />,
    },
    {
      label: "City",
      roles: ["Director", "Accounts"],
      component: <ViewCity />,
    },

    {
      label: "Pin Code",
      roles: ["Director", "Accounts"],
      component: <ViewPincode />,
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
