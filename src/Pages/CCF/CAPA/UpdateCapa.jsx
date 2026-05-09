import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
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
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { Popup } from "../../../Components/Popup";

const UpdateCapa = ({ recordForEdit, setOpenCapa, getAllCCFData }) => {
  const { handleSuccess, handleError } = useNotificationHandling();

  const [formData, setFormData] = useState({
    complaint: (recordForEdit && recordForEdit.complaint) || "",
    cap: (recordForEdit && recordForEdit.cap) || "",
    pap: (recordForEdit && recordForEdit.pap) || "",
    root_cause_why1: (recordForEdit && recordForEdit.root_cause_why1) || "",
    root_cause_why2: (recordForEdit && recordForEdit.root_cause_why2) || "",
    root_cause_why3: (recordForEdit && recordForEdit.root_cause_why3) || "",
    root_cause_why4: (recordForEdit && recordForEdit.root_cause_why4) || "",
    root_cause_why5: (recordForEdit && recordForEdit.root_cause_why5) || "",
    root_cause_category:
      (recordForEdit && recordForEdit.root_cause_category) || "",
    final_root_cause: (recordForEdit && recordForEdit.final_root_cause) || "",
    ccf_status: "Capa Revision Required",
    document: [],
    status: "Pending",
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [rootCauses, setRootCause] = useState([]);
  const [catogories, setCategories] = useState("");
  const [rootCauseId, setRootCauseId] = useState(null);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [ccf_id, setccf_id] = useState(null);
  const [localDocuments, setLocalDocuments] = useState(
    (recordForEdit && recordForEdit.document) || [],
  );

  const fileInputRef = useRef(null);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(function (prev) {
      return Object.assign({}, prev, { [name]: value });
    });
    if (errors[name]) {
      setErrors(function (prev) {
        return Object.assign({}, prev, { [name]: "" });
      });
    }
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData(function (prev) {
      return Object.assign({}, prev, { [name]: value });
    });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existingNames = files.map(function (f) {
      return f.name;
    });
    const uniqueFiles = newFiles.filter(function (f) {
      return !existingNames.includes(f.name);
    });
    setFiles(function (prev) {
      return prev.concat(uniqueFiles);
    });
    e.target.value = null;
  };

  const removeFile = (index) => {
    setFiles(function (prev) {
      return prev.filter(function (_, i) {
        return i !== index;
      });
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = (row) => {
    setOpenPopup1(true);
    setccf_id(row.id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ─── API Calls ────────────────────────────────────────────────────────────────

  const getRootCause = async () => {
    try {
      const response = await CustomerServices.getRootCauseList();
      setRootCause(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoriesLists = async () => {
    if (!rootCauseId) return;
    try {
      setLoader(true);
      const response = await CustomerServices.getCategoryList(rootCauseId);
      const categoryName =
        response.data.data[0] && response.data.data[0].name
          ? response.data.data[0].name
          : "";
      setCategories(categoryName);
      setFormData(function (prev) {
        return Object.assign({}, prev, { root_cause_category: categoryName });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleUploadDocuments = async () => {
    if (files.length === 0) {
      alert("No files selected for upload.");
      return;
    }
    try {
      setLoader(true);
      const uploadData = new FormData();
      files.forEach(function (file) {
        uploadData.append("file", file);
        if (file.type.startsWith("image")) {
          uploadData.append("media_type", "Photo");
        } else if (file.type.startsWith("video")) {
          uploadData.append("media_type", "Video");
        }
      });

      const response = await CustomerServices.uploadCCFdocument(uploadData);

      if (response.status === 200) {
        const documentIds = response.data.data.map(function (doc) {
          return doc.id;
        });
        setFormData(function (prev) {
          return Object.assign({}, prev, { document: documentIds });
        });
        setFiles([]);
        setMessage(
          response.data.message || "Document(s) submitted successfully",
        );
        setSeverity("success");
        setOpen(true);
      } else {
        setMessage("Error uploading document(s)");
        setSeverity("error");
        setOpen(true);
      }
    } catch (error) {
      setMessage(error.message || "An error occurred during the upload");
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      setLoader(true);
      const payload = {
        id: recordForEdit.id,
        document_id: ccf_id,
        document_type: "capa",
      };
      await CustomerServices.DeleteCCFImage(payload);
      setLocalDocuments(function (prev) {
        return prev.filter(function (doc) {
          return doc.id !== ccf_id;
        });
      });
      handleSuccess("Document deleted successfully");
      setOpenPopup1(false);
      await getAllCCFData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localDocuments.length === 0 && formData.document.length === 0) {
      setMessage("Please upload at least one document before submitting.");
      setSeverity("error");
      setOpen(true);
      return;
    }

    try {
      setLoader(true);
      const response = await CustomerServices.UpdateCapa(
        recordForEdit && recordForEdit.id,
        formData,
      );
      setMessage(response.data.message);
      setSeverity("success");
      setOpen(true);
      getAllCCFData();
      setOpenCapa(false);
    } catch (error) {
      const errMsg =
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
          ? error.response.data.message
          : error.message || "Error updating CAPA";
      setMessage(errMsg);
      setSeverity("error");
      setOpen(true);
    } finally {
      setLoader(false);
    }
  };

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(function () {
    getRootCause();
  }, []);

  useEffect(
    function () {
      if (!rootCauseId) return;
      getCategoriesLists();
    },
    [rootCauseId],
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <CustomSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
      />
      <CustomLoader open={loader} />

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="Complaint No."
              value={(recordForEdit && recordForEdit.id) || ""}
              inputProps={{ readOnly: true }}
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="Customer Name"
              value={
                recordForEdit &&
                recordForEdit.ccf_details &&
                recordForEdit.ccf_details.customer
                  ? recordForEdit.ccf_details.customer
                  : ""
              }
              inputProps={{ readOnly: true }}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Batch No"
              value={(recordForEdit && recordForEdit.batch_no) || ""}
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
              options={
                recordForEdit && recordForEdit.invoices
                  ? recordForEdit.invoices
                  : []
              }
              value={
                recordForEdit && recordForEdit.invoices
                  ? recordForEdit.invoices
                  : []
              }
              getOptionLabel={function (option) {
                return option;
              }}
              renderInput={function (params) {
                return <CustomTextField {...params} label="Invoice No" />;
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider>
              <Chip label="PRODUCT" />
            </Divider>
          </Grid>

          {recordForEdit &&
            recordForEdit.products &&
            recordForEdit.products.map(function (input, index) {
              return (
                <React.Fragment key={index}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Product"
                      value={input.product}
                      inputProps={{ readOnly: true }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Quantity"
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

          {["1", "2", "3", "4", "5"].map(function (n) {
            return (
              <Grid item xs={12} key={n}>
                <TextField
                  fullWidth
                  rows={4}
                  size="small"
                  label={"Root Cause (" + n + " Whys)"}
                  name={"root_cause_why" + n}
                  value={formData["root_cause_why" + n]}
                  onChange={handleChange}
                  error={!!errors["root_cause_why" + n]}
                  required
                />
              </Grid>
            );
          })}

          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              fullWidth
              name="final_root_cause"
              size="small"
              disablePortal
              value={formData.final_root_cause || ""}
              options={rootCauses.map(function (data) {
                return data.name;
              })}
              onChange={function (event, value) {
                handleAutocompleteChange("final_root_cause", value);
                const selected = rootCauses.find(function (opt) {
                  return opt.name === value;
                });
                if (selected) {
                  setRootCauseId(selected.category__id);
                  setFormData(function (prev) {
                    return Object.assign({}, prev, { root_cause_category: "" });
                  });
                } else {
                  setRootCauseId(null);
                  setCategories("");
                  setFormData(function (prev) {
                    return Object.assign({}, prev, { root_cause_category: "" });
                  });
                }
              }}
              error={!formData.final_root_cause}
              helperText={!formData.final_root_cause ? "Required" : ""}
              renderInput={function (params) {
                return (
                  <CustomTextField
                    {...params}
                    label="Root Cause"
                    error={!formData.final_root_cause}
                    helperText={!formData.final_root_cause ? "Required" : ""}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="root_cause_category"
              label="Root Cause Category"
              value={
                catogories
                  ? catogories
                  : (recordForEdit && recordForEdit.root_cause_category) || ""
              }
              disabled
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

          {localDocuments.length > 0 && (
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Uploaded Documents
              </Typography>
              <List sx={{ display: "flex", flexWrap: "wrap" }}>
                {localDocuments.map(function (doc, index) {
                  return (
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
                        position: "relative",
                      }}
                    >
                      <IconButton
                        onClick={function () {
                          handleDelete(doc);
                        }}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          color: "black",
                          background: "white",
                          "&:hover": { background: "#f8d7da" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <img
                        src={doc.file}
                        alt={doc.name || "document"}
                        style={{
                          width: "100%",
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <ListItemText
                        primary={doc.name || "Document"}
                        sx={{ textAlign: "center", mt: 1, fontSize: 12 }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
          )}

          <Grid item xs={12}>
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
                  Attach Document:
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

              {files.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ opacity: ".9", fontSize: "16px" }}
                  >
                    Selected Files:
                  </Typography>
                  <List style={{ display: "flex", flexWrap: "wrap" }}>
                    {files.map(function (file, index) {
                      return (
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
                              onClick={function () {
                                removeFile(index);
                              }}
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
                      );
                    })}
                  </List>
                </>
              )}
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
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Submit
          </Button>
        </Grid>
      </Box>

      <Popup
        title="Delete image"
        openPopup={openPopup1}
        setOpenPopup={setOpenPopup1}
      >
        <Box>
          <Typography>
            Are you sure you want to delete this document?
          </Typography>
          <Button
            onClick={function () {
              setOpenPopup1(false);
            }}
          >
            No
          </Button>
          <Button onClick={handleDeleteDocument}>Yes</Button>
        </Box>
      </Popup>
    </>
  );
};

export default UpdateCapa;
