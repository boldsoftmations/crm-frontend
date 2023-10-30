import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Grid } from "@mui/material";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomButton } from "../../Components/CustomButton";
import CustomTextField from "../../Components/CustomTextField";

export const BulkLeadAssign = (props) => {
  const { setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [assignFrom, setAssignFrom] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assigned, setAssigned] = useState([]);

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
      };
      await LeadServices.BulkLeadAssign(req);
      setOpenPopup(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={AssignBulkLead}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) => setAssignFrom(value)}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign From"
                  error={assignFrom === assignTo}
                  helperText={
                    assignFrom === assignTo
                      ? "Assign From will not same as Assign To"
                      : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) => setAssignTo(value)}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign To"
                  error={assignFrom === assignTo}
                  helperText={
                    assignFrom === assignTo
                      ? "Assign From will not same as Assign To"
                      : ""
                  }
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
