import React, { memo, useCallback, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import LeadServices from "../../../services/LeadService";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";

export const LeadForecastUpdate = memo(
  ({ getAllLeadDetails, setOpenPopup, leadForecastData, currentPage }) => {
    const [formData, setFormData] = useState(leadForecastData);
    const [open, setOpen] = useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleSubmit = useCallback(
      async (e) => {
        try {
          e.preventDefault();
          setOpen(true);
          const data = {
            quantity: formData.quantity,
            anticipated_date: formData.anticipated_date,
          };
          const response = await LeadServices.updateLeadForecast(
            formData.id,
            data
          );

          const successMessage =
            response.data.message || "Forecast Leads Updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getAllLeadDetails(formData, currentPage);
          }, 300);
        } catch (error) {
          handleError(error);
        } finally {
          setOpen(false);
        }
      },
      [formData, currentPage]
    );

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
          onSubmit={(e) => handleSubmit(e)}
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                size="small"
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                size="small"
                label="Anticipated Date"
                name="anticipated_date"
                type="date"
                value={formData.anticipated_date || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, textAlign: "right" }}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
);
