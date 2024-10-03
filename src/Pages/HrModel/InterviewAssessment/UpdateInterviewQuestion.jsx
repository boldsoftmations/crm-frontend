import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  IconButton,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";

const UpdateInterviewQuestion = ({
  getMCQQuetion,
  setOpenQuestionPopUp,
  data,
}) => {
  const [formData, setFormData] = useState({
    designation: data.designation || "",
    question: data.question || "",
    options: data.options || [],
    answer: data.answer || "",
  });
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ ...alertMsg, open: false });
  };

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await Hr.getDesginationList();
        setRole(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartmentList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...formData.options];
    newOptions[index] = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      options: newOptions,
    }));
  };

  const handleAddOption = () => {
    if (formData.options.length < 4) {
      setFormData((prevData) => ({
        ...prevData,
        options: [...prevData.options, ""],
      }));
    }
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length > 1) {
      const newOptions = [...formData.options];
      newOptions.splice(index, 1);
      setFormData((prevData) => ({
        ...prevData,
        options: newOptions,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await Hr.UpdateMCQQuetion(data.id, formData);
      setAlertMsg({
        open: true,
        message: response.message || "MCQ updated successfully",
        severity: "success",
      });
      setTimeout(() => {
        getMCQQuetion();
        setOpenQuestionPopUp(false);
      }, 500);
    } catch (error) {
      console.error("Error creating MCQ:", error);
      setAlertMsg({
        open: true,
        message: error.message || "Error creating MCQ",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 700, margin: "auto" }}>
      <CustomLoader open={loading} />
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <Box sx={{ padding: "20px" }}>
        <Grid item xs={12}>
          <CustomAutocomplete
            options={role.map((option) => option.designation)}
            value={formData.designation}
            onChange={(e, value) =>
              setFormData((prev) => ({ ...prev, designation: value }))
            }
            label="Designation"
            margin="dense"
            fullWidth
          />
        </Grid>

        <TextField
          label="Question"
          size="small"
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {formData.options.map((option, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 3, mt: 2 }}
          >
            <TextField
              label={`Option ${index + 1}`}
              size="small"
              value={option}
              onChange={(e) => handleOptionChange(index, e)}
              fullWidth
            />
            <IconButton
              onClick={() => handleRemoveOption(index)}
              disabled={formData.options.length <= 1}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={handleAddOption}
          startIcon={<AddIcon />}
          fullWidth
          sx={{ mb: 2 }}
          disabled={formData.options.length >= 4}
        >
          Add More Option
        </Button>
        <Grid item xs={12}>
          <CustomAutocomplete
            options={formData.options}
            onChange={(e, value) =>
              setFormData((prev) => ({ ...prev, answer: value }))
            }
            label="Correct Answer"
            margin="dense"
            fullWidth
            value={formData.answer}
          />
        </Grid>

        <Button
          style={{ marginTop: 12 }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={formData.options.length !== 4}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default UpdateInterviewQuestion;
