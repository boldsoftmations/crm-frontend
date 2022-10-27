import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import React, { useEffect, useRef, useState } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";

export const CreateRawMaterials = () => {
  const [brand, setBrand] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [unit, setUnit] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [color, setColor] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [productCode, setProductCode] = useState([]);
  const [productCodeData, setProductCodeData] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

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

  const getproductCodes = async () => {
    try {
      const res = await ProductService.getAllProductCode();
      setProductCodeData(res.data);
    } catch (err) {
      console.log("error ProductCode rawmaterial", err);
    }
  };

  useEffect(() => {
    getproductCodes();
  }, []);

  const getUnits = async () => {
    try {
      const res = await ProductService.getAllUnit();
      setUnitData(res.data);
    } catch (err) {
      console.log("error unit rawmaterial", err);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  const getBrandList = async () => {
    try {
      const res = await ProductService.getAllBrand();
      setBrandData(res.data);
    } catch (err) {
      console.log("error rawmaterial :>> ", err);
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  const getColours = async () => {
    try {
      const res = await ProductService.getAllColour();
      setColorData(res.data);
    } catch (err) {
      console.log("err Colour rawmaterial :>> ", err);
    }
  };

  useEffect(() => {
    getColours();
  }, []);

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
      const res = await ProductService.createRawMaterials(data);
      console.log("res :>> ", res);
      navigate("/products/view-raw-materials");
      setOpen(false);
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

      <Box
        className="Auth-form-content"
        component="form"
        noValidate
        onSubmit={(e) => createrawMaterials(e)}
        sx={{
          minWidth: "40em",
          boxShadow: "rgb(0 0 0 / 16%) 1px 1px 10px",
          marginTop: "2em",
          marginLeft: "10em",
          marginRight: "10em",
          position: "relative",
          paddingTop: "30px",
          paddingBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <Box display="flex">
          <Box sx={{ marginRight: "2em" }}>
            <Link to="/products/view-raw-materials" className="link-primary">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>
          </Box>
          <Box>
            <h3 className="Auth-form-title">Create Raw Materials</h3>
          </Box>
        </Box>

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
