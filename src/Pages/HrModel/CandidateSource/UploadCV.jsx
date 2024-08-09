import React, { useState } from "react";
import { Button, IconButton, Tooltip, Box, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import Hr from "../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";

const UploadCv = ({ candidate, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      // Generate preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("cv", selectedFile);
      formData.append("email", candidate.email);
      formData.append("contact", candidate.contact);

      try {
        setLoading(true);
        const response = await Hr.updateApplicant(candidate.id, formData);
        console.log("CV upload response", response.data);
        setAlertMsg({
          message: "CV uploaded successfully",
          open: true,
          severity: "success",
        });
        onUploadSuccess();
        setPreviewUrl(null); // Clear preview after upload
        setSelectedFile(null); // Clear selected file
      } catch (error) {
        setAlertMsg({
          message: "Failed to upload CV",
          open: true,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setAlertMsg({
        message: "Please select a file first",
        open: true,
        severity: "warning",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setAlertMsg({ open: false });
  };

  return (
    <div>
      <CustomLoader open={loading} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleCloseSnackbar}
      />

      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="upload-cv-input"
      />
      <label htmlFor="upload-cv-input">
        <Tooltip title="Select CV">
          <IconButton color="primary" component="span">
            <UploadIcon />
          </IconButton>
        </Tooltip>
      </label>

      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={handleFileUpload}
        style={{ marginLeft: "5px" }}
      >
        Submit
      </Button>

      {previewUrl && (
        <Box mt={2}>
          {selectedFile.type.startsWith("image/") ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ) : selectedFile.type === "application/pdf" ? (
            <Typography>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                Preview PDF
              </a>
            </Typography>
          ) : (
            <Typography>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                Preview File
              </a>
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
};

export default UploadCv;
