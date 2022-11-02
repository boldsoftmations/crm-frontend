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

export const UpdateColor = (props) => {
  const { recordForEdit, setOpenPopup, getColours } = props;
  const [open, setOpen] = useState(false);
  const [colour, setColour] = useState([]);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const getcolor = async (id) => {
    try {
      setOpen(true);
      const res = await ProductService.getColourById(recordForEdit);

      setColour(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setColour({ ...colour, [name]: value });
  };

  const updateColour = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: colour.name,
      };
      if (recordForEdit) {
        await ProductService.updateColour(colour.id, data);
        setOpenPopup(false);
        setOpen(false);
        getColours();
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
    if (recordForEdit) getcolor(recordForEdit);
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
      <Box component="form" noValidate onSubmit={(e) => updateColour(e)}>
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
              size="small"
              label="Id"
              variant="outlined"
              value={recordForEdit ? recordForEdit : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="name"
              size="small"
              label="Colour"
              variant="outlined"
              value={colour.name ? colour.name : ""}
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
