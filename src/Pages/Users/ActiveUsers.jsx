import React, { useEffect, useState } from "react";
import TaskService from "../../services/TaskService";
import { CustomLoader } from "../../Components/CustomLoader";
import {
  Box,
  Grid,
  Paper,
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
import { Popup } from "../../Components/Popup";
import SearchComponent from "../../Components/SearchComponent ";
import UpdateUser from "./UpdateUser";
import { SignUp } from "../Auth/SignUp";
import UserProfileService from "../../services/UserProfileService";
import CustomSnackbar from "../../Components/CustomerSnackbar";

export const ActiveUsers = () => {
  const [open, setOpen] = useState(false);
  const [openAddEmployeesPopUp, setOpenAddEmployeesPopUp] = useState(false);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(null);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  const openInPopup = (item) => {
    const data = activeUsersData.find((users) => users.emp_id === item.emp_id);
    setEditData(data);
    setOpenPopup(true);
  };

  const getAllUsersDetails = async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllUsers("True");
      setGroupsData(response.data.groups);
      setActiveUsersData(response.data.users);
      setOpen(false);
    } catch (error) {
      setAlertMsg({
        message: error.message,
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    getAllUsersDetails();
  }, []);

  const filteredData = activeUsersData.filter((user) =>
    Object.values(user || {}).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const Tableheaders = [
    "EMP ID",
    "Name",
    "Lastname",
    "Email",
    "Contact",
    "Profile",
    "Report",
    "Action",
  ];

  const handlChangePassword = async (data) => {
    setOpen(true);
    try {
      const res = await UserProfileService.resetPassword(data.emp_id);
      console.log(res.data.message);
      if (res.status === 200) {
        setAlertMsg({
          message: res.data.message || "Password reset successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          getAllUsersDetails();
        }, 1000);
      }
    } catch (err) {
      setAlertMsg({
        message: err.response.data.error || "Failed to reset password",
        severity: "error",
        open: true,
      });
      setOpen(false);
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
                  Active Employees
                </h3>
              </Grid>
              <Grid item xs={12} sm={4} justifyContent="flex-end">
                <Button
                  onClick={() => setOpenAddEmployeesPopUp(true)}
                  variant="contained"
                  color="primary"
                >
                  Add Employee
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
                {filteredData.map((row, i) => (
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
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.groups.map((row) => row).join(",")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.ref_user}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="text"
                        color="info"
                        size="small"
                        onClick={() => openInPopup(row)}
                      >
                        View
                      </Button>
                      <Button
                        variant="text"
                        color="success"
                        size="small"
                        onClick={() => handlChangePassword(row)}
                      >
                        Change password
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Popup
        title={"Update Active Users"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateUser
          setOpenPopup={setOpenPopup}
          editData={editData}
          getAllUsersDetails={getAllUsersDetails}
          groupsData={groupsData}
        />
      </Popup>

      <Popup
        maxWidth="sm"
        title={"Add New Employee"}
        openPopup={openAddEmployeesPopUp}
        setOpenPopup={setOpenAddEmployeesPopUp}
      >
        <SignUp
          setOpenPopup={setOpenAddEmployeesPopUp}
          refreshPageFunction={getAllUsersDetails}
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
