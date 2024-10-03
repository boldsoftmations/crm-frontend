import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Paper, Grid } from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import Hr from "../../../services/Hr";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";

const CreateInterviewQuestionAndAnswer = ({
  getMCQQuetion,
  setOpenQuestionPopUp,
}) => {
  const [formData, setFormData] = useState({
    designation: "",
    interview_type: "",
    question: "",
    expected_answer: "",
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
      const response = await Hr.createInterviewQuestionAndanswwer(formData);
      setAlertMsg({
        open: true,
        message: response.message || "Interview question created successfully",
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
        message: error.message || "Error creating interview question",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ maxWidth: 1000, margin: "auto" }}>
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
        <Grid item xs={12} marginTop={"13px"}>
          <CustomAutocomplete
            options={["Screening", "Face to Face"]}
            value={formData.interview_type}
            onChange={(e, value) =>
              setFormData((prev) => ({ ...prev, interview_type: value }))
            }
            label="Interview Question Type"
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
        <TextField
          fullWidth
          multiline
          rows={4}
          size="small"
          label="Expected Answer"
          name="expected_answer"
          style={{ marginTop: 11 }}
          value={formData.expected_answer}
          onChange={handleInputChange}
        />
        <Button
          style={{ marginTop: 16 }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateInterviewQuestionAndAnswer;
