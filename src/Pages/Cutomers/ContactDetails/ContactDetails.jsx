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
import { CreateContactDetails } from "./CreateContactDetails";
import { UpdateContactDetails } from "./UpdateContactDetails";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useSelector } from "react-redux";
import CustomerServices from "../../../services/CustomerService";
import DeleteConfirmation from "./DeletePopup";

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

export const ContactDetails = ({ recordForEdit }) => {
  const [open, setOpen] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [IDForEdit, setIDForEdit] = useState();
  const [opendeletePopup, setOpendletePopup] = useState(false);
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
      const contactResponse = await CustomerServices.getCompanyDataByIdWithType(
        recordForEdit,
        "contacts"
      );
      setContactData(contactResponse.data.contacts);
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

  const openDelete = (item) => {
    setIDForEdit(item);
    setOpendletePopup(true);
  };
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
              Contact Details
            </h3>
          </Box>
          <Box flexGrow={0.5} align="right">
            {(userData.groups.includes("Accounts") ||
              userData.groups.includes("Customer Service") ||
              userData.groups.includes("Director")) && (
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                // startIcon={<AddIcon />}
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
                <StyledTableCell align="center">NAME</StyledTableCell>
                <StyledTableCell align="center">COMPANY NAME</StyledTableCell>
                <StyledTableCell align="center">DESIGNATION</StyledTableCell>
                <StyledTableCell align="center">CONTACT</StyledTableCell>
                <StyledTableCell align="center">ALT. CONTACT</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contactData &&
                contactData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.designation}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.contact}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.alternate_contact}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes("Customer Service") ||
                          userData.groups.includes("Director")) && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openInPopup(row.id)}
                          >
                            View
                          </Button>
                        )}
                        {(userData.groups.includes("Accounts") ||
                          userData.groups.includes("Director")) && (
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={() => openDelete(row)}
                            style={{ marginLeft: 12 }}
                          >
                            Delete
                          </Button>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* </Paper> */}
      </Grid>
      <Popup
        title={"Create Contact Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateContactDetails
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Are you sure you want to delete ?"}
        openPopup={opendeletePopup}
        setOpenPopup={setOpendletePopup}
      >
        <DeleteConfirmation
          data={IDForEdit}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpendletePopup={setOpendletePopup}
        />
      </Popup>

      <Popup
        title={"Update Contact Details"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateContactDetails
          setOpenPopup={setOpenPopup}
          IDForEdit={IDForEdit}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
        />
      </Popup>
    </>
  );
};
