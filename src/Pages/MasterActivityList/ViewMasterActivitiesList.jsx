import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Collapse,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import MasterService from "../../services/MasterService";
import { Popup } from "../../Components/Popup";
import CreateMasterActivity from "./CreateMasterActivity";
import CreateActivityOption from "./CreateActivityOption";

export const ViewMasterActivitiesList = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getMasterActivity = useCallback(async () => {
    try {
      setOpen(true);
      const response = await MasterService.getMasterActivity(currentPage);
      setActivityData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getMasterActivity();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Grid item xs={12} sx={{ width: 800, mx: "auto" }}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={7}
                sx={{ textAlign: { xs: "center", md: "end" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Option Master
                </h3>
              </Grid>

              {/* Add Button on the right */}
              <Grid item xs={12} md={4} sx={{ textAlign: { md: "end" } }}>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => setOpenModal(true)}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
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
              sx={{ width: 700, mx: "auto" }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>

                  <StyledTableCell align="center">
                    MAster Option
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activityData.map((row) => (
                  <Row
                    key={row.id}
                    row={row}
                    getMasterActivity={getMasterActivity}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
          <Popup
            maxWidth="md"
            title="Create master option"
            openPopup={openModal}
            setOpenPopup={setOpenModal}
          >
            <CreateMasterActivity
              setOpenModal={setOpenModal}
              getMasterActivity={getMasterActivity}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

function Row({ row, getMasterActivity }) {
  const [tableExpand, setTableExpand] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleOpenModal = (data) => {
    setSelectedData(data.name); // Set selected row data
    setOpenModal(true);
  };

  return (
    <>
      <StyledTableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          textDecoration: row.cancelled ? "line-through" : "none",
        }}
      >
        {/* Expand/Collapse Button */}
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setTableExpand((prev) => !prev)}
          >
            {tableExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>

        {/* Row Name */}
        <StyledTableCell align="center">{row.name}</StyledTableCell>

        {/* Add Option Button */}
        <StyledTableCell align="center">
          <Button
            variant="text"
            size="small"
            color="primary"
            onClick={() => handleOpenModal(row)}
          >
            Add Option
          </Button>
        </StyledTableCell>
      </StyledTableRow>

      {/* Expandable Content */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={tableExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="activity-options">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#88a6cf" }}>
                    {" "}
                    {/* Heading background */}
                    <TableCell align="center" style={{ color: "white" }}>
                      Sub Options
                    </TableCell>
                    <TableCell align="center" style={{ color: "white" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.options.map((option, index) => (
                    <TableRow
                      key={option.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f1f8ff" : "#ffffff", // Alternating row colors
                      }}
                    >
                      <TableCell align="center">{option.name}</TableCell>
                      <TableCell align="center">
                        <Button variant="text" size="small" color="success">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Modal Popup */}
      <Popup
        maxWidth="md"
        title="Create sub options"
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <CreateActivityOption
          setOpenModal={setOpenModal}
          getMasterActivity={getMasterActivity}
          selectedData={selectedData}
        />
      </Popup>
    </>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 3,
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
