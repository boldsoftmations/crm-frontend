import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useRef, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import React, { useEffect } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";
import { useSelector } from "react-redux";

export const UpdateProductCode = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
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

  const getproductCode = async (id) => {
    try {
      setOpen(true);
      const res = await ProductService.getProductCodeById(id);
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
        description: description,
      };

      if (id) {
        const res = await ProductService.updateProductCode(
          productCode.id,
          data
        );
        console.log("res :>> ", res);
        navigate("/products/view-product-code");
        setOpen(false);
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
    if (id) getproductCode(id);
  }, [id]);

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
      <Box
        className="Auth-form-content"
        component="form"
        noValidate
        onSubmit={(e) => updatesproductCode(e)}
        sx={{
          minWidth: "35em",
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
          <Box sx={{ marginRight: "5em" }}>
            <Link to="/products/view-product-code" className="link-primary">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>
          </Box>
          <Box>
            <h3 className="Auth-form-title">Update Product Code</h3>
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
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
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
