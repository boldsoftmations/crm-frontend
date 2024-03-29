import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { useRef, useState } from "react";
import React from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

// const consume = [
//   {
//     value: "yes",
//     name: "Yes",
//   },

//   {
//     value: "no",
//     name: "No",
//   },
// ];

export const CreateDescription = (props) => {
  const { setOpenPopup, getDescriptions } = props;
  const [description, setDescription] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDescription({ ...description, [name]: value });
  };

  const createdescription = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: description.name,
        consumable: description.consumable,
      };
      await ProductService.createDescription(data);
      setOpenPopup(false);
      setOpen(false);
      getDescriptions();
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

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createdescription(e)}>
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
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Description"
              variant="outlined"
              value={description.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Consumable</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                label="Consumable"
                name="consumable"
                onChange={handleInputChange}
              >
                <MenuItem value={"Yes"}>Yes </MenuItem>
                <MenuItem value={"No"}>No </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
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
