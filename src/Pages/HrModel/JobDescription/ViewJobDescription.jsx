import React, { useState, useEffect } from "react";
import {
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
  Typography,
  Grid,
} from "@mui/material";
import Hr from "../../../services/Hr";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import JobDescriptionForm from "./CreateJobDescription";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomLoader } from "../../../Components/CustomLoader";
import UpdateJobDescription from "./UpdateJobDescription";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
export const ViewJobDescription = () => {
  const [jobDescription, setJobDescription] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [addOpenPopup, setAddOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  const getJobDescription = async () => {
    try {
      setLoader(true);
      const response = await Hr.getJobDescription(currentPage, searchQuery);
      setJobDescription(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error fetching jobDescription:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getJobDescription();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };
  const handleEdit = (data) => {
    setSelectedRow(data);
    setOpenPopup(true);
  };

  //download jd pdf

  // Convert data list into numbered format
  const downloadPDF = (job) => {
    const doc = new jsPDF();

    // **Title Section**
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`${job.designation} - Job Description`, 14, 10);

    // **Prepare Table Data with Bullet Points**
    const formatList = (items) => items.map((item) => `• ${item}`).join("\n");

    const tableData = [
      ["Purpose", job.job_purpose],
      ["Reports To", job.reports_to],
      ["Direct Reports", job.directs_report],
      ["Key Responsibilities", formatList(job.kra)],
      ["Major Tasks & Responsibilities", formatList(job.mtr)],
      ["Occasional Duties", formatList(job.occasional_duties)],
      ["Education Level", job.min_education_level],
      ["Work Experience", `${job.work_experience} years`],
      ["Described Work Experience", job.desc_work_exp],
      ["Skills & Abilities", formatList(job.ssa)],
      ["Relevant Skills", formatList(job.relevant_skill)],
      ["Preferred Background", formatList(job.preferred_background)],
    ];

    // **Apply AutoTable with Better Formatting**
    autoTable(doc, {
      startY: 20, // Adjusted starting position
      margin: { top: 5, left: 10, right: 10 }, // Proper margins
      head: [["Section", "Details"]],
      body: tableData,
      styles: {
        fontSize: 10,
        cellPadding: 2, // Adds spacing inside cells
        valign: "middle", // Aligns text vertically
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 65, fontStyle: "bold", halign: "left" }, // Section Title
        1: { cellWidth: "auto", halign: "left" }, // Dynamic Width
      },
      alternateRowStyles: { fillColor: [245, 245, 245] }, // Light gray alternating rows
      didParseCell: (data) => {
        if (data.column.index === 1) {
          data.cell.styles.fontSize = 10; // Reduce font size for long texts
        }
      },
    });

    // **Save the PDF**
    doc.save(`${job.designation}_Job_Description.pdf`);
  };
  return (
    <Grid item xs={12}>
      <CustomLoader open={loader} />
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <SearchComponent onSearch={handleSearch} onReset={handleReset} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h5"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Job Description
            </Typography>
          </Grid>
          {!userData.groups.includes("HR Recruiter") && (
            <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setAddOpenPopup(true)}
              >
                Add
              </Button>
            </Grid>
          )}
        </Grid>
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
            marginTop: "20px",
          }}
        >
          <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Job Title</StyledTableCell>

                <StyledTableCell align="center">Report To</StyledTableCell>
                <StyledTableCell align="center">
                  Min Education Level
                </StyledTableCell>
                <StyledTableCell align="center">
                  Work Experience
                </StyledTableCell>
                <StyledTableCell align="center">Is JD Uploaded</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobDescription.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell align="center">
                    {row.designation}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.reports_to}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.min_education_level}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.work_experience} Years
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.jd ? "Yes" : "No"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant="text" onClick={() => downloadPDF(row)}>
                      Download pdf
                    </Button>
                    {!userData.groups.includes("HR Recruiter") && (
                      <Button
                        variant="text"
                        color="success"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </Button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <Popup
          fullScreen={true}
          title={"Create Job Description"}
          openPopup={addOpenPopup}
          setOpenPopup={setAddOpenPopup}
        >
          <JobDescriptionForm
            getJobDescription={getJobDescription}
            setOpenPopup={setAddOpenPopup}
          />
        </Popup>
        <Popup
          fullScreen={true}
          title={"Update Job Description"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <UpdateJobDescription
            data={selectedRow}
            getJobDescription={getJobDescription}
            setOpenPopup={setOpenPopup}
          />
        </Popup>
      </Paper>
    </Grid>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
