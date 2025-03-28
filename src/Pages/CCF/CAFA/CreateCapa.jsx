import React, { useRef, useState } from "react";
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

const CreateCapa = ({ recordForEdit, setOpenCapa }) => {
  const [documentId, setDocumentId] = useState([]);
  const [formData, setFormData] = useState({
    ccf: recordForEdit && recordForEdit.id,
    complaint: (recordForEdit && recordForEdit.complaint) || "",
    root_cause: "",
    cap: "",
    pap: "",
    document: documentId ? documentId : [],
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existingFiles = files.map((file) => file.name);
    const uniqueFiles = newFiles.filter(
      (file) => !existingFiles.includes(file.name)
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
      if (files.length === 0) {
        alert("No files selected for upload.");
        return;
      }
      setOpen(true);
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
          response.data.message || "Document(s) submitted successfully"
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
      setOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const response = await CustomerServices.CreateCapa(formData);
      setMessage(response.data.message);
      setSeverity("success");
      setOpen(true);
      setLoader(false);
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
                  } // Ensure options are set properly
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
                  helperText={errors.complaint}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Root Cause (5 Whys)"
                  name="root_cause"
                  value={formData.root_cause}
                  onChange={handleChange}
                  error={!!errors.root_cause}
                  helperText={errors.root_cause}
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
