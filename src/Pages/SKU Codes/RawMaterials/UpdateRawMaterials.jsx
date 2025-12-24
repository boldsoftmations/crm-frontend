import React, { memo, useCallback, useMemo, useState } from "react";
import ProductService from "../../../services/ProductService";
import { useSelector } from "react-redux";
import { Box, Grid, Button } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { DecimalValidation } from "../../../Components/Header/DecimalValidation";

// 🔍 Utility
const searchArrayValue = (array, key, value, returnKey) => {
  const found = array.find((item) => item[key] === value);
  return found ? found[returnKey] : "";
};

export const UpdateRawMaterials = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getRawMaterials,
    currentPage,
    searchQuery,
  } = props;

  const { brandAllData, colourAllData, productCodeAllData, unitAllData } =
    useSelector((state) => state.auth);

  const productUnit = unitAllData;

  const [formData, setFormData] = useState(recordForEdit);
  const [open, setOpen] = useState(false);
  const [unitType, setUnitType] = useState(recordForEdit.unit);

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  // 🔍 🔥 MEMOIZED – avoids recalculating every render
  const shortName = useMemo(
    () => searchArrayValue(brandAllData, "name", formData.brand, "short_name"),
    [formData.brand, brandAllData]
  );

  const description = useMemo(
    () =>
      searchArrayValue(
        productCodeAllData,
        "code",
        formData.productcode,
        "description"
      ),
    [formData.productcode, productCodeAllData]
  );

  const productName = useMemo(
    () =>
      `${formData.productcode || ""}-${formData.color || ""}-${
        shortName || ""
      }-${formData.size || ""}`,
    [formData.productcode, formData.color, shortName, formData.size]
  );

  const GST = useMemo(
    () => (formData.gst ? formData.gst / 2 : 0),
    [formData.gst]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  // 🔥 Cleaner Autocomplete handler
  const handleAutoChange = useCallback((name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const updateRawMaterial = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setOpen(true);

        const selectedUnit = productUnit.find(
          (item) => item.name === formData.unit
        );

        const safeUnitType = selectedUnit ? selectedUnit.type_of_unit : "";
        const maxDecimal = selectedUnit ? selectedUnit.max_decimal_digit : "";

        setUnitType(safeUnitType);

        if (safeUnitType === "decimal") {
          const isValid = DecimalValidation({
            numTypes: [safeUnitType],
            quantities: [formData.minimum_stock_limit],
            decimalCounts: [maxDecimal],
            unit: [formData.unit],
            handleError,
          });

          if (!isValid) {
            setOpen(false);
            return;
          }
        }

        const payload = {
          name: productName,
          unit: formData.unit,
          size: formData.size,
          color: formData.color,
          brand: formData.brand,
          productcode: formData.productcode,
          description,
          shelf_life: formData.shelf_life,
          minimum_stock_limit: formData.minimum_stock_limit,
          hsn_code: formData.hsn_code,
          gst: formData.gst,
          cgst: GST,
          sgst: GST,
          type: "raw-materials",
        };

        if (recordForEdit) {
          const res = await ProductService.updateRawMaterials(
            formData.id,
            payload
          );

          handleSuccess(
            res.data.message || "Raw Materials updated successfully"
          );

          setTimeout(() => {
            setOpenPopup(false);
            getRawMaterials(currentPage, searchQuery);
          }, 300);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setOpen(false);
      }
    },
    [
      formData,
      productName,
      GST,
      description,
      productUnit,
      currentPage,
      searchQuery,
    ]
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

      <Box component="form" noValidate onSubmit={updateRawMaterial}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Raw Material"
              value={formData.name || ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Update Raw Material"
              value={productName}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="size"
              size="small"
              label="Size"
              value={formData.size || ""}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Unit */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              value={formData.unit || ""}
              options={unitAllData.map((o) => o.name)}
              label="Unit"
              onChange={(e, v) => {
                handleAutoChange("unit", v);
                const u = productUnit.find((item) => item.name === v);
                setUnitType(u ? u.type_of_unit : "");
              }}
            />
          </Grid>

          {/* Colour */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              value={formData.color || ""}
              options={colourAllData.map((o) => o.name)}
              label="Colour"
              onChange={(e, v) => handleAutoChange("color", v)}
            />
          </Grid>

          {/* Brand */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              value={formData.brand || ""}
              options={brandAllData.map((o) => o.name)}
              label="Brand"
              onChange={(e, v) => handleAutoChange("brand", v)}
            />
          </Grid>

          {/* Product Code */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              value={formData.productcode || ""}
              options={productCodeAllData.map((o) => o.code)}
              label="Product Code"
              onChange={(e, v) => handleAutoChange("productcode", v)}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Description"
              value={description}
            />
          </Grid>

          {/* Shelf Life */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="shelf_life"
              size="small"
              label="Shelf Life (Month)"
              value={formData.shelf_life || ""}
              onChange={handleInputChange}
            />
          </Grid>

          {/* HSN Code */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="hsn_code"
              size="small"
              label="HSN Code"
              value={formData.hsn_code || ""}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Minimum Stock */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="minimum_stock_limit"
              size="small"
              label="Minimum Stock Limit"
              value={
                unitType === "decimal"
                  ? formData.minimum_stock_limit
                  : Math.round(formData.minimum_stock_limit) || ""
              }
              onChange={handleInputChange}
            />
          </Grid>

          {/* GST */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="gst"
              size="small"
              type="number"
              label="IGST %"
              value={formData.gst || ""}
              onChange={handleInputChange}
            />
          </Grid>

          {/* CGST */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="CGST"
              value={`${GST}%`}
            />
          </Grid>

          {/* SGST */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="SGST"
              value={`${GST}%`}
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
