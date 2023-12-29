import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { CustomButton } from "../../Components/CustomButton";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import UserProfileService from "../../services/UserProfileService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const PerformanceUpdate = ({
  recordForEdit,
  setOpenPopup,
  getDailySaleReviewData,
}) => {
  const [performance, setPerformance] = useState(recordForEdit.performance);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPerformance(recordForEdit.performance);
  }, [recordForEdit]);

  const updatePerformance = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const data = { performance };
      await UserProfileService.updateDailySaleReviewData(
        recordForEdit.id,
        data
      );
      getDailySaleReviewData();
      setOpenPopup(false);
    } catch (error) {
      setError("Error updating performance data");
      console.error("Error while creating sales review", error);
    } finally {
      setIsLoading(false);
    }
  };

  const performanceOptions = [
    "On Track",
    "Under Performing",
    "Over Performing",
  ];

  return (
    <>
      <CustomLoader open={isLoading} />
      {error && <div>{error}</div>}
      <Box component="form" noValidate onSubmit={updatePerformance}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              size={"small"}
              sx={{ width: 300, marginRight: "10px" }}
              onChange={(event, value) => setPerformance(value)}
              value={performance}
              options={performanceOptions.map((option) => option)}
              getOptionLabel={(option) => option}
              label="Performance"
            />
          </Grid>
        </Grid>
        <CustomButton
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          text="Submit"
        />
      </Box>
    </>
  );
};
