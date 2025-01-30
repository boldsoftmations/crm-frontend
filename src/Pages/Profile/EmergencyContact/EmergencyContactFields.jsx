import React from "react";
import { Button, Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const EmergencyContactFields = ({ formData, setFormData, error }) => {
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

  // Ensure `showError` is not accessed when `error` or `error.emergency_contacts` is undefined
  const showError =
    error && error.emergency_contacts ? error.emergency_contacts : [];

  const handleEmergencyContactChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedContacts = [...prev.emergency_contacts];
      updatedContacts[index][name] = value;
      return { ...prev, emergency_contacts: updatedContacts };
    });
  };

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergency_contacts: [
        ...prev.emergency_contacts,
        { name: "", relationship: "", number: "" },
      ],
    }));
  };

  const removeEmergencyContact = (index) => {
    setFormData((prev) => {
      const updatedContacts = [...prev.emergency_contacts];
      updatedContacts.splice(index, 1);
      return { ...prev, emergency_contacts: updatedContacts };
    });
  };

  return (
    <>
      {formData.emergency_contacts.map((emergencyContact, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              required
              label="Emergency Contact Person Name"
              name="name"
              value={emergencyContact.name || ""}
              error={showError[index] && showError[index].name ? true : false}
              helperText={
                showError[index] && showError[index].name
                  ? showError[index].name
                  : ""
              }
              onChange={(event) => handleEmergencyContactChange(event, index)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              options={relationshipOptions}
              fullWidth
              size="small"
              value={emergencyContact.relationship || ""}
              onChange={(event, newValue) => {
                handleEmergencyContactChange(
                  { target: { name: "relationship", value: newValue || "" } },
                  index
                );
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Emergency Contact Relationship"
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
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              required
              label="Emergency Contact Number"
              type="tel"
              name="number"
              error={showError[index] && showError[index].number ? true : false}
              helperText={
                showError[index] && showError[index].number
                  ? showError[index].number
                  : ""
              }
              value={emergencyContact.number || ""}
              onChange={(event) => handleEmergencyContactChange(event, index)}
            />
          </Grid>
          {formData.emergency_contacts.length > 1 && (
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => removeEmergencyContact(index)}
              >
                Remove Contact
              </Button>
            </Grid>
          )}
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" onClick={addEmergencyContact}>
          Add Emergency Contact
        </Button>
      </Grid>
    </>
  );
};
