import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import CustomerServices from "../../services/CustomerService";
import { Popup } from "../../Components/Popup";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import MasterService from "../../services/MasterService";
import SearchComponent from "../../Components/SearchComponent ";

export const MasterLeadsData = ({
  getbeatCustomers,
  setOpenPopup,
  recordId,
}) => {
  const [open, setOpen] = useState(false);
  const [leadsData, setLeadsData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [beat, setBeat] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [beatData, setBeatData] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getLeadsMasterListByPincode = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getLeadsMasterListByPincode(
        pincode
      );
      setLeadsData(response.data);
    } catch (error) {
      handleError(error);
      console.log("while getting company details", error);
    } finally {
      setOpen(false);
    }
  }, [pincode]);

  useEffect(() => {
    getLeadsMasterListByPincode();
  }, [getLeadsMasterListByPincode]);

  useEffect(() => {
    const getAllMasterBeat = async () => {
      try {
        setOpen(true);
        const response = await MasterService.getMasterBeat("all");
        setBeatData(response.data || []);
      } catch (e) {
        console.log(e);
      } finally {
        setOpen(false);
      }
    };
    getAllMasterBeat();
  }, []);

  const allCustomerIds = useMemo(
    () => leadsData.map((comp) => comp.lead_id),
    [leadsData]
  );

  const isAllSelected =
    selectedLeads.length === allCustomerIds.length && allCustomerIds.length > 0;
  const isIndeterminate =
    selectedLeads.length > 0 && selectedLeads.length < allCustomerIds.length;

  const handleCheckboxChange = (id) => {
    console.log(id);
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected || isIndeterminate) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(allCustomerIds);
    }
  };

  const Tableheaders = useMemo(
    () => ["NAME", "STAGE", "CITY", "STATE", "PINCODE"],
    []
  );

  //open modal
  const HandleOpenModal = (item) => {
    setSelectedLeads(item);
    setModalOpen(true);
  };

  //beat to sales person
  const updateAssigned = async (e) => {
    try {
      setOpen(true);

      const basePayload = { lead: selectedLeads };
      const payload = recordId ? basePayload : { ...basePayload, beat };

      const response = recordId
        ? await CustomerServices.updateLeadsBeatPlan(recordId, payload)
        : await CustomerServices.addLeadsintoBeatName(payload);
      const successMessage = response.data.message;
      handleSuccess(successMessage);

      setTimeout(() => {
        setModalOpen(false);
        setSelectedLeads([]);
        getbeatCustomers();
        setOpenPopup();
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  const handleSearch = (query) => {
    setPincode(query);
  };

  const handleReset = () => {
    setPincode("");
  };
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <div>
        <div
          style={{
            padding: "16px",
            margin: "16px",
            boxShadow: "0px 3px 6px #00000029",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(255, 255, 255)", // set background color to default Paper color
          }}
        >
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "22px",
                    color: "rgba(7, 7, 7, 0.96)",
                    fontWeight: 700,
                  }}
                >
                  Leads List
                </h3>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {!recordId && selectedLeads.length > 0 && (
                  <Button
                    variant="contained"
                    onClick={() => HandleOpenModal(selectedLeads)}
                  >
                    Assign to beat
                  </Button>
                )}

                {recordId && selectedLeads.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updateAssigned}
                  >
                    Submit
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}></Grid>
            </Grid>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 400,
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
                <StyledTableRow>
                  <StyledTableCell align="center">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "white",
                        },
                      }}
                    />
                  </StyledTableCell>
                  {Tableheaders.map((header, i) => (
                    <StyledTableCell key={i} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {leadsData.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">
                      <Checkbox
                        checked={selectedLeads.includes(row.lead_id)}
                        onChange={() => handleCheckboxChange(row.lead_id)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.city}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.state}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.pincode}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // marginTop: "2em",
            }}
          ></div>

          <Popup
            maxWidth={"xl"}
            title={"Assign to Beat "}
            openPopup={modalOpen}
            setOpenPopup={setModalOpen}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomAutocomplete
                  sx={{
                    minWidth: 260,
                  }}
                  size="small"
                  onChange={(e, value) => setBeat(value)}
                  options={beatData.map((option) => option.name)}
                  getOptionLabel={(option) => `${option}`}
                  label={"Select beat Name"}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={updateAssigned}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Popup>
        </div>
      </div>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    padding: 10,
    fontSize: 12,
    backgroundColor: "#006BA1", // Remove padding from header cells
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 8, // Remove padding from body cells
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
