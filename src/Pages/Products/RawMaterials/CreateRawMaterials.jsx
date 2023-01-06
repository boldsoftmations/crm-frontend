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
import { useSelector } from "react-redux";

export const CreateRawMaterials = (props) => {
  const { setOpenPopup, getrawMaterials } = props;
  const [brand, setBrand] = useState([]);
  const [unit, setUnit] = useState([]);
  const [color, setColor] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [open, setOpen] = useState(false);

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const user = useSelector((state) => state.auth);
  const brandData = user.brandAllData;
  const colorData = user.colourAllData;
  const productCodeData = user.productCodeAllData;
  const unitData = user.unitAllData;
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRawMaterials({ ...rawMaterials, [name]: value });
  };
  function searchBrand(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i].short_name;
      }
    }
  }
  var shortName = searchBrand(brand, brandData);
  function getDescription(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].code === nameKey) {
        return myArray[i].description;
      }
    }
  }

  var description = getDescription(productCode, productCodeData);
  const productName = `${productCode ? productCode : ""}-${
    color ? color : ""
  }-${shortName ? shortName : ""}-${
    rawMaterials.size ? rawMaterials.size : ""
  }`;


  const createrawMaterials = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: productName,
        size: rawMaterials.size,
        unit: unit,
        color: color,
        brand: brand,
        productcode: productCode,
        description: description,
        hsn_code: rawMaterials.hsn_code,
        gst: rawMaterials.gst,
        cgst: GST,
        sgst: GST,
        type: "raw-materials",
      };
      await ProductService.createRawMaterials(data);

      setOpenPopup(false);
      setOpen(false);
      getrawMaterials();
    } catch (err) {
      console.log("error update color :>> ", err);
      setOpen(false);
      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors
            ? err.response.data.errors.description
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

  const GST = rawMaterials.gst / 2;

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

      <Box component="form" noValidate onSubmit={(e) => createrawMaterials(e)}>
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
              value={rawMaterials.size}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(e, value) => setUnit(value)}
              options={unitData.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => <TextField {...params} label={"Unit"} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setColor(value)}
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
                <TextField
                  {...params}
                  name="Product Code"
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
              name="hsn_code"
              size="small"
              label="Hsn Code"
              variant="outlined"
              value={rawMaterials.hsn_code}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="gst"
              type={"number"}
              size="small"
              label="IGST %"
              variant="outlined"
              value={rawMaterials.gst}
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
