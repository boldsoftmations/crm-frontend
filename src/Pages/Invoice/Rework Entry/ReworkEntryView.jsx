import React, { useCallback, useEffect, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Button,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Switch,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomPagination } from "../../../Components/CustomPagination";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import InventoryServices from "../../../services/InventoryService";
import { Popup } from "../../../Components/Popup";
import { ReworkEntryRawMaterial } from "./ReworkEntryRawMaterial";
import { ReworkEntryConsumable } from "./ReworkEntryConsumable";
import { useSelector } from "react-redux";

export const ReworkEntryView = () => {
  const [open, setOpen] = useState(false);
  const [reworkInvoiceData, setReworkInvoiceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowData, setSelectedRowData] = useState();
  const [openConsumablePopUp, setOpenConsumablePopUp] = useState(false);
  const [openRawMaterialPopUp, setOpenRawmaterialPopUp] = useState(false);
  const { profile: users } = useSelector((state) => state.auth);

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getReworkEntryData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getReworkinvoiceData(
        currentPage,
        searchQuery
      );
      console.log("rework Data", response.data.results);
      setReworkInvoiceData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getReworkEntryData();
  }, [currentPage, searchQuery]);

  const handleUpdateReworkInvoice = async (data) => {
    try {
      setOpen(true);
      const req = {
        is_accepted: true,
      };
      await InventoryServices.updateReworkInvoiceData(data.id, req);
      handleSuccess("Product Accepted Successfully");
      getReworkEntryData();
    } catch (error) {
      handleError(error);
      console.log("error Store Accepting", error);
    } finally {
      setOpen(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenPop = (data) => {
    setSelectedRowData(data);
    setOpenConsumablePopUp(true);
  };

  const handleOpenPopUpRawMaterial = (data) => {
    setSelectedRowData(data);
    setOpenRawmaterialPopUp(true);
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
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search Component on the left */}
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: { xs: "center", md: "center" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Rework Entry
                </h3>
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>
                  <StyledTableCell align="center">
                    SELLER ACOUNT
                  </StyledTableCell>
                  <StyledTableCell align="center">BATCH_NO</StyledTableCell>
                  <StyledTableCell align="center">CREATED BY</StyledTableCell>
                  <StyledTableCell align="center">
                    CREATION DATE
                  </StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">RATE</StyledTableCell>
                  <StyledTableCell align="center">AMOUNT</StyledTableCell>
                  <StyledTableCell align="center">ACCEPT</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reworkInvoiceData.map((row) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.seller_account}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.batch}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.created_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.creation_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    {(users.groups.includes("Director") ||
                      users.groups.includes("Accounts")) && (
                      <StyledTableCell align="center">
                        {row.rate}
                      </StyledTableCell>
                    )}
                    {(users.groups.includes("Director") ||
                      users.groups.includes("Accounts")) && (
                      <StyledTableCell align="center">
                        {row.amount}
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="center">
                      <Switch
                        checked={row.is_accepted}
                        inputProps={{ "aria-label": "controlled" }}
                        onClick={() => handleUpdateReworkInvoice(row)}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        color="info"
                        variant="text"
                        onClick={() => handleOpenPopUpRawMaterial(row)}
                      >
                        Raw Materials
                      </Button>
                      <Button
                        color="secondary"
                        variant="text"
                        onClick={() => handleOpenPop(row)}
                      >
                        Consumable
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
        <Popup
          maxWidth="md"
          title={"Consumable"}
          openPopup={openConsumablePopUp}
          setOpenPopup={setOpenConsumablePopUp}
        >
          <ReworkEntryConsumable
            selectedRow={selectedRowData}
            setOpenPopup={setOpenConsumablePopUp}
          />
        </Popup>

        <Popup
          maxWidth="md"
          title={"Raw Material"}
          openPopup={openRawMaterialPopUp}
          setOpenPopup={setOpenRawmaterialPopUp}
        >
          <ReworkEntryRawMaterial
            selectedRow={selectedRowData}
            setOpenPopup={setOpenRawmaterialPopUp}
          />
        </Popup>
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
