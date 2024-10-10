import React, { useEffect, useState } from "react";
import TaskService from "../../services/TaskService";
import { CustomTable } from "../../Components/CustomTable";
import { CustomLoader } from "../../Components/CustomLoader";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
import CustomerServices from "../../services/CustomerService";

export const ActiveUsers = () => {
  const [open, setOpen] = useState(false);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [activeUsersByIDData, setActiveUsersByIDData] = useState([]);
  const [state, setState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [manageGroup, setManageGroup] = useState([]);
  const [selectedGrp, setSelectedGrp] = useState("");
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [selectedStateCities, setSelectedStateCities] = useState({});

  const handleSelectChange = (name, value) => {
    setActiveUsersByIDData({
      ...activeUsersByIDData,
      [name]: value,
    });
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
      setOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const getAllStatesList = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllStatesList();
      setState((prevLocationData) => ({
        ...prevLocationData, // Keep previous state data in the component's state
        ...(activeUsersByIDData.state || {}), // Add previous data from activeUsersByIDData.state (if it exists)
        ...response.data, // Append new state data from the API response
      }));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllUsersDetails();
  }, []);

  useEffect(() => {
    if (
      activeUsersByIDData &&
      activeUsersByIDData.groups &&
      activeUsersByIDData.groups.includes("Customer Relationship Executive")
    ) {
      getAllStatesList();
    }
  }, [activeUsersByIDData.groups]);

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
        ref_user: activeUsersByIDData.ref_user,
        ...(Object.keys(selectedStateCities).length > 0 && {
          state: selectedStateCities,
        }), // Conditionally include the state only if it's not empty
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

  const getAllGroupsUser = async () => {
    try {
      setOpen(true);
      const response = await TaskService.getAllGroupsUser();

      const groupData = response.data.data.map((group) => {
        const key = Object.keys(group)[0];
        const value = group[key];
        return { key, value };
      });

      setManageGroup(groupData);
      setOpen(false);
    } catch (error) {
      handleError(error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllGroupsUser();
  }, []);

  const filterGroup = manageGroup.find((group) => group.key === selectedGrp);

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

  const groups = [
    "Sales Assistant Deputy Manager",
    "Sales Deputy Manager",
    "Sales Manager",
    "Customer Relationship Manager",
    "Business Development Manager",
  ];
  useEffect(() => {
    if (activeUsersByIDData && activeUsersByIDData.state) {
      setSelectedStateCities((prev) => ({
        ...prev,
        ...activeUsersByIDData.state, // Merge existing states with new activeUsersByIDData.state
      }));
    }
  }, [activeUsersByIDData]);

  const handleCheck = (event, state, cities = []) => {
    setSelectedStateCities((prev) => {
      const newSelectedStateCities = { ...prev };

      if (event.target.checked) {
        // Select the state and all its cities
        newSelectedStateCities[state] = cities;
      } else {
        // Deselect the state and remove it from the object
        delete newSelectedStateCities[state];
      }

      return newSelectedStateCities;
    });
  };

  const handleCityCheck = (event, state, city) => {
    setSelectedStateCities((prev) => {
      const newSelectedStateCities = { ...prev };

      // If the state is already present in the object
      if (newSelectedStateCities[state]) {
        if (event.target.checked) {
          // Add the city to the array
          newSelectedStateCities[state] = [
            ...newSelectedStateCities[state],
            city,
          ];
        } else {
          // Remove the city from the array
          newSelectedStateCities[state] = newSelectedStateCities[state].filter(
            (c) => c !== city
          );

          // If no cities are left, remove the state from the object
          if (newSelectedStateCities[state].length === 0) {
            delete newSelectedStateCities[state];
          }
        }
      } else if (event.target.checked) {
        // If the state is not in the object, add the city under the state
        newSelectedStateCities[state] = [city];
      }

      return newSelectedStateCities;
    });
  };

  const isStateHighlighted = (state) =>
    selectedStateCities[state] && selectedStateCities[state].length > 0;

  const isChecked = (state, city) =>
    (selectedStateCities[state] && selectedStateCities[state].includes(city)) ||
    false;

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

            <Grid item xs={12} sm={12}>
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

            {activeUsersByIDData &&
              activeUsersByIDData.groups &&
              activeUsersByIDData.groups.includes(
                "Customer Relationship Executive"
              ) && (
                <Grid item xs={12}>
                  <TreeView
                    aria-label="checkbox tree"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{
                      flexGrow: 1,
                      overflowY: "auto",
                      maxHeight: 400,
                      mx: "10px",
                    }}
                  >
                    {Object.entries(state).map(
                      ([state, cities], stateIndex) => {
                        const stateId = `state-${stateIndex}`;

                        return (
                          <TreeItem
                            key={stateId}
                            nodeId={stateId}
                            label={
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={isStateHighlighted(state)}
                                    onChange={(event) =>
                                      handleCheck(event, state, cities)
                                    }
                                  />
                                }
                                label={state}
                                sx={{
                                  color: isStateHighlighted(state)
                                    ? "blue"
                                    : "inherit",
                                  fontWeight: isStateHighlighted(state)
                                    ? "bold"
                                    : "normal",
                                }}
                              />
                            }
                          >
                            {cities.map((city, cityIndex) => {
                              const cityId = `city-${stateIndex}-${cityIndex}`;

                              return (
                                <TreeItem
                                  key={cityId}
                                  nodeId={cityId}
                                  label={
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={isChecked(state, city)}
                                          onChange={(event) =>
                                            handleCityCheck(event, state, city)
                                          }
                                        />
                                      }
                                      label={city}
                                    />
                                  }
                                />
                              );
                            })}
                          </TreeItem>
                        );
                      }
                    )}
                  </TreeView>
                </Grid>
              )}

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                id="grouped-demo"
                size="small"
                onChange={(event, value) => {
                  setSelectedGrp(value);
                }}
                options={groups} // Now contains all keys
                renderInput={(params) => (
                  <CustomTextField {...params} label="Reports" />
                )}
              />
            </Grid>

            {selectedGrp && (
              <Grid item xs={12} sm={6}>
                <CustomAutocomplete
                  id="grouped-demo"
                  size="small"
                  onChange={(event, value) => {
                    handleSelectChange("ref_user", value);
                  }}
                  options={filterGroup.value} // Display associated emails
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
