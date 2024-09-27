import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "./../../Components/CustomTabs";
import { NewLeads } from "./NewLeads";
import { OpenLead } from "./OpenLead";
import { HotLeads } from "./HotLeads";
import { ClosedLead } from "./ClosedLead";
import { DuplicateLead } from "./DuplicateLead";
import { UnassignedLead } from "./UnassignedLead";
import { IndiaMartLeads } from "./IndiaMartLeads";
import CreateJustDialLead from "./CreateJustDialLead";

export const AllLeadsTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const isAdmin = isInGroups(
    "Director",
    "Sales Manager",
    "Sales Deputy Manager",
    "Business Development Manager"
  );
  const isSalesADManager = isInGroups("Sales Assistant Deputy Manager");
  const isSalesExecutive = isInGroups(
    "Sales Executive",
    "Business Development Executive"
  );
  const isSalesManagerWithoutLeads = isInGroups("Sales Manager without Leads");
  const isSalesManagerWithLeads = isInGroups("Sales Manager with Leads");
  const isCustomerService = isInGroups("Customer Service");
  const isAdminAndDM = isInGroups("Director", "Digital Marketing");
  const tabs = useMemo(
    () => [
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
        component: <NewLeads />,
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
        component: <OpenLead />,
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
        component: <HotLeads />,
      },
      {
        label: "Dropped Leads",
        visible: isAdmin || isSalesADManager,
        index: 3,
        component: <ClosedLead />,
      },
      {
        label: "Duplicate Leads",
        visible: isAdmin || isSalesADManager,
        index: 4,
        component: <DuplicateLead />,
      },
      {
        label: "Unassigned Leads",
        visible: isAdmin || isSalesADManager || isSalesManagerWithLeads,
        index: 5,
        component: <UnassignedLead />,
      },
      {
        label: "Indiamart Leads",
        visible: isAdmin,
        index: 6,
        component: <IndiaMartLeads />,
      },
      {
        label: "Just Dial Leads",
        visible: isAdminAndDM,
        index: 7,
        component: <CreateJustDialLead />,
      },
    ],
    [
      isAdmin,
      isSalesADManager,
      isSalesExecutive,
      isSalesManagerWithoutLeads,
      isSalesManagerWithLeads,
      isCustomerService,
      isAdminAndDM,
    ]
  );

  const visibleTabs = useMemo(() => tabs.filter((tab) => tab.visible), [tabs]);
  const visibleTabIndexes = useMemo(
    () => visibleTabs.map((tab) => tab.index),
    [visibleTabs]
  );

  const [activeTab, setActiveTab] = useState(visibleTabIndexes[0] || 0);

  useEffect(() => {
    if (!visibleTabIndexes.includes(activeTab)) {
      setActiveTab(visibleTabIndexes[0] || 0);
    }
  }, [visibleTabIndexes, activeTab]);

  return (
    <div>
      <CustomTabs
        tabs={visibleTabs}
        activeTab={activeTab}
        onTabChange={(index) => setActiveTab(visibleTabIndexes[index])}
      />
      {visibleTabIndexes.includes(activeTab) && (
        <div>
          {visibleTabs.find((tab) => tab.index === activeTab).component}
        </div>
      )}
    </div>
  );
};
