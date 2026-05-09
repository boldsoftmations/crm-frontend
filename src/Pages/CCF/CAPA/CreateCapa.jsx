import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const CreateCapa = ({ recordForEdit, setOpenCapa, getAllCCFData }) => {
  const [documentId, setDocumentId] = useState([]);
  const [formData, setFormData] = useState({
    ccf: recordForEdit && recordForEdit.id,
    complaint: (recordForEdit && recordForEdit.complaint) || "",

    cap: "",
    pap: "",
    root_cause_why1: "",
    root_cause_why2: "",
    root_cause_why3: "",
    root_cause_why4: "",
    root_cause_why5: "",
    root_cause_category: "",
    final_root_cause: "",
    ccf_status: "Pending Capa Approval",
    document: documentId ? documentId : [],
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [rootCauses, setRootCause] = useState([]);
  const [catogaries, setCategories] = useState([]);
  const [rootCauseId, setRootCauseId] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const getCategoriesLists = async () => {
    try {
      if (!rootCauseId) return;
      setLoader(true);

      const response = await CustomerServices.getCategoryList(rootCauseId);
      const categoryName = response.data.data[0].name || "";

      setCategories(categoryName);

      // ✅ Sync formData too
      setFormData((prev) => ({
        ...prev,
        root_cause_category: categoryName,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (!rootCauseId) return; // ✅ STOP if empty
    getCategoriesLists();
  }, [rootCauseId]);

  const handleAutocompleteChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existingFiles = files.map((file) => file.name);
    const uniqueFiles = newFiles.filter(
      (file) => !existingFiles.includes(file.name),
    );
    setFiles([...files, ...uniqueFiles]);
    e.target.value = null;
  };
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleUploadDocuments = async () => {
    try {
      console.log("length is :", files.length);
      if (files.length === 0) {
        alert("No files selected for upload.");
        return;
      }
      setLoader(true);
      const formData = new FormData();

      // Append each file to the FormData object and detect file type (image or video)
      files.forEach((file) => {
        formData.append("file", file);

        // Detect media type based on file type
        if (file.type.startsWith("image")) {
          formData.append("media_type", "Photo");
        } else if (file.type.startsWith("video")) {
          formData.append("media_type", "Video");
        }
      });

      const response = await CustomerServices.uploadCCFdocument(formData);

      if (response.status === 200) {
        setMessage(
          response.data.message || "Document(s) submitted successfully",
        );
        setSeverity("success"); // Change severity to success
        setOpen(true);

        // Extract IDs from the response and update state
        const documentIds = response.data.data.map((doc) => doc.id);
        setDocumentId(documentIds);

        // Update the inputValue state with the document IDs
        setFormData((prev) => ({
          ...prev,
          document: documentIds ? documentIds : [],
        }));
        setFiles([]); // Clear files after successful upload
      } else {
        setMessage("Error creating CAPA upload");
        setSeverity("error");
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message || "An error occurred during the upload");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoader(false);
    }
  };
  const getRootCause = async () => {
    try {
      const response = await CustomerServices.getRootCauseList();
      setRootCause(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRootCause();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.document.length === 0) {
      setMessage(
        "Please upload at least one document before submitting the form.",
      );
      setSeverity("error");
      setOpen(true);
      return;
    }

    try {
      setLoader(true);
      const response = await CustomerServices.CreateCapa(formData);
      setMessage(response.data.message);
      setSeverity("success");
      setOpen(true);
      setLoader(false);
      getAllCCFData(); // Refresh CCF data after creating CAPA
      setOpenCapa(false); // Close the form dialog if submission is successful
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message || "Error creating CPA");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoader(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <CustomSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
      <CustomLoader open={loader} />
      <Card elevation={3} sx={{ marginTop: 1 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Complaint No."
                  name="ccf"
                  value={formData.ccf}
                  onChange={handleChange}
                  inputProps={{ readOnly: true }}
                  error={!!errors.ccf}
                  helperText={errors.ccf}
                  disabled
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Customer Name."
                  value={recordForEdit && recordForEdit.customer}
                  inputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <CustomAutocomplete
                  fullWidth
                  multiple
                  inputProps={{ readOnly: true }}
                  disabled
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={
                    recordForEdit && recordForEdit.batch_nos
                      ? recordForEdit.batch_nos
                      : []
                  } // Ensure options are set properly
                  value={
                    recordForEdit && recordForEdit.batch_nos
                      ? recordForEdit.batch_nos
                      : []
                  } // Set the value to all options
                  getOptionLabel={(option) => option} // Adjusted to get the label correctly
                  renderInput={(params) => (
                    <CustomTextField {...params} label="Batch No" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomAutocomplete
                  fullWidth
                  multiple
                  inputProps={{ readOnly: true }}
                  disabled
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={
                    recordForEdit && recordForEdit.invoices
                      ? recordForEdit.invoices
                      : []
                  }
                  value={
                    recordForEdit && recordForEdit.invoices
                      ? recordForEdit.invoices
                      : []
                  } // Set the value to all options
                  getOptionLabel={(option) => option} // Adjusted to get the label correctly
                  renderInput={(params) => (
                    <CustomTextField {...params} label="Invoice No" />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider>
                  <Chip label="PRODUCT" />
                </Divider>
              </Grid>
              {recordForEdit &&
                recordForEdit.products &&
                recordForEdit.products.map((input, index) => {
                  return (
                    <React.Fragment key={index}>
                      {" "}
                      {/* Use React.Fragment with a key for each item */}
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          fullWidth
                          name="product"
                          size="small"
                          label="Product"
                          variant="outlined"
                          value={input.product}
                          inputProps={{ readOnly: true }}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          fullWidth
                          name="quantity"
                          size="small"
                          label="Quantity"
                          variant="outlined"
                          value={input.quantity}
                          inputProps={{ readOnly: true }}
                          disabled
                        />
                      </Grid>
                    </React.Fragment>
                  );
                })}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Complaint"
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleChange}
                  error={!!errors.complaint}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (1 Whys)"
                  name="root_cause_why1"
                  value={formData.root_cause_why1}
                  onChange={handleChange}
                  error={!!errors.root_cause_why1}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (2 Whys)"
                  name="root_cause_why2"
                  value={formData.root_cause_why2}
                  onChange={handleChange}
                  error={!!errors.root_cause_why2}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (3 Whys)"
                  name="root_cause_why3"
                  value={formData.root_cause_why3}
                  onChange={handleChange}
                  error={!!errors.root_cause_why3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (4 Whys)"
                  name="root_cause_why4"
                  value={formData.root_cause_why4}
                  onChange={handleChange}
                  error={!!errors.root_cause_why4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label="Root Cause (5 Whys)"
                  name="root_cause_why5"
                  value={formData.root_cause_why5}
                  onChange={handleChange}
                  error={!!errors.root_cause_why5}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomAutocomplete
                  fullWidth
                  name="final_root_cause"
                  size="small"
                  disablePortal
                  value={formData.final_root_cause || ""}
                  options={rootCauses && rootCauses.map((data) => data.name)}
                  onChange={(event, value) => {
                    handleAutocompleteChange("final_root_cause", value);

                    const selected = rootCauses.find(
                      (option) => option.name === value,
                    );

                    if (selected) {
                      setRootCauseId(selected.category__id);

                      // ✅ RESET CATEGORY WHEN ROOT CAUSE CHANGES
                      setFormData((prev) => ({
                        ...prev,
                        root_cause_category: "",
                      }));
                    } else {
                      setRootCauseId(null);
                    }
                  }}
                  error={!formData.final_root_cause}
                  helperText={!formData.final_root_cause ? "Required" : ""}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Root Cause"
                      error={!formData.final_root_cause}
                      helperText={!formData.final_root_cause ? "Required" : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  name="root_cause_category"
                  size="small"
                  label="Root Cause Category"
                  variant="outlined"
                  value={catogaries || ""}
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Corrective Action Plan"
                  name="cap"
                  value={formData.cap}
                  onChange={handleChange}
                  error={!!errors.cap}
                  helperText={errors.cap}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Preventive Action Plan"
                  name="pap"
                  value={formData.pap}
                  onChange={handleChange}
                  error={!!errors.pap}
                  helperText={errors.pap}
                  required
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
                    {files.length > 0 && (
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
            </Grid>
            <Grid sx={12} style={{ marginTop: "2rem" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateCapa;
