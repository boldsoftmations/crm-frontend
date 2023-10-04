import React, { useEffect, useState } from "react";

import {
  Box,
  Grid,
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
import { Popup } from "./../../../Components/Popup";
import { CreateBankDetails } from "./CreateBankDetails";
import { UpdateBankDetails } from "./UpdateBankDetails";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useSelector } from "react-redux";

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

export const BankDetails = ({ recordForEdit }) => {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const [bankData, setBankData] = useState([]);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  // Fetch company details based on the active tab when the component mounts or the active tab changes
  useEffect(() => {
    if (recordForEdit) {
      getAllCompanyDetailsByID();
    }
  }, [recordForEdit]);

  // API call to fetch company details based on type
  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const bankResponse = await CustomerServices.getCompanyDataByIdWithType(
        recordForEdit,
        "bank"
      );
      setBankData(bankResponse.data.bank);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  console.log("bankData :>> ", bankData);
  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Box display="flex">
          <Box flexGrow={2}></Box>
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
              Bank Details
            </h3>
          </Box>
          <Box flexGrow={0.5} align="right">
            {userData.groups.toString() === "Accounts" && (
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
              >
                Add
              </Button>
            )}
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
          <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">BANK</StyledTableCell>
                <StyledTableCell align="center">ACCOUNT NO.</StyledTableCell>
                <StyledTableCell align="center">IFSC CODE</StyledTableCell>
                <StyledTableCell align="center">BRANCH</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankData &&
                bankData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{row.id}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.bank_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.current_account_no}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.ifsc_code}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.branch}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {userData.groups.toString() === "Accounts" && (
                          <Button
                            variant="contained"
                            onClick={() => openInPopup(row.id)}
                          >
                            View
                          </Button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Popup
        title={"Create Bank Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateBankDetails
          setOpenPopup={setOpenPopup2}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </Popup>
      <Popup
        title={"Update Bank Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateBankDetails
          setOpenPopup={setOpenPopup}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          idForEdit={idForEdit}
        />
      </Popup>
    </>
  );
};
