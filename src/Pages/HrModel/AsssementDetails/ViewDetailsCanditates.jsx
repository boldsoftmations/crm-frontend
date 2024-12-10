import React from "react";
import { Grid, Typography, Box, Paper, Divider } from "@mui/material";

const ViewDetailsCandidates = ({ data }) => {
  const renderSectionHeader = (title) => (
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        fontWeight: "bold",
        color: "#444",
        borderBottom: "2px solid #ddd",
        paddingBottom: "8px",
        mb: 2,
      }}
    >
      {title}
    </Typography>
  );

  const renderInfoBox = (title, value) => (
    <Typography variant="body1">
      <strong>{title}:</strong> {value || "N/A"}
    </Typography>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mx: "auto",
        backgroundColor: "#f9f9f9",
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={4}>
        {/* Personal Information */}
        <Grid item xs={12}>
          {renderSectionHeader("Personal Information")}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {renderInfoBox("Full Name", data.name)}
              {renderInfoBox("Contact", data.contact)}
              {renderInfoBox("Father or Husband Name", data.f_or_h_name)}
              {renderInfoBox("Date of Birth", data.dob)}
              {renderInfoBox("Place of Birth", data.place_of_birth)}
            </Grid>
            <Grid item xs={6}>
              {renderInfoBox("Nationality", data.nationality)}
              {renderInfoBox("Religion", data.religion)}
              {renderInfoBox("Marital Status", data.marital_status)}
              {renderInfoBox("Gender", data.gender)}
            </Grid>
          </Grid>
        </Grid>

        {/* Address Details */}
        <Grid item xs={12}>
          {renderSectionHeader("Address Details")}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {renderInfoBox(
                "Present Address",
                `${data.present_address.address}, ${data.present_address.city}, ${data.present_address.state}, ${data.present_address.country} - ${data.present_address.pincode}`
              )}
            </Grid>
            <Grid item xs={6}>
              {renderInfoBox(
                "Permanent Address",
                `${data.permanent_address.address}, ${data.permanent_address.city}, ${data.permanent_address.state}, ${data.permanent_address.country} - ${data.permanent_address.pincode}`
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Education */}
        <Grid item xs={12}>
          {renderSectionHeader("Education")}
          <Grid container spacing={2}>
            {data.eq.map((edu, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {renderInfoBox("School/College", edu.school_or_college_name)}
                  {renderInfoBox("Board/University", edu.board_or_university)}
                  {renderInfoBox("Examination", edu.examination)}
                  {renderInfoBox("Subject", edu.subject)}
                  {renderInfoBox("Year", edu.year)}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Work Experience */}
        <Grid item xs={12}>
          {renderSectionHeader("Work Experience")}
          <Grid container spacing={2}>
            {data.experience.map((exp, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {renderInfoBox("Post Held", exp.post_held)}
                  {renderInfoBox("Period", `${exp.period} years`)}
                  {renderInfoBox("Starting Salary", `₹${exp.starting_salary}`)}
                  {renderInfoBox("Last Salary", `₹${exp.last_salary}`)}
                  {renderInfoBox("Reason for Leaving", exp.reason_for_leaving)}
                  {renderInfoBox(
                    "Employer Name & Address",
                    exp.employer_name_and_address
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Other Info */}
        <Grid item xs={12}>
          {renderSectionHeader("Other Info")}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {renderInfoBox("Expected Salary", `₹${data.expected_salary}`)}
                {renderInfoBox("Joining Days", data.joining_days)}
                {renderInfoBox(
                  "Technical Qualification",
                  data.technical_qualification
                )}
                {renderInfoBox(
                  "Relative in Company",
                  data.relative_in_company.has_relative ? "Yes" : "No"
                )}
                {data.relative_in_company.relationship &&
                  renderInfoBox(
                    "Relationship with Relative",
                    data.relative_in_company.relationship
                  )}
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* References */}
        <Grid item xs={12}>
          {renderSectionHeader("References")}
          <Grid container spacing={2}>
            {data.references.map((ref, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {renderInfoBox("Name", ref.name)}
                  {renderInfoBox("Contact", ref.contact_number)}
                  {renderInfoBox("Address", ref.address)}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ViewDetailsCandidates;
