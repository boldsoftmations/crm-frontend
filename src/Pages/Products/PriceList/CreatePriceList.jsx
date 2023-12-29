import { Box, Button, Grid } from "@mui/material";

import React, { useRef, useState } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const CreatePriceList = (props) => {
  const { setOpenPopup, getPriceList, product } = props;
  const [inputValue, setInputValue] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [productName, setProductName] = useState([]);
  const [validation, setValidation] = useState();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const validate = inputValue.slab1 < inputValue.slab2;

  const createPriceListDetails = async (e) => {
    try {
      e.preventDefault();
      let validate = inputValue.slab1 < inputValue.slab2;
      setValidation(validate);
      console.log("validate", validation);
      const req = {
        product: productName,
        slab1: inputValue.slab1,
        slab1_price: inputValue.slab1_price,
        slab2: inputValue.slab2,
        slab2_price: inputValue.slab2_price,
        slab3_price: inputValue.slab3_price,
        validity: inputValue.validity,
        discontinued: false,
      };

      setOpen(true);
      await ProductService.createPriceList(req);

      setOpenPopup(false);
      setOpen(false);
      getPriceList();
    } catch (err) {
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

  return (
    <>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createPriceListDetails(e)}
      >
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
          <Grid item xs={12}>
            <CustomAutocomplete
              sx={{
                minWidth: 180,
              }}
              size="small"
              onChange={(e, value) => setProductName(value)}
              name="productName"
              options={product.map((option) => option.name)}
              getOptionLabel={(option) => `${option ? option : "No Options"}`}
              label="Product Name"
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
};
