import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";

// import CustomSelect from "../../../Components/CustomSelect";
// import CustomAutocomplete from "../../../Components/CustomAutocomplete";
// import CustomSnackbar from "../../../Components/CustomerSnackbar";
import SearchComponent from "../../../Components/SearchComponent ";
// import { CustomTable } from "../../../Components/CustomTable";

const ActiveEmplyeeLead = ({ employeeStatus, employeeReport }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    // Reset to first page with no search query
  };

  const ActiveUsers = [
    ...(employeeStatus.active_user || []).map((user) => ({
      ...user,
    })),
  ];
  const filteredActiveUsers = ActiveUsers.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.employee_id &&
        user.employee_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  //inActive Emplyee

  // const handleChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  return (
    <>
      {" "}
      <Box display="flex" alignItems={"center"} justifyContent={"center"}>
        <Box flexGrow={1}>
          <SearchComponent
            onSearch={handleSearch}
            onReset={handleReset}
            alignItems={"center"}
          />
        </Box>
        <Box flexGrow={2} marginLeft={2}>
          {/* </Grid> */}

          <h3
            style={{
              textAlign: "left",
              //   marginBottom: "0.5em",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
            }}
          >
            Active Employee Lead Summary
          </h3>
        </Box>
        <Box flexGrow={0.5}></Box>
      </Box>
      <TableContainer
        component={Paper}
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
        <Table size="small" aria-label="a dense table">
          <TableHead sx={{ p: 3, position: "sticky", top: 0, zIndex: 1 }}>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              {employeeStatus.in_active_user &&
                Object.keys(employeeStatus.in_active_user[0]).map(
                  (row, index) => (
                    <TableCell
                      align="center"
                      sx={{ color: "white" }}
                      key={index}
                    >
                      {row.replaceAll("_", " ").toUpperCase()}
                    </TableCell>
                  )
                )}
              {/* <TableCell align="center" sx={{ color: "white" }}>
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody sx={{ p: 3 }}>
            {filteredActiveUsers &&
              filteredActiveUsers.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e3f2fd",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="userDatas">
                    {row.employee_id}
                  </TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.groups__name}</TableCell>
                  <TableCell align="center">{row.lead_count}</TableCell>
                  <TableCell align="center">{row.new_leads}</TableCell>
                  <TableCell align="center">{row.open_leads}</TableCell>
                  <TableCell align="center">{row.contact_leads}</TableCell>
                  <TableCell align="center">{row.not_contact_leads}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ActiveEmplyeeLead;
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));
