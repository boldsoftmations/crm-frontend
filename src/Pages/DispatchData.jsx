import React, { useEffect, useState } from "react";
import moment from "moment";
import FileSaver from "file-saver";
import { CustomLoader } from "../Components/CustomLoader";
import { CustomTable } from "../Components/CustomTable";
import { CustomPagination } from "../Components/CustomPagination";
import InvoiceServices from "../services/InvoiceService";

export const DispatchData = (props) => {
  const { dispatchDataByID, setOpenPopup2 } = props;
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [pageCount, setpageCount] = useState(0);

  const handleClickLRCOPY = async (data) => {
    let url = data.lr_copy ? data.lr_copy : data.pod_copy;
    FileSaver.saveAs(url, "image");
  };

  useEffect(() => {
    if (dispatchDataByID) {
      getDispatchFilteredData();
    }
  }, [dispatchDataByID]);

  const getDispatchFilteredData = async () => {
    try {
      setOpen(true);
      const filterValue = dispatchDataByID.unit;
      const response =
        dispatchDataByID.type === "LR"
          ? await InvoiceServices.getLRCopyDashboardData(
              1,
              true,
              true,
              filterValue
            )
          : await InvoiceServices.getPODCopyDashboardData(
              1,
              true,
              true,
              filterValue
            );
      setLeads(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setOpen(true);
      const filterValue = dispatchDataByID.unit;
      const response =
        dispatchDataByID.type === "LR"
          ? await InvoiceServices.getLRCopyDashboardData(
              page,
              true,
              true,
              filterValue
            )
          : await InvoiceServices.getPODCopyDashboardData(
              page,
              true,
              true,
              filterValue
            );
      setLeads(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const Tabledata = leads.map((row, i) => {
    const LR_Copy = {
      lr_copy: row.lr_copy,
    };

    const POD_Copy = {
      pod_copy: row.pod_copy,
    };
    return {
      id: row.id,
      customer: row.customer,
      sales_invoice: row.sales_invoice,
      dispatch_location: row.dispatch_location,
      transporter: row.transporter,
      lr_number: row.lr_number,
      lr_copy: row.lr_copy !== null ? LR_Copy : null,
      pod_copy: row.pod_copy !== null ? POD_Copy : null,
      lr_date: row.lr_date,
      date: moment(row.date).format("DD-MM-YYYY"),
    };
  });

  const Tableheaders = [
    "ID",
    "Customer",
    "Sales Invoice",
    "Dispatch Location",
    "Transporter",
    "LR Number",
    "LR Copy",
    "POD Copy",
    "LR Date",
    "Date",
  ];
  return (
    <>
      <CustomLoader open={open} />

      <CustomTable
        headers={Tableheaders}
        data={Tabledata}
        Styles={{ paddingLeft: "10px", paddingRight: "10px" }}
        handleClickLRCOPY={handleClickLRCOPY}
      />
      <CustomPagination
        pageCount={pageCount}
        handlePageClick={handlePageClick}
      />
    </>
  );
};
