import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import InventoryServices from "../../services/InventoryService";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import { Popup } from "../../Components/Popup";
import { CurrencyCreate } from "./CurrencyCreate";
import { CurrencyUpdate } from "./CurrencyUpdate";

export const CurrencyView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const handlePopup = (row) => {
    setOpenEditPopup(true);
    setSelectedRow(row);
  };

  useEffect(() => {
    getCurrencyDetails();
  }, []);

  const getCurrencyDetails = async () => {
    setIsLoading(true);
    try {
      const response = await InventoryServices.getCurrencyData();

      if (response && response.data) {
        setCurrencyData(response.data);
      }
    } catch (err) {
      console.error("Error fetching daily sales review data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCurrencyData = currencyData.filter((currency) =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ marginRight: "10px" }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => setOpenCreatePopup(true)}
                  sx={{ marginLeft: "10px" }}
                >
                  Add
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <h3
                  style={{
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Currency
                </h3>
              </Grid>
            </Grid>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 400,
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
                <StyledTableRow>
                  <StyledTableCell align="center">Currency</StyledTableCell>
                  <StyledTableCell align="center">Symbol</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filteredCurrencyData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.symbol}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        sx={{ color: "#1976d2" }}
                        onClick={() => handlePopup(row)}
                      >
                        View
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        maxwidth={"xl"}
        title={"Currency Create"}
        openPopup={openCreatePopup}
        setOpenPopup={setOpenCreatePopup}
      >
        <CurrencyCreate
          setOpenPopup={setOpenCreatePopup}
          getCurrencyDetails={getCurrencyDetails}
        />
      </Popup>
      <Popup
        maxwidth={"xl"}
        title={"Currency Update"}
        openPopup={openEditPopup}
        setOpenPopup={setOpenEditPopup}
      >
        <CurrencyUpdate
          setOpenPopup={setOpenEditPopup}
          selectedRow={selectedRow}
          getCurrencyDetails={getCurrencyDetails}
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
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
