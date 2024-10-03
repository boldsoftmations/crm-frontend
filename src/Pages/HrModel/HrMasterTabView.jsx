import React, { useState } from "react";
import { useSelector } from "react-redux";
import { DesignationView } from "./Designation/DesignationView";
import { DepartmentView } from "./Department/DepartmentView";
import { SourceView } from "./CandidateSource/SourceView";
import { CustomTabs } from "../../Components/CustomTabs";
import { LocationView } from "./Location/LocationView";
import ViewMCQs from "./InterviewAssessment/ViewMCQ";
import ViewAttribute from "./Attribute/ViewAttribute";
import { ViewCompentancyAttribute } from "./CompentancyAttribute/ViewCompentacyAttribute";
import { ViewRoleClarity } from "./RoleClarity/ViewRoleClarity";
import { ViewJobDescription } from "./JobDescription/ViewJobDescription";
import InterviewQuestionView from "./InterviewQuestion/InterviewQuestionView";

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
    {
      label: "Location",
      visible: allTabs,
      index: 3,
    },
    {
      label: "MCQ Question",
      visible: allTabs,
      index: 4,
    },
    {
      label: "Interview Question",
      visible: allTabs,
      index: 5,
    },
    { label: "Attribute", visible: allTabs, index: 6 },
    { label: "Competency Attribute", visible: allTabs, index: 7 },
    { label: "Role Clarity", visible: allTabs, index: 8 },
    { label: "Job Description", visible: allTabs, index: 9 },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const visibleTabIndexes = visibleTabs.map((tab) => tab.index);

  const tabComponents = {
    0: <DesignationView />,
    1: <DepartmentView />,
    2: <SourceView />,
    3: <LocationView />,
    4: <ViewMCQs />,
    5: <InterviewQuestionView />,
    6: <ViewAttribute />,
    7: <ViewCompentancyAttribute />,
    8: <ViewRoleClarity />,
    9: <ViewJobDescription />,
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
