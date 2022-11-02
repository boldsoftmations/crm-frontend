import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";

import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";

export const UpdateProductCode = (props) => {
  const { recordForEdit, setOpenPopup, getproductCodes } = props;

  const [open, setOpen] = useState(false);

  const desc = useSelector((state) => state.auth);
  const [description, setDescription] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState([]);
  const [error, setError] = useState("");
  const [productCode, setProductCode] = useState([]);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const descriptionValue = selectedDescription.description
    ? selectedDescription.description
    : selectedDescription;
  console.log(
    "selectedDescription description :>> ",
    selectedDescription.description
  );
  console.log("descriptionValue", descriptionValue);
  console.log("selectedDescription", selectedDescription);
  useEffect(() => {
    getNoDescriptionData();
  }, []);

  const getNoDescriptionData = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getNoDescription();
      setDescription(res.data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getproductCode = async (recordForEdit) => {
    try {
      setOpen(true);
      const res = await ProductService.getProductCodeById(recordForEdit);
      setProductCode(res.data);
      setSelectedDescription(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductCode({ ...productCode, [name]: value });
  };

  const updatesproductCode = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        code: productCode.code,
        description: descriptionValue,
      };

      if (recordForEdit) {
        const res = await ProductService.updateProductCode(
          productCode.id,
          data
        );
        setOpenPopup(false);
        setOpen(false);
        getproductCodes();
      }
    } catch (err) {
      console.log("error update product code :>> ", err);
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
  console.log("error", error);
  useEffect(() => {
    if (recordForEdit) getproductCode(recordForEdit);
  }, [recordForEdit]);

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
      <Box component="form" noValidate onSubmit={(e) => updatesproductCode(e)}>
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
              name="code"
              size="small"
              label="Code"
              variant="outlined"
              value={productCode.code ? productCode.code : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              style={{
                minWidth: 225,
              }}
              size="small"
              disableClearable
              value={descriptionValue ? descriptionValue : ""}
              onChange={(event, value) => setSelectedDescription(value)}
              options={description.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField
                  size="small"
                  name="description"
                  {...params}
                  label="Description"
                />
              )}
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
