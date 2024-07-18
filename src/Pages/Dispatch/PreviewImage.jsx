import { Box, Button, Grid, Paper } from "@mui/material";
import React from "react";

export const PreviewImage = ({ lrCopyImage, podCopyImage, hideImage }) => {
  return (
    <>
      <Grid container justifyContent="center">
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Box component="form" noValidate>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {hideImage ? (
                    <img
                      src={lrCopyImage ? lrCopyImage : ""}
                      alt="lrcopy"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <img
                      src={podCopyImage ? podCopyImage : ""}
                      alt="podcopy"
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
