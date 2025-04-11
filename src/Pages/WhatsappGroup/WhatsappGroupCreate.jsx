import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CustomTextField from "../../Components/CustomTextField";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomerServices from "../../services/CustomerService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

export const WhatsappGroupCreate = ({ setOpenPopup, refreshData }) => {
  const [whatsappGroup, setWhatsappGroup] = useState({
    type_of_customer: "",
  });
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [filter, setFilter] = useState("message");
  const [errorMessage, setErrorMessage] = useState("");
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    setErrorMessage("");
    if (file.type.startsWith("video/") && file.size > 15728640) {
      setErrorMessage("Error: Video size must be less than or equal to 15MB.");
      setUploadedFile(null);
      setFilePreview(null);
      return;
    }

    setUploadedFile(file);
    setIsPdf(file.type === "application/pdf" || file.type.startsWith("video/"));

    if (
      file &&
      (file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        file.type.startsWith("video/"))
    ) {
      try {
        const fileURL = URL.createObjectURL(file);
        setFilePreview(fileURL);
      } catch (error) {
        console.error("Error converting file to base64", error);
      }
    } else {
      setFilePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleInputChange = (event, newValue, name) => {
    if (name) {
      setWhatsappGroup((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      const { name, value } = event.target;
      setWhatsappGroup((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const createWhatsappGroup = async (e) => {
    e.preventDefault();
    setOpen(true);

    try {
      const formData = new FormData();
      formData.append("type_of_customer", whatsappGroup.type_of_customer || "");

      if (uploadedFile) {
        const fileKey = "file";
        const fileName = uploadedFile.name;
        formData.append(fileKey, uploadedFile);
        formData.append("filename", fileName);
        formData.append("caption", whatsappGroup.caption || "");
      } else {
        formData.append("message", whatsappGroup.message || "");
      }

      let apiCall;
      if (uploadedFile) {
        apiCall = CustomerServices.createWhatsappImageData;
      } else {
        apiCall = CustomerServices.createWhatsappImageData;
      }

      await apiCall(formData);
      setOpenPopup(false);
      await refreshData();
    } catch (error) {
      console.error("Error creating WhatsApp group", error);
    } finally {
      setOpen(false);
    }
  };

  const renderInputFields = () => {
    switch (filter) {
      case "message":
        return (
          <CustomTextField
            fullWidth
            multiline
            name="message"
            size="small"
            label="Message"
            variant="outlined"
            value={whatsappGroup["message"] || ""}
            onChange={(event) => handleInputChange(event)}
          />
        );
      case "image":
      case "pdf":
      case "video":
        return (
          <>
            <Button
              variant="contained"
              component="label"
              size="small"
              sx={{ mt: 1, mb: 2 }}
            >
              Upload File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {errorMessage && (
              <Typography color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            {uploadedFile && (
              <Box sx={{ mt: 2, mb: 2 }}>
                {isPdf || filter === "pdf" ? (
                  <Typography variant="subtitle1">
                    {uploadedFile.name}
                  </Typography>
                ) : (
                  filePreview && (
                    <img
                      src={filePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  )
                )}
              </Box>
            )}
            <CustomTextField
              fullWidth
              multiline
              name="caption"
              size="small"
              label="Caption"
              variant="outlined"
              value={whatsappGroup["caption"] || ""}
              onChange={(event) => handleInputChange(event)}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createWhatsappGroup(e)}>
        <Grid xs={12} mb={3}>
          <CustomAutocomplete
            fullWidth
            name="type_of_customer"
            size="small"
            disablePortal
            id="combo-box-status"
            onChange={(event, value) =>
              handleInputChange(event, value, "type_of_customer")
            }
            options={[
              "Non-Exclusive Distribution",
              "Exclusive Distribution",
              "All Distribution",
              "All Industrial",
            ]}
            getOptionLabel={(option) => option}
            label="Type Of Customer"
            value={whatsappGroup.type_of_customer}
          />
        </Grid>
        <FormControl component="fieldset">
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            row
            aria-label="type"
            name="type"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <FormControlLabel
              value="message"
              control={<Radio />}
              label="Message"
            />
            <FormControlLabel value="image" control={<Radio />} label="Image" />
            <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
            <FormControlLabel value="video" control={<Radio />} label="Video" />
          </RadioGroup>
        </FormControl>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderInputFields()}
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};
