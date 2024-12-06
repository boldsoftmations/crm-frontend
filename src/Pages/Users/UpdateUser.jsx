import React, { useEffect, useState } from "react";
import { MessageAlert } from "../../Components/MessageAlert";
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
  Typography,
} from "@mui/material";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import TaskService from "../../services/TaskService";
import CustomTextField from "../../Components/CustomTextField";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomerServices from "../../services/CustomerService";

const UpdateUser = ({
  editData,
  getAllUsersDetails,
  setOpenPopup,
  groupsData,
}) => {
  const [open, setOpen] = useState(false);

  const [activeUsersByIDData, setActiveUsersByIDData] = useState(editData);
  const [state, setState] = useState([]);
  const [manageGroup, setManageGroup] = useState([]);
  const [filterGroup, setFilterGroup] = useState([]);
  const [selectedGrp, setSelectedGrp] = useState(
    activeUsersByIDData.ref_user_group
  );
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [selectedStateCities, setSelectedStateCities] = useState({});

  const handleSelectChange = (name, value) => {
    setActiveUsersByIDData({
      ...activeUsersByIDData,
      [name]: value,
    });
  };

  const getAllStatesList = async () => {
    try {
      setOpen(true);

      // Fetch the new state and city data from the API
      const response = await CustomerServices.getAllStatesList();

      // Prepare the merged state
      setState((prev) => {
        // Safely access `assigned_state_city.data` or use an empty object if undefined
        const prevStateCities =
          activeUsersByIDData &&
          activeUsersByIDData.assigned_state_city &&
          activeUsersByIDData.assigned_state_city.data
            ? activeUsersByIDData.assigned_state_city.data
            : {};

        // Ensure `response.data.data` is an object or fallback to an empty object
        const newStateCities =
          response && response.data && response.data.data
            ? response.data.data
            : {};

        // Create a new object to hold the merged data
        const mergedStateCities = { ...prevStateCities };

        // Merge `newStateCities` into `mergedStateCities`
        Object.entries(newStateCities).forEach(([state, newStateData]) => {
          const newCities = Array.isArray(newStateData.cities)
            ? newStateData.cities
            : [];

          // Get previous state data or initialize it
          const prevStateData = mergedStateCities[state] || { cities: [] };

          const prevCities = Array.isArray(prevStateData.cities)
            ? prevStateData.cities
            : [];

          // Merge cities by avoiding duplicates based on city names
          const mergedCitiesMap = new Map();
          prevCities.forEach((cityObj) =>
            mergedCitiesMap.set(cityObj.city, cityObj)
          );
          newCities.forEach((cityObj) =>
            mergedCitiesMap.set(cityObj.city, cityObj)
          );

          const mergedCities = Array.from(mergedCitiesMap.values());

          // Update the state data with merged cities, keeping the original state_count
          mergedStateCities[state] = {
            state_count: newStateData.state_count, // Keep state_count from the response
            cities: mergedCities, // Only update cities, maintaining unique entries
          };
        });

        // Return the final merged object
        return mergedStateCities;
      });
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  console.log(state);

  useEffect(() => {
    getAllStatesList();
  }, [editData]);

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

  useEffect(() => {
    const filterGroups = manageGroup.find((group) => {
      const groupKey = selectedGrp;
      return group.key === groupKey;
    });
    if (filterGroups && filterGroups.value.length > 0) {
      setFilterGroup(filterGroups.value);
    }
  }, [selectedGrp]);

  useEffect(() => {
    if (
      activeUsersByIDData &&
      activeUsersByIDData.assigned_state_city &&
      activeUsersByIDData.assigned_state_city.data
    ) {
      const result = {};
      let data = activeUsersByIDData.assigned_state_city.data;
      Object.entries(data).forEach(([stateName, stateData]) => {
        result[stateName] = {
          cities: stateData.cities.map((cityObj) => cityObj.city), // Extract city names
        };
      });

      setSelectedStateCities((prev) => ({
        ...prev,
        ...result, // Merge existing states with new activeUsersByIDData.assigned_state_city
      }));
    }
  }, [activeUsersByIDData.first_name]);

  const handleCheck = (event, stateName, cities = []) => {
    setSelectedStateCities((prev) => {
      const updatedStateCities = { ...prev };

      const cityNames = cities.map((cityObj) => cityObj.city);

      if (event.target.checked) {
        // Select all cities for the state
        updatedStateCities[stateName] = { cities: cityNames };
      } else {
        // Deselect the state
        delete updatedStateCities[stateName];
      }

      return updatedStateCities;
    });
  };

  const handleCityCheck = (event, stateName, cityName) => {
    setSelectedStateCities((prev) => {
      const updatedStateCities = { ...prev };

      // Ensure the state exists in the structure
      if (!updatedStateCities[stateName]) {
        updatedStateCities[stateName] = { cities: [] };
      }

      const selectedCities = updatedStateCities[stateName].cities;

      if (event.target.checked) {
        // Add the city (avoid duplicates)
        updatedStateCities[stateName].cities = [
          ...new Set([...selectedCities, cityName]),
        ];
      } else {
        // Remove the city
        updatedStateCities[stateName].cities = selectedCities.filter(
          (city) => city !== cityName
        );

        // If no cities remain, remove the state from the structure
        if (updatedStateCities[stateName].cities.length === 0) {
          delete updatedStateCities[stateName];
        }
      }

      return updatedStateCities;
    });
  };

  const isStateFullySelected = (stateName, cities) => {
    if (
      !selectedStateCities[stateName] ||
      !selectedStateCities[stateName].cities
    ) {
      // If the state or cities data is not ready, wait or return false
      return false;
    }

    const cityNames = cities.map((cityObj) => cityObj.city);
    const selectedCities = selectedStateCities[stateName].cities; // Access cities directly

    return selectedCities.length === cityNames.length; // Fully selected when lengths match
  };

  const isStatePartiallySelected = (stateName, cities) => {
    if (
      !selectedStateCities[stateName] ||
      !Array.isArray(selectedStateCities[stateName].cities)
    ) {
      // If data is not available or cities is not an array, return false
      return false;
    }

    const cityNames = cities.map((cityObj) => cityObj.city);
    const selectedCities = selectedStateCities[stateName].cities;

    return (
      selectedCities.length > 0 && // Some cities are selected
      selectedCities.length < cityNames.length // Not all cities are selected
    );
  };
  const isChecked = (stateName, cityName) => {
    if (
      !selectedStateCities[stateName] ||
      !Array.isArray(selectedStateCities[stateName].cities)
    ) {
      // If data is not available or cities is not an array, return false
      return false;
    }

    const selectedCities = selectedStateCities[stateName].cities;

    return selectedCities.includes(cityName); // Check if the city is selected
  };

  const transformStateCities = (data) => {
    if (!data) {
      return {}; // Return an empty object if data is not provided
    }
    const result = {};

    Object.entries(data).forEach(([stateName, stateData]) => {
      result[stateName] = stateData.cities || []; // Extract cities or default to an empty array
    });

    return result;
  };

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
        state:
          (selectedStateCities && transformStateCities(selectedStateCities)) ||
          [],
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
  const groups = [
    "Sales Assistant Deputy Manager",
    "Sales Deputy Manager",
    "Sales Manager",
    "Customer Relationship Manager",
    "Business Development Manager",
  ];

  // sorting state alphabetically
  const sortStatesByName = (data) => {
    // Convert the object into an array of [key, value] pairs
    const entries = Object.entries(data);

    // Sort the array by state name (key)
    entries.sort(([stateA], [stateB]) => stateA.localeCompare(stateB));

    // Convert the sorted array back to an object
    return Object.fromEntries(entries);
  };
  const sortedData = sortStatesByName(state);

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createUsersDetails(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="First Name"
              variant="outlined"
              value={activeUsersByIDData.first_name}
              onChange={(e) => handleSelectChange("first_name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Last Name"
              variant="outlined"
              value={activeUsersByIDData.last_name}
              onChange={(e) => handleSelectChange("last_name", e.target.value)}
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
              <Box
                sx={{
                  p: 2,
                  borderColor: "grey.300",
                  borderRadius: 2,
                  maxWidth: 400,
                  mx: "auto",
                  mt: 2,
                  backgroundColor: "grey.100",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  Total Customers Assigned :{" "}
                  <strong>
                    {
                      activeUsersByIDData.assigned_state_city
                        .assigned_total_count
                    }
                  </strong>
                </Typography>
              </Box>
            )}
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
                  {sortedData &&
                    Object.entries(sortedData).map(
                      ([stateName, stateData], stateIndex) => {
                        const stateId = `state-${stateIndex}`;
                        const cities = stateData.cities || []; // Ensure cities is an array

                        return (
                          <TreeItem
                            key={stateId}
                            nodeId={stateId}
                            label={
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      !!isStateFullySelected(stateName, cities)
                                    }
                                    indeterminate={isStatePartiallySelected(
                                      stateName,
                                      cities
                                    )}
                                    onChange={(event) =>
                                      handleCheck(event, stateName, cities)
                                    }
                                    sx={{
                                      "&.Mui-checked": { color: "blue" },
                                      "&.MuiCheckbox-indeterminate": {
                                        color: "black",
                                      },
                                    }}
                                  />
                                }
                                label={`${stateName} [${
                                  stateData.state_count || 0
                                }]`}
                                sx={{
                                  color: isStatePartiallySelected(
                                    stateName,
                                    cities
                                  )
                                    ? "blue"
                                    : "inherit",
                                  fontWeight: isStateFullySelected(
                                    stateName,
                                    cities
                                  )
                                    ? "bold"
                                    : "normal",
                                }}
                              />
                            }
                          >
                            {Array.isArray(cities) &&
                              cities.map((city, cityIndex) => {
                                const cityId = `city-${stateIndex}-${cityIndex}`;
                                return (
                                  <TreeItem
                                    key={cityId}
                                    nodeId={cityId}
                                    label={
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={
                                              !!isChecked(stateName, city.city)
                                            }
                                            onChange={(event) =>
                                              handleCityCheck(
                                                event,
                                                stateName,
                                                city.city
                                              )
                                            }
                                          />
                                        }
                                        label={`${city.city} [${city.count}]`}
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
              value={selectedGrp}
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
                value={activeUsersByIDData && activeUsersByIDData.ref_user}
                options={filterGroup} // Display associated emails
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
    </>
  );
};

export default UpdateUser;
