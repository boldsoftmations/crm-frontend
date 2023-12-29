import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
import { CustomButton } from "../../Components/CustomButton";
import { CustomLoader } from "../../Components/CustomLoader";
import UserProfileService from "../../services/UserProfileService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const DailySaleReviewCreate = ({
  setOpenPopup,
  getDailySaleReviewData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [salesPerson, setSalesPerson] = useState(null);
  const [error, setError] = useState("");

  const userData = useSelector((state) => state.auth.profile);
  const assigned = userData.sales_users || [];

  const handleAutocompleteChange = (event, value) => {
    setSalesPerson(value);
  };

  const createDailySalesReview = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      setIsLoading(true);
      const data = { sales_person: salesPerson };
      await UserProfileService.createDailySaleReviewData(data);
      setOpenPopup(false);
      getDailySaleReviewData();
    } catch (error) {
      console.error("Error while creating sales review", error);
      setError("Error creating sales review.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <CustomLoader open={isLoading} />
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error */}
      <Box component="form" noValidate onSubmit={createDailySalesReview}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              sx={{ width: "100%" }}
              size="small"
              onChange={handleAutocompleteChange}
              value={salesPerson}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option || ""} // Updated to handle null/undefined values
              label="Filter By Sales Person"
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
    </div>
  );
};
