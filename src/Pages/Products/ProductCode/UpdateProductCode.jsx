import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const UpdateProductCode = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getproductCodes,
    currentPage,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [descriptionOption, setDescriptionOption] = useState([]);
  const [productCode, setProductCode] = useState(recordForEdit);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getNoDescriptionData();
  }, []);

  const getNoDescriptionData = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getNoDescription();
      setDescriptionOption(res.data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const updatesproductCode = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          code: productCode.code,
          description: productCode.description,
        };

        if (recordForEdit) {
          const response = await ProductService.updateProductCode(
            productCode.id,
            data
          );
          const successMessage =
            response.data.message || "Product Code updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getproductCodes(currentPage, searchQuery);
          }, 300);
        }
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [productCode, currentPage, searchQuery]
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
      <Box component="form" noValidate onSubmit={(e) => updatesproductCode(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="code"
              size="small"
              label="Code"
              variant="outlined"
              value={productCode.code || ""}
              onChange={(event, newValue) => {
                setProductCode((prev) => ({ ...prev, code: newValue }));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              disablePortal
              sx={{
                minWidth: 225,
              }}
              size="small"
              disableClearable
              value={productCode.description}
              onChange={(event, newValue) => {
                setProductCode((prev) => ({ ...prev, description: newValue }));
              }}
              options={descriptionOption.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="Description"
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
