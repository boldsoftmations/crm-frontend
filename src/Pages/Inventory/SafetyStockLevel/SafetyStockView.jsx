import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { Popup } from "../../../Components/Popup";
import { SafetyStockCreate } from "./SafetyStockCreate";
import { SafetyStockUpdate } from "./SafetyStockUpdate";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";

export const SafetyStockView = () => {
  const [openPopupCreate, setOpenPopupCreate] = useState(false);
  const [safetyStockData, setSafetyStockData] = useState([]);
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleEdit = async (item) => {
    try {
      setOpen(true);
      setSelectedRow(item);
      setOpenPopupUpdate(true);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const getAllSafetyStockDetails = useCallback(async (page) => {
    setOpen(true); // Set loading state before making the API call
    try {
      const response = await InventoryServices.getAllSafetyStockData(page);
      setSafetyStockData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
      console.error("error", error);
    } finally {
      setOpen(false); // Close loading state in the finally block
    }
  }, []);

  useEffect(() => {
    getAllSafetyStockDetails(currentPage);
  }, [currentPage, getAllSafetyStockDetails]);

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
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid
              container
              alignItems="center"
              spacing={2}
              sx={{ mb: 2, mx: 3 }}
            >
              <Grid item xs={12} sm={4} md={4}></Grid>

              {/* Typography in the Center */}
              <Grid item xs={12} sm={4} md={4}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "rgb(34, 34, 34)",
                    textAlign: "center",
                  }}
                >
                  Safety Stock Level
                </Typography>
              </Grid>

              {/* Download CSV Button on the Right */}
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenPopupCreate(true)}
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Id</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {safetyStockData.map((row, index) => (
                  <StyledTableRow
                    key={index}
                    data-quantity={getRowColor(row.quantity)}
                  >
                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.seller_account}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.description}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => handleEdit(row)}>Edit</Button>
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
        </Paper>
      </Grid>

      <Popup
        title="Create Safety Stock"
        openPopup={openPopupCreate}
        setOpenPopup={setOpenPopupCreate}
      >
        <SafetyStockCreate
          currentPage={currentPage}
          setOpenPopup={setOpenPopupCreate}
          onCreateSuccess={getAllSafetyStockDetails}
        />
      </Popup>
      <Popup
        title={"Safety Stock Update"}
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <SafetyStockUpdate
          currentPage={currentPage}
          setOpenPopup={setOpenPopupUpdate}
          selectedRow={selectedRow}
          onUpdateSuccess={getAllSafetyStockDetails}
        />
      </Popup>
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
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
  },
}));

const getRowColor = (quantity) => {
  if (quantity < 10) return "low";
  if (quantity >= 10 && quantity <= 50) return "medium";
  if (quantity > 50 && quantity <= 100) return "high";
  return "default";
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  '&[data-quantity="low"]': {
    backgroundColor: "#FFCDD2",
  },
  '&[data-quantity="medium"]': {
    backgroundColor: "#FFF59D",
  },
  '&[data-quantity="high"]': {
    backgroundColor: "#BBDEFB",
  },
  '&[data-quantity="default"]': {
    // Default background
  },
}));
