import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../Images/glutape logo.jpg";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import InvoiceServices from "../../services/InvoiceService";
import CustomTextField from "../../Components/CustomTextField";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomerServices from "../../services/CustomerService";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const CreateCCF = ({ getAllCCFData, setOpenCCF }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [seller_units, setseller_units] = useState([]);
  const fileInputRef = useRef(null);
  const [invoiceNoOption, setInvoiceNoOption] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [batch_no, setBatch_no] = useState([]);
  const [documentId, setDocumentId] = useState([]);
  const [products, setProducts] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [inputValue, setInputValue] = useState({
    department: "",
    complain_for: "",
    complain_type: "",
    customer: "",
    unit: "",
    invoices: [],
    batch_nos: [],
    complaint: "",
    application: "",
    problem: "",
    document: documentId ? documentId : [],
    products: products,
  });

  console.log(inputValue);
  const [customer, setCustomer] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setseller_units(response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
    } finally {
      setOpen(false);
    }
  };

  const GetCustomerData = useCallback(async () => {
    try {
      setOpen(true);
      const res = await InvoiceServices.getCustomersList();
      setCustomer(res.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    getAllSellerAccountsDetails();
    GetCustomerData();
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existingFiles = files.map((file) => file.name);
    const uniqueFiles = newFiles.filter(
      (file) => !existingFiles.includes(file.name)
    );
    setFiles([...files, ...uniqueFiles]);
    e.target.value = null;
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  const handleUnitchange = async (event, value) => {
    setInputValue((prev) => ({
      ...prev,
      unit: value,
    }));
    try {
      setOpen(true);
      const response = await InvoiceServices.getInvoiceByCustomerAndSellerUnit(
        inputValue.customer,
        value
      );
      setInvoiceNoOption(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  const handleDepartmentChange = async (e, value) => {
    setInputValue((prev) => ({ ...prev, complain_for: value }));
    try {
      setOpen(true);
      const response = await CustomerServices.getAllComplaintsListData(
        "list",
        value
      );
      setDepartmentData(response.data);
    } catch (e) {
      handleError(e);
      console.log(e);
    } finally {
      setOpen(false);
    }
  };
  const handleInvoiceSelection = (event, value) => {
    const invoiceNumbers = value.map((v) => v.invoice_no);
    const selectedProducts = value.flatMap((invoice) =>
      invoice.products.map((product) => ({
        product: product.product,
        quantity: product.quantity,
        source_list: product.source_list.map((source) => source.source_key), // Extracting only the 'source' key
      }))
    );

    const batch_nos = selectedProducts.flatMap(
      (product) => product.source_list
    );
    setBatch_no(batch_nos);
    setProducts(selectedProducts);
    setInputValue((prev) => ({
      ...prev,
      invoices: invoiceNumbers,
      products: selectedProducts,
    }));
  };

  const SubmitComplaint = async (e) => {
    e.preventDefault();

    try {
      let modifyproducts = products.map((product) => {
        return {
          product: product.product,
          quantity: product.quantity,
        };
      });
      const payload = { ...inputValue, products: modifyproducts };
      const response = await CustomerServices.createCCFComplaintForm(payload);
      handleSuccess(response.message || "Complaint submitted successfully");
      getAllCCFData();
      setOpenCCF(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleUploadDocuments = async () => {
    try {
      if (files.length === 0) {
        alert("No files selected for upload.");
        return;
      }

      setOpen(true);
      const formData = new FormData();

      // Append each file to the FormData object
      files.forEach((file) => {
        formData.append("file", file);

        // Determine media type based on the file MIME type or extension
        const fileType = file.type.split("/")[0]; // This gives either "image" or "video"
        const mediaType =
          fileType === "image"
            ? "Photo"
            : fileType === "video"
              ? "Video"
              : "Other";

        // Append media type for each file
        formData.append("media_type", mediaType);
      });

      const response = await CustomerServices.uploadCCFdocument(formData);
      console.log("response", response.data.data);
      if (response.status === 200) {
        handleSuccess("Documents uploaded successfully");
        setDocuments(response.data.data);
        // Extract IDs from the response and update state
        const documentIds = response.data.data.map((doc) => doc.id);
        setDocumentId(documentIds);

        // Update the inputValue state with the document IDs
        setInputValue((prev) => ({
          ...prev,
          document: documentIds ? documentIds : [],
        }));

        setFiles([]); // Clear files after successful upload
      } else {
        handleError("Failed to upload documents");
      }
    } catch (error) {
      console.log(error);
      handleError("An error occurred during the upload");
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
      <Grid container spacing={2} style={{ width: "100%", margin: 0 }}>
        <Box component="form" noValidate onSubmit={SubmitComplaint}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Box>
              <Grid container spacing={2} alignItems="center">
                {/* Title Text centered */}
                <Grid item xs={12} sm={4}>
                  <img src={logo} alt="logo" width={170} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ textAlign: { xs: "center", md: "center" } }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      color: "rgb(34, 34, 34)",
                      fontWeight: 800,
                    }}
                  >
                    COMPLAINT FORM
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            {/* Form Fields */}
            <Grid container spacing={2} style={{ marginTop: "12px" }}>
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  name="department"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={complaintType}
                  onChange={(e, value) => {
                    setInputValue((prev) => ({ ...prev, department: value }));
                  }}
                  getOptionLabel={(option) => option}
                  fullWidth
                  label="Complaint to"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  name="complain_for"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={ComplaintsFor}
                  onChange={handleDepartmentChange}
                  getOptionLabel={(option) => option}
                  fullWidth
                  label="Complaint for"
                />
              </Grid>
              {inputValue.complain_for === "Account" && (
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="problem"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={departmentData.map((option) => option.name)}
                    onChange={(event, value) => {
                      setInputValue((prev) => ({ ...prev, problem: value }));
                    }}
                    getOptionLabel={(option) => option}
                    fullWidth
                    label="Complaint Problem"
                  />
                </Grid>
              )}
              {inputValue.complain_for === "Product" && (
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="problem"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={departmentData.map((option) => option.name)}
                    onChange={(event, value) => {
                      setInputValue((prev) => ({ ...prev, problem: value }));
                    }}
                    getOptionLabel={(option) => option}
                    fullWidth
                    label="Complaint Problem"
                  />
                </Grid>
              )}
              {inputValue.complain_for === "Sales Person" && (
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="problem"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={departmentData.map((option) => option.name)}
                    onChange={(event, value) => {
                      setInputValue((prev) => ({ ...prev, problem: value }));
                    }}
                    getOptionLabel={(option) => option}
                    fullWidth
                    label="Complaint Problem"
                  />
                </Grid>
              )}
              {inputValue.complain_for === "Dispatch and Logistic" && (
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="problem"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={departmentData.map((option) => option.name)}
                    onChange={(event, value) => {
                      setInputValue((prev) => ({ ...prev, problem: value }));
                    }}
                    getOptionLabel={(option) => option}
                    fullWidth
                    label="Complaint Problem"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  name="complain_type"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={ComplaintsTypes}
                  getOptionLabel={(option) => option}
                  onChange={(event, value) => {
                    setInputValue((prev) => ({
                      ...prev,
                      complain_type: value,
                    }));
                  }}
                  fullWidth
                  label="Complaint Type"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  name="customer"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={customer}
                  getOptionLabel={(option) => option}
                  onChange={(event, value) => {
                    setInputValue((prev) => ({ ...prev, customer: value }));
                  }}
                  fullWidth
                  label="Customer"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  name="unit"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={seller_units.map((option) => option.unit)}
                  getOptionLabel={(option) => option}
                  onChange={handleUnitchange}
                  fullWidth
                  label="Seller Unit"
                />
              </Grid>
              {invoiceNoOption && invoiceNoOption.length > 0 && (
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    multiple
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    onChange={handleInvoiceSelection}
                    options={invoiceNoOption}
                    getOptionLabel={(option) => option.invoice_no || ""}
                    renderInput={(params) => (
                      <CustomTextField {...params} label="Invoice No" />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  multiple
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={batch_no}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) =>
                    setInputValue((prev) => ({ ...prev, batch_nos: value }))
                  }
                  renderInput={(params) => (
                    <CustomTextField {...params} label="Batch No" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}></Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nature of Complaint : (Describe in detail)"
                  variant="outlined"
                  margin="normal"
                  name="complaint"
                  multiline
                  rows={4}
                  onChange={(e) =>
                    setInputValue((prev) => ({
                      ...prev,
                      complaint: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Application : (Describe in detail)"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  onChange={(e) =>
                    setInputValue((prev) => ({
                      ...prev,
                      application: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      accept="image/*,video/*"
                      ref={fileInputRef}
                    />
                    <span
                      style={{
                        fontSize: "16px",
                        opacity: "0.9",
                        fontWeight: "bold",
                      }}
                    >
                      Attach Document :{" "}
                    </span>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      onClick={handleClick}
                    >
                      Select Document
                    </Button>
                  </div>
                  <div>
                    {files.length > 0 && (
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{
                          opacity: ".9",
                          fontSize: "16px",
                        }}
                      >
                        Selected Files:
                      </Typography>
                    )}
                    {files.length > 0 ? (
                      <List style={{ display: "flex", flexWrap: "wrap" }}>
                        {files.map((file, index) => (
                          <ListItem
                            key={index}
                            divider
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              width: "150px",
                              margin: "10px",
                              backgroundColor: "#e4f1fe",
                              borderRadius: "3px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <ListItemText
                                primary={file.name}
                                primaryTypographyProps={{
                                  style: { fontSize: "12px" },
                                }}
                              />
                              <IconButton
                                edge="end"
                                onClick={() => removeFile(index)}
                                style={{ marginTop: "10px" }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                marginTop: "10px",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Grid>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "20px",
                          }}
                        >
                          {documents &&
                            documents.map((doc, index) => (
                              <div
                                key={index}
                                style={{
                                  width: "200px", // Set a fixed width for each media item
                                  textAlign: "center",
                                }}
                              >
                                <img
                                  src={doc.file}
                                  alt={`Media ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    cursor: "pointer",
                                  }}
                                />
                              </div>
                            ))}
                        </div>
                      </Grid>
                    )}
                  </div>
                </div>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={handleUploadDocuments}
                >
                  Submit Document
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Root>
                  <Divider>
                    <Chip label="PRODUCT" />
                  </Divider>
                </Root>
              </Grid>
              {products &&
                products.length > 0 &&
                products.map((input, index) => {
                  return (
                    <React.Fragment key={index}>
                      {" "}
                      {/* Use React.Fragment with a key for each item */}
                      <Grid item xs={12} sm={4}>
                        <CustomTextField
                          fullWidth
                          name="product"
                          size="small"
                          label="Product"
                          variant="outlined"
                          value={input.product}
                          onChange={(event) =>
                            setProducts((prevProducts) =>
                              prevProducts.map((p, i) =>
                                i === index
                                  ? { ...p, product: event.target.value }
                                  : p
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <CustomTextField
                          fullWidth
                          name="quantity"
                          size="small"
                          label="Quantity"
                          variant="outlined"
                          value={input.quantity}
                          onChange={(event) =>
                            setProducts((prevProducts) =>
                              prevProducts.map((p, i) =>
                                i === index
                                  ? { ...p, quantity: event.target.value }
                                  : p
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          onClick={() => removeFields(index)}
                          variant="contained"
                        >
                          Remove
                        </Button>
                      </Grid>
                    </React.Fragment>
                  );
                })}
              {/* Buttons */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  style={{ marginRight: "10px" }}
                >
                  Submit Complaint
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>
    </>
  );
};

export default CreateCCF;
const complaintType = ["Account", "Factory"];
const ComplaintsFor = [
  "Account",
  "Product",
  "Dispatch and Logistic",
  "Sales Person",
];
const ComplaintsTypes = ["Claim", "Warning"];
