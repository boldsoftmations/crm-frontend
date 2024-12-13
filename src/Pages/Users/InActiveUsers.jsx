import React, { useEffect, useState } from "react";
import TaskService from "../../services/TaskService";
import { CustomLoader } from "../../Components/CustomLoader";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
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
import { Popup } from "../../Components/Popup";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";

export const InActiveUsers = () => {
  const [open, setOpen] = useState(false);
  const [inActiveUsersData, setInActiveUsersData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [inActiveUsersByIDData, setInActiveUsersByIDData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [refUserList, setRefUserList] = useState([]);
  const [showRefUserList, setShowRefUserList] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleSelectChange = (name, value) => {
    setInActiveUsersByIDData({
      ...inActiveUsersByIDData,
      [name]: value,
    });

    const desiredRoles = [
      "Sales Executive",
      "Sales Assistant Deputy Manager",
      "Sales",
    ];

    // Check if the selected options include any of the desired roles
    if (
      name === "groups" &&
      value.some((role) => desiredRoles.includes(role))
    ) {
      setShowRefUserList(true);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  const openInPopup = (item) => {
    const data = inActiveUsersData.find(
      (users) => users.emp_id === item.emp_id
    );
    setInActiveUsersByIDData(data);
    setOpenPopup(true);
  };

  const getAllUsersDetails = async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllUsers("False");
      setGroupsData(response.data.groups);
      setInActiveUsersData(response.data.users);
      // Filter the data based on the specified roles
      const filteredData = response.data.users.filter((employee) => {
        // Check if the user is part of "Sales Deputy Manager" or "Sales Assistant Deputy Manager"
        const isManagerRole =
          employee.groups.includes("Sales Deputy Manager") ||
          employee.groups.includes("Sales Assistant Deputy Manager");

        return isManagerRole;
      });

      // Set the refUserList state with the filtered data
      setRefUserList(filteredData);
      const desiredRoles = [
        "Sales Executive",
        "Sales Assistant Deputy Manager",
        "Sales",
      ];
      // Check if any of the users in response.data.users have a role in the desiredRoles array
      const hasDesiredRole = response.data.users.some((user) =>
        user.groups.some((role) => desiredRoles.includes(role))
      );

      if (hasDesiredRole) {
        setShowRefUserList(true);
      }
      setOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllUsersDetails();
  }, []);

  const createUsersDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        first_name: inActiveUsersByIDData.first_name,
        last_name: inActiveUsersByIDData.last_name,
        contact: inActiveUsersByIDData.contact,
        email: inActiveUsersByIDData.email,
        is_active: inActiveUsersByIDData.is_active,
        group_names: inActiveUsersByIDData.groups,
        ref_user: inActiveUsersByIDData.ref_user
          ? inActiveUsersByIDData.ref_user.email
          : null,
      };
      const response = await TaskService.createUsers(
        inActiveUsersByIDData.emp_id,
        req
      );
      const successMessage =
        response.data.message || "InActive User Created successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getAllUsersDetails();
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  // Filter the productionInventoryData based on the search query
  const filteredData = inActiveUsersData.filter(
    (row) =>
      row.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof row.contact === "string" &&
        row.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
      row.groups.some((group) =>
        group.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const Tableheaders = [
    "EMP ID",
    "FirstName",
    "LastName",
    "Email",
    "Contact",
    "Designation",
    "Reporting To",
    "Action",
  ];

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
                  InActive Employees
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}></Grid>
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
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
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
        </Paper>
      </Grid>
      <Popup
        title={"Update InActive Users"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Box
          component="form"
          noValidate
          onSubmit={(e) => createUsersDetails(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                label="First Name"
                variant="outlined"
                value={inActiveUsersByIDData.first_name}
                onChange={(e) =>
                  handleSelectChange("first_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                label="Last Name"
                variant="outlined"
                value={inActiveUsersByIDData.last_name}
                onChange={(e) =>
                  handleSelectChange("last_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                label="Contact"
                variant="outlined"
                value={inActiveUsersByIDData.contact}
                onChange={(e) => handleSelectChange("contact", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                label="Email"
                variant="outlined"
                value={inActiveUsersByIDData.email}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                size="small"
                value={inActiveUsersByIDData.groups}
                onChange={(event, newValue) => {
                  handleSelectChange("groups", newValue);
                }}
                multiple
                limitTags={3}
                id="multiple-limit-tags"
                options={groupsData.map((option) => option)}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Groups"
                    placeholder="Groups"
                  />
                )}
              />
            </Grid>
            {showRefUserList && (
              <Grid item xs={12}>
                <CustomAutocomplete
                  id="grouped-demo"
                  size="small"
                  value={inActiveUsersByIDData.ref_user}
                  onChange={(event, value) => {
                    handleSelectChange("ref_user", value);
                  }}
                  options={refUserList}
                  groupBy={(option) => {
                    if (option.groups.includes("Sales Deputy Manager")) {
                      return "Sales Deputy Manager";
                    } else if (
                      option.groups.includes("Sales Assistant Deputy Manager")
                    ) {
                      return "Sales Assistant Deputy Manager";
                    } else {
                      return "Other"; // or return null if you don't want to group other roles
                    }
                  }}
                  getOptionLabel={(option) => option.email}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <CustomTextField {...params} label="Team Reference" />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inActiveUsersByIDData.is_active}
                    onChange={(e) =>
                      handleSelectChange("is_active", e.target.checked)
                    }
                  />
                }
                label="Is Active"
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            type="submit"
            size="small"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
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
