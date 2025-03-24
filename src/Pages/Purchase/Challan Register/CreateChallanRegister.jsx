import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { CustomLoader } from "../../../Components/CustomLoader";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import ProductService from "../../../services/ProductService";
import InventoryServices from "../../../services/InventoryService";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const CreateChallanRegister = memo(
  ({ recordForEdit, setOpenPopup, getAllVendorDetails, currentPage }) => {
    const { sellerData, userData } = useSelector((state) => ({
      sellerData: state.auth.sellerAccount,
      userData: state.auth.profile,
    }));
    const today = new Date().toISOString().slice(0, 10);
    const [inputValues, setInputValues] = useState({
      created_by: userData.email,
      schedule_date: today,
      job_worker: recordForEdit.name,
      vendor_type: recordForEdit.type,
      vendor_contact_person: "",
      buyer_account: "",
      delivery_term: "",
      transporter_name: "",
      transpotation_cost: "",
      vechile_no: "",
      products: [
        {
          product: "",
          quantity: "",
          unit: "",
        },
      ],
    });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productOption, setProductOption] = useState([]);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    const handleInputChange = useCallback((event) => {
      const { name, value } = event.target;
      setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
    }, []);

    const handleAutocompleteChange = useCallback(
      (fieldName, value) => {
        setInputValues((prevValues) => {
          const newValues = { ...prevValues, [fieldName]: value };

          if (fieldName === "vendor_contact_person") {
            const selectedContact = recordForEdit.contacts.find(
              (contact) => contact.name === value
            );
            if (selectedContact) {
              newValues.vendor_contact = selectedContact.contact;
              newValues.vendor_email = selectedContact.email;
            }

            // Set currency based on vendor type from recordForEdit
            if (recordForEdit.type === "Domestic") {
              newValues.currency = "INR";
            } else if (recordForEdit.type === "International") {
              // Remove INR from options or set to a default currency for International
              newValues.currency = ""; // This can be set to a different default if needed
            }
          }

          return newValues;
        });
      },
      [recordForEdit.type, recordForEdit.contacts]
    );

    const handleProductChange = (index, field, value) => {
      setInputValues((prevValues) => {
        const updatedProducts = [...prevValues.products];
        const productToUpdate = { ...updatedProducts[index] };

        // Update the field with the new value
        if (field === "quantity") {
          productToUpdate[field] = parseInt(value, 10) || ""; // Ensure quantity is an integer
        } else if (field === "rate") {
          productToUpdate[field] = parseFloat(value) || ""; // Rate can still be a float, but you could also enforce integers
        } else {
          productToUpdate[field] = value;
        }

        // Calculate amount if quantity or rate is changed
        if (field === "quantity" || field === "rate") {
          const quantity = parseInt(productToUpdate.quantity, 10) || 0;
          const rate = parseFloat(productToUpdate.rate) || 0;
          productToUpdate.amount = Math.round(quantity * rate); // Round to nearest integer
        }

        updatedProducts[index] = productToUpdate;
        return { ...prevValues, products: updatedProducts };
      });
    };

    const handleProductAutocompleteChange = (index, selectedProductName) => {
      // Prevent function from running if the selected product name is not defined
      if (!selectedProductName) return;

      // Find the product object based on the selected value
      const productObj = productOption.find(
        (item) => item.name === selectedProductName
      );

      // Early exit if the product object is not found
      if (!productObj) {
        console.error("Selected product not found in product options");
        return;
      }
      // Safely update the state with the new products list
      setInputValues((prevValues) => {
        const newProducts = prevValues.products.map((product, idx) => {
          if (idx === index) {
            return {
              ...product,
              product: selectedProductName,
              unit: productObj.unit,
            };
          }
          return product;
        });

        return { ...prevValues, products: newProducts };
      });
    };

    const addProductField = useCallback(() => {
      handleProductChange(inputValues.products.length, "", "");
      setSelectedProducts([...selectedProducts, ""]);
    }, [inputValues.products.length, handleProductChange]);

    const removeProductField = (index) => {
      setInputValues((prevValues) => {
        const products = prevValues.products.filter((_, i) => i !== index);
        const removedProduct = prevValues.products[index].product;

        // Update the selected products list: remove the product that is being deleted
        setSelectedProducts(
          selectedProducts.filter((item) => item !== removedProduct)
        );

        return { ...prevValues, products };
      });
    };

    useEffect(() => {
      if (recordForEdit) {
        setInputValues((prevValues) => ({
          ...prevValues,
          vendor_type: recordForEdit.type,
        }));
      }
    }, [recordForEdit]);

    useEffect(() => {
      getProduct();
    }, [recordForEdit]);

    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getAllRawMaterials("all");
        setProductOption(response.data);
        setLoading(false);
      } catch (err) {
        console.error("error potential", err);
        setLoading(false);
      }
    };

    const createChalanDetails = async (e) => {
      try {
        e.preventDefault();
        setLoading(true);
        const req = {
          created_by: inputValues.created_by,
          job_worker: inputValues.job_worker,
          vendor_type: inputValues.vendor_type,
          vendor_contact_person: inputValues.vendor_contact_person,
          buyer_account: inputValues.buyer_account,
          payment_terms: inputValues.payment_terms,
          delivery_term: inputValues.delivery_terms,
          schedule_date: inputValues.schedule_date,
          transporter_name: inputValues.transporter_name,
          transpotation_cost: parseFloat(inputValues.transpotation_cost),
          vechile_no: inputValues.vechile_no,
          products: inputValues.products || [],
        };

        const response = await InventoryServices.createChalan(req);
        if (response) {
          getAllVendorDetails(currentPage);
        }
        handleSuccess("Chalan created successfully");
        setTimeout(() => {
          setOpenPopup(false);
        }, 300);
        setLoading(false);
      } catch (error) {
        handleError(error);
        console.log("createing Challan error", error);
        setLoading(false);
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
        <CustomLoader open={loading} />

        <Box
          component="form"
          noValidate
          onSubmit={(e) => createChalanDetails(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Vendor"
                variant="outlined"
                value={recordForEdit.name || ""}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={recordForEdit.contacts}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  handleAutocompleteChange("vendor_contact_person", value.name)
                }
                label="Vendor Contact Person"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                disabled
                fullWidth
                size="small"
                label="Vendor Type"
                variant="outlined"
                value={inputValues.vendor_type || ""}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) =>
                  handleAutocompleteChange("buyer_account", value)
                }
                options={sellerData.map((option) => option.unit)}
                getOptionLabel={(option) => option}
                sx={{ minWidth: 300 }}
                label="Buyer Account"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) =>
                  setInputValues({ ...inputValues, delivery_terms: value })
                }
                options={deliveryTerms.map((option) => option)}
                getOptionLabel={(option) => option}
                sx={{ minWidth: 300 }}
                label="Delivery Terms"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                name="transporter_name"
                size="small"
                label="Transporter Name"
                variant="outlined"
                value={inputValues.transporter_name}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                type="number"
                name="transpotation_cost"
                size="small"
                label="Transportation Cost"
                variant="outlined"
                value={inputValues.transpotation_cost}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                name="vechile_no"
                size="small"
                label="Vehicle No"
                variant="outlined"
                value={inputValues.vechile_no}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                type="date"
                name="schedule_date"
                size="small"
                label="Schedule Date"
                variant="outlined"
                value={inputValues.schedule_date}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: today } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Root>
                <Divider>
                  <Chip label="PRODUCT" />
                </Divider>
              </Root>
            </Grid>
            {inputValues.products.map((input, index) => {
              return (
                <>
                  <Grid key={index} item xs={12} sm={3}>
                    <CustomAutocomplete
                      name="product"
                      size="small"
                      disablePortal
                      id={`combo-box-demo-${index}`}
                      value={input.product ? input.product : ""}
                      onChange={(event, value) =>
                        handleProductAutocompleteChange(index, value)
                      }
                      options={productOption.map((option) => option.name)}
                      getOptionLabel={(option) => option}
                      sx={{ minWidth: 300 }}
                      label="Product"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      name="unit"
                      size="small"
                      label="Unit"
                      variant="outlined"
                      value={input.unit ? input.unit : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      name="quantity"
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      value={input.quantity || ""}
                      onChange={(event) =>
                        handleProductChange(
                          index,
                          "quantity",
                          event.target.value
                        )
                      }
                    />
                  </Grid>

                  {/* <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    variant="outlined"
                    value={input.rate || ""}
                    onChange={(event) =>
                      handleProductChange(index, "rate", event.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    disabled
                    name="amount"
                    size="small"
                    label="Amount"
                    variant="outlined"
                    value={input.amount || ""}
                  />
                </Grid> */}
                  <Grid item xs={12} sm={1} alignContent="right">
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
                </>
              );
            })}

            <Grid item xs={12} sm={2} alignContent="right">
              <Button
                onClick={addProductField}
                variant="contained"
                sx={{ marginRight: "1em" }}
              >
                Add More...
              </Button>
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
      </>
    );
  }
);

// Data structure for Delivery Terms
const deliveryTerms = ["Ex-Work", "Ex - warehouse"];
