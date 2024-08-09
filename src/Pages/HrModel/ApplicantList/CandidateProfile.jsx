import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
  Divider,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import { blue } from "@mui/material/colors";
import Hr from "../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import { ApplicantListUpdate } from "./ApplicantListUpdate";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import UploadCv from "../CandidateSource/UploadCV";

const CandidateProfile = ({ candidateData }) => {
  const [openCandidatePopup, setOpenCandidatePopup] = useState(false);
  const [loader, setLoader] = useState(false);
  const [candidate, setCandidate] = useState({});
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleDownload = () => {
    if (candidate.cv) {
      const url = candidate.cv;
      const link = document.createElement("a");
      link.href = url;
      link.download = `${candidateData.name}${candidateData.id}.resume`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setAlertMsg({
        message: "CV is not uploaded for this candidate",
        open: true,
        severity: "error",
      });
    }
  };

  const getCandidateProfile = async () => {
    try {
      setLoader(true);
      const response = await Hr.getCandidateProfile(candidateData.id);
      console.log("response", response.data);
      setCandidate(response.data);
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCandidateProfile();
  }, [candidateData.id]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={loader} />
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="start">
            <Grid item xs={12} md={1}>
              <Avatar sx={{ bgcolor: blue[500], width: 56, height: 56 }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Grid>
            <Grid item xs={12} md={3} style={{ textAlign: "center" }}>
              <Typography variant="h6">{candidate.name}</Typography>
              <Typography color="textSecondary">
                {candidate.designation}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} style={{ textAlign: "center" }}>
              <Typography variant="h6">Status</Typography>
              <Typography color="textSecondary">{candidate.status}</Typography>
            </Grid>
            <Grid item xs={12} md={3} style={{ textAlign: "center" }}>
              <Typography variant="h6">Stage</Typography>
              <Typography color="textSecondary">{candidate.stage}</Typography>
            </Grid>
            <Grid item xs={12} md={2} style={{ textAlign: "end" }}>
              <Tooltip title="Edit Profile">
                <IconButton onClick={() => setOpenCandidatePopup(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Email:</strong> {candidate.email}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Contact:</strong> {candidate.contact}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Department:</strong> {candidate.department}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Job ID:</strong> {candidate.job}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Location:</strong> {candidate.location}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Current Location:</strong> {candidate.current_location}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Current Salary:</strong> {candidate.current_salary}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Expected Salary:</strong> {candidate.expected_salary}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Spoken English:</strong> {candidate.spoken_english}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Qualification:</strong> {candidate.qualification}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Source:</strong> {candidate.source}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Stage:</strong> {candidate.stage}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Created By:</strong> {candidate.created_by}
            </Typography>
            <Box display="flex" gap="20px">
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  style={{ marginTop: "20px" }}
                  target="_blank"
                  size="small"
                >
                  View CV
                </Button>
              </Box>

              <Box style={{ marginTop: "20px" }}>
                <UploadCv
                  candidate={candidate}
                  onUploadSuccess={getCandidateProfile}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Popup
        maxWidth="md"
        title="Update Candidate Profile"
        openPopup={openCandidatePopup}
        setOpenPopup={setOpenCandidatePopup}
      >
        <ApplicantListUpdate
          getCandidateProfile={getCandidateProfile}
          candidateData={candidate}
          setOpenCandidatePopup={setOpenCandidatePopup}
        />
      </Popup>
    </Container>
  );
};

export default CandidateProfile;
