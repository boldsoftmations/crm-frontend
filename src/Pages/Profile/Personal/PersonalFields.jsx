import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const fieldData = [
  { type: "text", label: "First Name", name: "first_name" },
  { type: "text", label: "Middle Name", name: "middle_name" },
  { type: "text", label: "Last Name", name: "last_name" },
  { type: "email", label: "Email", name: "email" },
  // { type: "email", label: "Alternate Email", name: "alternate_email" },
  { type: "tel", label: "Contact", name: "contact" },
  // { type: "tel", label: "Alternate Contact", name: "alternate_contact" },
  {
    type: "autocomplete",
    label: "Gender",
    name: "gender",
    options: ["Male", "Female", "Others"],
  },
  { type: "date", label: "Date of Birth", name: "date_of_birth" },
  { type: "text", label: "Place of Birth", name: "place_of_birth" },
  {
    type: "autocomplete",
    label: "Nationality",
    name: "nationality",
    options: [
      "Indian",
      "Canadian",
      "British",
      "Chineese",
      "Japaneese",
      "Pakistani",
      "Arabic",
      "Others",
    ],
  },
  {
    type: "autocomplete",
    label: "Religion",
    name: "religion",
    options: [
      "Christianity",
      "Islam",
      "Hinduism",
      "Buddhism",
      "Sikhism",
      "Judaism",
      "No religion",
      "Others",
    ],
  },
  {
    type: "autocomplete",
    label: "Marital Status",
    name: "marital_status",
    options: ["Married", "Unmarried"],
  },
  {
    type: "conditionalDate",
    label: "Marriage Date",
    name: "marriage_date",
    condition: "Married",
  },
  { type: "date", label: "Date of Joining", name: "date_of_joining" },
  {
    type: "autocomplete",
    label: "Blood Group",
    name: "blood_group",
    options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
];

export const PersonalFields = ({ formData, setFormData, error }) => {
  let showError = error && error.personal;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split(".");
    const nestedKey = keys[1];

    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [nestedKey]: value,
      },
    }));
  };

  return (
    <>
      {fieldData.map((field, index) => {
        const value = formData.personal[field.name] || "";
        switch (field.type) {
          case "autocomplete":
            return (
              <Grid item xs={12} sm={4} key={index}>
                <CustomAutocomplete
                  options={field.options}
                  fullWidth
                  size="small"
                  value={value}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: `personal.${field.name}`,
                        value: newValue || "",
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label={field.label}
                      required
                      error={showError && !!showError[field.name]} // Only show error when there is an error message
                      helperText={(showError && showError[field.name]) || ""} // Display helper text only if there's an error
                    />
                  )}
                />
              </Grid>
            );
          case "conditionalDate":
            if (formData.personal.marital_status === field.condition) {
              return (
                <Grid item xs={12} sm={4} key={index}>
                  <CustomTextField
                    fullWidth
                    required
                    type="date"
                    size="small"
                    label={field.label}
                    name={`personal.${field.name}`}
                    value={value}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={showError && !!showError[field.name]} // Only show error when there is an error message
                    helperText={(showError && showError[field.name]) || ""} // Display helper text only if there's an error
                  />
                </Grid>
              );
            }
            break;
          default:
            return (
              <Grid item xs={12} sm={4} key={index}>
                <CustomTextField
                  fullWidth
                  type={field.type}
                  size="small"
                  required
                  label={field.label}
                  name={`personal.${field.name}`}
                  value={value}
                  onChange={handleChange}
                  error={showError && !!showError[field.name]} // Only show error when there is an error message
                  helperText={(showError && showError[field.name]) || ""} // Display helper text only if there's an error
                  disabled={field.disabled}
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : {}
                  }
                />
              </Grid>
            );
        }
        return null;
      })}
    </>
  );
};
