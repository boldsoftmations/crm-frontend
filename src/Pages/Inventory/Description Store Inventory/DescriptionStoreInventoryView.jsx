import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import React, { useCallback, useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import { useSelector } from "react-redux";
import InvoiceServices from "../../../services/InvoiceService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomTextField from "../../../Components/CustomTextField";
import SearchComponent from "../../../Components/SearchComponent ";
import { ProductCodeStoreInventoryView } from "./ProductCodeStoreInventoryView";

export const DescriptionStoreInventoryView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [idForEdit, setIDForEdit] = useState("");
  const [sellerOption, setSellerOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [unitFilter, setUnitFilter] = useState(null);

  const getDescriptionData = useCallback(async () => {
    try {
      setOpen(true);
      const response =
        await InventoryServices.getDescriptionStoresInventoryDetails(
          unitFilter,
          searchQuery
        );
      setInventoryData(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  }, []);

  const handleRowClick = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
    console.log("seus");
  };

  useEffect(() => {
    getDescriptionData();
  }, [unitFilter, searchQuery]);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerOption(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const handleUnitChange = (event, newValue) => {
    setUnitFilter(newValue);
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const handleReset = () => {
    setSearchQuery("");
  };

  console.log("seller option", sellerOption);

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
          <Box sx={{ marginBottom: 2 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item xs={12} md={3}>
                <CustomAutocomplete
                  value={unitFilter}
                  onChange={handleUnitChange}
                  options={
                    sellerOption && sellerOption.map((option) => option.unit)
                  }
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Unit Filter"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Description Store Inventory
                </h3>
              </Grid>
            </Grid>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 360,
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">DESCRIPTION</StyledTableCell>
                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">RATE</StyledTableCell>
                  <StyledTableCell align="center">TOTAL AMOUNT</StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {inventoryData.map((row, i) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {row.description}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.pending_quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.rate}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.total_amount}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.unit}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => handleRowClick(row)}>
                        Product Code
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        maxWidth="xl"
        title={"Consolidate product code"}
      >
        <ProductCodeStoreInventoryView
          idForEdit={idForEdit}
          setOpenCreatePopup={setOpenPopup}
        />
      </Popup>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
