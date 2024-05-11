import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DesignationView } from "./Designation/DesignationView";
import { DepartmentView } from "./Department/DepartmentView";
import { SourceView } from "./CandidateSource/SourceView";
import { CustomTabs } from "../../Components/CustomTabs";

export const HrMasterTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  const allTabs = isInGroups("Director", "HR");
  const [activeTab, setActiveTab] = useState(allTabs ? 0 : 4);

  const tabs = [
    {
      label: "Designation",
      visible: allTabs,
      index: 0,
    },
    {
      label: "Department",
      visible: allTabs,
      index: 1,
    },
    {
      label: "Source",
      visible: allTabs,
      index: 2,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const tabComponents = {
    0: <DesignationView />,
    1: <DepartmentView />,
    2: <SourceView />,
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
