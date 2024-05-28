import React, { useState, useEffect } from "react";
import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "./../../../Components/CustomAutocomplete";
import InventoryServices from "../../../services/InventoryService";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const values = {
  someDate: new Date().toISOString().substring(0, 10),
};

export const ReworkInvoiceCreate = ({
  getSalesReturnInventoryDetails,
  setOpenPopup,
  selectedRow,
}) => {
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(
    selectedRow.products.map((product) => ({
      ...product,
      raw_materials: product.raw_materials || [], // Ensure each product has a raw_materials array
    }))
  );

  const [inputValue, setInputValue] = useState({
    batch_no: selectedRow.batch_no.join(", "),
    generation_date: new Date().toISOString().substring(0, 10),
    vendor: "",
    transporter_name: "",
    seller_unit: selectedRow.unit,
  });
  const [rawMaterialOptions, setRawMaterialOptions] = useState([]);

  const fetchRawMaterials = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllConsStoresInventoryData();
      setRawMaterialOptions(response.data);
    } catch (error) {
      handleError(error);
      console.error("Error fetching raw materials:", error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleFormChange = (productIndex, rawMaterialIndex, event) => {
    const { name, value } = event.target;
    let data = [...products];
    if (rawMaterialIndex === -1) {
      // Changes for main product
      data[productIndex] = {
        ...data[productIndex],
        [name]: value,
      };
    } else {
      // Changes for raw materials
      data[productIndex].raw_materials[rawMaterialIndex] = {
        ...data[productIndex].raw_materials[rawMaterialIndex],
        [name]: value,
      };
    }
    setProducts(data);
  };

  const handleRawMaterialChange = (
    productIndex,
    rawMaterialIndex,
    newValue
  ) => {
    let data = [...products];
    const selectedProduct = rawMaterialOptions.find(
      (option) => option.product__name === newValue.product__name
    );
    data[productIndex].raw_materials[rawMaterialIndex] = {
      ...data[productIndex].raw_materials[rawMaterialIndex],
      product: selectedProduct.product__name,
      unit: selectedProduct.product__unit,
    };
    setProducts(data);
  };

  const addRawMaterial = (productIndex) => {
    let data = [...products];
    data[productIndex].raw_materials.push({
      product: "",
      unit: "",
      quantity: 0,
    });
    setProducts(data);
  };

  const removeRawMaterial = (productIndex, rawMaterialIndex) => {
    let data = [...products];
    data[productIndex].raw_materials.splice(rawMaterialIndex, 1);
    setProducts(data);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  const createSupplierInvoiceDetails = async (e) => {
    e.preventDefault();

    const payload = {
      seller_account: inputValue.seller_unit,
      batch_no: inputValue.batch_no,
      products: products.map((product) => ({
        ...product,
        raw_materials: product.raw_materials.map((rm) => ({
          product: rm.product,
          unit: rm.unit,
          quantity: rm.quantity,
        })),
      })),
    };

    try {
      setOpen(true);
      const response = await InventoryServices.createReworkinvoiceData(payload);
      handleSuccess(
        response.data.message || "Supplier Invoice created successfully!"
      );
      setOpenPopup(false);
      getSalesReturnInventoryDetails();
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createSupplierInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              multiline
              size="small"
              label="Invoice No"
              variant="outlined"
              value={inputValue.batch_no}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Seller Unit"
              variant="outlined"
              value={inputValue.seller_unit}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              type={"date"}
              name="generation_date"
              size="small"
              label="Generation Date"
              variant="outlined"
              value={inputValue.generation_date || values.someDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="vendor"
              size="small"
              label="Vendor"
              variant="outlined"
              value={inputValue.vendor}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="transporter_name"
              size="small"
              label="Transporter Name"
              variant="outlined"
              value={inputValue.transporter_name}
              onChange={handleInputChange}
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
              <React.Fragment key={index}>
                <Grid item xs={12} sm={5}>
                  <CustomTextField
                    fullWidth
                    name="product"
                    size="small"
                    label="Product"
                    variant="outlined"
                    value={input.product}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Button
                    onClick={() => removeFields(index)}
                    variant="contained"
                  >
                    Remove
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Root>
                    <Divider>
                      <Chip label="RAW MATERIALS" />
                    </Divider>
                  </Root>
                </Grid>
                {input.raw_materials.map((rm, rmIndex) => (
                  <React.Fragment key={`${index}-${rmIndex}`}>
                    <Grid item xs={12} sm={3}>
                      <CustomAutocomplete
                        options={rawMaterialOptions}
                        getOptionLabel={(option) => option.product__name}
                        value={{ product__name: rm.product }}
                        onChange={(event, newValue) =>
                          handleRawMaterialChange(index, rmIndex, newValue)
                        }
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label="Raw Material Product"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTextField
                        fullWidth
                        name="unit"
                        size="small"
                        label="Unit"
                        variant="outlined"
                        value={rm.unit}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <CustomTextField
                        fullWidth
                        name="quantity"
                        size="small"
                        label="Raw Material Quantity"
                        variant="outlined"
                        value={rm.quantity}
                        onChange={(event) =>
                          handleFormChange(index, rmIndex, event)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Button
                        onClick={() => removeRawMaterial(index, rmIndex)}
                        variant="contained"
                      >
                        Remove
                      </Button>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  <Button
                    onClick={() => addRawMaterial(index)}
                    variant="contained"
                  >
                    Add Raw Material
                  </Button>
                </Grid>
              </React.Fragment>
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
    </>
  );
};
