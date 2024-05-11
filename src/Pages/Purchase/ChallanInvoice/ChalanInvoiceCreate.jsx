import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  ListItem,
  styled,
  Divider,
  Chip,
  Box,
} from "@mui/material";
import InventoryServices from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

function BOMProductsList({ bomProducts }) {
  return (
    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
      {bomProducts.map((bomProduct, index) => (
        <ListItem key={index}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4} sm={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Product:
              </Typography>
            </Grid>
            <Grid item xs={8} sm={4}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {bomProduct.product}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Quantity:
              </Typography>
            </Grid>
            <Grid item xs={8} sm={4}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {bomProduct.quantity}
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
      ))}
    </Grid>
  );
}

export const ChalanInvoiceCreate = ({
  setOpenPopup,
  challanNumbers,
  getChalanDetails,
}) => {
  const [formData, setFormData] = useState({
    challan: challanNumbers.challan_no,
    job_worker: challanNumbers.job_worker,
    buyer_account: challanNumbers.buyer_account,
    service_charge: "",
    transport_cost: "",
    invoice_no: "",
    products: [{ product: "", quantity: "", bom_id: "" }],
  });
  const [bomIdOptions, setBomIdOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productResponse, bomResponse] = await Promise.all([
          ProductService.getAllProduct(),
          InventoryServices.getAllBillofMaterialsData("all"),
        ]);
        setProductOptions(productResponse.data);
        setBomIdOptions(bomResponse.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleProductChange = (index, name, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][name] = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      products: updatedProducts,
    }));
  };

  const handleBomIdChange = async (index, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index]["bom_id"] = value;

    const selectedBom = bomIdOptions.find((option) => option.bom_id === value);

    if (selectedBom) {
      const bomProductData = selectedBom.products_data || [];

      const bomProductsFormatted = bomProductData.map(
        ({ product, quantity }) => ({
          product,
          quantity,
        })
      );

      updatedProducts[index]["bom_products"] = bomProductsFormatted;

      setFormData((prevFormData) => ({
        ...prevFormData,
        products: updatedProducts,
      }));
    } else {
      console.error("Selected BOM not found in bomIdOptions");
    }
  };

  const addProductField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      products: [
        ...prevFormData.products,
        { product: "", quantity: "", bom_id: "" },
      ],
    }));
  };

  const removeProductField = (index) => {
    const filteredProducts = formData.products.filter(
      (_, idx) => idx !== index
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      products: filteredProducts,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const preparedFormData = {
        ...formData,
        service_charge: parseInt(formData.service_charge, 10),
        transport_cost: parseInt(formData.transport_cost, 10),
        products: formData.products.map((product) => ({
          // Only include the desired fields for each product
          product: product.product,
          quantity: parseInt(product.quantity, 10),
          bom_id: product.bom_id,
        })),
      };
      const response = await InventoryServices.createChalanInvoice(
        preparedFormData
      );
      console.log("Invoice Created:", response);
      getChalanDetails();
      handleSuccess("Chalan Invoice Created Successfully");
      setOpenPopup(false);
    } catch (error) {
      handleError(error);
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
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {[
            "challan",
            "job_worker",
            "buyer_account",
            "service_charge",
            "transport_cost",
            "invoice_no",
          ].map((fieldName, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <CustomTextField
                fullWidth
                size="small"
                label={fieldName.replace(/_/g, " ")}
                name={fieldName}
                type={
                  fieldName === "service_charge" ||
                  fieldName === "transport_cost"
                    ? "number"
                    : "text"
                }
                value={formData[fieldName]}
                onChange={handleChange}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Product" />
              </Divider>
            </Root>
          </Grid>
          {formData.products.map((product, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  name="product"
                  size="small"
                  disablePortal
                  id={`combo-box-demo-${index}`}
                  value={product.product}
                  onChange={(event, value) =>
                    handleProductChange(index, "product", value)
                  }
                  options={productOptions.map((option) => option.name)}
                  getOptionLabel={(option) => option}
                  label="Product"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleProductChange(index, "quantity", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomAutocomplete
                  name="bom_id"
                  size="small"
                  disablePortal
                  id={`bom-box-${index}`}
                  value={product.bom_id}
                  onChange={(event, value) => handleBomIdChange(index, value)}
                  options={bomIdOptions.map((option) => option.bom_id)}
                  getOptionLabel={(option) => option}
                  label="BOM ID"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                {index !== 0 && (
                  <Button
                    disabled={index === 0}
                    onClick={() => removeProductField(index)}
                    variant="contained"
                  >
                    Remove
                  </Button>
                )}
              </Grid>
              {product.bom_products && product.bom_products.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Divider>
                      <Chip label="BOM Products" />
                    </Divider>
                  </Box>
                  <BOMProductsList bomProducts={product.bom_products} />
                </Grid>
              )}
            </React.Fragment>
          ))}
          <Grid item xs={12} sm={4} alignContent="right">
            <Button
              onClick={addProductField}
              variant="contained"
              sx={{ marginRight: "1em" }}
            >
              Add More...
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Create Invoice
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
