import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
  Chip,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Hr from "../../../services/Hr";
import { OfferStatusUpdate } from "./OfferStatusUpdate";
import { CustomLoader } from "../../../Components/CustomLoader";

export const OfferStatusView = () => {
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [offers, setOffers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoader(true);
      const response = await Hr.getOfferStatus();
      setOffers(response.data.results);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePreviewOpen = (file) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };

  const isImage = (doc) => {
    const mediaTypeLower =
      doc.media_type && doc.media_type.toLowerCase() === "photo";
    const fileExtMatch =
      doc.file && /\.(jpg|jpeg|png|gif|webp|ico|bmp|svg)(\?|$)/i.test(doc.file);
    return mediaTypeLower || fileExtMatch;
  };

  // Flatten all CAPA documents from all offers into a single list
  const capaDocuments = offers.flatMap((offer) => {
    const capaDetails = offer.capa_details;
    const docs =
      capaDetails && capaDetails.document ? capaDetails.document : [];
    return docs.map((doc) => ({
      ...doc,
      complain_no: offer.complain_no,
      customer: offer.customer,
      complaint:
        capaDetails && capaDetails.complaint
          ? capaDetails.complaint
          : offer.complaint,
      capaId: capaDetails ? capaDetails.id : null,
    }));
  });

  return (
    <Grid item xs={12}>
      <CustomLoader open={loader} />
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        {/* ───── Offer Status Table ───── */}
        <Box flexGrow={1} display="flex" justifyContent="center">
          <h3
            style={{
              marginBottom: "1em",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
            }}
          >
            Offer Status
          </h3>
        </Box>

        <TableContainer
          sx={{
            maxHeight: 440,
            "&::-webkit-scrollbar": { width: 15 },
            "&::-webkit-scrollbar-track": { backgroundColor: "#f2f2f2" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: "#aaa9ac" },
          }}
        >
          <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Candidate Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Phone Number</StyledTableCell>
                <StyledTableCell align="center">Designation</StyledTableCell>
                <StyledTableCell align="center">Location</StyledTableCell>
                <StyledTableCell align="center">Stage</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Joining Date</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.contact}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.designation}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.current_location}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.stage}</StyledTableCell>
                  <StyledTableCell align="center">{row.status}</StyledTableCell>
                  <StyledTableCell align="center">{row.doj}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleClickOpen(row)}
                    >
                      View
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ───── CAPA Documents Section ───── */}
        {capaDocuments.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />

            <Box flexGrow={1} display="flex" justifyContent="center">
              <h3
                style={{
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                CAPA Documents
              </h3>
            </Box>

            <TableContainer
              sx={{
                maxHeight: 440,
                "&::-webkit-scrollbar": { width: 15 },
                "&::-webkit-scrollbar-track": { backgroundColor: "#f2f2f2" },
                "&::-webkit-scrollbar-thumb": { backgroundColor: "#aaa9ac" },
              }}
            >
              <Table
                sx={{ minWidth: 900 }}
                stickyHeader
                aria-label="capa-documents-table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell align="center">Doc ID</StyledTableCell>
                    <StyledTableCell align="center">
                      Complaint No
                    </StyledTableCell>
                    <StyledTableCell align="center">Customer</StyledTableCell>
                    <StyledTableCell align="center">Complaint</StyledTableCell>
                    <StyledTableCell align="center">CAPA ID</StyledTableCell>
                    <StyledTableCell align="center">Media Type</StyledTableCell>
                    <StyledTableCell align="center">Preview</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {capaDocuments.map((doc, i) => (
                    <StyledTableRow key={doc.id}>
                      <StyledTableCell align="center">{i + 1}</StyledTableCell>
                      <StyledTableCell align="center">{doc.id}</StyledTableCell>
                      <StyledTableCell align="center">
                        {doc.complain_no ? doc.complain_no : "—"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {doc.customer ? doc.customer : "—"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {doc.complaint ? doc.complaint : "—"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {doc.capaId ? doc.capaId : "—"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Chip
                          icon={
                            isImage(doc) ? (
                              <ImageIcon fontSize="small" />
                            ) : (
                              <InsertDriveFileIcon fontSize="small" />
                            )
                          }
                          label={doc.media_type ? doc.media_type : "File"}
                          size="small"
                          color={isImage(doc) ? "success" : "default"}
                          variant="outlined"
                        />
                      </StyledTableCell>

                      {/* Thumbnail preview */}
                      <StyledTableCell align="center">
                        {isImage(doc) ? (
                          <Box
                            component="img"
                            src={doc.file}
                            alt={`doc-${doc.id}`}
                            onClick={() => handlePreviewOpen(doc)}
                            sx={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid #ddd",
                              cursor: "pointer",
                              transition: "transform 0.2s",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                          />
                        ) : (
                          <InsertDriveFileIcon
                            sx={{ fontSize: 40, color: "#888" }}
                          />
                        )}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Tooltip title="Open in new tab">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => window.open(doc.file, "_blank")}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* ───── Offer Status Update Dialog ───── */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Offer Status Update</DialogTitle>
          <DialogContent>
            <OfferStatusUpdate
              row={selectedRow}
              closeDialog={handleClose}
              onUpdateComplete={fetchOffers}
            />
          </DialogContent>
        </Dialog>

        {/* ───── CAPA Document Full-Preview Dialog ───── */}
        <Dialog
          open={previewOpen}
          onClose={handlePreviewClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Document Preview — ID: {previewFile ? previewFile.id : ""}
            <Chip
              label={
                previewFile && previewFile.media_type
                  ? previewFile.media_type
                  : "File"
              }
              size="small"
              sx={{ ml: 1 }}
              color="info"
            />
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", justifyContent: "center", p: 2 }}
          >
            {previewFile && isImage(previewFile) ? (
              <Box
                component="img"
                src={previewFile.file}
                alt={`preview-${previewFile.id}`}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 2,
                }}
              />
            ) : (
              <Box sx={{ textAlign: "center", p: 4 }}>
                <InsertDriveFileIcon sx={{ fontSize: 64, color: "#aaa" }} />
                <p>Preview not available for this file type.</p>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() =>
                    previewFile && window.open(previewFile.file, "_blank")
                  }
                >
                  Open File
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
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
