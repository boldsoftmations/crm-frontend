import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Divider,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "@mui/material";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../Images/glutape logo.jpg";
import ISO from "../../Images/ISOLogo.ico";
import MSME from "../../Images/MSME.jpeg";
import { CustomLoader } from "../../Components/CustomLoader";
// Adjust the path to your combined MSME and ISO image

const ComplainPdf = ({ pdfData }) => {
  const [open, setOpen] = useState(false);
  const componentRef = useRef();

  const downloadPDF = () => {
    const input = componentRef.current;
    setOpen(true); // Reference to the component you want to print
    html2canvas(input, {
      scale: 5, // Adjust the scale for higher resolution, lower it to reduce file size
      useCORS: true, // Ensures that external resources like images are loaded in the canvas
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.6); // Convert to JPEG and set quality (0 to 1)
        const pdf = new jsPDF("p", "pt", "a4", true); // Enable compression
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Add image to PDF
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          pdfWidth,
          pdfHeight,
          undefined,
          "FAST"
        );
        pdf.save(`Complaint_form_No_${pdfData.id}.pdf`); // Specify the file name for the download
        setOpen(false);
      })
      .catch((err) => {
        console.error("Error generating PDF", err);
        setOpen(false);
      });
  };

  return (
    <Container maxWidth="md">
      <CustomLoader open={open} />
      <Card elevation={3} sx={{ marginTop: 4 }} ref={componentRef}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 2,
              gap: "1.5rem",
            }}
          >
            <Box>
              <img src={logo} alt="Glutape Logo" height="60" />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ marginTop: "1.4rem" }}
              >
                Glutape India Private Limited
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "12px" }}>
                {pdfData.unit_address}, Email: contact@glutape.com
              </Typography>
            </Box>
            <Box style={{ display: "flex", gap: "5px" }}>
              <img src={MSME} alt="MSME" height="50" />
              <img src={ISO} alt="ISO Logos" height="50" />
            </Box>
          </Box>
          <Divider></Divider>

          <Box
            sx={{
              textAlign: "center",
              padding: 2,
              paddingBottom: 0,
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              backgroundColor: "rgba(255, 255, 255, 1)", // Corrected the backgroundColor value
              display: "flex",
            }}
          >
            <p>
              Complaint to: <strong>{pdfData.department}</strong>
            </p>
            <p>
              Complaint Type: <strong>{pdfData.complain_type}</strong>
            </p>
          </Box>

          <Divider></Divider>
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                >
                  Complaint No:
                </Typography>
                <Typography variant="body1">{pdfData.id}</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Sent By:
                </Typography>
                <Typography variant="body1">{pdfData.created_by}</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Customer Name:
                </Typography>
                <Typography variant="body1">{pdfData.customer}</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Nature of Complaint (Describe in detail):
                </Typography>
                <Typography variant="body1">{pdfData.complaint}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                >
                  Complaint For:
                </Typography>
                <Typography variant="body1">{pdfData.complain_for}</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Invoice No & Date:
                </Typography>
                <Typography variant="body1">
                  {pdfData.invoices.map((invoice, index) => (
                    <span key={index}>
                      {invoice}
                      {index < pdfData.invoices.length - 1 && (
                        <span style={{ margin: "0 5px" }}>|</span>
                      )}
                    </span>
                  ))}
                  &nbsp;& {pdfData.creation_date}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Batch Nos:
                </Typography>
                <Typography variant="body1">
                  {pdfData.batch_nos.map((batchNo, index) => (
                    <span key={index}>
                      {batchNo}
                      {index < pdfData.batch_nos.length - 1 && (
                        <span style={{ margin: "0 5px" }}>|</span>
                      )}
                    </span>
                  ))}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Application (Describe in detail):
                </Typography>
                <Typography variant="body1">{pdfData.application}</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="textSecondary"
                  sx={{ marginTop: 2 }}
                >
                  Problem :
                </Typography>
                <Typography variant="body1">{pdfData.problem}</Typography>
              </Grid>
              <Grid item xs={12}>
                <TableContainer sx={{ marginTop: 2 }}>
                  <Table aria-label="product table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Sr. No.</TableCell>
                        <TableCell align="center">Product</TableCell>
                        <TableCell align="center">Unit</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pdfData.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {product.product}
                          </TableCell>
                          <TableCell align="center">{product.unit}</TableCell>
                          <TableCell align="center">
                            {product.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          Download PDF
        </Button>
      </Box>
    </Container>
  );
};

export default ComplainPdf;
