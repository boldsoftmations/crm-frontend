import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import ProductService from "../../../services/ProductService";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const CreateBasicUnit = memo((props) => {
  const { setOpenPopup, getBasicUnit, currentPage, searchQuery } = props;
  const [brand, setBrand] = useState([]);
  const [open, setOpen] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

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

        const response = await ProductService.createBasicUnit(data);
        const successMessage =
          response.data.message || "Basic Unit Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getBasicUnit(currentPage, searchQuery);
        }, 300);
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
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createBrand(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Basic Unit"
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
