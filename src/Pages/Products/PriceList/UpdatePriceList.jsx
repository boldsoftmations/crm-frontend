import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";

import { useRef, useState } from "react";
import React, { useEffect } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";

export const UpdatePriceList = (props) => {
  const { recordForEdit, setOpenPopup, getPriceList } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [productName, setProductName] = useState([]);
  const [product, setProduct] = useState([]);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    getProduct();
  }, []);
  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const getPriceListData = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getPriceListById(recordForEdit);
      setInputValue(res.data);
      setChecked(res.data.discontinued);
      setProductName(res.data.product);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handleCheckedChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const updatePriceList = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        product: productName ? productName : "",
        price: inputValue.price,
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

  useEffect(() => {
    if (recordForEdit) getPriceListData(recordForEdit);
  }, [recordForEdit]);

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="price"
              size="small"
              label="Price"
              variant="outlined"
              value={inputValue.price ? inputValue.price : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
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
              label="Validity"
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
