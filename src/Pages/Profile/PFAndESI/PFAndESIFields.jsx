import React from "react";
import { Grid, Autocomplete } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";

export const PFAndESIFields = ({ formData, setFormData }) => {
  const YesorNoOptions = ["Yes", "No"];

  const handleChange = (name, value) => {
    const keys = name.split(".");
    if (keys.length === 2) {
      const nestedKey = keys[1];
      setFormData((prev) => ({
        ...prev,
        pf_esi_details: {
          ...prev.pf_esi_details,
          [nestedKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={YesorNoOptions}
          fullWidth
          size="small"
          value={formData.pf_esi_details.has_pf_esi_account || ""}
          onChange={(event, newValue) =>
            handleChange("pf_esi_details.has_pf_esi_account", newValue || "")
          }
          renderInput={(params) => (
            <CustomTextField label="Do you have PF & ESI Account" {...params} />
          )}
        />
      </Grid>
      {formData.pf_esi_details.has_pf_esi_account === "Yes" && (
        <>
          {["UAN No.", "PF No.", "ESI No."].map((label, index) => {
            const fields = ["uan_number", "pf_number", "esi_number"];
            return (
              <Grid key={label} item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label={label}
                  name={`pf_esi_details.${fields[index]}`}
                  value={formData.pf_esi_details[fields[index]]}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </Grid>
            );
          })}
        </>
      )}
    </>
  );
};
