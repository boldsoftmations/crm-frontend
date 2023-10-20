import React, { useState } from "react";
import { Button, Grid, Autocomplete } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";

export const EmergencyContactFields = ({ formData, setFormData }) => {
  const relationshipOptions = [
    "Father",
    "Mother",
    "Spouse",
    "Son",
    "Daughter",
    "Uncle",
    "Aunt",
    "Friend",
    "Neighbour",
  ];

  const handleEmergencyContactChange = (event, index) => {
    const { name, value } = event.target;
    const updatedEmergencyContacts = [...formData.emergency_contacts];
    updatedEmergencyContacts[index][name] = value;
    setFormData({
      ...formData,
      emergency_contacts: updatedEmergencyContacts,
    });
  };

  const addEmergencyContact = () => {
    const updatedEmergencyContacts = [...formData.emergency_contacts];
    updatedEmergencyContacts.push({
      name: "",
      relationship: "", // Use the default relationship
      number: "",
    });
    setFormData({
      ...formData,
      emergency_contacts: updatedEmergencyContacts,
    });
  };

  const removeEmergencyContact = (index) => {
    const updatedEmergencyContacts = [...formData.emergency_contacts];
    updatedEmergencyContacts.splice(index, 1); // This will remove the contact at the given index
    setFormData({
      ...formData,
      emergency_contacts: updatedEmergencyContacts,
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
              label="Emergency Contact Person Name"
              name="name"
              value={emergencyContact.name || ""}
              onChange={(event) => handleEmergencyContactChange(event, index)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={relationshipOptions}
              fullWidth
              size="small"
              value={emergencyContact.relationship || ""}
              onChange={(event, newValue) => {
                handleEmergencyContactChange(
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
                <CustomTextField
                  label="Emergency Contact Relationship"
                  {...params}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Emergency Contact Number"
              type="tel"
              name="number"
              value={emergencyContact.number || ""}
              onChange={(event) => handleEmergencyContactChange(event, index)}
            />
          </Grid>
          {formData.emergency_contacts.length > 1 && ( // Check if there's more than one emergency contact
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
