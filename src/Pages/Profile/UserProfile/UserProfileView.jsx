import React, { useEffect, useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTable } from "../../../Components/CustomTable";
import { Popup } from "../../../Components/Popup";
import { UserProfileUpdate } from "./UserProfileUpdate";
import { CSVLink } from "react-csv";
import {
  Box,
  Button,
  Grid,
  Paper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

export const UserProfileView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [IDForEdit, setIDForEdit] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllUserProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await UserProfileService.getAllUserProfileData();
      if (response.data) {
        setUserProfiles(response.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUserProfileData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  const Tableheaders = [
    "EMP ID",
    "FIRST NAME",
    "LAST NAME",
    "PERSONAL CONTACT",
    "PERSONAL EMAIL",
    "DATE OF BIRTH",
    "DATE OF JOINING",
    "ACTION",
  ];

  const filteredUserProfiles = userProfiles.filter((user) =>
    Object.values(user.personal || {}).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatDate = (dateString) => {
    return dateString
      ? new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(dateString))
      : "-";
  };

  const getCsvData = () => {
    return filteredUserProfiles.map((user) => {
      const ID = user.id || "-";
      const personal = user.personal || {};
      const kyc = user.kyc || {};
      const pfEsiDetails = user.pf_esi_details || {};
      const employmentHistory = user.employment_history || [{}];
      const education = user.education || {};
      const emergencyContacts = user.emergency_contacts || [{}];

      const school = education.school || {};
      const college = education.college || {};
      const diploma = education.diploma || {};
      const graduation = education.graduation || {};
      const pg = education.pg || {};
      const additional_qualification = education.additional_qualifiction || "-";

      return {
        ID: ID || "-",
        "First Name": personal.first_name || "-",
        "Middle Name": personal.middle_name || "-",
        "Last Name": personal.last_name || "-",
        Email: personal.email || "-",
        Contact: personal.contact || "-",
        "Date of Birth": personal.date_of_birth || "-",
        "Place of Birth": personal.place_of_birth || "-",
        Nationality: personal.nationality || "-",
        "Marital Status": personal.marital_status || "-",
        "Marriage Date": personal.marriage_date || "-",
        "Date of Joining": personal.date_of_joining || "-",
        "Blood Group": personal.blood_group || "-",
        "Bank Name": kyc.name || "-",
        "Account Number": kyc.account_number || "-",
        "IFSC Code": kyc.ifsc_code || "-",
        Branch: kyc.branch || "-",
        "Bank City": kyc.city || "-",
        "Bank State": kyc.state || "-",
        "Bank Address": kyc.address || "-",
        "PAN Card Number": kyc.pan_card_number || "-",
        "Aadhar Card Number": kyc.aadhar_card_number || "-",
        "Passport Number": kyc.passport_number || "-",
        "DL Number": kyc.dl_number || "-",
        "Emergency Contact Name": emergencyContacts[0].name || "-",
        "Emergency Contact Relationship":
          emergencyContacts[0].relationship || "-",
        "Emergency Contact Number": emergencyContacts[0].number || "-",
        "Has PF ESI Account": pfEsiDetails.has_pf_esi_account || "-",
        "UAN Number": pfEsiDetails.uan_number || "-",
        "PF Number": pfEsiDetails.pf_number || "-",
        "ESI Number": pfEsiDetails.esi_number || "-",
        "Employment Company Name": employmentHistory[0].company_name || "-",
        "Employment Post Held": employmentHistory[0].post_held || "-",
        "Employment Worked From": employmentHistory[0].workedFrom || "-",
        "Employment Worked Till": employmentHistory[0].workedTill || "-",
        "School Name": school.name || "-",
        "School Board": school.board || "-",
        "School Passout": school.passout || "-",
        "College Name": college.name || "-",
        "College Board": college.board || "-",
        "College Passout": college.passout || "-",
        "Diploma Type": diploma.type || "-",
        "Diploma Uni Name": diploma.uni_name || "-",
        "Diploma Passout": diploma.passout || "-",
        "Graduation Type": graduation.type || "-",
        "Graduation University": graduation.university || "-",
        "Graduation Passout": graduation.passout || "-",
        "PG Masters": pg.masters || "-",
        "PG Passout": pg.passout || "-",
        "Additional Qualification": additional_qualification || "-",
      };
    });
  };

  const getCsvHeaders = () => {
    return [
      { label: "ID", key: "ID" },
      { label: "First Name", key: "First Name" },
      { label: "Middle Name", key: "Middle Name" },
      { label: "Last Name", key: "Last Name" },
      { label: "Email", key: "Email" },
      { label: "Contact", key: "Contact" },
      { label: "Date of Birth", key: "Date of Birth" },
      { label: "Place of Birth", key: "Place of Birth" },
      { label: "Nationality", key: "Nationality" },
      { label: "Marital Status", key: "Marital Status" },
      { label: "Marriage Date", key: "Marriage Date" },
      { label: "Date of Joining", key: "Date of Joining" },
      { label: "Blood Group", key: "Blood Group" },
      { label: "Bank Name", key: "Bank Name" },
      { label: "Account Number", key: "Account Number" },
      { label: "IFSC Code", key: "IFSC Code" },
      { label: "Branch", key: "Branch" },
      { label: "Bank City", key: "Bank City" },
      { label: "Bank State", key: "Bank State" },
      { label: "Bank Address", key: "Bank Address" },
      { label: "PAN Card Number", key: "PAN Card Number" },
      { label: "Aadhar Card Number", key: "Aadhar Card Number" },
      { label: "Passport Number", key: "Passport Number" },
      { label: "DL Number", key: "DL Number" },
      { label: "Emergency Contact Name", key: "Emergency Contact Name" },
      {
        label: "Emergency Contact Relationship",
        key: "Emergency Contact Relationship",
      },
      { label: "Emergency Contact Number", key: "Emergency Contact Number" },
      { label: "Has PF ESI Account", key: "Has PF ESI Account" },
      { label: "UAN Number", key: "UAN Number" },
      { label: "PF Number", key: "PF Number" },
      { label: "ESI Number", key: "ESI Number" },
      { label: "Employment Company Name", key: "Employment Company Name" },
      { label: "Employment Post Held", key: "Employment Post Held" },
      { label: "Employment Worked From", key: "Employment Worked From" },
      { label: "Employment Worked Till", key: "Employment Worked Till" },
      { label: "School Name", key: "School Name" },
      { label: "School Board", key: "School Board" },
      { label: "School Passout", key: "School Passout" },
      { label: "College Name", key: "College Name" },
      { label: "College Board", key: "College Board" },
      { label: "College Passout", key: "College Passout" },
      { label: "Diploma Type", key: "Diploma Type" },
      { label: "Diploma Uni Name", key: "Diploma Uni Name" },
      { label: "Diploma Passout", key: "Diploma Passout" },
      { label: "Graduation Type", key: "Graduation Type" },
      { label: "Graduation University", key: "Graduation University" },
      { label: "Graduation Passout", key: "Graduation Passout" },
      { label: "PG Masters", key: "PG Masters" },
      { label: "PG Passout", key: "PG Passout" },
      { label: "Additional Qualification", key: "Additional Qualification" },
    ];
  };

  // Usage
  const csvHeaders = getCsvHeaders();
  const csvData = getCsvData();

  const data = filteredUserProfiles.map((user) => ({
    employee_id: user.id,
    first_name: user.personal.first_name || "-",
    last_name: user.personal.last_name || "-",
    phone_number: user.personal.contact || "-",
    personal_email: user.personal.email || "-",
    date_of_birth: user.personal.date_of_birth
      ? formatDate(user.personal.date_of_birth)
      : "-",
    date_of_joining: user.personal.date_of_joining
      ? formatDate(user.personal.date_of_joining)
      : "-",
  }));

  const openInPopup = (item) => {
    setIDForEdit(item.id);
    setOpenPopup(true);
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />

      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Personal Profiles
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CSVLink
                  data={csvData}
                  headers={csvHeaders}
                  filename="user_profiles.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                >
                  <Button variant="contained" color="secondary" textAlign="end">
                    Export Information
                  </Button>
                </CSVLink>
              </Grid>
            </Grid>
          </Box>

          {filteredUserProfiles.length > 0 && (
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
                    {Tableheaders.map((header, i) => {
                      return (
                        <StyledTableCell key={i} align="center">
                          {header}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, i) => (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.employee_id}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.first_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.last_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.phone_number}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.personal_email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.date_of_birth}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.date_of_joining}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => openInPopup(row)}
                        >
                          View
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>

      <Popup
        fullScreen={true}
        title={"Update User Profile"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserProfileUpdate
          setOpenPopup={setOpenPopup}
          IDForEdit={IDForEdit}
          getAllUserProfileData={getAllUserProfileData}
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
