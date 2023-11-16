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
import { ScriptCreate } from "./ScriptCreate";
import { Popup } from "../../../Components/Popup";
import { ScriptUpdate } from "./ScriptUpdate";
import { CustomPagination } from "../../../Components/CustomPagination";
import CustomTextField from "../../../Components/CustomTextField";
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ScriptView = () => {
  const [script, setScript] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPopupCreate, setOpenPopupCreate] = useState(false);
  const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0); // Assuming you know how many pages there are
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  useEffect(() => {
    getScriptDetails(currentPage);
  }, [currentPage, getScriptDetails]);

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

  const getScriptDetails = useCallback(
    async (page, query = searchQuery) => {
      try {
        setOpen(true);
        const response = await UserProfileService.getAllScriptData(page, query);
        setScript(response.data.results);
        const total = response.data.count;
        setPageCount(Math.ceil(total / 25));
        setOpen(false);
      } catch (error) {
        console.error("Error fetching scripts", error);
        setOpen(false);
      }
    },
    [searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
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
              onClick={() => getScriptDetails(currentPage, searchQuery)}
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
                setCurrentPage(1);
                getScriptDetails(1, "");
              }}
              fullWidth
            >
              Reset
            </Button>
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
        {script.map((item, index) => {
          const paragraphs = item.script
            ? item.script
                .split("\n")
                .filter((paragraph) => paragraph.trim() !== "")
            : [];

          return (
            <Accordion key={item.id} sx={{ margin: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                <Typography>
                  {index + 1}) Subject: {item.subject}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ marginBottom: 4 }}>
                  <Typography sx={{ my: 2 }}>
                    Script:
                    {paragraphs.map((paragraph, pIndex) => (
                      <React.Fragment key={pIndex}>
                        {paragraph}
                        <br />
                        <br />
                      </React.Fragment>
                    ))}
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography>Author: {item.author || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>
                        Updated Author: {item.updated_author || "N/A"}
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
          );
        })}
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <CustomPagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageClick={handlePageClick}
        />
      </Box>
      <Popup
        title={"Create Scripts"}
        openPopup={openPopupCreate}
        setOpenPopup={setOpenPopupCreate}
      >
        <ScriptCreate
          getScriptDetails={getScriptDetails}
          setOpenPopup={setOpenPopupCreate}
        />
      </Popup>
      <Popup
        title={"Update Script"}
        openPopup={openPopupUpdate}
        setOpenPopup={setOpenPopupUpdate}
      >
        <ScriptUpdate
          setOpenPopup={setOpenPopupUpdate}
          getScriptDetails={getScriptDetails}
          recordForEdit={recordForEdit}
        />
      </Popup>
    </>
  );
};
