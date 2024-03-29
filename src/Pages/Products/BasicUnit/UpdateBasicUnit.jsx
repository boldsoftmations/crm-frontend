import { Box, Button, Grid } from "@mui/material";
import { useRef, useState } from "react";
import React, { useEffect } from "react";
import "../../CommonStyle.css";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const UpdateBasicUnit = (props) => {
  const { recordForEdit, setOpenPopup, getBasicUnit } = props;
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState([]);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const getBrand = async (recordForEdit) => {
    try {
      setOpen(true);
      const res = await ProductService.getBasicUnitById(recordForEdit);

      setBrand(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBrand({ ...brand, [name]: value });
  };

  const updatesBrand = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: brand.name,
        short_name: brand.short_name,
      };
      console.log("data", data);
      if (recordForEdit) {
        await ProductService.updateBasicUnit(brand.id, data);
        setOpenPopup(false);
        setOpen(false);
        getBasicUnit();
      }
    } catch (err) {
      console.log("error :>> ", err);
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
    if (recordForEdit) getBrand(recordForEdit);
  }, [recordForEdit]);

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => updatesBrand(e)}>
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
            <CustomTextField
              fullWidth
              size="small"
              label="Id"
              variant="outlined"
              value={recordForEdit ? recordForEdit : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Basic Unit"
              variant="outlined"
              value={brand.name ? brand.name : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="short_name"
              size="small"
              label="Short Name"
              variant="outlined"
              value={brand.short_name ? brand.short_name : ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
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
