import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Typography,
  tableCellClasses,
} from "@mui/material";
// import CustomSnackbar from "../../Components/CustomerSnackbar";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
// import { CustomLoader } from "../../Components/CustomLoader";
import { CustomLoader } from "../../../Components/CustomLoader";
// import SearchComponent from "../../Components/SearchComponent ";
import SearchComponent from "../../../Components/SearchComponent ";
// import { CustomPagination } from "../../Components/CustomPagination";
import { CustomPagination } from "../../../Components/CustomPagination";
// import { Popup } from "../../Components/Popup";
import { Popup } from "../../../Components/Popup";
// import MasterService from "../../services/MasterService";
import MasterService from "../../../services/MasterService";
// import { CreateLeadSummary } from "./CreateLeadSummary";
// import { CreateLeadSummary } from "../../MasterLeadSummary/CreateLeadSummary";
import { CreateZone } from "./CreateZone";
import { UpdateZone } from "./UpdateZone";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
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

const ZoneListView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [zoneData, setZoneData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);

  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleCloseSnackbar = () =>
    setAlertMsg((prev) => ({ ...prev, open: false }));

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };
  const openInPopup = (data) => {
    setRecordForEdit(data);
    setOpenUpdatePopup(true);
  };

  const getAllMasterZone = async () => {
    try {
      setIsLoading(true);
      const response = await MasterService.getZoneMasterList(
        "all",
        searchQuery
      );
      setZoneData(response.data || []);

      setTotalPages(Math.ceil(response.data.count / 25));
      console.log(response.data);
    } catch (e) {
      setAlertMsg({
        message: e.response.data.message || "Error fetching zone list",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  // const handleSearch = (query) => {
  //   if (query.trim() === "") {
  //     setZoneData(sourceData);
  //   } else {
  //     setZoneData(
  //       sourceData.filter(
  //         (item) =>
  //           item.source &&
  //           item.source.toLowerCase().includes(query.toLowerCase())
  //       )
  //     );
  //   }
  // };

  useEffect(() => {
    getAllMasterZone();
  }, [searchQuery]);

  return (
    <>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleCloseSnackbar}
      />
      <CustomLoader open={isLoading} />

      <Grid item xs={12}>
        <Paper sx={{ p: 3, m: 3 }}>
          {/* Header Section */}
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} sm={4}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Grid>
            <Grid item xs={12} sm={4} textAlign="center">
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Zone List
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenPopup(true)}
              >
                Add Zone
              </Button>
            </Grid>
          </Grid>

          {/* Table Section */}
          <TableContainer
            sx={{
              maxHeight: 480,
              mt: 3,
              "&::-webkit-scrollbar": {
                width: 10,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"> Name</StyledTableCell>

                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zoneData.length > 0 ? (
                  zoneData.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {" "}
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => openInPopup(row)}
                        >
                          Edit
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={1}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box mt={2}>
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </Box>

          {/* Popup */}
          <Popup
            title="Add Zone List"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <CreateZone
              setOpenPopup={setOpenPopup}
              getAllMasterZone={getAllMasterZone}
            />
          </Popup>
          <Popup
            title="Update City"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <UpdateZone
              recordForEdit={recordForEdit}
              setOpenPopup={setOpenUpdatePopup}
              getAllMasterZone={getAllMasterZone}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

export default ZoneListView;
