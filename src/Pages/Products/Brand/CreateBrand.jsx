import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import ProductService from "../../../services/ProductService";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const CreateBrand = memo((props) => {
  const { setOpenPopup, getBrandList, currentPage, searchQuery } = props;
  const [brand, setBrand] = useState([]);
  const [open, setOpen] = useState(false);
  const {
    handleSuccess,
    handleError,
    handleCloseSnackbar,
    alertInfo, // Make sure this line is added
  } = useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBrand({ ...brand, [name]: value });
  };

  const createBrand = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: brand.name,
          short_name: brand.shortName,
        };

        const response = await ProductService.createBrand(data);
        const successMessage =
          response.data.message || "Brand Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getBrandList(currentPage, searchQuery);
        }, 300); // Adjust delay as needed
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
      <Box component="form" noValidate onSubmit={(e) => createBrand(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Brand"
              variant="outlined"
              value={brand.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="shortName"
              size="small"
              label="Short Name"
              variant="outlined"
              value={brand.shortName}
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
          Submit
        </Button>
      </Box>
    </>
  );
});
