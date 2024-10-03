import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Paper, Grid } from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";

const UpdateQuestion = ({ data, getMCQQuetion, setOpenQuestionPopUp }) => {
  const [formData, setFormData] = useState({
    designation: data.designation,
    interview_type: data.interview_type,
    question: data.question,
    expected_answer: data.expected_answer,
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

  const handleSubmit = async () => {
    try {
      if (
        !formData.designation ||
        !formData.expected_answer ||
        !formData.question ||
        !formData.interview_type
      ) {
        setAlertMsg({
          open: true,
          message: "Please fill all the fields.",
          severity: "warning",
        });
        return;
      }

      setLoading(true);
      const response = await Hr.UpdateInterviewQuestionandanswwer(
        data.id,
        formData
      );
      setAlertMsg({
        open: true,
        message: response.message || "Interview question updated successfully",
        severity: "success",
      });
      setTimeout(() => {
        getMCQQuetion();
        setOpenQuestionPopUp(false);
      }, 500);
    } catch (error) {
      console.error("Error updating MCQ:", error);
      setAlertMsg({
        open: true,
        message: error.message || "Error updating interview question",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CustomLoader open={loading} />
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              options={role.map((option) => option.designation)}
              value={formData.designation}
              onChange={(e, value) =>
                setFormData((prev) => ({ ...prev, designation: value }))
              }
              label="Designation"
              fullWidth
              margin="dense"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              options={["Screening", "Face to Face"]}
              value={formData.interview_type}
              onChange={(e, value) =>
                setFormData((prev) => ({ ...prev, interview_type: value }))
              }
              label="Interview Question Type"
              fullWidth
              margin="dense"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              size="small"
              label="Expected Answer"
              name="expected_answer"
              value={formData.expected_answer}
              onChange={handleInputChange}
              sx={{
                marginTop: 2,
                "& .MuiInputBase-root": {
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
              sx={{
                marginTop: 3,
                padding: "12px",
                borderRadius: "10px",
                backgroundColor: "#007BFF",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default UpdateQuestion;
