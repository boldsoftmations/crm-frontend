import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import ProductService from "../../../services/ProductService";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { DecimalValidation } from "../../../Components/Header/DecimalValidation";

function searchArrayByKey(array, key, searchValue, returnValue) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === searchValue) {
      return array[i][returnValue];
    }
  }
}

export const CreateRawMaterials = memo((props) => {
  const { setOpenPopup, getRawMaterials, currentPage, searchQuery } = props;
  const [open, setOpen] = useState(false);
  // const productUnit = useSelector((state) => state.auth.unitAllData);

  const [formData, setFormData] = useState([]);
  const { brandAllData, colourAllData, productCodeAllData, unitAllData } =
    useSelector((state) => state.auth);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const shortName = searchArrayByKey(
    brandAllData,
    "name",
    formData.brand || null,
    "short_name"
  );

  const description = searchArrayByKey(
    productCodeAllData,
    "code",
    formData.productcode,
    "description"
  );
  // useEffect(() => {
  // }, []);
  // const getUnits = async () => {
  //   try {
  //     const res = await ProductService.getAllUnit("all");
  //     // set(getUnitData(res.data));
  //   } catch (err) {
  //     console.log("error unit finishGoods", err);
  //   }
  // };

  const productName = `${formData.productcode || ""}-${formData.color || ""}-${
    shortName ? shortName : ""
  }-${formData.size || ""}`;

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }, []);

  const GST = formData.gst / 2;

  const createrawMaterials = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: productName,
          size: formData.size,
          unit: formData.unit,
          color: formData.color,
          brand: formData.brand,
          productcode: formData.productcode,
          description: description,
          shelf_life: formData.shelf_life,
          minimum_stock_limit: formData.minimum_stock_limit,
          hsn_code: formData.hsn_code,
          gst: formData.gst,
          cgst: GST,
          sgst: GST,
          type: "raw-materials",
        };
        let news = unitAllData.find((item) => item.name === data.unit);

        const isvalid = DecimalValidation({
          numTypes: [news.type_of_unit],
          quantities: [formData.minimum_stock_limit],
          decimalCounts: [news.max_decimal_digit],
          unit: [formData.unit],
          handleError,
        });
        if (!isvalid) {
          setOpen(false);
          return;
        }

        console.log("hello", data);
        const response = await ProductService.createRawMaterials(data);
        const successMessage =
          response.data.message || "Raw Materials Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getRawMaterials(currentPage, searchQuery);
        }, 300);
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [formData, productName, GST, currentPage, searchQuery]
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

      <Box component="form" noValidate onSubmit={(e) => createrawMaterials(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="Name"
              size="small"
              label="Name"
              variant="outlined"
              value={productName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="size"
              size="small"
              label="Size"
              variant="outlined"
              value={formData.size}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.unit || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, unit: newValue }));
              }}
              options={unitAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label={"Unit"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.color || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, color: newValue }));
              }}
              options={colourAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="Colour"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.brand || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, brand: newValue }));
              }}
              options={brandAllData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              label="brand"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              value={formData.productcode || ""}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, productcode: newValue }));
              }}
              options={productCodeAllData.map((option) => option.code)}
              getOptionLabel={(option) => `${option}`}
              label="Product Code"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Description"
              variant="outlined"
              value={description || ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="shelf_life"
              label="Shelf Life (Month)"
              variant="outlined"
              value={formData.shelf_life || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="hsn_code"
              size="small"
              label="Hsn Code"
              variant="outlined"
              value={formData.hsn_code}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="gst"
              type={"number"}
              size="small"
              label="IGST %"
              variant="outlined"
              value={formData.gst}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="CGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="SGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="minimum_stock_limit"
              label="Minimum Stock Limit"
              variant="outlined"
              value={formData.minimum_stock_limit || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
});
