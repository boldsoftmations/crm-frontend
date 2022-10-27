import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";

import React, { useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import "../../CommonStyle.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export const CreateColor = () => {
  const [colour, setColour] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const createColours = async (e) => {
    try {
      e.preventDefault();
      const req = {
        name: colour,
      };

      setOpen(true);
      const res = await ProductService.createColour(req);
      console.log("res", res);
      navigate("/products/view-colors");
      setOpen(false);
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
        onSubmit={(e) => createColours(e)}
        sx={{
          minWidth: "20em",
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
          <Box sx={{ marginRight: "4em" }}>
            <Link to="/products/view-colors" className="link-primary">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>
          </Box>
          <Box>
            <h3 className="Auth-form-title">Create Colour</h3>
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="colour"
              size="small"
              label="Colour"
              variant="outlined"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
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
