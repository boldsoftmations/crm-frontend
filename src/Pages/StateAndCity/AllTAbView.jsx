import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { ViewCountry } from "./ViewCountry";
import { ViewState } from "./State/ViewState";
import { ViewCity } from "./City/ViewCity";
import { ViewPincode } from "./Pincode/ViewPincode";
import ZoneListView from "./ZoneList/ZoneListView";
import { MergePincodeView } from "./MergePinCode/MergePincodeView";
import ViewPincodeAuditLog from "./PincodeAuditLog/ViewPincodeAuditLog";
import ViewRefrenceGeoPostal from "./RefrenceGeoPostal/ViewRefrenceGeoPostal";
import {
  canAdminPinMaster,
  canViewPinMaster,
} from "../../utility/masterAccess";

export const AllTabView = () => {
  const userData = useSelector((state) => state.auth.profile);
  const canAdmin = canAdminPinMaster(userData);
  const canView = canViewPinMaster(userData);

  const tabs = [
    {
      label: "Country",
      allowed: canAdmin,
      component: <ViewCountry />,
    },
    {
      label: "Zone",
      allowed: canAdmin,
      component: <ZoneListView />,
    },
    {
      label: "State",
      allowed: canAdmin,
      component: <ViewState />,
    },
    {
      label: "City",
      allowed: canAdmin,
      component: <ViewCity />,
    },
    {
      label: "Pin Code",
      allowed: canView,
      component: <ViewPincode />,
    },
    {
      label: "Merge Pin Code",
      allowed: canAdmin,
      component: <MergePincodeView />,
    },
    {
      label: "Geo Audit Log",
      allowed: canAdmin,
      component: <ViewPincodeAuditLog />,
    },
    {
      label: "Geo Postal Reference",
      allowed: canAdmin,
      component: <ViewRefrenceGeoPostal />,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.allowed);
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
