import React, { useEffect, useState } from "react";
import { Button, TextField, DialogActions } from "@mui/material";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

const statusOptions = ["Selected", "Rejected"];
const rejectedReasonOptions = [
  "Insufficient Technical Knowledge",
  "Poor Problem-Solving Skills",
  "Lack of Practical Experience",
  "Poor Communication Skills",
  "Cultural Mismatch",
  "Lack of Enthusiasm or Interest",
  "Inadequate Responses to Behavioral Questions",
  "Inconsistent Career Goals",
  "Negative Team Feedback",
  "Poor Performance in Team Exercises",
  "Unprofessional Behavior",
  "Overconfidence or Arrogance",
  "Failed Technical Assessments",
  "Background Check Issues",
  "Better Fit Found",
];

export const ShortListedCandidateUpdate = ({
  row,
  closeDialog,
  fetchCandidates,
}) => {
  const [formData, setFormData] = useState({
    rejection_reason: row.rejection_reason || "",
    status: row.status || "",
    stage: row.stage,
    applicant: row.applicant,
  });
  const [loader, setLoader] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  useEffect(() => {
    setFormData({
      rejection_reason: row.rejection_reason || "",
      status: row.status || "",
      stage: row.stage,
      applicant: row.applicant,
    });
  }, [row]);
  console.log(row);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    const { status, rejection_reason, stage, applicant } = formData;
    const updatedInterviewDetails = {
      status: status,
      stage: stage,
      applicant: applicant,
      ...(status === "Rejected" && { rejection_reason: rejection_reason }),
    };

    try {
      setLoader(true);
      await Hr.updateInterviewDate(row.id, updatedInterviewDetails);

      handleSuccess("Interviews status updated successfully");
      setTimeout(() => {
        closeDialog();
        fetchCandidates();
      }, 500);
    } catch (error) {
      console.error("Error updating interview details:", error);
      handleError(error || "Error updating interview details");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={loader} />
      <CustomAutocomplete
        value={formData.status}
        onChange={(event, newValue) => handleInputChange("status", newValue)}
        options={statusOptions}
        getOptionLabel={(option) => option}
        label="Status"
        fullWidth
      />
      {formData.status === "Rejected" && (
        <CustomAutocomplete
          value={formData.rejection_reason}
          onChange={(event, newValue) =>
            handleInputChange("rejection_reason", newValue)
          }
          options={rejectedReasonOptions}
          label="Rejected Reason"
          fullWidth
        />
      )}
      <DialogActions>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </>
  );
};
