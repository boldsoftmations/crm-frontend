import React, { useState } from "react";
import { CustomTabs } from "../../Components/CustomTabs.jsx";
import { JobOpeningView } from "./../HrModel/JobOpening/JobOpeningView.jsx";
import { InterviewStatusView } from "./InterviewStatus/InterviewStatusView.jsx";
import { OfferStatusView } from "./OfferStatus/OfferStatusView.jsx";
import { MisReportView } from "./MisReport/MisReportView.jsx";
import { ApplicantListView } from "./ApplicantList/ApplicantListView.jsx";
import { ShortListedCandidateView } from "./ShortlistedCandidate/ShortListedCandidateView.jsx";
import { HrDashboard } from "./HrDashboard.jsx";
import { RejectedCandidate } from "./RejectedCandidate/RejectedCandidate.jsx";
import { useSelector } from "react-redux";
import ViewAttribute from "./Attribute/ViewAttribute.jsx";
import { ViewCompentancyAttribute } from "./CompentancyAttribute/ViewCompentacyAttribute.jsx";
import { ViewRoleClarity } from "./RoleClarity/ViewRoleClarity.jsx";
import { ViewJobDescription } from "./JobDescription/ViewJobDescription.jsx";
export const HrModelTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned = users.sales_users || [];
  const isSalesManager = users.groups.includes("Sales Manager");

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = isSalesManager
    ? [{ label: "Job Opening" }]
    : [
        { label: "Job Opening" },
        { label: "Applicant List" },
        { label: "Shortlisted Candidate" },
        { label: "Interview Status" },
        { label: "Offer Status" },
        { label: "MIS Report" },
        { label: "Dashboard" },
        { label: "Rejected Candidate" },
        { label: "Attribute" },
        { label: "Competency Attribute" },
        { label: "Role Clarity" },
        { label: "Job Description" },
      ];

  return (
    <div>
      <div>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div style={{ marginTop: "10px" }}>
          {activeTab === 0 && (
            <div>
              <JobOpeningView />
            </div>
          )}
          {!isSalesManager && (
            <>
              {activeTab === 1 && (
                <div>
                  <ApplicantListView />
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <InterviewStatusView />
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <ShortListedCandidateView />
                </div>
              )}
              {activeTab === 4 && (
                <div>
                  <OfferStatusView />
                </div>
              )}
              {activeTab === 5 && (
                <div>
                  <MisReportView />
                </div>
              )}
              {activeTab === 6 && (
                <div>
                  <HrDashboard />
                </div>
              )}
              {activeTab === 7 && (
                <div>
                  <RejectedCandidate />
                </div>
              )}
              {activeTab === 8 && (
                <div>
                  <ViewAttribute />
                </div>
              )}
              {activeTab === 9 && (
                <div>
                  <ViewCompentancyAttribute />
                </div>
              )}
              {activeTab === 10 && (
                <div>
                  <ViewRoleClarity />
                </div>
              )}
              {activeTab === 11 && (
                <div>
                  <ViewJobDescription />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
