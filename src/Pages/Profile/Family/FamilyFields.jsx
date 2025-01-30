import React from "react";
import { Grid, Button } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const FamilyFields = ({ formData, setFormData, error }) => {
  const relationshipOptions = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Spouse",
    "Son",
    "Daughter",
    "Uncle",
    "Aunt",
    "Friend",
    "Neighbour",
  ];

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const showError = error && error.family_details ? error.family_details : [];

  // Handle the change in family details
  const handleFamilyDetailsChange = (event, index) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const updatedFamilyDetails = [...prev.family_details];
      updatedFamilyDetails[index][name] = value;
      return { ...prev, family_details: updatedFamilyDetails };
    });
  };

  // Add a new family member
  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      family_details: [
        ...prev.family_details,
        { name: "", relationship: "", blood_group: "", contact_number: "" },
      ],
    }));
  };

  // Remove a family member
  const removeFamilyMember = (index) => {
    setFormData((prev) => {
      const updatedFamilyDetails = [...prev.family_details];
      updatedFamilyDetails.splice(index, 1);
      return { ...prev, family_details: updatedFamilyDetails };
    });
  };

  return (
    <>
      {formData.family_details.map((familyMember, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Name"
              name="name"
              value={familyMember.name || ""}
              error={showError[index] && showError[index].name ? true : false}
              helperText={
                showError[index] && showError[index].name
                  ? showError[index].name
                  : ""
              }
              onChange={(event) => handleFamilyDetailsChange(event, index)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
              options={relationshipOptions}
              fullWidth
              size="small"
              value={familyMember.relationship || ""}
              onChange={(event, newValue) => {
                handleFamilyDetailsChange(
                  { target: { name: "relationship", value: newValue || "" } },
                  index
                );
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Relation"
                  required
                  error={
                    showError[index] && showError[index].relationship
                      ? true
                      : false
                  }
                  helperText={
                    showError[index] && showError[index].relationship
                      ? showError[index].relationship
                      : ""
                  }
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <CustomAutocomplete
              fullWidth
              size="small"
              options={bloodGroupOptions}
              getOptionLabel={(option) => option}
              value={familyMember.blood_group || ""}
              onChange={(event, newValue) => {
                handleFamilyDetailsChange(
                  { target: { name: "blood_group", value: newValue || "" } },
                  index
                );
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Blood Group"
                  required
                  error={
                    showError[index] && showError[index].blood_group
                      ? true
                      : false
                  }
                  helperText={
                    showError[index] && showError[index].blood_group
                      ? showError[index].blood_group
                      : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              size="small"
              label="Contact Number"
              name="contact_number"
              value={familyMember.contact_number || ""}
              error={
                showError[index] && showError[index].contact_number
                  ? true
                  : false
              }
              helperText={
                showError[index] && showError[index].contact_number
                  ? showError[index].contact_number
                  : ""
              }
              onChange={(event) => handleFamilyDetailsChange(event, index)}
            />
          </Grid>

          {formData.family_details.length > 1 && (
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeFamilyMember(index)}
              >
                Remove
              </Button>
            </Grid>
          )}
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" onClick={addFamilyMember}>
          Add Family Member
        </Button>
      </Grid>
    </>
  );
};
