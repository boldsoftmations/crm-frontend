import React, { useState } from "react";
import { Autocomplete, Box, Grid } from "@mui/material";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomButton } from "../../Components/CustomButton";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useSelector } from "react-redux";

export const BulkLeadAssign = (props) => {
  const { setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [assignFrom, setAssignFrom] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [touchedAssignFrom, setTouchedAssignFrom] = useState(false);
  const [touchedAssignTo, setTouchedAssignTo] = useState(false);
  const [selectedState, setSelectedState] = useState([]);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const assigned_from = users.sales_users || [];
  const assigned_to_users = users.active_sales_user || [];

  const AssignBulkLead = async (e) => {
    try {
      setOpen(true);
      e.preventDefault();
      const req = {
        assign_from: assignFrom,
        assign_to: assignTo,
        states: selectedState.map((state) => state.value),
      };
      await LeadServices.BulkLeadAssign(req);
      setOpenPopup(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setOpen(false);
    }
  };

  const getErrorMessage = (fieldValue, otherFieldValue, fieldTouched) => {
    if (!fieldValue && fieldTouched) {
      return "Field cannot be empty";
    } else if (fieldValue === otherFieldValue) {
      return "Assign From will not be the same as Assign To";
    }
    return "";
  };

  const StateOption = [
    {
      value: "Andhra Pradesh",
    },

    {
      value: "Arunachal Pradesh",
    },
    {
      value: "Assam",
    },
    {
      value: "Bihar",
    },
    {
      value: "Chhattisgarh",
    },
    {
      value: "Goa",
    },
    {
      value: "Gujarat",
    },
    {
      value: "Haryana",
    },
    {
      value: "Himachal Pradesh",
    },
    {
      value: "Jharkhand",
    },
    {
      value: "Karnataka",
    },
    {
      value: "Kerala",
    },
    {
      value: "Madhya Pradesh",
    },
    {
      value: "Maharashtra",
    },
    {
      value: "Manipur",
    },
    {
      value: "Meghalaya",
    },
    {
      value: "Mizoram",
    },
    {
      value: "Nagaland",
    },
    {
      value: "Odisha",
    },
    {
      value: "Punjab",
    },
    {
      value: "Rajasthan",
    },
    {
      value: "Sikkim",
    },
    {
      value: "Tamil Nadu",
    },
    {
      value: "Telangana",
    },
    {
      value: "Tripura",
    },
    {
      value: "Uttar Pradesh",
    },
    {
      value: "Uttarakhand",
    },
    {
      value: "West Bengal",
    },
    {
      value: "Delhi",
    },
    {
      value: "Jammu & Kashmir",
    },
    {
      value: "Ladakh",
    },
  ];
  return (
    <>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={AssignBulkLead}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              fullWidth
              size="small"
              value={selectedState}
              onChange={(event, value) => {
                setSelectedState(value);
              }}
              options={StateOption}
              getOptionLabel={(option) => option.value}
              renderInput={(params) => (
                <CustomTextField {...params} label="Select States" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={
                assignFrom
                  ? assigned_from.find(
                      (option) => option.employee_id === assignFrom
                    )
                  : null
              }
              onChange={(event, value) => {
                setAssignFrom((value && value.employee_id) || ""); // Store employee_id in state
                if (!touchedAssignFrom) setTouchedAssignFrom(true);
              }}
              options={assigned_from}
              getOptionLabel={(option) =>
                `${option.name} ${option.employee_id}`
              } // Display name in dropdown
              isOptionEqualToValue={(option, value) =>
                option.employee_id === value
              } // Match based on employee_id
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign From"
                  error={
                    touchedAssignFrom &&
                    (assignFrom === assignTo || !assignFrom)
                  }
                  helperText={getErrorMessage(
                    assignFrom,
                    assignTo,
                    touchedAssignFrom
                  )}
                  onBlur={() => setTouchedAssignFrom(true)}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={
                assignTo
                  ? assigned_to_users.find(
                      (option) => option.employee_id === assignTo
                    ) || null
                  : null
              } // Find the option by employee_id
              onChange={(event, value) => {
                setAssignTo((value && value.employee_id) || ""); // Store the employee_id in state
                if (!touchedAssignTo) setTouchedAssignTo(true);
              }}
              options={assigned_to_users} // Pass the full user objects
              getOptionLabel={(option) =>
                `${option.name} ${option.employee_id}`
              } // Display email in dropdown
              isOptionEqualToValue={(option, value) =>
                option.employee_id === value
              } // Match by employee_id
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign To"
                  error={
                    touchedAssignTo && (assignFrom === assignTo || !assignTo)
                  }
                  helperText={getErrorMessage(
                    assignTo,
                    assignFrom,
                    touchedAssignTo
                  )}
                  onBlur={() => setTouchedAssignTo(true)}
                />
              )}
            />
          </Grid>
        </Grid>
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          text={"Assign"}
        />
      </Box>
    </>
  );
};
