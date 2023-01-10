import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from "@mui/lab";

import moment from "moment";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import LeadServices from "../../services/LeadService";
import { useSelector } from 'react-redux';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const ViewAllFollowUp = (props) => {
  const { recordForEdit } = props;
  const [followUp, setFollowUp] = useState([]);
  const [followUpData, setFollowUpData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const data = useSelector((state) => state.auth);
  const userId = data.profile.email;
  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFollowUp({ ...followUp, [name]: value });
  };

  const getFollowUp = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getLeadsById(recordForEdit);
      setFollowUpData(res.data.followup);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setOpen(false);
    }
  };

  useEffect(() => {
    getFollowUp();
  }, []);

  const createFollowUpLeadsData = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        leads: recordForEdit,
        user: userId,
        notes: followUp.note,
        next_followup_date: followUp.nextFollowUpDate,
      };

      const res = await LeadServices.createFollowUpLeads(data);

      console.log("res :>> ", res);
      setOpenModal(false);
      getFollowUp();
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };
  return (
    <>
      <div>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Create Follow Up
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={(e) => createFollowUpLeadsData(e)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  multiline
                  fullWidth
                  name="note"
                  size="small"
                  label="Note"
                  variant="outlined"
                  value={followUp.companyName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  name="nextFollowUpDate"
                  size="small"
                  label="Next Followup Date"
                  variant="outlined"
                  value={
                    followUp.nextFollowUpDate ? followUp.nextFollowUpDate : ""
                  }
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Button fullWidth type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </BootstrapDialog>

      <Box component="form" noValidate sx={{ mt: 1 }}>
        <Paper
          sx={{
            p: 2,
            m: 4,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Box display="flex">
            <Box flexGrow={0.9} align="left"></Box>
            <Box flexGrow={2.5} align="center">
              <h3 className="Auth-form-title">View FollowUp</h3>
            </Box>
            <Box flexGrow={0.3} align="right">
              <Button
                variant="contained"
                color="success"
                onClick={handleClickOpen}
              >
                Create Followup
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 260,
              overflow: "hidden",
              overflowY: "scroll",
              // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
            }}
          >
            {followUpData && (
              <>
                {followUpData.map((data) => {
                  return (
                    <div key={data.id}>
                      <Timeline
                         sx={{
                          [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.2,
                          },
                        }}
                      >
                        <TimelineItem>
                          <TimelineOppositeContent sx={{  px: 2 }}>
                          <Typography variant="h6" component="span">
                          {moment(data.current_date).format(
                                "DD/MM/YYYY h:mm:ss"
                              )}
                              </Typography>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent sx={{ py: "12px", px: 2 }}>
                            <Typography
                              sx={{ fontSize: "20px" }}
                              component="span"
                            >
                              {moment(data.current_date).format(
                                "DD/MM/YYYY h:mm:ss"
                              )}
                              - {data.user} -{" "}
                              {moment(data.next_followup_date).format(
                                "DD/MM/YYYY"
                              )}
                            </Typography>
                            <Typography sx={{ fontSize: "24px" }}>
                              {data.notes}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    </div>
                  );
                })}
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};
