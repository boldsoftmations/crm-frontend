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
import CustomerServices from "../../../services/CustomerService";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CSVLink } from "react-csv";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";

export const ProductBaseCustomerView = () => {
  const [open, setOpen] = useState(false);
  const [productBaseCustomer, setProductBaseCustomer] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [descriptionOption, setDescriptionOption] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const csvLinkRef = useRef(null);
  const [filters, setFilters] = useState({
    customerFilterValue: "",
    productFilterValue: "",
    choice: "",
  });

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  // Function to get product base customer data
  const getProductBaseCustomer = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getProductBaseCustomer(
        filterValue,
        filters.customerFilterValue,
        filters.productFilterValue
      );
      console.log("API Response:", response.data); // Debugging log
      setProductBaseCustomer(response.data);
      setOpen(false);
    } catch (err) {
      console.error("Error fetching product base customer data", err);
      handleError("Failed to get product base customer data" || err);
      setOpen(false);
    }
  };

  // Trigger API call when filters or filterValue changes
  useEffect(() => {
    getProductBaseCustomer();
  }, [
    filterValue,
    filters.customerFilterValue,
    filters.productFilterValue,
    filters.choice,
  ]);

  // Function to get all product descriptions
  const getProduct = useCallback(async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getAllDescription();
      setDescriptionOption(res.data);
      console.log("Product descriptions fetched:", res.data); // Debugging log
      setOpen(false);
    } catch (err) {
      console.error("Error fetching product descriptions", err);
      handleError("Failed to get product descriptions");
      setOpen(false);
    }
  }, []);

  // Fetch product descriptions on component mount
  useEffect(() => {
    getProduct();
  }, [getProduct]);

  // Handle description selection change
  const handleDescriptionChange = (event, value) => {
    console.log("Description changed:", value); // Debugging log
    setFilterValue(value);

    const selectedDescription = descriptionOption.find(
      (list) => list.description === value
    );

    if (selectedDescription) {
      setCustomerList(selectedDescription.customer_list || []);
      setProductList(selectedDescription.product_list || []);
    } else {
      setCustomerList([]);
      setProductList([]);
    }
  };

  // Handle filter change for customer or product
  const handleFilterChange = (event, value, name) => {
    console.log("Filter changed:", name, value); // Debugging log
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value || "",
    }));
  };

  const DownloadData = () => {
    const CSVDATA = productBaseCustomer.map((row) => ({
      Name: row.customer,
      Description: row.description,
      Brand: row.brand,
      Product: row.product,
      Unit: row.unit,
      quantity: row.quantity,
      Date: row.date,
    }));
    return CSVDATA;
  };

  const headers = [
    { label: "Customer Name", key: "Name" },
    { label: "Description", key: "Description" },
    { label: "Brand", key: "Brand" },
    { label: "Product", key: "Product" },
    { label: "Unit", key: "Unit" },
    { label: "Quantity", key: "quantity" },
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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={filterValue ? 8 : 4}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    name="Description"
                    size="small"
                    disablePortal
                    id="combo-box-description"
                    onChange={handleDescriptionChange}
                    options={descriptionOption.map(
                      (option) => option.description
                    )}
                    getOptionLabel={(option) => option}
                    label="Description"
                  />
                  {filterValue && productBaseCustomer.length > 0 && (
                    <CustomAutocomplete
                      fullWidth
                      name="choice"
                      size="small"
                      disablePortal
                      id="combo-box-description"
                      onChange={(e, value) =>
                        handleFilterChange(e, value, "choice")
                      }
                      options={["Customer", "Product"]}
                      getOptionLabel={(option) => option}
                      label="Filter By"
                    />
                  )}

                  {filters.choice === "Customer" && (
                    <CustomAutocomplete
                      fullWidth
                      name="customer"
                      size="small"
                      disablePortal
                      id="combo-box-customer"
                      onChange={(e, value) =>
                        handleFilterChange(e, value, "customerFilterValue")
                      }
                      options={customerList}
                      getOptionLabel={(option) => option}
                      label="Customer"
                    />
                  )}
                  {filters.choice === "Product" && (
                    <CustomAutocomplete
                      fullWidth
                      name="product"
                      size="small"
                      disablePortal
                      id="combo-box-product"
                      onChange={(e, value) =>
                        handleFilterChange(e, value, "productFilterValue")
                      }
                      options={productList}
                      getOptionLabel={(option) => option}
                      label="Product"
                    />
                  )}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={filterValue ? 2 : 8}
                style={{ textAlign: "end" }}
              >
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleDownload}
                >
                  Download CSV
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
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center" marginBottom="10px">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Customer List
                </h3>
              </Box>
            </Grid>
          </Grid>

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
                </TableRow>
              </TableHead>
              <TableBody>
                {productBaseCustomer.length > 0 &&
                  productBaseCustomer.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.customer}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.brand}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.date}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                {productBaseCustomer.length === 0 && (
                  <TableRow>
                    <StyledTableCell colSpan={6} align="center">
                      No Data Available
                    </StyledTableCell>
                  </TableRow>
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
