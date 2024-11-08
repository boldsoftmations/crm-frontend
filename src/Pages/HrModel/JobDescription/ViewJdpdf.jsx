import React, { useRef, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import html2pdf from "html2pdf.js";

const colors = {
  section1: "#f0f0f0",
  section2: "#e0f7fa",
  section3: "#ffecb3",
  section4: "#dcedc8",
};

const JobDescriptionDetail = ({ job }) => {
  const printRef = useRef();
  const [loader, setLoader] = useState(false);

  const renderListWithNumbers = (items) => (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText
            primaryTypographyProps={{ fontSize: 14, fontWeight: 300 }}
            primary={`${index + 1}. ${item}`}
          />
        </ListItem>
      ))}
    </List>
  );

  const downloadPDF = () => {
    const input = printRef.current;
    setLoader(true);

    const opt = {
      margin: 10,
      filename: `${job.designation}_Job_Description.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: "#ffffff" }, // Set scale and background color
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(input)
      .save()
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <Container>
      <CustomLoader open={loader} />
      <Paper sx={{ p: 2, mb: 1, backgroundColor: "white" }} ref={printRef}>
        <Typography variant="h6" gutterBottom align="center">
          GLUTAPE - JOB DESCRIPTION <br /> {job.designation}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: colors.section1,
                p: 1,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Purpose:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, fontWeight: 300 }}
              >
                {job.job_purpose}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: colors.section2,
                p: 1,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Reports To:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, fontWeight: 300 }}
              >
                {job.reports_to}
              </Typography>
            </Box>
          </Grid>
          {job.directs_report.length > 0 && (
            <Grid item xs={12}>
              <Box
                sx={{
                  backgroundColor: colors.section3,
                  p: 1,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Direct Reports:
                </Typography>
                {renderListWithNumbers(job.directs_report)}
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: colors.section4,
                p: 1,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Key Responsibility Areas:
              </Typography>
              {renderListWithNumbers(job.kra)}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: colors.section1,
                p: 1,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Major Tasks and Responsibilities:
              </Typography>
              {renderListWithNumbers(job.mtr)}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                backgroundColor: colors.section3,
                padding: 1,
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Occasional Duties:
              </Typography>
              {renderListWithNumbers(job.occasional_duties)}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{ backgroundColor: colors.section2, p: 1, borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Relevant Skills:
              </Typography>
              {renderListWithNumbers(job.relevant_skill)}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold" }}
            >
              Requirements
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Box
              sx={{
                backgroundColor: colors.section3,
                p: 2,
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Minimum Education Level:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, fontWeight: 300 }}
              >
                {job.min_education_level}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                backgroundColor: colors.section4,
                p: 2,
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Work Experience:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, fontWeight: 300 }}
              >
                {job.work_experience} years
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: colors.section1,
                p: 2,
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Described Work Experience:
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, fontWeight: 300 }}
              >
                {job.desc_work_exp}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{ backgroundColor: colors.section2, p: 1, borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Special Skills and Abilities:
              </Typography>
              {renderListWithNumbers(job.ssa)}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{ backgroundColor: colors.section4, p: 1, borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Preferred Background:
              </Typography>
              {renderListWithNumbers(job.preferred_background)}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Button variant="contained" color="primary" onClick={downloadPDF}>
        Download as PDF
      </Button>
    </Container>
  );
};

export default JobDescriptionDetail;
