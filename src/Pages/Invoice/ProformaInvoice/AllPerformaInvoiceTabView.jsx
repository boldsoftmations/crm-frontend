import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../../Components/CustomTabs";
import { ApprovePi } from "./ApprovePi";
import { ActivePI } from "./ActivePI";
import { PriceApprovalPI } from "./PriceApprovalPI";
import { AllProformaInvoice } from "./AllProformaInvoice";
export const AllPerformaInvoiceTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allTabs = isInGroups("Director", "Accounts");
  const isSalesManager = isInGroups("Sales Manager");
  const isSalesDManager = isInGroups("Sales Deputy Manager");
  const isSalesADManager = isInGroups("Sales Assistant Deputy Manager");
  const isSalesExecutive = isInGroups("Sales Executive");
  const isSalesManagerWithoutLeads = isInGroups("Sales Manager without Leads");
  const isSalesManagerWithLeads = isInGroups("Sales Manager with Leads");
  const isCustomerService = isInGroups("Customer Service");
  const isAccountBillingDepartment = isInGroups("Accounts Billing Department");

  const tabs = useMemo(
    () => [
      {
        label: "Approve PI",
        visible: allTabs || isAccountBillingDepartment,
        index: 0,
        component: <ApprovePi />,
      },
      {
        label: "Active PI",
        visible:
          isSalesManager ||
          isSalesDManager ||
          isSalesADManager ||
          isSalesExecutive ||
          isSalesManagerWithoutLeads ||
          isSalesManagerWithLeads ||
          allTabs ||
          isCustomerService,
        index: 1,
        component: <ActivePI />,
      },
      {
        label: "Price Approval PI",
        visible: allTabs,
        index: 2,
        component: <PriceApprovalPI />,
      },
      {
        label: "All PI",
        visible:
          isSalesManager ||
          isSalesDManager ||
          isSalesADManager ||
          isSalesExecutive ||
          isSalesManagerWithoutLeads ||
          isSalesManagerWithLeads ||
          allTabs ||
          isAccountBillingDepartment,
        index: 3,
        component: <AllProformaInvoice />,
      },
    ],
    [
      allTabs,
      isSalesManager,
      isSalesDManager,
      isSalesADManager,
      isSalesExecutive,
      isSalesManagerWithoutLeads,
      isSalesManagerWithLeads,
      isCustomerService,
      isAccountBillingDepartment,
    ]
  );

  const visibleTabs = useMemo(() => tabs.filter((tab) => tab.visible), [tabs]);
  const visibleTabIndexes = useMemo(
    () => visibleTabs.map((tab) => tab.index),
    [visibleTabs]
  );

  // Set the first visible tab as active by default
  const [activeTab, setActiveTab] = useState(visibleTabIndexes[0] || 0);

  useEffect(() => {
    // Update the active tab if the current one is no longer visible
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
