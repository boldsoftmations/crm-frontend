import React from "react";
import { Box, Paper, Typography } from "@mui/material";
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

export const ViewAllFollowUp = (props) => {
  const { leadsByID } = props;

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
          <Box display="flex">
            <Box flexGrow={0.9} align="left"></Box>
            <Box flexGrow={2.5} align="center">
              <h3 className="Auth-form-title">View Activity</h3>
            </Box>
            <Box flexGrow={0.3} align="right"></Box>
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
            {leadsByID.followup && (
              <>
                {leadsByID.followup.map((data) => {
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
                              {data.activity} - {data.user} -
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
