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
  const getAllStatesList = async () => {
    try {
      setOpen(true);

      // Fetch the new state and city data from the API
      const response = await CustomerServices.getAllStatesList();

      // Prepare the merged state
      setState((prev) => {
        const prevStateCities = activeUsersByIDData.state || {}; // Previous state and city data
        const newStateCities = response.data; // New state and city data from response

        // Create a new object to hold the merged data
        const mergedStateCities = { ...prevStateCities };

        // Merge newStateCities into mergedStateCities
        Object.entries(newStateCities).forEach(([state, cities]) => {
          if (mergedStateCities[state]) {
            // If the state already exists, merge cities and avoid duplicates
            mergedStateCities[state] = [
              ...new Set([...mergedStateCities[state], ...cities]),
            ];
          } else {
            // If the state does not exist, directly add it
            mergedStateCities[state] = cities;
          }
        });

        // Return the final merged object
        return {
          ...prev, // Keep other previous state
          ...mergedStateCities, // Add the merged states and cities
        };
      });
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

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

  const filterGroup = manageGroup.find((group) => group.key === selectedGrp);

  useEffect(() => {
    if (activeUsersByIDData && activeUsersByIDData.state) {
      setSelectedStateCities((prev) => ({
        ...prev,
        ...activeUsersByIDData.state, // Merge existing states with new activeUsersByIDData.state
      }));
    }
  }, [activeUsersByIDData.first_name]);

  const handleCheck = (event, state, cities = []) => {
    setSelectedStateCities((prev) => {
      const newSelectedStateCities = { ...prev };

      // If the state already exists in prev, keep it
      const existingCities = newSelectedStateCities[state] || [];

      if (event.target.checked) {
        // Add new cities to the existing cities array
        const updatedCities = [...new Set([...existingCities, ...cities])]; // Avoid duplicates
        newSelectedStateCities[state] = updatedCities;
      } else {
        // Deselect the state or individual cities based on the event
        if (cities.length === 0) {
          // If no cities are passed, deselect the entire state
          delete newSelectedStateCities[state];
        } else {
          // If cities are passed, remove only those cities
          const remainingCities = existingCities.filter(
            (city) => !cities.includes(city)
          );
          if (remainingCities.length > 0) {
            newSelectedStateCities[state] = remainingCities;
          } else {
            delete newSelectedStateCities[state]; // Remove the state if no cities remain
          }
        }
      }

      return newSelectedStateCities;
    });
  };

  const handleCityCheck = (event, state, city) => {
    setSelectedStateCities((prev) => {
      const newSelectedStateCities = { ...prev };

      // Check if the state is already present in the object
      if (newSelectedStateCities[state]) {
        if (event.target.checked) {
          // Add the city to the array, only if it doesn't already exist (avoid duplicates)
          if (!newSelectedStateCities[state].includes(city)) {
            newSelectedStateCities[state] = [
              ...newSelectedStateCities[state],
              city,
            ];
          }
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

  // Check if all cities are selected for the state
  const isStateFullySelected = (stateName, cities) => {
    return (
      selectedStateCities[stateName] &&
      selectedStateCities[stateName].length === cities.length
    );
  };

  // Check if some but not all cities are selected for the state
  const isStatePartiallySelected = (stateName, cities) => {
    return (
      selectedStateCities[stateName] &&
      selectedStateCities[stateName].length > 0 &&
      selectedStateCities[stateName].length < cities.length
    );
  };

  const isChecked = (state, city) =>
    (selectedStateCities[state] && selectedStateCities[state].includes(city)) ||
    false;
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
        state: selectedStateCities || [],
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
                  {state &&
                    Object.entries(state).map(
                      ([stateName, cities], stateIndex) => {
                        const stateId = `state-${stateIndex}`;
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
                                    } // Ensure controlled value (either true or false)
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
                                label={stateName}
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
                              cities.length > 0 &&
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
                                              !!isChecked(stateName, city)
                                            } // Ensure controlled value (either true or false)
                                            onChange={(event) =>
                                              handleCityCheck(
                                                event,
                                                stateName,
                                                city
                                              )
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
    </>
  );
};

export default UpdateUser;
