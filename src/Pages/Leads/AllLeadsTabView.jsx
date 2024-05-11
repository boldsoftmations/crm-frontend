import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "./../../Components/CustomTabs";
import { NewLeads } from "./NewLeads";
import { OpenLead } from "./OpenLead";
import { HotLeads } from "./HotLeads";
import { ClosedLead } from "./ClosedLead";
import { DuplicateLead } from "./DuplicateLead";
import { UnassignedLead } from "./UnassignedLead";
import { IndiaMartLeads } from "./IndiaMartLeads";

export const AllLeadsTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  // Function to check if user belongs to any of the specified groups
  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  // Determine the user's roles and permissions
  const isAdmin = isInGroups(
    "Director",
    "Sales Manager",
    "Sales Deputy Manager"
  );
  const isSalesADManager = isInGroups("Sales Assistant Deputy Manager");
  const isSalesExecutive = isInGroups("Sales Executive");
  const isSalesManagerWithoutLeads = isInGroups("Sales Manager without Leads");
  const isSalesManagerWithLeads = isInGroups("Sales Manager with Leads");
  const isCustomerService = isInGroups("Customer Service");

  // Initial active tab based on user role
  const [activeTab, setActiveTab] = useState(isAdmin ? 0 : 4);

  // Define all possible tabs with visibility conditions
  const tabs = [
    {
      label: "New Leads",
      visible:
        isAdmin ||
        isSalesADManager ||
        isSalesExecutive ||
        isSalesManagerWithoutLeads ||
        isSalesManagerWithLeads ||
        isCustomerService,
      index: 0,
    },
    {
      label: "Opened Leads",
      visible:
        isAdmin ||
        isSalesADManager ||
        isSalesExecutive ||
        isSalesManagerWithoutLeads ||
        isSalesManagerWithLeads ||
        isCustomerService,
      index: 1,
    },
    {
      label: "Hot Leads",
      visible:
        isAdmin ||
        isSalesADManager ||
        isSalesExecutive ||
        isSalesManagerWithoutLeads ||
        isSalesManagerWithLeads ||
        isCustomerService,
      index: 2,
    },
    { label: "Dropped Leads", visible: isAdmin || isSalesADManager, index: 3 },
    {
      label: "Duplicate Leads",
      visible: isAdmin || isSalesADManager,
      index: 4,
    },
    {
      label: "Unassigned Leads",
      visible: isAdmin || isSalesADManager || isSalesManagerWithLeads,
      index: 5,
    },
    { label: "Indiamart Leads", visible: isAdmin, index: 6 },
  ];

  // Filter tabs based on visibility
  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  // Tab components mapping
  const tabComponents = {
    0: <NewLeads />,
    1: <OpenLead />,
    2: <HotLeads />,
    3: <ClosedLead />,
    4: <DuplicateLead />,
    5: <UnassignedLead />,
    6: <IndiaMartLeads />,
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
