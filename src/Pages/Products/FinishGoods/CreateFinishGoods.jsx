import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";

import React, { useEffect, useRef, useState } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";
import { useSelector } from 'react-redux';

export const CreateFinishGoods = (props) => {
  const { setOpenPopup, getFinishGoods } = props;

  const [brand, setBrand] = useState([]);

  const [unit, setUnit] = useState([]);
  const [packingUnit, setPackingUnit] = useState([]);
  const [basicUnit, setBasicUnit] = useState([]);
  const [color, setColor] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [finishGoods, setFinishGoods] = useState([]);
  const [open, setOpen] = useState(false);
const user = useSelector((state) => state.auth)
const brandData = user.brandAllData;
const colorData = user.colourAllData;
const packingUnitData = user.packingunitAllData;
const productCodeData = user.productCodeAllData;
const allBasicUnit = user.basicunitAllData;
const unitData = user.unitAllData;
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFinishGoods({ ...finishGoods, [name]: value });
  };
  function searchBrand(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i].short_name;
      }
    }
  }

  var shortName = searchBrand(brand, brandData);

  function packingUnitShortName(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i].short_name;
      }
    }
  }

  const getPackingUnitShortName = packingUnitShortName(
    packingUnit,
    packingUnitData
  );
  const productName = `${productCode ? productCode : ""}-${
    color ? color : ""
  }-${shortName ? shortName : ""}-${finishGoods.size ? finishGoods.size : ""}-${
    finishGoods.unit_quantity ? finishGoods.unit_quantity : ""
  }-${getPackingUnitShortName ? getPackingUnitShortName : ""}${
    finishGoods.packing_unit_quantity ? finishGoods.packing_unit_quantity : ""
  }`;

  function getDescription(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].code === nameKey) {
        return myArray[i].description;
      }
    }
  }

  var description = getDescription(productCode, productCodeData);

  const createfinishGoods = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: productName,
        size: finishGoods.size,
        basic_unit: basicUnit,
        unit: unit,
        unit_quantity: finishGoods.unit_quantity,
        packing_unit: packingUnit,
        packing_unit_quantity: finishGoods.packing_unit_quantity,
        color: color,
        brand: brand,
        productcode: productCode,
        description: description,
        hsn_code: finishGoods.hsn_code,
        gst: finishGoods.gst,
        cgst: GST,
        sgst: GST,
        type: "finished-goods",
      };

      await ProductService.createFinishGoods(data);

      setOpenPopup(false);
      setOpen(false);
      getFinishGoods();
    } catch (err) {
      console.log("error update finishGoods :>> ", err);
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
  const GST = finishGoods.gst / 2;

  return (
    <div>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Box component="form" noValidate onSubmit={(e) => createfinishGoods(e)}>
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
              name="Name"
              size="small"
              label="Name"
              variant="outlined"
              value={productName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="size"
              size="small"
              label="Size"
              variant="outlined"
              value={finishGoods.size}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setUnit(value)}
              name="unit"
              options={unitData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField fullWidth={"false"} {...params} label="Unit" />
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
              value={finishGoods.unit_quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setPackingUnit(value)}
              name="Packing Unit"
              options={packingUnitData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} label="Packing Unit" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="packing_unit_quantity"
              size="small"
              label="Packing Unit Quantity"
              variant="outlined"
              value={finishGoods.packing_unit_quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setBasicUnit(value)}
              options={allBasicUnit.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  name="basicUnit"
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
              onChange={(event, value) => setColor(value)}
              name="Colour"
              options={colorData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField fullWidth {...params} label="Colour" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setBrand(value)}
              name="brand"
              options={brandData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => <TextField {...params} label="brand" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setProductCode(value)}
              name="Product Code"
              options={productCodeData.map((option) => option.code)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} label="Product Code" />
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
              name="hsn_code"
              size="small"
              label="Hsn Code"
              variant="outlined"
              value={finishGoods.hsn_code}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="gst"
              size="small"
              type={"number"}
              label="IGST %"
              variant="outlined"
              value={finishGoods.gst}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              size="small"
              label="CGST"
              variant="outlined"
              value={GST ? `${GST}%` : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
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
    </div>
  );
};
