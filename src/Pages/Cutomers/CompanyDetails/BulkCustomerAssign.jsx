import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomButton } from "../../../Components/CustomButton";
import CustomerServices from "../../../services/CustomerService";
import LeadServices from "../../../services/LeadService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useSelector } from "react-redux";
import MasterService from "../../../services/MasterService";

export const BulkCustomerAssign = (props) => {
  const { setOpenPopup, setOpenSnackbar } = props;
  const [open, setOpen] = useState(false);
  const [assignFrom, setAssignFrom] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [touchedAssignFrom, setTouchedAssignFrom] = useState(false);
  const [touchedAssignTo, setTouchedAssignTo] = useState(false);
  const [selectedState, setSelectedState] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const sales_customer_user = userData.sales_customer_user || [];
  useEffect(() => {
    getAssignedData();
  }, []);

  const getAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
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
      await CustomerServices.BulkCustomerAssign(req);
      setOpenPopup(false);
      setOpen(false);
      // Show success snackbar
      setOpenSnackbar(true);
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

  const getAllMasterStates = async () => {
    try {
      setOpen(true);
      const response = await MasterService.getAllMasterStates("all");
      setStateOption(response.data);
    } catch (e) {
      console.log("Error getting all states");
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    getAllMasterStates();
  }, []);

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
              options={stateOption}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <CustomTextField {...params} label="Select State(s)" />
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
              options={sales_customer_user.map((option) => option.email)}
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
