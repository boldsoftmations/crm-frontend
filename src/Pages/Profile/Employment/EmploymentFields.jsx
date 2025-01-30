// EmploymentFields.js
import React from "react";
import { Grid, Button } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";

export const EmploymentFields = ({ formData, setFormData }) => {
  const handleEmploymentChange = (event, index) => {
    const { name, value } = event.target;
    const updatedEmployments = [...formData.employment_history];
    updatedEmployments[index][name] = value;

    setFormData({
      ...formData,
      employment_history: updatedEmployments,
    });
  };

  const removeEmploymentRecord = (index) => {
    const updatedEmployments = [...formData.employment_history];
    updatedEmployments.splice(index, 1);
    setFormData({
      ...formData,
      employment_history: updatedEmployments,
    });
  };

  const addEmploymentRecord = () => {
    const employers = formData.employment_history.map(
      (emp) => emp.company_name
    );

    const hasDuplicates = new Set(employers).size !== employers.length;
    if (hasDuplicates) {
      alert("Please ensure that the employer names are unique.");
      return;
    }

    const newRecord = {
      company_name: "",
      post_held: "",
      workedFrom: "",
      workedTill: "",
    };

    const updatedEmployments = [...formData.employment_history, newRecord];
    setFormData({
      ...formData,
      employment_history: updatedEmployments,
    });
  };
  return (
    <>
      {formData.employment_history.map((employment, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Company Name"
              name="company_name"
              required
              value={employment.company_name || ""}
              onChange={(event) => handleEmploymentChange(event, index)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              required
              size="small"
              label="Designation"
              name="post_held"
              value={employment.post_held || ""}
              onChange={(event) => handleEmploymentChange(event, index)}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              required
              size="small"
              label="Worked From"
              type="date"
              name="workedFrom"
              value={employment.workedFrom}
              onChange={(event) => handleEmploymentChange(event, index)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              required
              size="small"
              label="Worked Till"
              type="date"
              name="workedTill"
              value={employment.workedTill}
              onChange={(event) => handleEmploymentChange(event, index)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            {formData.employment_history.length > 1 && (
              <Button
                variant="contained"
                color="error"
                onClick={() => removeEmploymentRecord(index)}
              >
                Remove
              </Button>
            )}
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" onClick={addEmploymentRecord}>
          Add More
        </Button>
      </Grid>
    </>
  );
};
