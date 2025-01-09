import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { WhatsappGroupView } from "./WhatsappGroupView";
import { CustomerNoWhatsappGroup } from "./CustomerNoWhatsappGroup";
import { SalesPersonNotInGroup } from "./SalesPersonNotInGroup";
import { CustomerNotInGroup } from "./CustomerNotInGroup";
import { WhatsappGroup } from "./WhatsappGroup";
import { Automation } from "./Automation";

export const AllWhatsappTabs = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allTabs = isInGroups("Director");
  const fourTabs = isInGroups("Customer Service");
  const [activeTab, setActiveTab] = useState(allTabs ? 0 : 4);

  const tabs = [
    {
      label: "Customer Not In Group",
      visible: allTabs || fourTabs,
      index: 0,
    },
    {
      label: "Sales Person Not In Group",
      visible: allTabs || fourTabs,
      index: 1,
    },
    {
      label: "Customer Not Having Group",
      visible: allTabs || fourTabs,
      index: 2,
    },
    {
      label: "Bulk Message",
      visible: allTabs || fourTabs,
      index: 3,
    },
    {
      label: "Group Info",
      visible: allTabs || fourTabs,
      index: 4,
    },
    {
      label: "Scheduler Log",
      visible: allTabs,
      index: 5,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const tabComponents = {
    0: <CustomerNotInGroup />,
    1: <SalesPersonNotInGroup />,
    2: <CustomerNoWhatsappGroup />,
    3: <WhatsappGroup />,
    4: <WhatsappGroupView />,
    5: <Automation />,
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
