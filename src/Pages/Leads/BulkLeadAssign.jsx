import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Grid } from "@mui/material";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomButton } from "../../Components/CustomButton";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const BulkLeadAssign = (props) => {
  const { setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [assignFrom, setAssignFrom] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [touchedAssignFrom, setTouchedAssignFrom] = useState(false);
  const [touchedAssignTo, setTouchedAssignTo] = useState(false);
  const [selectedState, setSelectedState] = useState([]);

  useEffect(() => {
    getAssignedData();
  }, []);

  const getAssignedData = async () => {
    try {
      setOpen(true);
      const ALLOWED_ROLES = [
        "Director",
        "Customer Service",
        "Sales Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Sales Manager without Leads",
      ];
      const res = await LeadServices.getAllAssignedUser();
      // Filter the data based on the ALLOWED_ROLES
      const filteredData = res.data.filter((employee) =>
        employee.groups.some((group) => ALLOWED_ROLES.includes(group))
      );
      setAssigned(filteredData);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

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
              value={assignFrom} // Ensure you are managing state for assignFrom
              onChange={(event, value) => {
                setAssignFrom(value);
                if (!touchedAssignFrom) setTouchedAssignFrom(true);
              }}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              label="Assign From"
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
              value={assignTo} // Ensure you have a state variable for assignTo
              onChange={(event, value) => {
                setAssignTo(value);
                if (!touchedAssignTo) setTouchedAssignTo(true);
              }}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              label="Assign To"
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
