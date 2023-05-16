import React, { useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import ProductService from "../../../services/ProductService";
import "../../CommonStyle.css";
import { CustomLoader } from "../../../Components/CustomLoader";

export const UpdatePriceList = (props) => {
  const { recordForEdit, setOpenPopup, getPriceList, product } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(recordForEdit);
  const [productName, setProductName] = useState(recordForEdit.product);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [checked, setChecked] = useState(recordForEdit.discontinued);

  const handleCheckedChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };
  const validate = inputValue.slab1 < inputValue.slab2;
  const updatePriceList = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        product: productName ? productName : "",
        slab1: inputValue.slab1,
        slab1_price: inputValue.slab1_price,
        slab2: inputValue.slab2,
        slab2_price: inputValue.slab2_price,
        slab3_price: inputValue.slab3_price,
        validity: inputValue.validity,
        discontinued: checked,
      };
      if (recordForEdit) {
        await ProductService.updatePriceList(inputValue.id, req);
        setOpenPopup(false);
        setOpen(false);
        getPriceList();
      }
    } catch (err) {
      console.log("error update price list :>> ", err);
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
      <Box component="form" noValidate onSubmit={(e) => updatePriceList(e)}>
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
            <Autocomplete
              style={{
                minWidth: 180,
              }}
              size="small"
              value={productName ? productName : ""}
              onChange={(e, value) => setProductName(value)}
              name="productName"
              options={product.map((option) => option.name)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Product Name" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="slab1"
              size="small"
              label="Slab 1"
              variant="outlined"
              value={inputValue.slab1 ? inputValue.slab1 : ""}
              error={inputValue.slab1 === ""}
              helperText={
                inputValue.slab1 === "" ? "this field is required." : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="slab1_price"
              size="small"
              label="Slab1 Price"
              variant="outlined"
              value={inputValue.slab1_price ? inputValue.slab1_price : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="slab2"
              size="small"
              label="Slab 2"
              variant="outlined"
              value={inputValue.slab2 ? inputValue.slab2 : ""}
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
            <TextField
              fullWidth
              name="slab2_price"
              size="small"
              label="Slab2 Price"
              variant="outlined"
              value={inputValue.slab2_price ? inputValue.slab2_price : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="slab3_price"
              size="small"
              label="Slab3  Price"
              variant="outlined"
              value={inputValue.slab3_price ? inputValue.slab3_price : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              name="validity"
              size="small"
              label="Validity"
              variant="outlined"
              value={inputValue.validity ? inputValue.validity : ""}
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
                  checked={checked}
                  onChange={handleCheckedChange}
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
};
