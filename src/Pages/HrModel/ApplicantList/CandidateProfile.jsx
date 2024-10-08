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
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import { blue, grey } from "@mui/material/colors";
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
    <Container maxWidth="md">
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={loader} />
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 4,
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2} display="flex" justifyContent="center">
              <Avatar
                sx={{
                  bgcolor: blue[500],
                  width: 50,
                  height: 50,
                  fontSize: 40,
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold">
                {candidate.name || "N/A"}
              </Typography>
              <Typography color="textSecondary">
                {candidate.designation || "No Designation"}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box textAlign="center" width="50%">
                <Typography variant="body1" color="textSecondary">
                  Stage
                </Typography>
                <Chip
                  label={candidate.stage || "Screening"}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: "bold", mt: 1 }}
                />
              </Box>
              <Box textAlign="center" width="50%">
                <Typography variant="body1" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={candidate.status || "Open"}
                  color="secondary"
                  variant="outlined"
                  sx={{ fontWeight: "bold", mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={2} mt={3}>
              <Tooltip title="Edit Profile">
                <IconButton
                  onClick={() => setOpenCandidatePopup(true)}
                  sx={{ bgcolor: grey[200] }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {candidate.email || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Contact:</strong> {candidate.contact || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Department:</strong> {candidate.department || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Job ID:</strong> {candidate.job || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Location:</strong> {candidate.location || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Current Location:</strong>{" "}
                {candidate.current_location || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Current Salary:</strong>{" "}
                {candidate.current_salary || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Expected Salary:</strong>{" "}
                {candidate.expected_salary || "N/A"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Spoken English:</strong>{" "}
                {candidate.spoken_english || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Qualification:</strong>{" "}
                {candidate.qualification || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Source:</strong> {candidate.source || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Created By:</strong> {candidate.created_by || "N/A"}
              </Typography>
            </Grid>
          </Grid>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap="20px"
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              size="small"
            >
              View CV
            </Button>
            <UploadCv
              candidate={candidate}
              onUploadSuccess={getCandidateProfile}
            />
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