import React, { useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Grid, Paper } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { useSelector } from "react-redux";
import { WhatsappGroupCreate } from "./WhatsappGroupCreate";
import { Popup } from "../../Components/Popup";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";

export const WhatsappGroupView = () => {
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [openPopupWhatsapp, setOpenPopupWhatsapp] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  useEffect(() => {
    getAllWhatsappGroup();
  }, [currentPage]);

  const getAllWhatsappGroup = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getAllWhatsappGroupData(currentPage);
      setWhatsappGroupData(res.data.results);
      setPageCount(Math.ceil(res.data.count / 25));
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const Tabledata = Array.isArray(whatsappGroupData)
    ? whatsappGroupData.map((row) => ({
        name: row.name,
        whatsapp_group: row.whatsapp_group,
        whatsapp_group_id: row.whatsapp_group_id,
      }))
    : [];

  const Tableheaders = ["Comapny ", "Group Name", "Group Id"];

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                {" "}
              </Grid>
              <Grid item xs={12} sm={6} alignItems={"center"}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Customer Whatsapp Group
                </h3>
              </Grid>
            </Grid>
          </Box>
          <CustomTable headers={Tableheaders} data={Tabledata} />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
          <Popup
            title={"Send Message or File"}
            openPopup={openPopupWhatsapp}
            setOpenPopup={setOpenPopupWhatsapp}
          >
            <WhatsappGroupCreate
              // getsetWhatsappGroupDetails={getsetWhatsappGroupDetails}
              setOpenPopup={setOpenPopupWhatsapp}
            />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};
