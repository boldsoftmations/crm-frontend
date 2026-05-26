import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";

// ── Styled components ──────────────────────────────────────────────────────────

const StyledTableCell = styled.td`
  text-align: center;
`;

const MediaContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const MediaWrapper = styled.div`
  margin: 10px;
  text-align: center;
`;

const Media = styled.img`
  width: ${(props) => (props.isEnlarged ? "500px" : "200px")};
  height: auto;
  cursor: pointer;
  transition:
    width 0.5s ease-in-out,
    box-shadow 0.3s ease-in-out;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
`;

const Video = styled.video`
  width: ${(props) => (props.isEnlarged ? "500px" : "200px")};
  height: auto;
  cursor: pointer;
  transition:
    width 0.5s ease-in-out,
    box-shadow 0.3s ease-in-out;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
`;

const Message = styled.div`
  margin: 20px;
  font-size: 18px;
  color: #777;
`;

const Heading = styled.div`
  margin-bottom: 5px;
  font-weight: bold;
`;

// ── Header field helper ────────────────────────────────────────────────────────

const HeaderField = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.3,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: "#006BA1",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "rgb(34,34,34)",
        }}
      >
        {value ? value : "—"}
      </Typography>
    </Box>
  </Grid>
);

// ── Main component ─────────────────────────────────────────────────────────────

const CapaImageView = ({ imagesData, setImageShow }) => {
  const [enlargedMedia, setEnlargedMedia] = useState(null);
  console.log("ImageData is:", imagesData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (imagesData && imagesData.length > 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [imagesData]);

  const handleMediaClick = (media) => {
    if (enlargedMedia === media) {
      setEnlargedMedia(null);
    } else {
      setEnlargedMedia(media);
    }
  };

  const renderMedia = (media, index) => {
    console.log("media item:", media);
    console.log("media type:", media.media_type);

    const mediaType = media.media_type ? media.media_type.toLowerCase() : "";

    const isVideo = mediaType.startsWith("video");

    if (isVideo) {
      return (
        <Video
          key={index}
          src={media.file}
          controls
          controlsList="nodownload"
          isEnlarged={enlargedMedia === media}
          onClick={() => handleMediaClick(media)}
          onLoadedData={() => setLoading(false)}
        />
      );
    }

    return (
      <Media
        key={index}
        src={media.file}
        alt={`Media ${index + 1}`}
        isEnlarged={enlargedMedia === media}
        onClick={() => handleMediaClick(media)}
        onLoad={() => setLoading(false)}
      />
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* ── Header info ── */}

      {imagesData ? (
        <>
          <Box
            sx={{
              backgroundColor: "#f5f9fc",
              border: "1px solid #d0e8f5",
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: "#006BA1",
                mb: 1.5,
                fontSize: "15px",
              }}
            >
              Complaint Details
            </Typography>

            <Grid container spacing={2}>
              <HeaderField
                label="Complaint No."
                value={
                  imagesData.ccf_details
                    ? imagesData.ccf_details.complain_no
                    : ""
                }
              />

              <HeaderField
                label="Customer"
                value={
                  imagesData.ccf_details ? imagesData.ccf_details.customer : ""
                }
              />

              <HeaderField
                label="Complaint Type"
                value={imagesData && imagesData.complain_type}
              />

              <HeaderField label="Status" value={imagesData.status} />

              <HeaderField label="Created By" value={imagesData.created_by} />

              <HeaderField label="Date" value={imagesData.creation_date} />
              <HeaderField
                label="Current Status"
                value={imagesData.ccfstatus}
              />

              <HeaderField label="Updated By" value={imagesData.updated_by} />
            </Grid>
          </Box>

          <Divider sx={{ mb: 2 }} />
        </>
      ) : (
        <h1>hello</h1>
      )}

      {/* ── Media Section ── */}

      <StyledTableCell>
        {loading ? (
          <CustomLoader open={loading} />
        ) : !imagesData || imagesData.length === 0 ? (
          <Message>No media available</Message>
        ) : (
          <MediaContainer>
            {imagesData.document.map((media, index) => (
              <MediaWrapper key={index}>
                <Heading>
                  {media.media_type &&
                  media.media_type.toLowerCase().startsWith("video")
                    ? "Video"
                    : "Image"}{" "}
                  {index + 1}
                </Heading>

                {renderMedia(media, index)}
              </MediaWrapper>
            ))}
          </MediaContainer>
        )}
      </StyledTableCell>
      {/* <h1>hello</h1> */}
    </Box>
  );
};

export default CapaImageView;
