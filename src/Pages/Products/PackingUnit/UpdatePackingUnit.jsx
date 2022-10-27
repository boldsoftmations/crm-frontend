import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import React, { useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "../../CommonStyle.css";
import ProductService from "../../../services/ProductService";

export const UpdatePackingUnit = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [unit, setUnit] = useState([]);

  const getunit = async (id) => {
    try {
      setOpen(true);
      const res = await ProductService.getPackingUnitById(id);

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
      if (id) {
        const res = await ProductService.updatePackingUnit(unit.id, data);
        console.log("res :>> ", res);
        navigate("/products/view-packing-unit");

        setOpen(false);
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
    if (id) getunit(id);
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
        onSubmit={(e) => updatePackingUnits(e)}
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
            <Link to="/products/view-packing-unit" className="link-primary">
              <KeyboardBackspaceIcon fontSize="large" />
            </Link>
          </Box>
          <Box>
            <h3 className="Auth-form-title">Update Packing Unit</h3>
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
              name="id"
              size="small"
              label="Id"
              variant="outlined"
              value={id ? id : ""}
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
