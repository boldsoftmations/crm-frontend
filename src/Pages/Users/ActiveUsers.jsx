import React, { useEffect, useState } from "react";
import TaskService from "../../services/TaskService";
import { CustomTable } from "../../Components/CustomTable";
import { CustomLoader } from "../../Components/CustomLoader";
import { Box, Grid, Paper } from "@mui/material";
import { Popup } from "../../Components/Popup";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import UpdateUser from "./UpdateUser";

export const ActiveUsers = () => {
  const [open, setOpen] = useState(false);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

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
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    getAllUsersDetails();
  }, [openPopup]);

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
        <UpdateUser
          setOpenPopup={setOpenPopup}
          editData={editData}
          getAllUsersDetails={getAllUsersDetails}
          groupsData={groupsData}
        />
      </Popup>
    </>
  );
};
