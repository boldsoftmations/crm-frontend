import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const GRNCreate = (props) => {
  const { setOpenPopup, getAllGRNDetails } = props;
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [grnDataByID, setGRNDataByID] = useState([]);
  const [error, setError] = useState(null);
  const data = useSelector((state) => state.auth);
  const vendorOption = data.packingList;
  const [products, setProducts] = useState([
    {
      products: "",
      order_quantity: "",
      qa_rejected: "",
      qa_accepted: "",
    },
  ]);

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...products];
    list[index][name] = value;

    // If qa_rejected and quantity values exist, update the qa_accepted value
    if (list[index].qa_rejected !== "" && list[index].order_quantity !== "") {
      list[index].qa_accepted =
        parseInt(list[index].order_quantity) -
        parseInt(list[index].qa_rejected);
    }

    setProducts(list);
  };

  useEffect(() => {
    if (vendor !== null && vendor !== undefined && vendor.id) {
      getGRNDetailsByID();
    }
  }, [vendor]);

  const getGRNDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getPackingListDataById(
        vendor.id
      );
      setGRNDataByID(response.data);
      var arr = response.data.products.map((fruit) => ({
        products: fruit.product,
        order_quantity: fruit.quantity,
        unit: fruit.unit,
      }));
      setProducts(arr);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const createPackingListDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        packing_list: grnDataByID.id, //Normal text field
        products: products,
      };
      await InventoryServices.createGRNData(req);
      setOpenPopup(false);
      getAllGRNDetails();
      setOpen(false);
    } catch (error) {
      console.log("createing Packing list error", error);
      setError(
        error.response.data.errors
          ? error.response.data.errors.packing_list
            ? "Packing List" + error.response.data.errors.packing_list
            : error.response.data.errors.seller_account
            ? "Seller Account" + error.response.data.errors.seller_account
            : ""
          : ""
      );
      setOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createPackingListDetails(e)}
      >
        <Snackbar
          open={Boolean(error)}
          onClose={handleCloseSnackbar}
          message={error}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              name="vendor"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setVendor(value)}
              options={vendorOption ? vendorOption.map((option) => option) : []}
              getOptionLabel={(option) =>
                `${option.vendor} ${option.packing_list_no}`
              }
              sx={{ minWidth: 300 }}
              renderInput={(params) => <TextField {...params} label="Vendor" />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="packing_list"
              label="Packing List"
              variant="outlined"
              value={grnDataByID.id ? grnDataByID.id : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products.map((input, index) => {
            return (
              <>
                <Grid key={index} item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="products"
                    size="small"
                    label="Products"
                    variant="outlined"
                    value={input.products ? input.products : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit ? input.unit : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="order_quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.order_quantity ? input.order_quantity : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="qa_rejected"
                    size="small"
                    label="QA Rejected"
                    variant="outlined"
                    value={input.qa_rejected}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="qa_accepted"
                    size="small"
                    label="QA Accepted"
                    variant="outlined"
                    value={
                      input.qa_rejected !== "" &&
                      input.order_quantity !== "" &&
                      !isNaN(input.order_quantity) &&
                      !isNaN(input.qa_rejected)
                        ? parseInt(input.order_quantity) -
                          parseInt(input.qa_rejected)
                        : ""
                    }
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
              </>
            );
          })}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};
