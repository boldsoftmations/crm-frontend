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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import { Popup } from "./../../../Components/Popup";
import { CreateContactDetails } from "./CreateContactDetails";
import { UpdateContactDetails } from "./UpdateContactDetails";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useSelector } from "react-redux";
import CustomerServices from "../../../services/CustomerService";
import DeleteConfirmation from "./DeletePopup";
import { WhatsappServices } from "../../../services/Whatsapp";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
    cursor: "pointer",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
    cursor: "pointer",
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

export const ContactDetails = ({ recordForEdit }) => {
  const [open, setOpen] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [IDForEdit, setIDForEdit] = useState();
  const [opendeletePopup, setOpendletePopup] = useState(false);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  // Handle checkbox changes for participants
  const [formData, setFormData] = useState({
    company: "",
    contacts: [],
  });
  const handleCheckboxChange = (contact, row) => {
    setFormData((prev) => {
      prev.company = row.company;
      // Check if a contact with the same `id` already exists
      const contactIndex = prev.contacts.findIndex(
        (item) => item.id === row.id
      );

      if (contactIndex !== -1) {
        // If the contact exists, update the object
        const existingContact = { ...prev.contacts[contactIndex] };
        const updatedContacts = [...prev.contacts];

        // Check if it's the primary or alternate contact
        if (contact === row.contact) {
          // Toggle the primary contact
          if (existingContact.contact === row.contact) {
            delete existingContact.contact; // Remove primary contact if unchecked
          } else {
            existingContact.contact = row.contact; // Add primary contact if checked
          }
        }

        if (contact === row.alternate_contact) {
          // Toggle the alternate contact
          if (existingContact.alternate_contact === row.alternate_contact) {
            delete existingContact.alternate_contact; // Remove alternate contact if unchecked
          } else {
            existingContact.alternate_contact = row.alternate_contact; // Add alternate contact if checked
          }
        }

        // Remove the object if both contacts are empty
        if (Object.keys(existingContact).length === 2) {
          updatedContacts.splice(contactIndex, 1); // Remove object if only `id` and `name` are left
        } else {
          // Update the object in the array
          updatedContacts[contactIndex] = existingContact;
        }

        return {
          ...prev,
          contacts: updatedContacts,
        };
      } else {
        // Dynamically create the new object, adding only selected keys
        const newContact = {
          id: row.id,
          name: row.name,
        };

        if (contact === row.contact) {
          newContact.contact = row.contact;
        }

        if (contact === row.alternate_contact) {
          newContact.alternate_contact = row.alternate_contact;
        }

        return {
          ...prev,
          contacts: [...prev.contacts, newContact],
        };
      }
    });
  };

  console.log(formData);

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

  const handleAddcontacts = async () => {
    try {
      setOpen(true);
      const res = await WhatsappServices.AddCustomerNumbersInPhone(formData);
      if (res.data.success === true) {
        setAlertMsg({
          message: "Whatsapp Group created successfully",
          severity: "success",
          open: true,
        });
        getAllCompanyDetailsByID();
      }
    } catch (err) {
      setAlertMsg({
        message: err.response.data.message || "Failed to create Whatsapp Group",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
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
          <Box flexGrow={0.5} align="right" mx={{ marginRight: 10 }}>
            {(userData.groups.includes("Accounts") ||
              userData.groups.includes("Director") ||
              userData.groups.includes("Customer Service") ||
              userData.groups.includes("Sales Deputy Manager") ||
              userData.groups.includes("Sales Manager") ||
              userData.groups.includes("Sales Executive") ||
              userData.groups.includes("Sales Assistant Deputy Manager")) && (
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="info"
                size="small"
                // startIcon={<AddIcon />}
              >
                Add
              </Button>
            )}
          </Box>

          {formData.contacts.length > 0 && (
            <Box flexGrow={0.5} align="right" mx={{ marginRight: 10 }}>
              {(userData.groups.includes("Director") ||
                userData.groups.includes("Customer Service")) && (
                <Button
                  onClick={handleAddcontacts}
                  variant="contained"
                  color="success"
                  size="small"
                  // startIcon={<AddIcon />}
                >
                  Add contact in group
                </Button>
              )}
            </Box>
          )}
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
                <StyledTableCell align="center">COMPANY NAME</StyledTableCell>
                <StyledTableCell align="center">NAME</StyledTableCell>
                <StyledTableCell align="center">DEPARTMENT</StyledTableCell>
                <StyledTableCell align="center">CONTACT</StyledTableCell>
                <StyledTableCell align="center">ALT. CONTACT</StyledTableCell>
                <StyledTableCell align="center">EMAIL</StyledTableCell>
                <StyledTableCell align="center">Add contact</StyledTableCell>
                <StyledTableCell align="center">ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contactData &&
                contactData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{ textTransform: "capitalize" }}
                      >
                        {row.name}
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
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Box display="block">
                          {/* Primary Contact Checkbox */}
                          <FormControlLabel
                            style={{ fontSize: "13px" }}
                            control={
                              <Checkbox
                                disabled={row.is_primary} // Disable the checkbox if the contact is the primary contact
                                checked={
                                  formData.contacts.some(
                                    (item) => item.contact === row.contact
                                  ) || row.is_primary
                                } // Check if the primary contact is in the state
                                onChange={() =>
                                  handleCheckboxChange(row.contact, row)
                                } // Handle state toggle
                              />
                            }
                            label={row.contact}
                          />

                          {/* Alternate Contact Checkbox */}
                          {row.alternate_contact && (
                            <FormControlLabel
                              style={{ fontSize: "13px" }}
                              control={
                                <Checkbox
                                  disabled={row.is_alternative}
                                  checked={
                                    // Check if the alternate contact is in the state
                                    formData.contacts.some(
                                      (item) =>
                                        item.contact ===
                                          row.alternate_contact || // If alternate contact is stored as `contact`
                                        item.alternate_contact ===
                                          row.alternate_contact // If stored as `alternate_contact`
                                    ) || row.is_alternative // If `row.is_alternate` is true, also check the box
                                  }
                                  onChange={() =>
                                    handleCheckboxChange(
                                      row.alternate_contact,
                                      row
                                    )
                                  } // Handle state toggle
                                />
                              }
                              label={row.alternate_contact}
                            />
                          )}
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap={1}
                        >
                          {(userData.groups.includes("Accounts") ||
                            userData.groups.includes("Customer Service") ||
                            userData.groups.includes("Director")) && (
                            <Button
                              size="small"
                              variant="text"
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
                              variant="text"
                              onClick={() => openDelete(row)}
                            >
                              Delete
                            </Button>
                          )}
                        </Box>
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
