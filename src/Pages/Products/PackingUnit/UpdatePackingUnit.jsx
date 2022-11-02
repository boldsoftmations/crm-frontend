import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";

import { useRef, useState } from "react";
import React, { useEffect } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";

export const UpdatePackingUnit = (props) => {
  const { recordForEdit, setOpenPopup, getPackingUnits } = props;
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [unit, setUnit] = useState([]);

  const getunit = async (recordForEdit) => {
    try {
      setOpen(true);
      const res = await ProductService.getPackingUnitById(recordForEdit);

      setUnit(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUnit({ ...unit, [name]: value });
  };

  const updatePackingUnits = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: unit.name,
        short_name: unit.short_name,
      };
      console.log("data", data);
      if (recordForEdit) {
        await ProductService.updatePackingUnit(unit.id, data);
        setOpenPopup(false);

        setOpen(false);
        getPackingUnits();
      }
    } catch (err) {
      console.log("error update color :>> ", err);
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
    if (recordForEdit) getunit(recordForEdit);
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
      <Box component="form" noValidate onSubmit={(e) => updatePackingUnits(e)}>
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
            <TextField
              fullWidth
              size="small"
              label="Id"
              variant="outlined"
              value={recordForEdit ? recordForEdit : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              size="small"
              label="Packing Unit"
              variant="outlined"
              value={unit.name ? unit.name : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="short_name"
              size="small"
              label="Short Name"
              variant="outlined"
              value={unit.short_name ? unit.short_name : ""}
              onChange={handleInputChange}
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
