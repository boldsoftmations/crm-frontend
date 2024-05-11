import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import ProductService from "../../../services/ProductService";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const UpdateBrand = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getBrandList,
    currentPage,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState(recordForEdit);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBrand({ ...brand, [name]: value });
  };

  const updatesBrand = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: brand.name,
          short_name: brand.short_name,
        };

        if (recordForEdit) {
          const response = await ProductService.updateBrand(brand.id, data);
          // Example adjustment for fallback success message
          const successMessage =
            response.data.message || "Brand updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getBrandList(currentPage, searchQuery);
          }, 300); // Adjust delay as needed
        }
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [brand, currentPage, searchQuery]
  );

  return (
    <>
      <MessageAlert
        open={alertInfo.open} // Updated to use alertInfo.open
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity} // Updated to use alertInfo.severity
        message={alertInfo.message} // Updated to use alertInfo.message
      />

      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => updatesBrand(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="ID"
              variant="outlined"
              value={brand.id || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Brand"
              variant="outlined"
              value={brand.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="short_name"
              size="small"
              label="Short Name"
              variant="outlined"
              value={brand.short_name || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
      </Box>
    </>
  );
});
