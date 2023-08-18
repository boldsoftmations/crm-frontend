import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useSelector } from "react-redux";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";

export const LeadActivityCreate = ({
  leadsByID,
  getLeadByID,
  setOpenModal,
}) => {
  const [open, setOpen] = useState(false);
  const [followUp, setFollowUp] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const data = useSelector((state) => state.auth);
  const userId = data.profile.email;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFollowUp((prevFollowUp) => ({ ...prevFollowUp, [name]: value }));
  };

  const createFollowUpLeadsData = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const followUpData = {
        leads: leadsByID,
        user: userId,
        activity: followUp.activity,
        notes: followUp.note,
        next_followup_date: followUp.nextFollowUpDate,
      };

      await LeadServices.createFollowUpLeads(followUpData);
      setOpenModal(false);
      await getLeadByID(leadsByID);
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setErrorMessage(error.response.data.message);
      setOpen(false);
    }
  };

  return (
    <>
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
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: "200px",
                    },
                  },
                }}
                onChange={handleInputChange}
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
              fullWidth
              multiline
              size="small"
              label="Note"
              variant="outlined"
              value={followUp.note}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              name="nextFollowUpDate"
              size="small"
              label="Next Followup Date"
              variant="outlined"
              value={followUp.nextFollowUpDate || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Button fullWidth type="submit" variant="contained">
          Submit
        </Button>
        {errorMessage && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <ErrorIcon color="error" sx={{ mr: 1 }} />
            <Typography color="error">{errorMessage}</Typography>
          </Box>
        )}
      </Box>
    </>
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
    value: "Send detail on whatsapp/sms/email",
    label: "Send detail on whatsapp/sms/email",
  },
  {
    id: 5,
    value: "Not buying from us due to product range",
    label: "Not buying from us due to product range",
  },
  {
    id: 6,
    value: "Dealing in other brand",
    label: "Dealing in other brand",
  },
  {
    id: 7,
    value: "Buying a different product from other company",
    label: "Buying a different product from other company",
  },
  {
    id: 8,
    value: "Size or quantity is unavailabe with us",
    label: "Size or quantity is unavailabe with us",
  },
  {
    id: 9,
    value: "Transportation cost issue",
    label: "Transportation cost issue",
  },
  {
    id: 10,
    value: "Required without bill",
    label: "Required without bill",
  },
  {
    id: 11,
    value: "Call me back",
    label: "Call me back",
  },
  {
    id: 12,
    value: "Send sample",
    label: "Send sample",
  },
  {
    id: 13,
    value: "Not a decision maker",
    label: "Not a decision maker",
  },
  {
    id: 14,
    value: "Require own branding",
    label: "Require own branding",
  },
  {
    id: 15,
    value: "Small buyer, moved to dealer/distributor",
    label: "Small buyer, moved to dealer/distributor",
  },
  {
    id: 16,
    value: "Require exclusive distributorship/dealership",
    label: "Require exclusive distributorship/dealership",
  },
  {
    id: 17,
    value: "Quality issue",
    label: "Quality issue",
  },
  {
    id: 18,
    value: "Small buyer, no dealer/distributor in that area",
    label: "Small buyer, no dealer/distributor in that area",
  },
  {
    id: 19,
    value: "Require credit",
    label: "Require credit",
  },
  {
    id: 20,
    value: "Wrong number",
    label: "Wrong number",
  },
  {
    id: 21,
    value: "Company shut down",
    label: "Company shut down",
  },
  {
    id: 22,
    value: "Order taken",
    label: "Order taken",
  },
  {
    id: 23,
    value: "Stock lot",
    label: "Stock lot",
  },
  {
    id: 24,
    value: "One time requirement",
    label: "One time requirement",
  },
  {
    id: 25,
    value: "Drop the lead",
    label: "Drop the lead",
  },
];
