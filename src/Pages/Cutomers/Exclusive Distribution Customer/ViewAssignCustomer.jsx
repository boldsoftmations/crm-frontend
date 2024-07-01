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
import { Popup } from "../../../Components/Popup";
import { CreateEDC } from "./CreateEDC";

export const ViewAssignCustomers = (props) => {
  const [openEDC, setOpenEDC] = useState(false);
  const { assignCustomerData, getAllEDC, closeModal } = props;
  return (
    <>
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenEDC(true)}
                >
                  Add
                </Button>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {assignCustomerData.assign_customer &&
                  assignCustomerData.assign_customer.map((row, i) => (
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
                    </StyledTableRow>
                  ))}
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
