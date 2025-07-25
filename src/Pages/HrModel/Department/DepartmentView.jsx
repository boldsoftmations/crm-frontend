import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { DepartmentCreate } from "./DepartmentCreate";
import { DepartmentUpdate } from "./DepartmentUpdate";
import { CustomTable } from "../../../Components/CustomTable";
import Hr from "../../../services/Hr";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";

export const DepartmentView = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(false);

  const fetchDepartments = async (query = searchQuery) => {
    try {
      setOpen(true);
      const response = await Hr.getDepartment(query);
      setDepartments(response.data);
      setOpen(false);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const TableHeader = ["ID", "Department", "Action"];
  const TableData = departments.map((department) => ({
    id: department.id,
    name: department.department,
  }));

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginRight: 5, marginLeft: 5 }}
            >
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchDepartments(searchQuery)}
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    fetchDepartments("");
                  }}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  onClick={() => setOpenCreatePopup(true)}
                  variant="contained"
                  color="success"
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center">
            <h3
              style={{
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Departments
            </h3>
          </Box>
          <Paper sx={{ p: 2 }}>
            <CustomTable
              headers={TableHeader}
              data={TableData}
              openInPopup={handleEdit}
            />
          </Paper>
          <Popup
            title="Add New Department"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <DepartmentCreate
              addNewDepartment={fetchDepartments}
              setOpenCreatePopup={setOpenCreatePopup}
            />
          </Popup>
          <Popup
            title="Edit Department"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <DepartmentUpdate
              departmentId={recordForEdit}
              setOpenUpdatePopup={setOpenUpdatePopup}
              fetchDepartments={fetchDepartments}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};
