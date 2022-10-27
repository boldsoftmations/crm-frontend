import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import React from "react";

import ProductService from "../../../services/ProductService";

import "../../CommonStyle.css";

const consume = [
  {
    value: "yes",
    name: "Yes",
  },

  {
    value: "no",
    name: "No",
  },
];

export const CreateDescription = () => {
  const [description, setDescription] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [consumable, setConsumable] = useState([]);
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
        consumable: consumable,
      };
      const res = await ProductService.createDescription(data);
      console.log("res :>> ", res);
      navigate("/products/view-description");
      setOpen(false);
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
        onSubmit={(e) => createdescription(e)}
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
            <Link to="/products/view-description" className="link-primary">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>
          </Box>
          <Box>
            <h3 className="Auth-form-title"> Create Description</h3>
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
              name="name"
              size="small"
              label="Description"
              variant="outlined"
              value={description.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              textAlign={"right"}
              select
              fullWidth
              name="consumable"
              size="small"
              label="Consumable"
              variant="outlined"
              value={consumable}
              onChange={(e) => setConsumable(e.target.value)}
            >
              {consume.map((option, i) => (
                <MenuItem key={option.name} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
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
