import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";

import { TransportersHome } from "./TransportersHome";
import ViewTransportRef from "./TransportRef/ViewTransportRef";
import TransporterAuditLog from "./AuditLog/TransporterAuditLog";
import TransporterFinder from "./TransporterFinder";

// UI-ONLY restructuring per V3 handover (Section 3 - Target navigation).
// No business logic, API calls, role-permission RULES, or field names have
// been changed here - the previous master screens are grouped into controlled
// top-level operational tabs:
//   Transporters                  -> TransporterWorkspace (which itself
//                                     holds Overview / Branches & IDs /
//                                     Contacts / Serviceability / Audit
//                                     Log as its own sub-tabs - see that
//                                     file)
//   Transport Assignment Requests -> mapping request operational queue
//   Audit Log                     -> read-only transporter audit trail
//
// Role lists below are NOT new restrictions - they are the exact union of
// roles that already had access to at least one of the old Transport
// Master / Transport Mapping / Transport Contact tabs, so nobody's access
// changes because of this reshuffle. See the note above "requestRoles" for
// one open question this raises against the V3 doc that should be
// confirmed with the team before UAT sign-off, rather than changed here.

export const AllTransportMasterTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const userGroups =
    userData && userData.groups && Array.isArray(userData.groups)
      ? userData.groups
      : [];

  const isInGroups = (...groups) =>
    groups.some((group) => userGroups.includes(group));

  // Union of the old "Transport Master", "Transport Mapping" and
  // "Transport Contact" tab role lists (Transport Contact had the widest
  // list of the three, so this is identical to that one). TransporterWorkspace
  // does its own internal per-sub-tab role filtering, so a user who only
  // qualified for, say, Contacts before will still only see Contacts once
  // they open this top-level tab - this list only controls whether the
  // "Transporters" tab appears at all.
  const transporterWorkspaceRoles = [
    "Director",
    "Sales Manager",
    "Sales Manager(Retailer)",
    "Business Development Manager",
    "Customer Relationship Executive",
    "Customer Relationship Manager",
    "Sales Deputy Manager",
    "Sales Assistant Deputy Manager",
    "Sales Executive",
    "Operations & Supply Chain Manager",
    "Sales Manager without Leads",
    "Sales Manager with Lead",
  ];

  // Mapping Request is an operational queue. Sales roles can see the queue
  // read-only; Director/Admin/Dispatch/Operations/Customer Success get the
  // Update/Resolve actions inside ViewTransportRef.
  const requestRoles = [
    "Director",
    "Admin",
    "Dispatch",
    "Factory-Mumbai-Dispatch",
    "Factory-Delhi-Dispatch",
    "Operations & Supply Chain Manager",
    "Customer Service",
    "Customer Relationship Manager",
    "Sales Manager",
    "Sales Manager(Retailer)",
    "Sales Deputy Manager",
    "Sales Executive",
    "Customer Relationship Executive",
  ];

  // Audit endpoint is read-only. Keep access aligned with the existing
  // Transporter Workspace Audit Log permission until business confirms a
  // wider view-only role list.
  const auditLogRoles = ["Director"];

  const tabs = [
    {
      label: "Transporters",
      roles: transporterWorkspaceRoles,
      component: <TransportersHome />,
    },
    // {
    //   label: "Transporter Finder",
    //   roles: transporterWorkspaceRoles,
    //   component: <TransporterFinder />,
    // },
    {
      label: "Transport Assignment Requests",
      roles: requestRoles,
      component: <ViewTransportRef />,
    },
    {
      label: "Audit Log",
      roles: auditLogRoles,
      component: <TransporterAuditLog />,
    },
  ];

  const visibleTabs = tabs.filter((tab) => isInGroups(...tab.roles));

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
