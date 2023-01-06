import React, { useEffect, useRef, useState } from "react";

import ProductService from "../../../services/ProductService";

import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { useSelector } from "react-redux";
export const UpdateFinishGoods = (props) => {
  const { recordForEdit, setOpenPopup, getFinishGoods } = props;
  const [finishGoods, setFinishGoods] = useState([]);
  const [basicUnit, setBasicUnit] = useState([]);
  const [brand, setBrand] = useState([]);
  const [color, setColor] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [unit, setUnit] = useState([]);

  const [packingUnit, setPackingUnit] = useState([]);

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth)
  const brandData = user.brandAllData;
  const colorData = user.colourAllData;
  const packingUnitData = user.packingunitAllData;
  const productCodeData = user.productCodeAllData;
  const allBasicUnit = user.basicunitAllData;
  const unitData = user.unitAllData;


  const productCodeValue = productCode.productcode
    ? productCode.productcode
    : productCode;
  const brandValue = brand.brand ? brand.brand : brand;
  const colorValue = color.color ? color.color : color;
  const packingUnitValue = packingUnit.packing_unit
    ? packingUnit.packing_unit
    : packingUnit;
  const unitValue = unit.unit ? unit.unit : unit;
  const basicUnitValue = basicUnit.basic_unit
    ? basicUnit.basic_unit
    : basicUnit;

  function searchBrand(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i].short_name;
      }
    }
  }

  var shortName = searchBrand(brandValue, brandData);

  function getDescription(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].code === nameKey) {
        return myArray[i].description;
      }
    }
  }

  var description = getDescription(productCodeValue, productCodeData);

  function packingUnitShortName(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i].short_name;
      }
    }
  }

  const getPackingUnitShortName = packingUnitShortName(
    packingUnitValue,
    packingUnitData
  );

  const productName = `${productCodeValue ? productCodeValue : ""}-${
    colorValue ? colorValue : ""
  }-${shortName ? shortName : ""}-${finishGoods.size ? finishGoods.size : ""}-${
    finishGoods.unit_quantity ? finishGoods.unit_quantity : ""
  }-${getPackingUnitShortName ? getPackingUnitShortName : ""}${
    finishGoods.packing_unit_quantity ? finishGoods.packing_unit_quantity : ""
  }`;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFinishGoods({ ...finishGoods, [name]: value });
  };

  const getFinishGoodData = async (recordForEdit) => {
    try {
      setOpen(true);
      const res = await ProductService.getFinishGoodsById(recordForEdit);
      setFinishGoods(res.data);
      setProductCode(res.data);
      setBrand(res.data);
      setColor(res.data);
      setPackingUnit(res.data);
      setUnit(res.data);
      setBasicUnit(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const updateFinishGood = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: productName,
        size: finishGoods.size,
        basic_unit: basicUnitValue,
        unit: unitValue,
        unit_quantity: finishGoods.unit_quantity,
        packing_unit: packingUnitValue,
        packing_unit_quantity: finishGoods.packing_unit_quantity,
        color: colorValue,
        brand: brandValue,
        productcode: productCodeValue,
        description: description,
        hsn_code: finishGoods.hsn_code,
        gst: finishGoods.gst,
        cgst: GST,
        sgst: GST,
        type: "finished-goods",
      };
      if (recordForEdit) {
        const res = await ProductService.updateFinishGoods(
          finishGoods.id,
          data
        );
        console.log("res", res);
        setOpenPopup(false);

        setOpen(false);
        getFinishGoods();
      }
    } catch (err) {
      console.log("error update color :>> ", err);
      setOpen(false);
      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  useEffect(() => {
    if (recordForEdit) getFinishGoodData(recordForEdit);
  }, [recordForEdit]);

  const GST = JSON.stringify(finishGoods.gst / 2);

  return (
    <>
      <div>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Box component="form" noValidate onSubmit={(e) => updateFinishGood(e)}>
        <Grid container spacing={2}>
          <p
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 4,
              backgroundColor: errMsg ? "red" : "offscreen",
              textAlign: "center",
              color: "white",
              textTransform: "capitalize",
            }}
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              variant="outlined"
              value={finishGoods.name ? finishGoods.name : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="Name"
              size="small"
              label="Update Name"
              variant="outlined"
              value={productName ? productName : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              value={basicUnitValue ? basicUnitValue : ""}
              onChange={(event, value) => setBasicUnit(value)}
              options={allBasicUnit.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  name={"basicUnit"}
                  {...params}
                  label="Basic Unit"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              value={unitValue ? unitValue : ""}
              onChange={(e, value) => setUnit(value)}
              options={unitData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} name={"unit"} label={"Unit"} />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              value={packingUnitValue ? packingUnitValue : ""}
              onChange={(e, value) => setPackingUnit(value)}
              options={packingUnitData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={"packingUnit"}
                  label={" Packing Unit"}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="unit_quantity"
              size="small"
              label="Unit Quantity"
              variant="outlined"
              value={finishGoods.unit_quantity ? finishGoods.unit_quantity : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="packing_unit_quantity"
              size="small"
              label="Packing Unit Quantity"
              variant="outlined"
              value={
                finishGoods.packing_unit_quantity
                  ? finishGoods.packing_unit_quantity
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              value={colorValue ? colorValue : ""}
              onChange={(event, value) => setColor(value)}
              options={colorData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} name={"color"} label={"Colour"} />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              value={brandValue ? brandValue : ""}
              onChange={(event, value) => setBrand(value)}
              options={brandData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} name={"brand"} label="Brand" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              value={productCodeValue ? productCodeValue : ""}
              onChange={(event, value) => setProductCode(value)}
              options={productCodeData.map((option) => option.code)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={"productCode"}
                  label="Product Code"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Description"
              variant="outlined"
              value={description ? description : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="size"
              size="small"
              label="Size"
              variant="outlined"
              value={finishGoods.size ? finishGoods.size : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="hsn_code"
              size="small"
              label="Hsn Code"
              variant="outlined"
              value={finishGoods.hsn_code ? finishGoods.hsn_code : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="gst"
              type={"number"}
              size="small"
              label="IGST %"
              variant="outlined"
              value={finishGoods.gst ? finishGoods.gst : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="CGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="SGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
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
};
