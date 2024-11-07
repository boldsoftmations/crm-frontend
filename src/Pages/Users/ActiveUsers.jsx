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
                  Active Employees
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
