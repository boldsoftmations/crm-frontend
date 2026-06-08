import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CustomLoader } from "../../../Components/CustomLoader";

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

const ImageView = ({ imagesData }) => {
  const [enlargedMedia, setEnlargedMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [imagesData]);

  const handleMediaClick = (media) => {
    setEnlargedMedia(enlargedMedia === media ? null : media);
  };

  const getMediaKind = (media) => {
    const mediaType = media.media_type ? media.media_type.toLowerCase() : "";
    const fileUrl = (media.file || "").toLowerCase();

    if (mediaType.startsWith("video")) return "video";

    if (
      mediaType === "application/pdf" ||
      mediaType.includes("pdf") ||
      fileUrl.endsWith(".pdf") ||
      fileUrl.includes(".pdf?")
    )
      return "pdf";

    // fallback: if mediaType is octet-stream but URL hints at PDF
    if (mediaType === "application/octet-stream" && fileUrl.includes("pdf"))
      return "pdf";

    return "image";
  };

  const renderMedia = (media, index) => {
    const kind = getMediaKind(media);
    const fileUrl = media.file || "";

    // 👇 keep this until you confirm media_type values from your API
    console.log(
      `[Media ${index + 1}] kind=${kind} | media_type=${media.media_type} | file=${fileUrl}`,
    );

    if (kind === "video") {
      return (
        <Video
          key={index}
          src={fileUrl}
          controls
          controlsList="nodownload"
          isEnlarged={enlargedMedia === media}
          onClick={() => handleMediaClick(media)}
        />
      );
    }

    if (kind === "pdf") {
      return (
        <iframe
          key={index}
          src={fileUrl}
          title={`PDF-${index + 1}`}
          width="500"
          height="600"
          style={{ border: "1px solid #ccc", borderRadius: "8px" }}
        />
      );
    }

    return (
      <Media
        key={index}
        src={fileUrl}
        alt={`Image ${index + 1}`}
        isEnlarged={enlargedMedia === media}
        onClick={() => handleMediaClick(media)}
      />
    );
  };

  const getLabel = (media) => {
    const kind = getMediaKind(media);
    if (kind === "video") return "Video";
    if (kind === "pdf") return "PDF";
    return "Image";
  };

  return (
    <StyledTableCell>
      {loading ? (
        <CustomLoader open={loading} />
      ) : !imagesData || imagesData.length === 0 ? (
        <Message>No media available</Message>
      ) : (
        <MediaContainer>
          {imagesData.map((media, index) => (
            <MediaWrapper key={index}>
              <Heading>
                {getLabel(media)} {index + 1}
              </Heading>
              {renderMedia(media, index)}
            </MediaWrapper>
          ))}
        </MediaContainer>
      )}
    </StyledTableCell>
  );
};

export default ImageView;
