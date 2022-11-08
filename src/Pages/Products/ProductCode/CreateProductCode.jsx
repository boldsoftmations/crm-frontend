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

export const CreateProductCode = (props) => {
  const { setOpenPopup, getproductCodes } = props;
  const [description, setDescription] = useState([]);
  const [allDescription, seAllDescription] = useState([]);
  const [productCode, setProductCode] = useState([]);

  const [open, setOpen] = useState(false);

  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductCode({ ...productCode, [name]: value });
  };

  useEffect(() => {
    getNoDescriptionData();
  }, []);

  const getNoDescriptionData = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getNoDescription();
      seAllDescription(res.data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const createProductCode = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        code: productCode.code,
        description: description,
      };
      await ProductService.createProductCode(data);
      setOpenPopup(false);
      setOpen(false);
      getproductCodes();
    } catch (err) {
      console.log("error update color :>> ", err);
      setOpen(false);
      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors
            ? err.response.data.errors.code
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
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Box component="form" noValidate onSubmit={(e) => createProductCode(e)}>
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
              name="code"
              fullWidth
              size="small"
              label="Code"
              variant="outlined"
              value={productCode.code}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => setDescription(value)}
              name="description"
              options={allDescription.map((option) => option.name)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} label="Description" />
              )}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
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
