import React, { useCallback, useEffect, useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { CustomLoader } from "../../../Components/CustomLoader";
import {
  Box,
  Typography,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { CustomPagination } from "../../../Components/CustomPagination";
import { useSelector } from "react-redux";
import { ObjectionsCreate } from "./ObjectionsCreate";
import { ObjectionsUpdate } from "./ObjectionsUpdate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchComponent from "../../../Components/SearchComponent ";

export const ObjectionsView = () => {
  const [objection, setObjection] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPopupCreate, setOpenPopupCreate] = useState(false);
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const formatDate = useCallback((dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const getObjectionDetails = useCallback(
    async (page, query = searchQuery) => {
      try {
        setOpen(true);
        const response = await UserProfileService.getAllObjectionData(
          page,
          query
        );
        setObjection(response.data.results);
        const total = response.data.count;
        setTotalPages(Math.ceil(total / 25));
        setOpen(false);
      } catch (error) {
        console.error("Error fetching scripts", error);
        setOpen(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    getObjectionDetails(currentPage);
  }, [currentPage, searchQuery, getObjectionDetails]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleEditClick = (item) => {
    setRecordForEdit(item);
    setOpenPopupUpdate(true);
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ marginRight: 5, marginLeft: 5 }}
        >
          <Grid item xs={12} sm={6}>
            <SearchComponent onSearch={handleSearch} onReset={handleReset} />
          </Grid>
          {(userData.groups.includes("Sales Manager") ||
            userData.groups.includes("Sales Deputy Manager") ||
            userData.groups.includes("Sales Assistant Deputy Manager") ||
            userData.groups.includes("Director")) && (
            <Grid item xs={12} sm={2}>
              <Button
                onClick={() => setOpenPopupCreate(true)}
                variant="contained"
                color="success"
                fullWidth
              >
                Add
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>

      <Box sx={{ maxHeight: "500px", overflow: "auto" }}>
        {objection.map((item, index) => (
          <Accordion key={item.id} sx={{ margin: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
            >
              <Typography>
                {index + 1}) Question: {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ marginBottom: 4 }}>
                <Typography sx={{ my: 2 }}>Answer: {item.answer}</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography>Author: {item.created_by || "N/A"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Updated Author: {item.updated_by || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Creation Date: {formatDate(item.creation_date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Typography>
                      Updation Date: {formatDate(item.updation_date)}
                    </Typography>
                  </Grid>
                  {(userData.groups.includes("Sales Manager") ||
                    userData.groups.includes("Sales Deputy Manager") ||
                    userData.groups.includes(
                      "Sales Assistant Deputy Manager"
                    ) ||
                    userData.groups.includes("Director")) && (
                    <Grid item xs={12} sm={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Box sx={{ marginBottom: 4 }}>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Box>
      <Popup
        title={"Create Objection"}
        openPopup={openPopupCreate}
        setOpenPopup={setOpenPopupCreate}
      >
        <ObjectionsCreate
          getObjectionDetails={getObjectionDetails}
          setOpenPopup={setOpenPopupCreate}
        />
      </Popup>
      <Popup
        title={"Update Objection"}
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <ObjectionsUpdate
          setOpenPopup={setOpenPopupUpdate}
          getObjectionDetails={getObjectionDetails}
          recordForEdit={recordForEdit}
        />
      </Popup>
    </>
  );
};
