import React, { memo, useCallback, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const LeadActivityCreate = memo(
  ({
    leadsByID,
    getLeadByID,
    setOpenPopup,
    getleads,
    currentPage,
    filterQuery,
    filterSelectedQuery,
    searchQuery,
    updateData,
  }) => {
    const [open, setOpen] = useState(false);
    const [followUp, setFollowUp] = useState({});
    const [activityRequiresFollowup, setActivityRequiresFollowup] =
      useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFollowUp((prevFollowUp) => ({ ...prevFollowUp, [name]: value }));

      // Check if the selected activity requires a followup date
      const requiresFollowup = [
        "Not answering/busy/disconnecting",
        "Having stock",
        "Rate issue",
        "Send detail on WhatsApp/sms/email",
        "Dealing in other brand",
        "Transportation cost issue",
        "Call me back",
        "Send sample",
        "Require exclusive distributorship/dealership",
        "Require credit",
      ].includes(value);

      setActivityRequiresFollowup(requiresFollowup);
    };

    const createFollowUpLeadsData = useCallback(
      async (e) => {
        e.preventDefault();
        try {
          setOpen(true);

          const followUpData = {
            leads: leadsByID,
            ...followUp,
          };

          const response = await LeadServices.createFollowUpLeads(followUpData);
          console.log(response);
          const successMessage =
            response.data.message || "Activity Created successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            if (getleads) {
              getleads(
                currentPage,
                filterQuery,
                filterSelectedQuery,
                searchQuery
              );
            }
            if (getLeadByID) getLeadByID(leadsByID);
          }, 300);
        } catch (error) {
          handleError(error);
        } finally {
          setOpen(false);
        }
      },
      [
        followUp,
        leadsByID,
        currentPage,
        filterQuery,
        filterSelectedQuery,
        searchQuery,
      ]
    );
    const handleTabelLads = () => {
      if (followUp.activity === "Drop the lead") {
        updateData(followUp);
        console.log("done");
      }
    };

    return (
      <>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
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
              <CustomTextField
                fullWidth
                multiline
                name="notes"
                size="small"
                label="Note"
                variant="outlined"
                value={followUp.notes}
                onChange={handleInputChange}
              />
            </Grid>
            {followUp.activity !== "Drop the lead" && (
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
                  error={
                    activityRequiresFollowup && !followUp.next_followup_date
                  }
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
            )}
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
                "Send detail on WhatsApp/sms/email",
                "Dealing in other brand",
                "Transportation cost issue",
                "Call me back",
                "Send sample",
                "Require exclusive distributorship/dealership",
                "Require credit",
              ].includes(followUp.activity) && !followUp.next_followup_date
            }
            onClick={handleTabelLads}
          >
            Submit
          </Button>
        </Box>
      </>
    );
  }
);

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
