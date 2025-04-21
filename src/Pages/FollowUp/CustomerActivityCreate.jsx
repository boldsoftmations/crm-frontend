import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomerServices from "../../services/CustomerService";
import { Box, Button, Grid, TextField } from "@mui/material";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const CustomerActivityCreate = (props) => {
  const { setOpenModal, getFollowUp, selectedCustomers } = props;
  const [open, setOpen] = useState(false);
  const [followUp, setFollowUp] = useState({});
  const [customerStatus, setCustomerStatus] = useState([]);
  const [activityRequiresFollowup, setActivityRequiresFollowup] =
    useState(false);

  useEffect(() => {
    const getCustomerStatus = async () => {
      try {
        setOpen(true);
        const res = await CustomerServices.getCustomerStatus();
        setCustomerStatus(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setOpen(false);
      }
    };
    getCustomerStatus();
  }, []);
  const createFollowUpLeadsData = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        company:
          (selectedCustomers && selectedCustomers.name) ||
          selectedCustomers.company,
        notes: followUp.notes,
        next_followup_date: followUp.next_followup_date,
        status: followUp.status,
        activity: followUp.activity,
      };
      console.log(data);

      await CustomerServices.createFollowUpCustomer(data);
      setOpenModal(false);
      getFollowUp();
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFollowUp({ ...followUp, [name]: value });
  };

  const handleFollowChange = (e, newValue, name) => {
    setFollowUp((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    // Check if the selected activity requires a followup date
    const requiresFollowup = [
      "Not answering/busy/disconnecting",
      "Having stock",
      "Rate issue",
      "Buying a different product from other company",
      "Transportation cost issue",
      "Call me back",
      "Send sample",
      "Require exclusive distributorship/dealership",
      "Require credit",
    ].includes(newValue);

    setActivityRequiresFollowup(requiresFollowup);
  };

  return (
    <div>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={createFollowUpLeadsData}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              size="small"
              id="call_status"
              name="status"
              options={["Connected", "Disconnected"]}
              renderInput={(params) => (
                <TextField {...params} label="Call Status" />
              )}
              value={followUp.status}
              onChange={(e, value) => handleFollowChange(e, value, "status")}
              label="Call Status"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              size="small"
              id="activity"
              options={customerStatus}
              getOptionLabel={(option) => option.name} // Show name in the dropdown
              renderInput={(params) => (
                <TextField {...params} label="Activity" />
              )}
              value={
                customerStatus.find(
                  (option) => option.id === followUp.activity
                ) || null
              } // Ensure selected value is an object
              onChange={
                (e, value) =>
                  handleFollowChange(e, value ? value.id : null, "activity") // Store the ID
              }
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              multiline
              fullWidth
              name="notes"
              size="small"
              label="Note"
              variant="outlined"
              value={followUp.notes}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              type="date"
              name="next_followup_date"
              size="small"
              label="Next Followup Date"
              variant="outlined"
              value={followUp.next_followup_date || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              required={activityRequiresFollowup}
              error={activityRequiresFollowup && !followUp.next_followup_date}
              helperText={
                activityRequiresFollowup && !followUp.next_followup_date
                  ? "Next Followup Date is required."
                  : ""
              }
              inputProps={{
                min: new Date().toISOString().split("T")[0], // Set minimum date to today
              }}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={
            [
              "Not answering/busy/disconnecting",
              "Having stock",
              "Rate issue",
              "Buying a different product from other company",
              "Transportation cost issue",
              "Call me back",
              "Send sample",
              "Require exclusive distributorship/dealership",
              "Require credit",
            ].includes(followUp.activity) && !followUp.next_followup_date
          }
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};
