import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Paper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { DesignationCreate } from "./DesignationCreate";
import { DesignationUpdate } from "./DesignationUpdate";
import Hr from "./../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomTextField from "../../../Components/CustomTextField";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const DesignationView = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [designations, setDesignations] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };


  const getDesignationsDetails = useCallback(
    async (page, query = searchQuery) => {
      try {
        setOpen(true);
        const response = await Hr.getDesignationsData(page, query);
        setDesignations(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
        setOpen(false);
      } catch (error) {
        console.error("Error fetching scripts", error);
        setOpen(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    getDesignationsDetails(currentPage);
  }, [currentPage, getDesignationsDetails]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEdit = (data) => {
    console.log("value", data);
    setRecordForEdit(data);
    setOpenUpdatePopup(true);
  };

  const handleDeleteDesignations = async (data) => {
    try {
      setOpen(false);
      const response = await Hr.deleteDesignations(data.id);
      if (response.status === 200) {
        setAlertMsg({
          message: response.data.message || "Designation deleted successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          getDesignationsDetails(currentPage);
        }, 500);
      }
    } catch (e) {
      console.log("Error", e);
      setAlertMsg({
        message: e.response.data.error || "Error deleting designation",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    getDesignationsDetails(currentPage, searchQuery)
                  }
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    getDesignationsDetails(1, "");
                  }}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  onClick={() => setOpenCreatePopup(true)}
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Designations
            </h3>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {designations.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.department}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="text"
                        color="success"
                        size="small"
                        onClick={() => handleEdit(row)}
                      >
                        edit
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteDesignations(row)}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
          <Popup
            title="Add New Designation"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <DesignationCreate
              setOpenCreatePopup={setOpenCreatePopup}
              getDesignationsDetails={getDesignationsDetails}
            />
          </Popup>
          <Popup
            title="Edit Designation"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <DesignationUpdate
              designationId={recordForEdit}
              setOpenUpdatePopup={setOpenUpdatePopup}
              getDesignationsDetails={getDesignationsDetails}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
