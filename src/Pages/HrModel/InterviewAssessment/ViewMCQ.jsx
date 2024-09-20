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
import CreateInterviewQuestion from "./CreateInterviewQuestion";
import { Popup } from "../../../Components/Popup";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import UpdateInterviewQuestion from "./UpdateInterviewQuestion";

const ViewMCQs = () => {
  const [mcqData, setMcqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openQuestionPopUp, setOpenQuestionPopUp] = useState(false);
  const [openQuestionPopUp1, setOpenQuestionPopUp1] = useState(false);
  const [filterValue, setFilterValue] = useState("");
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
  const getMCQQuetion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Hr.getMCQQuetion(currentPage, filterValue);
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
  }, [currentPage, filterValue]);

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
    getMCQQuetion();
  }, [getMCQQuetion]);

  const handleAddQuestion = () => setOpenQuestionPopUp1(true);
  const handleEdit = (data) => {
    setSelectedRow(data);
    setOpenQuestionPopUp(true);
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
      <Paper style={{ padding: "15px", margin: "1rem" }}>
        <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginRight: 1, marginLeft: 1 }}
          >
            <Grid item xs={12} sm={4}>
              <CustomAutocomplete
                fullWidth
                name="designation"
                size="small"
                disablePortal
                id="combo-box-stage"
                onChange={(e, value) => setFilterValue(value)}
                options={designation.map((option) => option.designation)}
                getOptionLabel={(option) => option}
                label="Filter By Designation"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h4"
                sx={{
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                Interview Question List
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ maxWidth: 1300, margin: "auto", padding: 1 }}>
          {mcqData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Designation</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Question</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Options</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Correct Answer</strong>
                    </TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mcqData.map((mcq) => (
                    <TableRow key={mcq.id}>
                      <TableCell>{mcq.designation}</TableCell>
                      <TableCell>{mcq.question}</TableCell>
                      <TableCell>
                        <ul>
                          {mcq.options.map((option, idx) => (
                            <li key={idx}>{option}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{mcq.answer}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleEdit(mcq);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6" align="center">
              No MCQs found.
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
        <CreateInterviewQuestion
          getMCQQuetion={getMCQQuetion}
          setOpenQuestionPopUp={setOpenQuestionPopUp1}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title="Update Interview Question"
        openPopup={openQuestionPopUp}
        setOpenPopup={setOpenQuestionPopUp}
      >
        <UpdateInterviewQuestion
          getMCQQuetion={getMCQQuetion}
          setOpenQuestionPopUp={setOpenQuestionPopUp}
          data={selectedRow}
        />
      </Popup>
    </>
  );
};

export default ViewMCQs;
