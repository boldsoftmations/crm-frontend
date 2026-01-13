import React, { memo, useCallback, useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Grid, Switch } from "@mui/material";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import ProductService from "../../services/ProductService";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomTextField from "../../Components/CustomTextField";
import MasterService from "../../services/MasterService";

export const UpdatePriceList = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getPriceList,
    product,
    currentPage,
    filterQuery,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(recordForEdit);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValue((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);
  console.log("Zone Name", recordForEdit.zone);

  const validate = inputValue.slab1 < inputValue.slab2;
  const updatePriceList = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const req = {
          zone: inputValue.zone,
          product: inputValue.product,
          slab1: inputValue.slab1,
          slab1_price: inputValue.slab1_price,
          slab2: inputValue.slab2,
          slab2_price: inputValue.slab2_price,
          slab3_price: inputValue.slab3_price,
          validity: inputValue.validity,
          discontinued: inputValue.discontinued,
        };
        console.log(req);
        if (recordForEdit) {
          const response = await ProductService.updatePriceList(
            inputValue.id,
            req
          );
          const successMessage =
            response.data.message || "Price List Created successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getPriceList(currentPage, filterQuery, searchQuery);
          }, 300);
        }
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [inputValue, currentPage, searchQuery]
  );
  const [zoneOption, setZoneOptions] = useState([]);

  const zoneMasterList = useCallback(async () => {
    try {
      const response = await MasterService.getZoneMasterList();
      setZoneOptions(response.data.results);
      // console.log(response.data);
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  useEffect(() => {
    zoneMasterList();
  }, [zoneMasterList]);

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => updatePriceList(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              sx={{
                minWidth: 180,
              }}
              size="small"
              value={inputValue.zone || ""}
              onChange={(event, newValue) => {
                setInputValue((prev) => ({ ...prev, zone: newValue }));
              }}
              options={zoneOption.map((option) => option.name)}
              getOptionLabel={(option) => option}
              label="Zone Name"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              sx={{
                minWidth: 180,
              }}
              size="small"
              value={inputValue.product || ""}
              onChange={(event, newValue) => {
                setInputValue((prev) => ({ ...prev, product: newValue }));
              }}
              options={product.map((option) => option.name)}
              getOptionLabel={(option) => option}
              label="Product Name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="slab1"
              size="small"
              label="Slab 1"
              variant="outlined"
              value={
                (inputValue.type_of_unit === "decimal"
                  ? inputValue.slab1
                  : Number(inputValue.slab1)) || ""
              }
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
              value={inputValue.slab1_price || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="slab2"
              size="small"
              label="Slab 2"
              variant="outlined"
              value={
                (inputValue.type_of_unit === "decimal"
                  ? inputValue.slab2
                  : Number(inputValue.slab2)) || ""
              }
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
              value={inputValue.slab2_price || ""}
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
              value={inputValue.slab3_price || ""}
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
              value={inputValue.validity || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={inputValue.discontinued}
                  onChange={(event, newValue) => {
                    setInputValue((prevInputValue) => ({
                      ...prevInputValue,
                      discontinued: newValue,
                    }));
                  }}
                  name="validity"
                />
              }
              label="Discontinued"
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
