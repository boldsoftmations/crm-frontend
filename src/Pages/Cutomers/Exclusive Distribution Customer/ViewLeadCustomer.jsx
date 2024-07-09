import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
export const ViewLeadCustomer = (props) => {
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [open, setOpen] = useState(false);
  const { leadCustomerData, getAllEDC, closeModal, assignCustomerData } = props;

  const RemoveEdc = async (name) => {
    if (!name) {
      handleError("Name is required to remove EDC");
      return;
    }

    try {
      setOpen(true);
      await CustomerServices.RemoveEdc({ company: name });
      handleSuccess("Removed EDC successfully");
      setTimeout(() => {
        getAllEDC();
        closeModal();
      }, 500);
    } catch (err) {
      handleError(err);
      console.error("An error occurred while removing EDC:", err);
    } finally {
      setOpen(false);
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
              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: "left", md: "left" } }}
              >
                <h3 style={{ fontSize: "18px", opacity: "0.9" }}>
                  Customer Name : <strong> {assignCustomerData.name}</strong>
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
                  <StyledTableCell align="center">LEAD ID</StyledTableCell>
                  <StyledTableCell align="center">COMPANY</StyledTableCell>
                  <StyledTableCell align="center">GST NO.</StyledTableCell>
                  <StyledTableCell align="center">PAN NUMBER</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leadCustomerData &&
                  leadCustomerData.map((row, i) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align="center">
                        {row.lead_id}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.gst_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pan_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.state}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          onClick={() => RemoveEdc(row.name)}
                        >
                          Remove
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                {leadCustomerData.length == 0 && (
                  <StyledTableRow>
                    <StyledTableCell colSpan={6} align="center">
                      No Exclusive Distrubution Customers assigned yet.
                    </StyledTableCell>
                  </StyledTableRow>
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
