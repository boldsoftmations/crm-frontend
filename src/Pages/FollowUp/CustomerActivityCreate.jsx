import React, { useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomerServices from "../../services/CustomerService";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";

export const CustomerActivityCreate = (props) => {
  const { recordForEdit, setOpenModal, getFollowUp } = props;
  const [open, setOpen] = useState(false);
  const [followUp, setFollowUp] = useState([]);
  const data = useSelector((state) => state.auth);
  const userId = data.profile.email;
  const [activityRequiresFollowup, setActivityRequiresFollowup] =
    useState(false);

  const createFollowUpLeadsData = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);

      const data = {
        company: recordForEdit,
        user: userId,
        activity: followUp.activity,
        notes: followUp.notes,
        next_followup_date: followUp.next_followup_date,
      };

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
    ].includes(value);

    setActivityRequiresFollowup(requiresFollowup);
  };

  return (
    <div>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={(e) => createFollowUpLeadsData(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Activity</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="activity"
                label="Activity"
                // value={filterQuery}
                onChange={handleInputChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "200px", // Adjust the maximum height as per your requirement
                    },
                  },
                }}
              >
                {ActivityOption.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
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
            <TextField
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

const ActivityOption = [
  {
    id: 1,
    value: "Not answering/busy/disconnecting",
    label: "Not answering/busy/disconnecting",
  },

  {
    id: 2,
    value: "Having stock",
    label: "Having stock",
  },
  {
    id: 3,
    value: "Rate issue",
    label: "Rate issue",
  },
  {
    id: 4,
    value: "Buying a different product from other company",
    label: "Buying a different product from other company",
  },
  {
    id: 5,
    value: "Size or quantity is unavailabe with us",
    label: "Size or quantity is unavailabe with us",
  },
  {
    id: 6,
    value: "Transportation cost issue",
    label: "Transportation cost issue",
  },
  {
    id: 7,
    value: "Call me back",
    label: "Call me back",
  },
  {
    id: 8,
    value: "Send sample",
    label: "Send sample",
  },
  {
    id: 9,
    value: "Require own branding",
    label: "Require own branding",
  },
  {
    id: 10,
    value: "Require exclusive distributorship/dealership",
    label: "Require exclusive distributorship/dealership",
  },
  {
    id: 11,
    value: "Quality issue",
    label: "Quality issue",
  },
  {
    id: 12,
    value: "Company shut down",
    label: "Company shut down",
  },
  {
    id: 13,
    value: "Require credit",
    label: "Require credit",
  },
];
