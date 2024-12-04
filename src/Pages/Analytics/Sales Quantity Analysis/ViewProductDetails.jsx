import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  Button,
  tableCellClasses,
} from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import DashboardService from "../../../services/DashboardService";
import { UpdateAllCompanyDetails } from "../../Cutomers/CompanyDetails/UpdateAllCompanyDetails";
import { Popup } from "../../../Components/Popup";
import { CreateCustomerProformaInvoice } from "../../Invoice/ProformaInvoice/CreateCustomerProformaInvoice";
import CustomerServices from "../../../services/CustomerService";

export const ViewProductDetails = ({
  rowData,
  startMonth,
  startYear,
  filterValue,
}) => {
  const {
    product__description__name,
    product__brand__name,
    product__unit__name,
  } = rowData;
  const [isLoading, setIsLoading] = useState(false);
  const [openPopupOfUpdateCustomer, setOpenPopupOfUpdateCustomer] =
    useState(false);
  const [openPopupInvoice, setOpenPopupInvoice] = useState(false);
  const [rowdata, setRowdata] = useState();
  const [recordForEdit, setRecordForEdit] = useState();
  const [selectedCustomers, setSelectedCustomers] = useState();
  const [salesQuantityAnalysis, setSalesQuantityAnalysis] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const getSalesQuatityAnalysisdetailsByproduct = async () => {
    setIsLoading(true);
    try {
      const response =
        await DashboardService.getSalesQuatityAnalysisdetailsByproduct(
          product__description__name,
          product__brand__name,
          product__unit__name,
          startMonth + 1,
          startYear,
          filterValue
        );
      setSalesQuantityAnalysis(response.data);
    } catch (error) {
      setAlertMsg({
        message: "Failed to fetch sales quantity analysis",
        severity: "error",
        open: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalesQuatityAnalysisdetailsByproduct();
  }, [startMonth, startYear, rowData, filterValue]);

  // Create a number formatter to add commas to the total values
  const numberFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  });

  const calculateTotals = () => {
    let totalMaxQty = 0;
    let totalCurrentMonthQty = 0;
    let totalshortQty = 0;

    salesQuantityAnalysis.forEach((row) => {
      totalMaxQty += row.max_qty || 0;
      totalCurrentMonthQty += row.current_month_qty || 0;
      totalshortQty += row.short_qty || 0;
    });

    return {
      totalMaxQty: numberFormatter.format(totalMaxQty),
      totalCurrentMonthQty: numberFormatter.format(totalCurrentMonthQty),
      totalshortQty: numberFormatter.format(totalshortQty),
    };
  };

  const totals = calculateTotals();

  const openInPopupOfUpdateCustomer = (item) => {
    setRecordForEdit(item.id);
    setSelectedCustomers(item);
    setOpenPopupOfUpdateCustomer(true);
  };

  const openInPopupInvoice = async (row) => {
    try {
      const response = await CustomerServices.getCompanyDataById(row.id);
      const data = response.data;
      setRecordForEdit(data.id);
      setRowdata(data);
      setOpenPopupInvoice(true);
    } catch (err) {
      console.log("company data by id error", err);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Sales Quantity Analysis
            </h3>
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
                  <StyledTableCell align="center">Company</StyledTableCell>
                  <StyledTableCell align="center">
                    Product Description
                  </StyledTableCell>
                  <StyledTableCell align="center">Brand</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Max Qty</StyledTableCell>
                  <StyledTableCell align="center">
                    This Month QTY
                  </StyledTableCell>
                  <StyledTableCell align="center">Short QTY</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesQuantityAnalysis.length > 0 ? (
                  salesQuantityAnalysis.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.company_name || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.description || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.brand || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.unit || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.max_qty || 0}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.current_month_qty || 0}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.short_qty}
                      </StyledTableCell>

                      <StyledTableCell align="center" display="flex" gap={2}>
                        <Button
                          sx={{ color: "#1976d2" }}
                          onClick={() => openInPopupOfUpdateCustomer(row)}
                        >
                          View
                        </Button>

                        <Button
                          sx={{ color: "#28a745" }}
                          onClick={() => openInPopupInvoice(row)}
                        >
                          Create PI
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={14}>
                      No Data Available
                    </StyledTableCell>
                  </StyledTableRow>
                )}
                {salesQuantityAnalysis.length > 0 && (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      <strong>Total</strong>
                    </StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center">
                      {totals.totalMaxQty}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {totals.totalCurrentMonthQty}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {totals.totalshortQty}
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Popup
            fullScreen={true}
            title={"Update Customer"}
            openPopup={openPopupOfUpdateCustomer}
            setOpenPopup={setOpenPopupOfUpdateCustomer}
          >
            <UpdateAllCompanyDetails
              setOpenPopup={setOpenPopupOfUpdateCustomer}
              getAllCompanyDetails={getSalesQuatityAnalysisdetailsByproduct}
              recordForEdit={recordForEdit}
              selectedCustomers={selectedCustomers}
            />
          </Popup>
          <Popup
            fullScreen={true}
            title={"Create Customer Proforma Invoice"}
            openPopup={openPopupInvoice}
            setOpenPopup={setOpenPopupInvoice}
          >
            <CreateCustomerProformaInvoice
              recordForEdit={recordForEdit}
              rowData={rowdata}
              setOpenPopup={setOpenPopupInvoice}
            />
          </Popup>
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
