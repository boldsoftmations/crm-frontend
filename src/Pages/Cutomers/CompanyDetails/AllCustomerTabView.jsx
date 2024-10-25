import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../../Components/CustomTabs";
import { CompanyDetails } from "./CompanyDetails";
import { UnassignedCustomer } from "./UnassignedCustomer";
import { InActiveCustomer } from "./InActiveCustomer";
import { IncompleteKycDetails } from "./IncompleteKycDetails";
import { ExclusiveDistributionCustomer } from "../Exclusive Distribution Customer/ExclusiveDistributionCustomer";
import { ProductBaseCustomerView } from "../ProductBaseCustomer/ProductBaseCustomerView";

export const AllCustomerTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allCustomerTabs = isInGroups(
    "Director",
    "Sales Manager",
    "Accounts",
    "Customer Relationship Manager",
    "Business Development Manager"
  );

  const isDirectorandSalesManager = isInGroups(
    "Director",
    "Sales Manager",
    "Customer Relationship Manager",
    "Business Development Manager"
  );
  const isDirectorandCRMandCRE = isInGroups(
    "Director",
    "Customer Relationship Manager",
    "Customer Relationship Executive"
  );

  const isSalesDManager = isInGroups("Sales Deputy Manager");
  const isSalesADManager = isInGroups("Sales Assistant Deputy Manager");
  const isSalesExecutive = isInGroups(
    "Sales Executive",
    "Customer Relationship Executive",
    "Business Development Executive"
  );
  const isSalesManagerWithoutLeads = isInGroups("Sales Manager without Leads");
  const isSalesManagerWithLeads = isInGroups("Sales Manager with Leads");
  const isCustomerService = isInGroups("Customer Service");
  const isAccountBillingDepartment = isInGroups("Accounts Billing Department");
  const tabs = useMemo(
    () => [
      {
        label: "Company Details",
        visible:
          allCustomerTabs ||
          isSalesDManager ||
          isSalesADManager ||
          isSalesExecutive ||
          isSalesManagerWithoutLeads ||
          isSalesManagerWithLeads ||
          isCustomerService ||
          isAccountBillingDepartment,
        index: 0,
        component: <CompanyDetails />,
      },
      {
        label: "Unassigned Customer",
        visible: allCustomerTabs || isCustomerService,
        index: 1,
        component: <UnassignedCustomer />,
      },
      {
        label: "Inactive Customers",
        visible: allCustomerTabs,
        index: 2,
        component: <InActiveCustomer />,
      },
      {
        label: "Incomplete KYC",
        visible:
          allCustomerTabs ||
          isSalesDManager ||
          isSalesADManager ||
          isSalesExecutive ||
          isSalesManagerWithoutLeads ||
          isSalesManagerWithLeads,
        index: 3,
        component: <IncompleteKycDetails />,
      },
      {
        label: "Exclusive Distribution Customers",
        visible:
          allCustomerTabs ||
          isSalesExecutive ||
          isSalesDManager ||
          isSalesManagerWithLeads,
        index: 4,
        component: <ExclusiveDistributionCustomer />,
      },
      {
        label: "Product Base Customers",
        visible: isDirectorandCRMandCRE,
        index: 5,
        component: <ProductBaseCustomerView />,
      },
    ],
    [
      allCustomerTabs,
      allCustomerTabs,
      isDirectorandSalesManager,
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
