import React, { useEffect, useRef, useState } from "react";
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
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import ClearIcon from "@mui/icons-material/Clear";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import InventoryServices from "../../../services/InventoryService";
import { CSVLink } from "react-csv";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

export const ProductionShortFallView = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [productionShortFallData, setProductionShortFallData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getAllProductionShortFallDetails();
  }, []);

  const getAllProductionShortFallDetails = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllProductionShortFallData();

      setProductionShortFallData(response.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setOpen(false);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleResetClick = () => {
    setSearchQuery("");
  };

  // Filter the productionInventoryData based on the search query
  const filteredData = productionShortFallData.filter((row) =>
    row.product.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // in type fist letter capitalized function
  productionShortFallData.forEach((product) => {
    product.type = product.type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  //   export to excel data
  let data = productionShortFallData.map((item) => {
    return {
      type: item.type,
      product: item.product,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
    };
  });
  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              {" "}
              <TextField
                label="Search By Product"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchQuery && (
                        <IconButton onClick={handleResetClick}>
                          <ClearIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Shortfall Inventory
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <CSVLink
                data={data}
                headers={headers}
                filename={"my-file.csv"}
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              >
                <Button color="success" variant="contained">
                  Export to Excel
                </Button>
              </CSVLink>
            </Box>
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
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">TYPE</StyledTableCell>
                  <StyledTableCell align="center">PRODUCT</StyledTableCell>

                  <StyledTableCell align="center">DESCRIPTION</StyledTableCell>

                  <StyledTableCell align="center">QUANTITY</StyledTableCell>
                  <StyledTableCell align="center">UNIT</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.type}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.description}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.unit}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
};

const headers = [
  { label: "Type", key: "type" },
  {
    label: "Product",
    key: "product",
  },

  { label: "Description", key: "description" },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Unit",
    key: "unit",
  },
];
