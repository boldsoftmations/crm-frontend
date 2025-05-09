import React, { useState } from "react";
import {
  Grid,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";
import MasterService from "../../../services/MasterService";

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

export const ViewCustomerList = ({
  customer,
  getbeatCustomers,
  customerType,
  setCustomerType,
}) => {
  const { id, customer_list, lead_list } = customer;

  const [isLoading, setIsLoading] = useState(false);
  const [customerListState, setCustomerListState] = useState(
    customerType === "Customer" ? customer_list : lead_list
  );
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleCloseSnackbar = () =>
    setAlertMsg((prev) => ({ ...prev, open: false }));

  const handleRemoveCustomerBeatList = async (data) => {
    const companyId = customerType === "Customer" ? data.id : data.lead_id;

    try {
      setIsLoading(true);

      const payload =
        customerType === "Customer"
          ? { company: companyId }
          : { lead: companyId };

      console.log("customerType", customerType);
      const response =
        customerType === "Customer"
          ? await MasterService.removeCustomterBeatList(id, payload)
          : await MasterService.removeLeadsBeatList(id, payload);
      if (response.status === 200) {
        setAlertMsg({
          message: response.data.message,
          severity: "success",
          open: true,
        });

        setTimeout(() => {
          getbeatCustomers();
          setCustomerListState((prev) =>
            prev.filter((item) =>
              customerType === "Customer"
                ? item.id !== companyId
                : item.lead_id !== companyId
            )
          );
        }, 500);
      }
    } catch (error) {
      const msg = error.response.data.message || "Unexpected Error";
      setAlertMsg({
        message: msg,
        severity: "error",
        open: true,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
                {["Customer", "State", "City", "Pincode", "Type", "Action"].map(
                  (header, index) => (
                    <StyledTableCell key={index} align="center">
                      {header}
                    </StyledTableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {customerListState.length > 0 ? (
                customerListState.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pincode}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.type_of_customer}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveCustomerBeatList(row)}
                      >
                        Remove
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};
