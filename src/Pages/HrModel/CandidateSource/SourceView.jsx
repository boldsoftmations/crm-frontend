import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Button, Paper } from "@mui/material";
import { Popup } from "../../../Components/Popup";

import { CustomTable } from "../../../Components/CustomTable";
import CustomTextField from "../../../Components/CustomTextField";
import Hr from "../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import { SourceCreate } from "./SourceCreate";
import { SourceUpdate } from "./SourceUpdate";

export const SourceView = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sources, setSources] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const getSourcesDetails = useCallback(
    async (query = searchQuery) => {
      try {
        setOpen(true);
        const response = await Hr.getSource(query);
        setSources(response.data);
        setOpen(false);
      } catch (error) {
        console.error("Error fetching sources", error);
        setOpen(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    getSourcesDetails();
  }, [getSourcesDetails]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    getSourcesDetails();
  };

  const handleEdit = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const handleAddNew = () => {
    setRecordForEdit(null);
    setOpenCreatePopup(true);
  };

  const TableHeader = ["ID", "Source", "Action"];
  const TableData = sources.map((source) => ({
    id: source.id,
    name: source.name,
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
                  onClick={handleSearch}
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
                    getSourcesDetails("");
                  }}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  onClick={handleAddNew}
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <h3
              style={{
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Source
            </h3>
          </Box>
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={handleEdit}
          />

          <Popup
            title="Add New Source"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <SourceCreate
              setOpenCreatePopup={setOpenCreatePopup}
              getSourcesDetails={getSourcesDetails}
            />
          </Popup>
          <Popup
            title="Edit Source"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <SourceUpdate
              sourceId={recordForEdit}
              setOpenUpdatePopup={setOpenUpdatePopup}
              getSourcesDetails={getSourcesDetails}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};
