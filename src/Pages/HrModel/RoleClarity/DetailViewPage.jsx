import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
} from "@mui/material";

const DetailViewPage = ({ data }) => {
  return (
    <Container>
      <Paper sx={{ p: 3 }} style={{ width: "700px" }}>
        <Typography variant="h6" gutterBottom>
          Role: {data.designation}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container>
          <Grid item xs={4} sx={{ borderRight: 1, borderColor: "divider" }}>
            <Box sx={{ p: 2, backgroundColor: "#f0f0f0", height: "100%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Role Definition
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, fontSize: 15 }}
              >
                {data.role_definition}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={4}
            sx={{ borderRight: 1, borderColor: "divider", borderTop: 1 }}
          >
            <Box sx={{ p: 2, backgroundColor: "#e0f7fa", height: "100%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Responsibility Deliverable
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={8} sx={{ borderTop: 1, borderColor: "divider" }}>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, fontSize: 15 }}
              >
                {data.responsibility_deliverable}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={4}
            sx={{ borderRight: 1, borderColor: "divider", borderTop: 1 }}
          >
            <Box sx={{ p: 2, backgroundColor: "#ffecb3", height: "100%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Tasks Activities
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={8} sx={{ borderTop: 1, borderColor: "divider" }}>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, fontSize: 15 }}
              >
                {data.tasks_activities}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={4}
            sx={{ borderRight: 1, borderColor: "divider", borderTop: 1 }}
          >
            <Box sx={{ p: 2, backgroundColor: "#dcedc8", height: "100%" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Measurement Metrics
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={8} sx={{ borderTop: 1, borderColor: "divider" }}>
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, fontSize: 15 }}
              >
                {data.measurement_metrics}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DetailViewPage;
