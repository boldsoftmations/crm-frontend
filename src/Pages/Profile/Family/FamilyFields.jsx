import React from "react";
import { Grid, Autocomplete, Button } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";

export const FamilyFields = ({ formData, setFormData }) => {
  // Handle the change in family details
  const handleFamilyDetailsChange = (event, index) => {
    const { name, value } = event.target;
    const updatedFamilyDetails = [...formData.family_details];
    updatedFamilyDetails[index][name] = value;
    setFormData({
      ...formData,
      family_details: updatedFamilyDetails,
    });
  };

  // Add a new family member
  const addFamilyMember = () => {
    const updatedFamilyDetails = [...formData.family_details];
    updatedFamilyDetails.push({
      name: "",
      marital_status: "",
      blood_group: "",
      contact_number: "",
    });
    setFormData({
      ...formData,
      family_details: updatedFamilyDetails,
    });
  };

  // Remove a family member
  const removeFamilyMember = (index) => {
    const updatedFamilyDetails = [...formData.family_details];
    updatedFamilyDetails.splice(index, 1);
    setFormData({
      ...formData,
      family_details: updatedFamilyDetails,
    });
  };
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
              onChange={(event) => handleFamilyDetailsChange(event, index)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={relationshipOptions}
              fullWidth
              size="small"
              value={familyMember.relationship || ""}
              onChange={(event, newValue) => {
                handleFamilyDetailsChange(
                  {
                    target: {
                      name: "relationship",
                      value: newValue || "",
                    },
                  },
                  index
                );
              }}
              renderInput={(params) => (
                <CustomTextField label="Contact Relationship" {...params} />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Autocomplete
              fullWidth
              size="small"
              options={bloodGroupOptions}
              getOptionLabel={(option) => option}
              value={familyMember.blood_group || ""}
              onChange={(event, newValue) => {
                handleFamilyDetailsChange(
                  { target: { name: "blood_group", value: newValue } },
                  index
                );
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Blood Group"
                  name="blood_group"
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
              onChange={(event) => handleFamilyDetailsChange(event, index)}
            />
          </Grid>
          {/* Remove Family Member Button */}
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
