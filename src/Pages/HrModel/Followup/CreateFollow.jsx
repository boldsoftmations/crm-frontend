import React, { useEffect, useState } from "react";
import { Grid, TextField, Box, Button } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import Hr from "../../../services/Hr";
import { Popup } from "../../../Components/Popup";
import { InterviewStatusCreate } from "../InterviewStatus/InterviewStatusUpdate";

export const CreateFollowup = ({
  dataRecord,
  setOpenUpdatePopup,
  getInterviewDatas,
}) => {
  const [candidateStatus, setCandidateStatus] = useState([]);
  const [followupData, setFollowupData] = useState({});
  const [loader, setLoader] = useState(false);
  const [isFollowupDone, setIsFollowupDone] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  useEffect(() => {
    const getCandidateStatus = async () => {
      try {
        setLoader(true);
        const res = await Hr.getCandidates();
        setCandidateStatus(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    };
    getCandidateStatus();
  }, []);

  const handleFollowInputChange = (event) => {
    let { name, value } = event.target;
    setFollowupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFollowChange = (e, newValue, name) => {
    setFollowupData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmitFollowup = async (e) => {
    e.preventDefault();
    if (dataRecord && !dataRecord.applicant) {
      setAlertMsg({
        open: true,
        message: "Contact number is required",
        severity: "error",
      });
      return;
    }
    try {
      setLoader(true);
      const payload = {
        applicant: dataRecord.applicant ? dataRecord.applicant : "",
        call_status: followupData.call_status,
        applicant_status: followupData.applicant_status,
        notes: followupData.notes,
      };
      const res = await Hr.createCandidateFollowup(payload);
      const data = res.data;
      if (res.status === 201) {
        setAlertMsg({
          open: true,
          message: "Followup created successfully",
          severity: "success",
        });
        if (data.success === true) {
          setIsFollowupDone(true);
        } else {
          setOpenUpdatePopup(false);
          getInterviewDatas();
        }
      }
    } catch (e) {
      setAlertMsg({
        open: true,
        message: e.response.data.message || "Error creating followup",
        severity: "error",
      });
      console.error("Error creating followup:", e);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <CustomLoader open={loader} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomAutocomplete
            size="small"
            id="call_status"
            name="call_status"
            options={["Connected", "Disconnected"]}
            renderInput={(params) => (
              <TextField {...params} label="Call Status" />
            )}
            value={followupData.call_status}
            onChange={(e, value) => handleFollowChange(e, value, "call_status")}
            label="Call Status"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomAutocomplete
            size="small"
            id="applicant_status"
            options={candidateStatus}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Applicant Status" />
            )}
            value={
              candidateStatus.find(
                (option) => option.id === followupData.applicant_status
              ) || null
            }
            onChange={(e, value) =>
              handleFollowChange(e, value ? value.id : null, "applicant_status")
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            label="Notes"
            name="notes"
            fullWidth
            value={followupData.notes}
            onChange={handleFollowInputChange}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          fullWidth
          onClick={handleSubmitFollowup}
          variant="contained"
          color="secondary"
        >
          Add Followup
        </Button>
      </Box>
      <Popup
        openPopup={isFollowupDone}
        setOpenPopup={setIsFollowupDone}
        title="Schedule Interview"
        maxWidth="md"
      >
        <InterviewStatusCreate
          setIsFollowupDone={setIsFollowupDone}
          contact={dataRecord && dataRecord.applicant}
          setOpenApplicantListPopup={setOpenUpdatePopup}
          getInterviewDatas={getInterviewDatas}
        />
      </Popup>
    </>
  );
};
