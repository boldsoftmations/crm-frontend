import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../../Components/CustomTabs";
import { ApprovePi } from "./ApprovePi";
import { ActivePI } from "./ActivePI";
import { PriceApprovalPI } from "./PriceApprovalPI";
import { AllProformaInvoice } from "./AllProformaInvoice";

export const AllPerformaInvoiceTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) => {
    return (
      userData &&
      userData.groups &&
      groups.some((group) => userData.groups.indexOf(group) > -1)
    );
  };

  const roles = useMemo(
    () => ({
      allTabs: isInGroups("Director", "Accounts", "Accounts Executive"),
      isSalesManager: isInGroups(
        "Sales Manager",
        "Sales Manager(Retailer)",
        "Customer Relationship Manager",
        "Business Development Manager",
      ),
      isAccountBillingDepartment: isInGroups("Accounts Billing Department"),
      isSalesDManager: isInGroups("Sales Deputy Manager"),
      isSalesADManager: isInGroups("Sales Assistant Deputy Manager"),
      isSalesExecutive: isInGroups(
        "Sales Executive",
        "Customer Relationship Executive",
        "Business Development Executive",
      ),
      isSalesManagerWithoutLeads: isInGroups("Sales Manager without Leads"),
      isSalesManagerWithLeads: isInGroups("Sales Manager with Leads"),
      isCustomerService: isInGroups("Customer Service"),
    }),
    [userData],
  );

  const tabs = useMemo(
    () => [
      {
        label: "Approve PI",
        visible: roles.allTabs || roles.isAccountBillingDepartment,
        index: 0,
        component: <ApprovePi />,
      },
      {
        label: "Active PI",
        visible:
          roles.isSalesManager ||
          roles.isSalesDManager ||
          roles.isSalesADManager ||
          roles.isSalesExecutive ||
          roles.isSalesManagerWithoutLeads ||
          roles.isSalesManagerWithLeads ||
          roles.allTabs ||
          roles.isCustomerService,
        index: 1,
        component: <ActivePI />,
      },
      {
        label: "Price Approval PI",
        visible:
          roles.allTabs ||
          roles.isSalesManager ||
          roles.isSalesExecutive ||
          roles.isAccountBillingDepartment,
        index: 2,
        component: <PriceApprovalPI />,
      },
      {
        label: "All PI",
        visible:
          roles.isSalesManager ||
          roles.isSalesDManager ||
          roles.isSalesADManager ||
          roles.isSalesExecutive ||
          roles.isSalesManagerWithoutLeads ||
          roles.isSalesManagerWithLeads ||
          roles.allTabs ||
          roles.isAccountBillingDepartment ||
          roles.isCustomerService,
        index: 3,
        component: <AllProformaInvoice />,
      },
    ],
    [roles],
  );

  const visibleTabs = useMemo(() => {
    return tabs
      .filter((tab) => tab.visible)
      .map((tab, i) => ({ ...tab, index: i }));
  }, [tabs]);
  const visibleTabIndexes = useMemo(
    () => visibleTabs.map((tab) => tab.index),
    [visibleTabs],
  );

  // Set the first visible tab as active by default
  const [activeTab, setActiveTab] = useState(
    visibleTabs.length > 0 ? visibleTabs[0].index : 0,
  );

  useEffect(() => {
    // Update the active tab if the current one is no longer visible
    if (visibleTabs.length > 0 && visibleTabIndexes.indexOf(activeTab) === -1) {
      setActiveTab(visibleTabs[0].index);
    }
  }, [visibleTabs, visibleTabIndexes, activeTab]);

  return (
    <div>
      <CustomTabs
        tabs={visibleTabs}
        activeTab={activeTab}
        onTabChange={(index) => setActiveTab(visibleTabIndexes[index])}
      />
      {visibleTabs.map(
        (tab) =>
          tab.index === activeTab && <div key={tab.index}>{tab.component}</div>,
      )}
    </div>
  );
};
