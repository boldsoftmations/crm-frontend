import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import Hr from "../../../services/Hr";
import { Popup } from "../../../Components/Popup";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import CreateInterviewQuestionAndAnswer from "./CreateInterviewQuestionAndAnswer";
import UpdateQuestion from "./UpdateQuestion";
import { useSelector } from "react-redux";

const InterviewQuestionView = () => {
  const userData = useSelector((state) => state.auth.profile);
  const [mcqData, setMcqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openQuestionPopUp, setOpenQuestionPopUp] = useState(false);
  const [openQuestionPopUp1, setOpenQuestionPopUp1] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [typefilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [designation, setDesignation] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ ...alertMsg, open: false });
  };

  const getInterviewQuestionAndAnswer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Hr.getInterviewQuestionAndAnswer(
        currentPage,
        filterValue,
        typefilter
      );
      setMcqData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      console.error("Error fetching MCQs:", error);
      setAlertMsg({
        open: true,
        message: error.message || "Error fetching MCQs",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterValue, typefilter]);

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await Hr.getDesginationList();
        setDesignation(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartmentList();
  }, []);

  useEffect(() => {
    getInterviewQuestionAndAnswer();
  }, [currentPage, filterValue, typefilter]);

  const handleAddQuestion = () => setOpenQuestionPopUp1(true);
  const handleEdit = (data) => {
    setSelectedRow(data);
    setOpenQuestionPopUp(true);
  };

  const handleDeleteQuestion = async (data) => {
    try {
      const res = await Hr.DeteteInterviewQuestionandanswwer(data.id);
      if (res.status === 200) {
        setAlertMsg({
          message: res.data.message || "Question deleted successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          getInterviewQuestionAndAnswer();
        }, 400);
      }
    } catch (error) {
      console.error("Error deleting  Question:", error);
      setAlertMsg({
        open: true,
        message: error.response.data.error || "Error deleting  Question",
        severity: "error",
      });
    }
  };

  const handlePageChange = (_, value) => setCurrentPage(value);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <Paper
        style={{
          padding: "20px",
          margin: "1rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <CustomAutocomplete
                fullWidth
                name="designation"
                value={filterValue}
                size="small"
                disablePortal
                id="combo-box-stage"
                onChange={(e, value) => setFilterValue(value)}
                options={designation.map((option) => option.designation)}
                getOptionLabel={(option) => option}
                label="Filter By Designation"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomAutocomplete
                fullWidth
                size="small"
                value={typefilter}
                disablePortal
                id="combo-box-stage"
                onChange={(e, value) => setTypeFilter(value)}
                options={["Screening", "Face to Face"]}
                getOptionLabel={(option) => option}
                label="Type of question"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h5"
                sx={{
                  color: "#222",
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                Interview Questions
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="end">
              {!userData.groups.includes("HR Recruiter") && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddQuestion}
                  sx={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Add Question
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ maxWidth: 1300, margin: "auto", padding: 1 }}>
          {mcqData.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Designation</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Interview Type</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Question</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Expected Answer</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mcqData.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell align="center">
                        {question.designation}
                      </TableCell>
                      <TableCell align="center">
                        {question.interview_type}
                      </TableCell>
                      <TableCell align="center">{question.question}</TableCell>
                      <TableCell align="center">
                        {question.expected_answer}
                      </TableCell>
                      <TableCell align="center">
                        {!userData.groups.includes("HR Recruiter") && (
                          <Box
                            display="flex"
                            gap="10px"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => {
                                handleEdit(question);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => {
                                handleDeleteQuestion(question);
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6" align="center">
              No Questions found.
            </Typography>
          )}
        </Box>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Paper>

      <Popup
        fullScreen={true}
        title="Create Interview Question"
        openPopup={openQuestionPopUp1}
        setOpenPopup={setOpenQuestionPopUp1}
      >
        <CreateInterviewQuestionAndAnswer
          getMCQQuetion={getInterviewQuestionAndAnswer}
          setOpenQuestionPopUp={setOpenQuestionPopUp1}
        />
      </Popup>

      <Popup
        fullScreen={true}
        title="Update Interview Question"
        openPopup={openQuestionPopUp}
        setOpenPopup={setOpenQuestionPopUp}
      >
        <UpdateQuestion
          getMCQQuetion={getInterviewQuestionAndAnswer}
          setOpenQuestionPopUp={setOpenQuestionPopUp}
          data={selectedRow}
        />
      </Popup>
    </>
  );
};

export default InterviewQuestionView;
