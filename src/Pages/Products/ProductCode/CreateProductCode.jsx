import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const CreateProductCode = memo((props) => {
  const { setOpenPopup, getproductCodes, currentPage, searchQuery } = props;
  const [description, setDescription] = useState([]);
  const [allDescription, seAllDescription] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [open, setOpen] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductCode({ ...productCode, [name]: value });
  };

  useEffect(() => {
    getNoDescriptionData();
  }, []);

  const getNoDescriptionData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      seAllDescription(res.data);
    } catch (error) {
      console.log("error No Description Fetching Data", error);
    }
  };

  const createProductCode = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          code: productCode.code,
          description: description,
        };
        const response = await ProductService.createProductCode(data);
        const successMessage =
          response.data.message || "Product Code Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getproductCodes(currentPage, searchQuery);
        }, 300);
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

      <Box component="form" noValidate onSubmit={(e) => createProductCode(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              name="code"
              fullWidth
              size="small"
              label="Code"
              variant="outlined"
              value={productCode.code}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setDescription(value)}
              name="description"
              options={allDescription.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="Description"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
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
