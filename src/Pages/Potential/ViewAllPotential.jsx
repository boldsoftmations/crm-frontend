import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import LeadServices from "../../services/LeadService";
import ProductService from "../../services/ProductService";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
export const ViewAllPotential = (props) => {
  const [open, setOpen] = useState(false);
  const { recordForEdit } = props;

  const [product, setProduct] = useState([]);
  const [potential, setPotential] = useState([]);
  const [productName, setProductName] = useState([]);
  const [potentialData, setPotentialData] = useState([]);
  const [openModal, setOpenModal] = React.useState(false);

  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const getPotential = async () => {
    try {
      setOpen(true);
      const res = await LeadServices.getLeadsById(recordForEdit);

      setPotentialData(res.data.potential);

      setOpen(false);
    } catch (err) {
      console.error(err);
      setOpen(false);
    }
  };

  useEffect(() => {
    getPotential();
  }, []);
  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      console.log("res product", res.data);
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPotential({ ...potential, [name]: value });
  };

  let handleSubmit = (event) => {
    try {
      event.preventDefault();
      const data = {
        lead: recordForEdit,
        product: productName,
        current_brand: potential.currentBrand,
        current_buying_price: potential.currentBuyingPrice,
        current_buying_quantity: potential.currentBuyingQuantity,
        target_price: potential.targetPrice,
        quantity: potential.quantity,
      };
      setOpen(true);
      const res = LeadServices.createPotentialLead(data);
      console.log("res", res);

      setOpenModal(false);
      getPotential();
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
      setOpen(false);
    }
  };
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
      <BootstrapDialog
        maxWidth={"lg"}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Create Potential
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={(e) => handleSubmit(e)}
            >
              <Grid container spacing={2}>
                <Grid item xs={24} sm={4}>
                  <Autocomplete
                    style={{
                      minWidth: 180,
                    }}
                    size="small"
                    onChange={(e, value) => setProductName(value)}
                    name="productName"
                    options={product.map((option) => option.name)}
                    getOptionLabel={(option) =>
                      `${option ? option : "No Options"}`
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Product Name" />
                    )}
                  />
                </Grid>
                <Grid item xs={24} sm={4}>
                  <TextField
                    fullWidth
                    name="currentBrand"
                    size="small"
                    label="Current Brand"
                    variant="outlined"
                    value={potential.currentBrand ? potential.currentBrand : ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={24} sm={4}>
                  <TextField
                    type="number"
                    fullWidth
                    name="currentBuyingPrice"
                    size="small"
                    label="Current Buying Price"
                    variant="outlined"
                    value={
                      potential.currentBuyingPrice
                        ? potential.currentBuyingPrice
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={24} sm={4}>
                  <TextField
                    type="number"
                    fullWidth
                    name="currentBuyingQuantity"
                    size="small"
                    label="Current Buying Quantity"
                    variant="outlined"
                    value={
                      potential.currentBuyingQuantity
                        ? potential.currentBuyingQuantity
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={24} sm={4}>
                  <TextField
                    type="number"
                    fullWidth
                    name="targetPrice"
                    size="small"
                    label="Target Price"
                    variant="outlined"
                    value={potential.targetPrice ? potential.targetPrice : ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={24} sm={4}>
                  <TextField
                    type="number"
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={potential.quantity ? potential.quantity : ""}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Grid
                  container
                  justifyContent={"flex-end"}
                  // sx={{ marginTop: "1rem" }}
                >
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </Grid>
              </DialogActions>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>

      {potentialData && (
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Paper
            sx={{
              p: 2,
              m: 4,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#F5F5F5",
            }}
          >
            <Box display="flex">
              <Box flexGrow={0.9} align="left"></Box>
              <Box flexGrow={2.5} align="center">
                <h3 className="Auth-form-title">View Potential</h3>
              </Box>
              <Box flexGrow={0.3} align="right">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleClickOpen}
                >
                  Create Potential
                </Button>
              </Box>
            </Box>

            {potentialData.map((potentialInput, index) => {
              return (
                <>
                  <Grid
                    key={index}
                    sx={{ marginBottom: "1em", marginTop: "1em" }}
                    container
                    spacing={2}
                  >
                    <Grid item xs={24} sm={4}>
                      ProductName :{" "}
                      {potentialInput.product ? potentialInput.product : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Current Brand :{" "}
                      {potentialInput.current_brand
                        ? potentialInput.current_brand
                        : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Current Buying Price :{" "}
                      {potentialInput.current_buying_price
                        ? potentialInput.current_buying_price
                        : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Current Buying Quantity :{" "}
                      {potentialInput.current_buying_quantity}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Target Price :{" "}
                      {potentialInput.target_price
                        ? potentialInput.target_price
                        : ""}
                    </Grid>
                    <Grid item xs={24} sm={4}>
                      Qunatity :{" "}
                      {potentialInput.quantity ? potentialInput.quantity : ""}
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              );
            })}
          </Paper>
        </Box>
      )}
    </>
  );
};
