import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Paper,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
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
import { useSelector } from "react-redux";
import moment from "moment";
import CustomerServices from "../../services/CustomerService";
import { CustomLoader } from "../../Components/CustomLoader";
import { Popup } from "../../Components/Popup";

export const ViewCustomerFollowUp = (props) => {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFollowUp({ ...followUp, [name]: value });
  };

  const getFollowUp = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getCompanyDataById(recordForEdit);
      setFollowUpData(res.data.follow_up);
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
        company: recordForEdit,
        user: userId,
        activity: followUp.activity,
        notes: followUp.note,
        next_followup_date: followUp.nextFollowUpDate,
      };

      const res = await CustomerServices.createFollowUpCustomer(data);
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
      <CustomLoader open={open} />
      <Popup
        maxWidth={"xl"}
        title={"Create Follow Up"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={(e) => createFollowUpLeadsData(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Activity</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="activity"
                  label="Activity"
                  // value={filterQuery}
                  onChange={handleInputChange}
                >
                  {ActivityOption.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
      </Popup>

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
              <h3 className="Auth-form-title">View Activity</h3>
            </Box>
            <Box flexGrow={0.3} align="right">
              <Button
                variant="contained"
                color="success"
                onClick={handleClickOpen}
              >
                Create Activity
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
                          <TimelineOppositeContent sx={{ px: 2 }}>
                            <Typography variant="h6">
                              {moment(data.current_date).format(
                                "DD/MM/YYYY h:mm"
                              )}
                            </Typography>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent sx={{ width: "50%", color: "#333" }}>
                            <Typography
                              variant="h6"
                              sx={{ fontFamily: "Arial", fontWeight: "bold" }}
                            >
                              {data.activity} - {data.user} -{" "}
                              {data.next_followup_date &&
                                moment(data.next_followup_date).format(
                                  "DD/MM/YYYY"
                                )}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontFamily: "Verdana", fontSize: "16px" }}
                            >
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

const ActivityOption = [
  {
    id: 1,
    value: "Not answering/busy/disconnecting",
    label: "Not answering/busy/disconnecting",
  },

  {
    id: 2,
    value: "Having stock",
    label: "Having stock",
  },
  {
    id: 3,
    value: "Rate issue",
    label: "Rate issue",
  },
  {
    id: 4,
    value: "Buying a different product from other company",
    label: "Buying a different product from other company",
  },
  {
    id: 5,
    value: "Size or quantity is unavailabe with us",
    label: "Size or quantity is unavailabe with us",
  },
  {
    id: 6,
    value: "Transportation cost issue",
    label: "Transportation cost issue",
  },
  {
    id: 7,
    value: "Call me back",
    label: "Call me back",
  },
  {
    id: 8,
    value: "Send sample",
    label: "Send sample",
  },
  {
    id: 9,
    value: "Require own branding",
    label: "Require own branding",
  },
  {
    id: 10,
    value: "Require exclusive distributorship/dealership",
    label: "Require exclusive distributorship/dealership",
  },
  {
    id: 11,
    value: "Quality issue",
    label: "Quality issue",
  },
];
