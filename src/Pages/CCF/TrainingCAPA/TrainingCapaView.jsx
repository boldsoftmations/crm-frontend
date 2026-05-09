import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CustomerServices from "../../../services/CustomerService";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

// ================= CONSTANTS =================
const PAGE_SIZE = 25;
const STATUS_OPTIONS = ["Pending", "Completed"];

const INITIAL_SNACKBAR = { open: false, message: "", severity: "success" };

// ================= STYLES =================
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#006BA1",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// ================= HELPERS =================
const getNestedValue = (obj, path, fallback) => {
  var result = obj;
  for (var i = 0; i < path.length; i++) {
    if (result === null || result === undefined)
      return fallback !== undefined ? fallback : "";
    result = result[path[i]];
  }
  return result !== null && result !== undefined
    ? result
    : fallback !== undefined
      ? fallback
      : "";
};

// ================= COMPONENT =================
const TrainingCapaView = () => {
  const [CCFData, setCCFData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [isTraining, setIsTraining] = useState("false");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [snackbar, setSnackbar] = useState(INITIAL_SNACKBAR);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [trainedMap, setTrainedMap] = useState({});

  // ================= API =================
  const getAllCAPAData = useCallback(async () => {
    try {
      setLoader(true);
      const response = await CustomerServices.getAllCapaData(
        currentPage,
        searchQuery,
        "",
        isTraining,
      );
      var results =
        response && response.data && response.data.results
          ? response.data.results
          : [];
      var count =
        response && response.data && response.data.count
          ? response.data.count
          : 0;
      setCCFData(results);
      setTotalPages(Math.ceil(count / PAGE_SIZE));

      var map = {};
      for (var j = 0; j < results.length; j++) {
        var item = results[j];
        if (item && item.id && item.is_training) {
          map[item.id] = true;
        }
      }
      setTrainedMap(map);
    } catch (error) {
      console.error("Error fetching CAPA data:", error);
    } finally {
      setLoader(false);
    }
  }, [currentPage, searchQuery, isTraining]);

  useEffect(() => {
    getAllCAPAData();
  }, [getAllCAPAData]);

  const updateTrainingStatus = async () => {
    if (!selectedRow || !selectedRow.id) return;

    try {
      setLoader(true);
      const response = await CustomerServices.UpdateCapa(selectedRow.id, {
        is_training: true,
      });

      var successMessage =
        response && response.data && response.data.message
          ? response.data.message
          : "Training updated";
      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      setTrainedMap((prev) => ({ ...prev, [selectedRow.id]: true }));
      setOpenPopup(false);
      getAllCAPAData();
    } catch (error) {
      var errorMessage =
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
          ? error.response.data.message
          : "Error updating training";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoader(false);
    }
  };

  // ================= HANDLERS =================
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleStatusChange = (_, value) => {
    setSelectedStatus(value);
    setIsTraining(value === "Completed" ? "true" : "false");
    setCurrentPage(1);
  };

  const handleSwitchChange = (row) => {
    setSelectedRow(row);
    setOpenPopup(true);
  };

  // ================= RENDER =================
  return (
    <>
      <CustomLoader open={loader} />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4 }}>
          {/* Header */}
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  Corrective &amp; Preventive Action List
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  fullWidth
                  size="small"
                  options={STATUS_OPTIONS}
                  getOptionLabel={(option) => option}
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  label="Filter by Status"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Table */}
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["ID", "Complaint No.", "Customer", "Status", "Action"].map(
                    (header) => (
                      <StyledTableCell key={header} align="center">
                        {header}
                      </StyledTableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {CCFData.map((row, i) => {
                  const rowId = row && row.id ? row.id : null;
                  const isTrained = Boolean(rowId && trainedMap[rowId]);
                  return (
                    <StyledTableRow key={rowId || i}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">
                        {getNestedValue(row, ["ccf_details", "complain_no"])}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {getNestedValue(row, ["ccf_details", "customer"])}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row && row.status ? row.status : ""}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Switch
                          checked={isTrained}
                          disabled={isTrained}
                          onChange={() => handleSwitchChange(row)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={(_, value) => setCurrentPage(value)}
          />
        </Paper>
      </Grid>

      {/* Confirmation Popup */}
      <Popup
        title="Training Confirmation"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6">Is training completed?</Typography>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button onClick={() => setOpenPopup(false)}>No</Button>
            <Button
              variant="contained"
              color="success"
              onClick={updateTrainingStatus}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Popup>
    </>
  );
};

export default TrainingCapaView;
