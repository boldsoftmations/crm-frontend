import React, { useEffect, useState } from "react";
import TaskService from "../../services/TaskService";
import { CustomTable } from "../../Components/CustomTable";
import { CustomLoader } from "../../Components/CustomLoader";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Paper,
} from "@mui/material";
import { Popup } from "../../Components/Popup";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";

export const ActiveUsers = () => {
  const [open, setOpen] = useState(false);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [activeUsersByIDData, setActiveUsersByIDData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [refUserList, setRefUserList] = useState([]);
  const [showRefUserList, setShowRefUserList] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleSelectChange = (name, value) => {
    setActiveUsersByIDData({
      ...activeUsersByIDData,
      [name]: value,
    });

    const desiredRoles = [
      "Sales Executive",
      "Sales Assistant Deputy Manager",
      "Sales Deputy Manager",
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
    const data = activeUsersData.find((users) => users.emp_id === item.emp_id);
    setActiveUsersByIDData(data);
    setOpenPopup(true);
  };

  const getAllUsersDetails = async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllUsers("True");
      setGroupsData(response.data.groups);
      setActiveUsersData(response.data.users);
      // Filter the data based on the specified roles
      const filteredData = response.data.users.filter((employee) => {
        // Check if the user is part of "Sales Deputy Manager" or "Sales Assistant Deputy Manager"
        const isManagerRole =
          employee.groups.includes("Sales Deputy Manager") ||
          employee.groups.includes("Sales Assistant Deputy Manager") ||
          employee.groups.includes("Sales Manager");

        return isManagerRole;
      });

      // Set the refUserList state with the filtered data
      setRefUserList(filteredData);
      const desiredRoles = [
        "Sales Executive",
        "Sales Assistant Deputy Manager",
        "Sales Deputy Manager",
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

  // Helper function to preprocess the refUserList
  const preprocessRefUserList = (list, group) => {
    if (!group) return [];

    let filteredList = [];

    if (group.includes("Sales Executive")) {
      filteredList = list.filter(
        (user) =>
          user.groups.includes("Sales Deputy Manager") ||
          user.groups.includes("Sales Assistant Deputy Manager")
      );
    } else if (group.includes("Sales Assistant Deputy Manager")) {
      filteredList = list.filter((user) =>
        user.groups.includes("Sales Deputy Manager")
      );
    } else if (group.includes("Sales Deputy Manager")) {
      filteredList = list.filter((user) =>
        user.groups.includes("Sales Manager")
      );
    }

    return filteredList.reduce((acc, user) => {
      if (
        user.groups.includes("Sales Deputy Manager") &&
        !acc.some((u) => u.email === user.email)
      ) {
        acc.push({ ...user, primaryGroup: "Sales Deputy Manager" });
      } else if (
        user.groups.includes("Sales Assistant Deputy Manager") &&
        !acc.some((u) => u.email === user.email)
      ) {
        acc.push({ ...user, primaryGroup: "Sales Assistant Deputy Manager" });
      } else if (
        user.groups.includes("Sales Manager") &&
        !acc.some((u) => u.email === user.email)
      ) {
        acc.push({ ...user, primaryGroup: "Sales Manager" });
      }
      return acc;
    }, []);
  };

  // Preprocess the refUserList
  const processedRefUserList = preprocessRefUserList(
    refUserList,
    activeUsersByIDData.groups
  );

  const selectedRefUser = processedRefUserList.find(
    (user) => user.email === activeUsersByIDData.ref_user
  );

  const createUsersDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        first_name: activeUsersByIDData.first_name,
        last_name: activeUsersByIDData.last_name,
        contact: activeUsersByIDData.contact,
        email: activeUsersByIDData.email,
        is_active: activeUsersByIDData.is_active,
        group_names: activeUsersByIDData.groups,
        ref_user: activeUsersByIDData.ref_user
          ? activeUsersByIDData.ref_user.email
          : null,
      };
      const response = await TaskService.createUsers(
        activeUsersByIDData.emp_id,
        req
      );

      const successMessage =
        response.data.message || "Active User Created successfully";
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
  const filteredData = activeUsersData.filter((user) =>
    Object.values(user || {}).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
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

  const data = filteredData.map((row) => {
    return {
      emp_id: row.emp_id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      contact: row.contact,
      groups: row.groups.map((row) => row).join(","),
      name: row.name,
    };
  });

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
                    textAlign: "left",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Active Employees
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}></Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={data}
            openInPopup={openInPopup}
            openInPopup2={null}
            Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Update Active Users"}
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
                value={activeUsersByIDData.first_name}
                onChange={(e) =>
                  handleSelectChange("first_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                size="small"
                label="Last Name"
                variant="outlined"
                value={activeUsersByIDData.last_name}
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
                value={activeUsersByIDData.contact}
                onChange={(e) => handleSelectChange("contact", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                label="Email"
                variant="outlined"
                value={activeUsersByIDData.email}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                size="small"
                value={activeUsersByIDData.groups}
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
            {selectedRefUser && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Reporting Groups"
                  variant="outlined"
                  value={selectedRefUser.primaryGroup || ""}
                />
              </Grid>
            )}
            {showRefUserList && (
              <Grid item xs={12} sm={6}>
                <CustomAutocomplete
                  id="grouped-demo"
                  size="small"
                  value={selectedRefUser}
                  onChange={(event, value) => {
                    handleSelectChange("ref_user", value);
                  }}
                  options={processedRefUserList}
                  groupBy={(option) => option.primaryGroup || null}
                  getOptionLabel={(option) => option.email}
                  renderInput={(params) => (
                    <CustomTextField {...params} label="Reports" />
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activeUsersByIDData.is_active}
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
