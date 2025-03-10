import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
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
import { Popup } from "../../Components/Popup";
import { CustomerActivityCreate } from "./CustomerActivityCreate";
import CustomerServices from "../../services/CustomerService";

export const ViewCustomerFollowUp = ({ recordForEdit, selectedCustomers }) => {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [followUpData, setFollowUpData] = useState([]);

  useEffect(() => {
    getCompanyDetailsByID();
  }, []);

  // API call to fetch company details based on type
  const getCompanyDetailsByID = async () => {
    try {
      setOpen(true);

      const [followupResponse, potentialResponse] = await Promise.all([
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "followup"),
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "potential"),
      ]);
      setFollowUpData(followupResponse.data.followup);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const handleClickOpen = () => setOpenModal(true);

  const renderTimelineItems = () =>
    followUpData.map((data) => (
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
                {moment(data.creation_date).format("DD/MM/YYYY h:mm")}
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
                {data.activity_name} - {data.sales_person} -{" "}
                {data.next_followup_date &&
                  moment(data.next_followup_date).format("DD/MM/YYYY")}
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
    ));

  return (
    <>
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
          <Box display="flex" justifyContent="space-around">
            <Typography variant="h5" align="center">
              View Activity
            </Typography>
            <Button
              variant="contained"
              color="success"
              onClick={handleClickOpen}
            >
              Create Activity
            </Button>
          </Box>
          {followUpData && followUpData.length && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: 260,
                overflow: "auto",
              }}
            >
              {renderTimelineItems()}
            </Box>
          )}
        </Paper>
      </Box>
      <Popup
        maxWidth="xl"
        title="Create Follow Up"
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <CustomerActivityCreate
          setOpenModal={setOpenModal}
          getFollowUp={getCompanyDetailsByID}
          selectedCustomers={selectedCustomers}
        />
      </Popup>
    </>
  );
};
