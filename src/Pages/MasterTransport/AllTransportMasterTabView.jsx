import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";

import { TransportersHome } from "./TransportersHome";
import ViewTransportRef from "./TransportRef/ViewTransportRef";
import TransporterAuditLog from "./AuditLog/TransporterAuditLog";
import {
  canManageTransportAssignmentRequests,
  canViewTransporterAudit,
  canViewTransporterMaster,
} from "../../utility/masterAccess";

export const AllTransportMasterTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const tabs = [
    {
      label: "Transporters",
      allowed: canViewTransporterMaster(userData),
      component: <TransportersHome />,
    },
    {
      label: "Transport Assignment Requests",
      allowed: canManageTransportAssignmentRequests(userData),
      component: <ViewTransportRef />,
    },
    {
      label: "Audit Log",
      allowed: canViewTransporterAudit(userData),
      component: <TransporterAuditLog />,
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
