import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { CustomTabs } from "../../Components/CustomTabs";
import { ActiveUsers } from "./ActiveUsers";
import { InActiveUsers } from "./InActiveUsers";
import { UserProfileView } from "../Profile/UserProfile/UserProfileView";
import { ViewEmployeesAttendance } from "./Attendance/ViewAttendance";
import { LeaveApplicationForm } from "./LeaveApplicationForm/LeaveApplicationForm";
import { ViewWarningLetter } from "./WarningLetter/ViewWarningLetter";

export const AllProfileTabView = () => {
  const userData = useSelector((state) => state.auth.profile);

  const isInGroups = (...groups) =>
    groups.some((group) => userData.groups.includes(group));

  // Memoize group role checks
  const permissions = useMemo(() => {
    const commonTabs = isInGroups(
      "Director",
      "Sales Manager",
      "Sales Manager(Retailer)",
      "Sales Deputy Manager",
      "Sales Assistant Deputy Manager",
      "Sales Executive",
      "Sales Manager without Leads",
      "Sales Manager with Lead",
      "HR",
      "Digital Marketing",
      "HR Recruiter",
      "Factory-Mumbai-OrderBook",
      "Factory-Delhi-OrderBook",
      "Factory-Delhi-Dispatch",
      "Factory-Mumbai-Dispatch",
      "Customer Service",
      "Purchase",
      "Stores",
      "Production Delhi",
      "Stores Delhi",
      "Production",
      "Accounts",
      "Accounts Billing Department",
      "Accounts Executive",
      "Customer Relationship Executive",
      "Customer Relationship Manager",
      "Business Development Manager",
      "Business Development Executive",
      "QA"
    );
    const allTabs = isInGroups(
      "Director",
      "Sales Manager",
      "Sales Manager(Retailer)",
      "Sales Executive",
      "Sales Manager without Leads",
      "Sales Manager with Lead",
      "HR",
      "Digital Marketing",
      "HR Recruiter",
      "Factory-Delhi-Dispatch",
      "Factory-Mumbai-Dispatch",
      "Customer Service",
      "Purchase",
      "Stores",
      "Production Delhi",
      "Stores Delhi",
      "Production",
      "Accounts",
      "Accounts Billing Department",
      "Accounts Executive",
      "Customer Relationship Executive",
      "Customer Relationship Manager",
      "Business Development Manager",
      "Business Development Executive",
      "QA"
    );

    return {
      isDirectorOrHR: isInGroups("Director", "HR"),
      isManager: isInGroups(
        "Sales Manager",
        "Sales Manager(Retailer)",
        "Operations & Supply Chain Manager"
      ),
      allTabs,
      commonTabs,
    };
  }, [userData]);

  const allTabDefinitions = [
    {
      label: "Active Employees",
      visible: permissions.isDirectorOrHR,
      component: <ActiveUsers />,
    },
    {
      label: "InActive Employees",
      visible: permissions.isDirectorOrHR,
      component: <InActiveUsers />,
    },
    {
      label: "Personal Profiles",
      visible: permissions.isDirectorOrHR,
      component: <UserProfileView />,
    },
    {
      label: "Employees Attendance",
      visible: permissions.allTabs || permissions.isManager,
      component: <ViewEmployeesAttendance />,
    },
    {
      label: "Leave Application Form",
      visible: permissions.commonTabs || permissions.isManager,
      component: <LeaveApplicationForm />,
    },

    {
      label: "Warning Letter",
      visible: permissions.commonTabs,
      component: <ViewWarningLetter />,
    },
  ];

  const visibleTabs = allTabDefinitions.filter((tab) => tab.visible);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div>
      <CustomTabs
        tabs={visibleTabs.map((tab) => ({ label: tab.label }))}
        activeTab={activeTabIndex}
        onTabChange={(index) => setActiveTabIndex(index)}
      />
      <div>{visibleTabs && visibleTabs[activeTabIndex].component}</div>
    </div>
  );
};
