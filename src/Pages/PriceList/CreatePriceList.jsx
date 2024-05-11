import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import ProductService from "../../services/ProductService";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomTextField from "../../Components/CustomTextField";

export const CreatePriceList = memo((props) => {
  const {
    setOpenPopup,
    getPriceList,
    product,
    currentPage,
    filterQuery,
    searchQuery,
  } = props;
  const [inputValue, setInputValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [validation, setValidation] = useState();
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValue((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const validate = inputValue.slab1 < inputValue.slab2;

  const createPriceListDetails = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        let validate = inputValue.slab1 < inputValue.slab2;
        setValidation(validate);
        console.log("validate", validation);
        const req = {
          product: inputValue.product,
          slab1: inputValue.slab1,
          slab1_price: inputValue.slab1_price,
          slab2: inputValue.slab2,
          slab2_price: inputValue.slab2_price,
          slab3_price: inputValue.slab3_price,
          validity: inputValue.validity,
          discontinued: false,
        };

        setOpen(true);
        const response = await ProductService.createPriceList(req);
        const successMessage =
          response.data.message || "Price List Updated successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getPriceList(currentPage, filterQuery, searchQuery);
        }, 300);
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [inputValue, currentPage, searchQuery]
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
        onSubmit={(e) => createPriceListDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              sx={{
                minWidth: 180,
              }}
              size="small"
              onChange={(event, newValue) => {
                setInputValue((prev) => ({ ...prev, product: newValue }));
              }}
              value={inputValue.product}
              options={product.map((option) => option.name)}
              getOptionLabel={(option) => `${option ? option : "No Options"}`}
              label="Product"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              required
              fullWidth
              name="slab1"
              size="small"
              label="Slab 1"
              variant="outlined"
              value={inputValue.slab1}
              error={inputValue.slab1 === ""}
              helperText={
                inputValue.slab1 === "" ? "this field is required." : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="slab1_price"
              size="small"
              label="Slab1 Price"
              variant="outlined"
              value={inputValue.slab1_price}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              required
              fullWidth
              name="slab2"
              size="small"
              label="Slab 2"
              type={"number"}
              variant="outlined"
              value={inputValue.slab2}
              error={validate === false || validate === ""}
              helperText={
                validate === false || inputValue.slab2 === ""
                  ? "slab2 must be greater than slab1"
                  : " "
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="slab2_price"
              size="small"
              label="Slab2 Price"
              variant="outlined"
              value={inputValue.slab2_price}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="slab3_price"
              size="small"
              label="Slab3  Price"
              variant="outlined"
              value={inputValue.slab3_price}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type="date"
              name="validity"
              size="small"
              label="Validity"
              variant="outlined"
              value={inputValue.validity}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
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
