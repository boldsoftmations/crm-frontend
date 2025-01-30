import React from "react";
import { Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";

const educationFieldData = [
  { section: "school", type: "text", label: "10th School Name", name: "name" },
  { section: "school", type: "text", label: "Board", name: "board" },
  { section: "school", type: "number", label: "Passout Year", name: "passout" },
  {
    section: "college",
    type: "text",
    label: "12th School/College Name",
    name: "name",
  },
  { section: "college", type: "text", label: "Board", name: "board" },
  {
    section: "college",
    type: "number",
    label: "Passout Year",
    name: "passout",
  },
  { section: "diploma", type: "text", label: "Diploma Type", name: "type" },
  {
    section: "diploma",
    type: "text",
    label: "Diploma University Name",
    name: "uni_name",
  },
  {
    section: "diploma",
    type: "number",
    label: "Passout Year",
    name: "passout",
  },
  {
    section: "graduation",
    type: "text",
    label: "Graduation Type",
    name: "type",
  },
  {
    section: "graduation",
    type: "text",
    label: "Graduation University Name",
    name: "university",
  },
  {
    section: "graduation",
    type: "number",
    label: "Passout Year",
    name: "passout",
  },
  {
    section: "pg",
    type: "text",
    label: "Post Graduation / Masters",
    name: "masters",
  },
  { section: "pg", type: "number", label: "Passout Year", name: "passout" },
  // {
  //   section: "education",
  //   type: "text",
  //   label: "Additional Educational Qualifications",
  //   name: "additional_qualifiction",
  // },
];

export const EducationFields = ({ formData, setFormData }) => {
  const getFieldData = (field) => {
    if (!formData || !formData.education) return ""; // Handle undefined data

    if (field.section === "education") {
      return formData.education[field.name] || "";
    } else if (formData.education[field.section]) {
      return formData.education[field.section][field.name] || "";
    }

    return "";
  };

  const handleChange = (event, section) => {
    const { name, value } = event.target;
    let updatedData = { ...formData.education };

    if (section === "education") {
      updatedData[name] = value;
    } else {
      if (!updatedData[section]) {
        updatedData[section] = {};
      }
      updatedData[section][name] = value;
    }

    setFormData((prev) => ({
      ...prev,
      education: updatedData,
    }));
  };

  return (
    <>
      {educationFieldData.map((field, index) => {
        const value = getFieldData(field);

        return (
          <Grid item xs={12} sm={4} key={index}>
            <CustomTextField
              fullWidth
              type={field.type}
              size="small"
              label={field.label}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(e, field.section)}
              InputLabelProps={field.type === "date" ? { shrink: true } : {}}
            />
          </Grid>
        );
      })}
    </>
  );
};
