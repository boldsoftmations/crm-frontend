import {
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
  Typography,
  styled,
} from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import logo from "../../../Images/glutape logo.jpg";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import CustomTextField from "../../../Components/CustomTextField";
import { Popup } from "../../../Components/Popup";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

const UpdateCCF = ({ getAllCCFData, setOpenCCF, ViewData }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [documentId, setDocumentId] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [products, setProducts] = useState(ViewData.products || []);
  const [openPopup1, setOpenPopup1] = useState(false);
  const fileInputRef = useRef(null);
  const [ccf_id, setccf_id] = useState(null);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [localDocuments, setLocalDocuments] = useState(ViewData.document || []);
  const [inputvalue, setInputValue] = useState({
    source_of_complaint: ViewData.source_of_complaint,
    priority: ViewData.priority,
  });
  const ugrganecy = ["Critical", "Normal", "High"];
  const sourceOFComplaint = [
    "Customer Call",
    "Email",
    "WhatsApp",
    "Sales Visit",
    "Internal Detection",
    "Transporter Feedback",
  ];

  console.log("ViewData:", ViewData);
  // ================= FILE HANDLING =================
  const Root = styled("div")(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    "& > :not(style) + :not(style)": {
      marginTop: theme.spacing(2),
    },
  }));
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existingFiles = files.map((file) => file.name);

    const uniqueFiles = newFiles.filter(
      (file) => !existingFiles.includes(file.name),
    );

    setFiles((prev) => [...prev, ...uniqueFiles]);
    e.target.value = null;
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  useEffect(() => {
    if (ViewData && ViewData.document) {
      setLocalDocuments(ViewData.document);
    }
  }, [ViewData && ViewData.document]);

  // ================= UPLOAD DOCUMENT =================

  const handleUploadDocuments = async () => {
    try {
      if (files.length === 0) {
        handleError("No files selected");
        return;
      }

      setOpen(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);

        const fileType = file.type.split("/")[0];

        const mediaType =
          fileType === "image"
            ? "Photo"
            : fileType === "video"
              ? "Video"
              : "Other";

        formData.append("media_type", mediaType);
      });

      const response = await CustomerServices.uploadCCFdocument(formData);

      if (response.status === 200) {
        const uploadedDocs = response.data.data;

        setDocuments(uploadedDocs);
        const existingIds = ViewData.document.map(function (doc) {
          return doc.id;
        });

        const newIds = uploadedDocs.map(function (doc) {
          return doc.id;
        });

        setDocumentId(existingIds.concat(newIds));

        handleSuccess("Documents uploaded successfully");

        setFiles([]);
      }
    } catch (error) {
      handleError("Upload failed");
    } finally {
      setOpen(false);
    }
  };
  const handleAutoComplete = (name, value) => {
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteDocument = async () => {
    try {
      setOpen(true);

      const payload = {
        id: ViewData.id,
        document_id: ccf_id,
        document_type: "ccf",
      };

      await CustomerServices.DeleteCCFImage(payload);

      // ✅ FIX: use localDocuments instead of ViewData.document
      const updatedDocs = localDocuments.filter((doc) => doc.id !== ccf_id);

      setLocalDocuments(updatedDocs);

      handleSuccess("Document deleted successfully");

      setOpenPopup1(false);

      // optional: refresh backend data AFTER UI update
      await getAllCCFData();
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  // ================= UPDATE CCF =================

  const handleUpdateCCF = async () => {
    try {
      setOpen(true);
      if (!inputvalue.priority || !inputvalue.source_of_complaint) {
        handleError("Please fill all the required fields");
        setOpen(false);
        return;
      }
      const payload = {
        document: [
          ...localDocuments.map((doc) => doc.id), // existing (after delete)
          ...documents.map((doc) => doc.id), // newly uploaded
        ],
        priority: inputvalue.priority,
        source_of_complaint: inputvalue.source_of_complaint,
        products: products, // send full updated products
      };

      const response = await CustomerServices.CCFUpdate(ViewData.id, payload);

      handleSuccess(response.data.message || "CCF updated successfully");

      getAllCCFData();

      setOpenCCF(false);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = value;
    setProducts(updatedProducts);
  };

  const handleDelete = (row) => {
    setOpenPopup1(true);
    setccf_id(row.id);
  };

  console.log("Document", documents);
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
        <Box component="form" noValidate>
          <Paper sx={{ p: 2 }}>
            {/* HEADER */}

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <img src={logo} alt="logo" width={170} />
              </Grid>

              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: 800,
                  }}
                >
                  COMPLAINT FORM
                </h3>
              </Grid>
            </Grid>

            <Divider sx={{ mt: 2, mb: 2 }} />

            {/* FORM DATA */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Complain To"
                  size="small"
                  fullWidth
                  value={ViewData.department}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Complain For"
                  size="small"
                  fullWidth
                  value={ViewData.complain_for}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Complaint Type"
                  size="small"
                  fullWidth
                  value={ViewData.complain_type}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Customer"
                  size="small"
                  fullWidth
                  value={ViewData.customer}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  // label="Urgency Type"
                  name="urgency_type"
                  size="small"
                  fullWidth
                  value={inputvalue.priority}
                  options={ugrganecy}
                  onChange={(event, newvalue) =>
                    handleAutoComplete("priority", newvalue)
                  }
                  error={!inputvalue.priority}
                  helperText={!inputvalue.priority ? "Required" : ""}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Urgency Type"
                      error={!inputvalue.priority}
                      helperText={!inputvalue.priority ? "Required" : ""}
                    />
                  )}
                  // renderInput={<TextField required label="Urgency Type" />}

                  // disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  label="Source of Complaint"
                  name="source_of_complaint"
                  size="small"
                  fullWidth
                  value={inputvalue.source_of_complaint}
                  options={sourceOFComplaint}
                  onChange={(event, newValue) =>
                    handleAutoComplete("source_of_complaint", newValue)
                  }
                  error={!inputvalue.source_of_complaint}
                  helperText={!inputvalue.source_of_complaint ? "Required" : ""}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Source of Complaint"
                      error={!inputvalue.source_of_complaint}
                      helperText={
                        !inputvalue.source_of_complaint ? "Required" : ""
                      }
                    />
                  )}
                  // disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Seller Unit"
                  size="small"
                  fullWidth
                  value={ViewData.unit}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Batch No"
                  size="small"
                  fullWidth
                  value={ViewData.batch_nos.join(",")}
                  disabled
                />
              </Grid>

              {/* Complaint */}

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Nature of Complaint"
                  multiline
                  rows={4}
                  fullWidth
                  value={ViewData.complaint}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label="Application"
                  multiline
                  rows={4}
                  fullWidth
                  value={ViewData.application}
                  disabled
                />
              </Grid>

              {/* DOCUMENT UPLOAD */}

              {ViewData && localDocuments && localDocuments.length > 0 && (
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Uploaded Documents
                  </Typography>

                  <List sx={{ display: "flex", flexWrap: "wrap" }}>
                    {localDocuments.map((doc, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          width: 150,
                          flexDirection: "column",
                          background: "#f5f7fa",
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          m: 1,
                          p: 1,
                          position: "relative", // ✅ IMPORTANT
                        }}
                      >
                        <IconButton
                          onClick={() => handleDelete(doc)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            color: "black",
                            background: "white",
                            "&:hover": {
                              background: "#f8d7da",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <img
                          src={doc.file}
                          alt={doc.name}
                          style={{
                            width: "100%",
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />

                        <ListItemText
                          primary={doc.name || "Document"}
                          sx={{
                            textAlign: "center",
                            mt: 1,
                            fontSize: 12,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />

                  {/* Select Button */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography fontWeight={500}>Attach Document :</Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleClick}
                    >
                      Select Document
                    </Button>
                  </Box>

                  {/* Selected Files */}
                  {files.length > 0 && (
                    <>
                      <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                        Selected Files
                      </Typography>

                      <List sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {files.map((file, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              width: 150,
                              flexDirection: "column",
                              alignItems: "center",
                              background: "#e4f1fe",
                              borderRadius: 1,
                              p: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: "100px",
                                }}
                              >
                                {file.name}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() => removeFile(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                                marginTop: 6,
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  {/* Uploaded Documents */}
                  {documents.length > 0 && (
                    <>
                      <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                        Uploaded Documents
                      </Typography>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {documents.map((doc, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 150,
                              background: "#f5f7fa",
                              borderRadius: 1,
                              p: 1,
                              textAlign: "center",
                            }}
                          >
                            <img
                              src={doc.file}
                              alt={`doc-${index}`}
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>

              {/* UPDATE BUTTON */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={handleUploadDocuments}
                >
                  Upload Document
                </Button>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <Root>
                  <Divider>
                    <Chip label="PRODUCT" />
                  </Divider>
                </Root>
              </Grid>
              {ViewData &&
                ViewData.products.length > 0 &&
                ViewData.products.map((input, index) => {
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
                          // disabled={true}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <CustomTextField
                          fullWidth
                          type="number"
                          name="quantity"
                          size="small"
                          label="Quantity"
                          variant="outlined"
                          value={products[index].quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
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
                          value={input.unit}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </React.Fragment>
                  );
                })}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateCCF}
                >
                  Update CCF
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>

      <Popup
        title="Delete Confirmation"
        openPopup={openPopup1}
        setOpenPopup={setOpenPopup1}
      >
        <Box
          sx={{
            minWidth: { xs: "100%", sm: 400 },
            p: 1,
          }}
        >
          {/* Message */}
          {/* <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#d32f2f",
              mb: 1,
            }}
          >
            Delete Image
          </Typography> */}

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.8,
            }}
          >
            Are you sure you want to delete this image?
            <br />
            This action cannot be undone.
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setOpenPopup1(false)}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteDocument}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Popup>
    </>
  );
};

export default UpdateCCF;
