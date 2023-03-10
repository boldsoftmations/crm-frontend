import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import ProductService from "../../../services/ProductService";
import { ForecastProductCreate } from "./ForecastProductCreate";

export const ForecastCreate = (props) => {
  const { setOpenPopup, getAllCompanyDetailsByID } = props;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [IDForEdit, setIDForEdit] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const Company_Name = data.companyName;

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllValidPriceList("all");
      setProductOption(res.data);

      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const createForecastDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        company: Company_Name,
        sales_person: users.email,
        product: selectedProduct,
      };
      const response = await CustomerServices.createForecastData(req);
      console.log("response", response);
      setIDForEdit(response.data.forecast_id);
      setOpenPopup(false);
      getAllCompanyDetailsByID();
      setOpen(false);
      // setOpenModal(true);
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createForecastDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* <Button
              variant="outlined"
              // disabled={() => openModal(false)}
              onClick={() => setOpenModal(true)}
            >
              Add Product Forecast
            </Button> */}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="company"
              label="Company"
              variant="outlined"
              value={Company_Name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              name="cheque_no"
              size="small"
              label="Sales Person"
              variant="outlined"
              value={users.email}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedProduct(value)}
              options={productOption.map((option) => option.product)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Product Name" />
              )}
            />
          </Grid>
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
      <Popup
        title={"Update Product Forecast Details"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <ForecastProductCreate
          IDForEdit={IDForEdit}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpenModal={setOpenModal}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </div>
  );
};
