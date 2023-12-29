import { Box, Button, Grid } from "@mui/material";

import { useState } from "react";
import React, { useRef } from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const CreateColor = (props) => {
  const { setOpenPopup, getColours } = props;
  const [colour, setColour] = useState("");
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
      await ProductService.createColour(req);

      setOpenPopup(false);
      setOpen(false);
      getColours();
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
      <Box component="form" noValidate onSubmit={(e) => createColours(e)}>
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
