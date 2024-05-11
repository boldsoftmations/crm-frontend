import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

export const UpdateBasicUnit = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getBasicUnit,
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

  const updatesBrand = useCallback(async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: brand.name,
        short_name: brand.short_name,
      };
      if (recordForEdit) {
        const response = await ProductService.updateBasicUnit(brand.id, data);
        const successMessage =
          response.data.message || "Basic Unit updated successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getBasicUnit(currentPage, searchQuery);
        }, 300);
      }
    } catch (error) {
      handleError(error); // Handle errors from the API call
    } finally {
      setOpen(false); // Always close the loader
    }
  });

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => updatesBrand(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Id"
              variant="outlined"
              value={recordForEdit.id || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Basic Unit"
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
