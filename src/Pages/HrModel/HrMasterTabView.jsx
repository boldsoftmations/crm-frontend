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
  const isRecruiterAndDirector = isInGroups("Director", "HR", "HR Recruiter");

  const tabs = [
    {
      label: "Designation",
      visible: allTabs,
      component: <DesignationView />,
    },
    {
      label: "Department",
      visible: allTabs,
      component: <DepartmentView />,
    },
    {
      label: "Source",
      visible: allTabs,
      component: <SourceView />,
    },
    {
      label: "Location",
      visible: allTabs,
      component: <LocationView />,
    },
    {
      label: "MCQ Question",
      visible: allTabs,
      component: <ViewMCQs />,
    },
    {
      label: "Interview Question",
      visible: isRecruiterAndDirector,
      component: <InterviewQuestionView />,
    },
    { label: "Attribute", visible: allTabs, component: <ViewAttribute /> },
    {
      label: "Competency Attribute",
      visible: allTabs,
      component: <ViewCompentancyAttribute />,
    },
    { label: "Role Clarity", visible: allTabs, component: <ViewRoleClarity /> },
    {
      label: "Job Description",
      visible: isRecruiterAndDirector,
      component: <ViewJobDescription />,
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <CustomTabs
        tabs={visibleTabs}
        activeTab={activeTab}
        onTabChange={(index) => setActiveTab(index)}
      />
      <div>
        {visibleTabs[activeTab].component && visibleTabs[activeTab].component}
      </div>
    </div>
  );
};
