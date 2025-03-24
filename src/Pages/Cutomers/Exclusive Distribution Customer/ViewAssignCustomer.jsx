import React, { useState } from "react";
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
import { Popup } from "../../../Components/Popup";
import { CreateEDC } from "./CreateEDC";
import CustomerServices from "../../../services/CustomerService";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { useSelector } from "react-redux";

export const ViewAssignCustomers = (props) => {
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const [openEDC, setOpenEDC] = useState(false);
  const [open, setOpen] = useState(false);
  const { assignCustomerData, getAllEDC, closeModal, assignViewData } = props;
  console.log(assignViewData);

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
              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: "right", md: "right" } }}
              >
                {(userData.groups.includes("Accounts") ||
                  userData.groups.includes("Director")) && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenEDC(true)}
                      >
                        Add
                      </Button>
                    </>
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
                  <StyledTableCell align="center">NAME</StyledTableCell>
                  <StyledTableCell align="center">PAN NO.</StyledTableCell>
                  <StyledTableCell align="center">GST</StyledTableCell>
                  <StyledTableCell align="center">STATE</StyledTableCell>
                  <StyledTableCell align="center">STATUS</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignViewData &&
                  assignViewData.map((row, i) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.pan_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.gst_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.state}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.status}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes("Director")) && (
                            <>
                              <Button
                                variant="text"
                                size="small"
                                style={{ backgroundColor: "red" }}
                                onClick={() => RemoveEdc(row.name)}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                {assignViewData.length === 0 && (
                  <StyledTableRow>
                    <StyledTableCell colSpan={6} align="center">
                      No Customers assigned yet.
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        title={"Assign to Exclusive Distrubution Customer"}
        openPopup={openEDC}
        setOpenPopup={setOpenEDC}
      >
        <CreateEDC
          assignCustomerData={assignCustomerData}
          getAllEDC={getAllEDC}
          closeModal={closeModal}
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
