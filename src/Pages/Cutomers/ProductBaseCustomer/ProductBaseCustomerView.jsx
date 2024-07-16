import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useSelector } from "react-redux";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import CustomerServices from "../../../services/CustomerService";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CSVLink } from "react-csv";
import ProductService from "../../../services/ProductService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const ProductBaseCustomerView = () => {
  const [open, setOpen] = useState(false);
  const data = useSelector((state) => state.auth);
  const [productBaseCustomer, setProductBaseCustomer] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [filterValue, setFilterValue] = useState(null);
  const csvLinkRef = useRef(null);
  const userData = data.profile;
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleProductChange = async (event, value) => {
    try {
      setOpen(true);
      const response = await CustomerServices.getProductBaseCustomer(value);
      setFilterValue(value);
      setProductBaseCustomer(response.data.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      handleError("Failed to get product base customer data" || err);
    }
  };

  const getProduct = useCallback(async () => {
    try {
      const res = await ProductService.getAllValidPriceList("all");
      setProductOption(res.data);
    } catch (err) {
      console.error("error potential", err);
    }
  }, []);

  useEffect(() => {
    getProduct();
  }, []);

  const DownloadData = () => {
    const CSVDATA = productBaseCustomer.map((row) => {
      setOpen(true);
      return {
        Name: row.sales_invoice__order_book__company__name,
        Brand: row.product__brand__name,
        Product: row.product__name,
        Unit: row.product__unit__name,
        quantity: row.quantity,
        Date: row.sales_invoice__generation_date,
      };
    });
    setOpen(false);
    return CSVDATA;
  };
  const headers = [
    { label: "Customer Name", key: "Name" },
    { label: "Brand", key: "Brand" },
    { label: "Product", key: "Product" },
    { label: "Unit", key: "Unit" },
    { label: "Quntity", key: "quantity" },
    { label: "Date", key: "Date" },
  ];

  const handleDownload = () => {
    try {
      const data = DownloadData();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
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
              {/* Title Text centered */}
              <Grid item xs={12} sm={4}>
                <CustomAutocomplete
                  name="product"
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  onChange={handleProductChange}
                  options={productOption.map((option) => option.product)}
                  getOptionLabel={(option) => option}
                  label="Product Name"
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
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
                  Product Base Customers
                </h3>
              </Grid>
              <Grid item xs={12} md={4} style={{ textAlign: "end" }}>
                <Button
                  variant="contained"
                  color="info"
                  className="mx-3"
                  onClick={handleDownload}
                >
                  DownLoad CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Customer.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}
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
                  <StyledTableCell align="center">
                    Customer Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Brand</StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">
                    Last Invoice Qty
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Last Invoice Date
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">ACTION</StyledTableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {productBaseCustomer.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.sales_invoice__order_book__company__name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product__brand__name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product__name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.product__unit__name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.sales_invoice__generation_date}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {filterValue && productBaseCustomer.length === 0 && (
                  <>
                    <TableRow>
                      <StyledTableCell colSpan={6} align="center">
                        No Data Available
                      </StyledTableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
};

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
