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
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../../src/Images/glutape logo.jpg";
import ISO from "../../../../src/Images/ISO.png";
import MSME from "../../../../src/Images/MSME.jpeg";
import { CustomLoader } from "../../../Components/CustomLoader";

const CapaDownload = ({ recordForEdit }) => {
  const [open, setOpen] = useState(false);
  const componentRef = useRef();

  const downloadPDF = () => {
    const input = componentRef.current;
    setOpen(true);
    html2canvas(input, {
      scale: 5,
      useCORS: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 0.6);
        const pdf = new jsPDF("p", "pt", "a4", true);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

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
        pdf.save(`CAPA_form_No_${recordForEdit.id}.pdf`);
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
                {recordForEdit.address}, Email: contact@glutape.com
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "5px" }}>
              <img src={MSME} alt="MSME" height="45" />
              <img src={ISO} alt="ISO Logos" height="45" />
            </Box>
          </Box>
          <Divider />
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Complaint No. :
                </Typography>
                <Typography variant="body2">
                  {recordForEdit.ccf_details.complain_no}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Date :
                </Typography>
                <Typography variant="body2">
                  {recordForEdit.creation_date}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" fontWeight="bold">
                  Complain Type :
                </Typography>
                <Typography variant="body2">
                  {recordForEdit.complain_type}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" fontWeight="bold">
                  Created by:
                </Typography>
                <Typography variant="body2">
                  {recordForEdit.created_by}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  Customer Complaint :
                </Typography>
                <Typography variant="body2">
                  {recordForEdit.complaint}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  Root Cause :
                </Typography>
                <Typography variant="body2">
                  {recordForEdit.root_cause}
                </Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  Corrective Action Plan :
                </Typography>
                <Typography variant="body2">{recordForEdit.cap}</Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  Preventive Action Plan :
                </Typography>
                <Typography variant="body2">{recordForEdit.pap}</Typography>
                <Divider sx={{ marginY: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">
                  Suggestion for claim settlement :
                </Typography>
                <Typography variant="body2">{recordForEdit.sfcs}</Typography>
                <Divider sx={{ marginY: 1 }} />
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

export default CapaDownload;
