import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import CustomTextField from "../../Components/CustomTextField";
import ProductForecastService from "../../services/ProductForecastService";
import { CustomLoader } from "../../Components/CustomLoader";

export const AnticipatedDateUpdate = ({
  idForEdit,
  setOpenPopup,
  getAllProductionForecastDetails,
}) => {
  const [open, setOpen] = useState(false);
  // Initialize anticipatedDate with the correct structure
  const [anticipatedDate, setAnticipatedDate] = useState({
    id: idForEdit.id,
    anticipated_date: idForEdit.anticipated_date || "",
    month: idForEdit.month || "",
    product_forecast: idForEdit.product_forecast || "",
    year: idForEdit.year || "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnticipatedDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      setOpen(true);
      const data = {
        anticipated_date: anticipatedDate.anticipated_date,
        month: anticipatedDate.month,
        product_forecast: anticipatedDate.product_forecast,
        year: anticipatedDate.year,
      };
      const response = await ProductForecastService.updateAnticipatedDate(
        anticipatedDate.id,
        data
      );

      if (response) {
        setOpenPopup(false);
        getAllProductionForecastDetails();
      }
      setOpen(false);
    } catch (error) {
      setOpen(false);
      console.error("Error updating anticipated date:", error);
      // You can set an error message state here and display it to the user
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={handleUpdate} sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              type="date"
              label="Estimated Date"
              name="anticipated_date"
              value={anticipatedDate.anticipated_date}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
      </Box>
    </>
  );
};
