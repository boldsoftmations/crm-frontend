import React, { useState } from "react";
import { CustomTabs } from "../../Components/CustomTabs.jsx";
import { JobOpeningView } from "./../HrModel/JobOpening/JobOpeningView.jsx";
import { OfferStatusView } from "./OfferStatus/OfferStatusView.jsx";
import { ApplicantListView } from "./ApplicantList/ApplicantListView.jsx";
import { ShortListedCandidateView } from "./ShortlistedCandidate/ShortListedCandidateView.jsx";
import { RejectedCandidate } from "./RejectedCandidate/RejectedCandidate.jsx";
import { useSelector } from "react-redux";
import { ViewCompetitorCandidates } from "./CompetitorCandidates/ViewCompetitorCandidates.jsx";
import { ViewAssementDetails } from "./AsssementDetails/ViewAssementDetails.jsx";
import { ViewCandidatesFollowup } from "./Followup/ViewCandidatesFollowup.jsx";
export const HrModelTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  // const assigned = users.sales_users || [];
  const isSalesManager = users.groups.includes("Sales Manager");

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = isSalesManager
    ? [{ label: "Job Opening" }]
    : [
        { label: "Job Opening" },
        { label: "Applicant List" },
        { label: "Candidates Followup" },
        { label: "Interview Status" },
        { label: "Offer Status" },
        // { label: "MIS Report" },
        // { label: "Dashboard" },
        { label: "Rejected Candidate" },
        { label: "Assesment Details" },
        { label: "Competitor" },
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
                  <ViewCandidatesFollowup />
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
              {/* {activeTab === 5 && (
                <div>
                  <MisReportView />
                </div>
              )}
              {activeTab === 6 && (
                <div>
                  <HrDashboard />
                </div>
              )} */}
              {activeTab === 5 && (
                <div>
                  <RejectedCandidate />
                </div>
              )}
              {activeTab === 6 && (
                <div>
                  <ViewAssementDetails />
                </div>
              )}
              {activeTab === 7 && (
                <div>
                  <ViewCompetitorCandidates />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
