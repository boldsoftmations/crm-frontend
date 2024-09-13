import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CustomLoader } from "../../Components/CustomLoader";

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
  transition: width 0.5s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: ${(props) =>
    props.isEnlarged
      ? "0px 2px 10px rgba(0, 0, 0, 0.3)"
      : "0px 2px 10px rgba(0, 0, 0, 0.3)"};
`;

const Video = styled.video`
  width: ${(props) => (props.isEnlarged ? "500px" : "200px")};
  height: auto;
  cursor: pointer;
  transition: width 0.5s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: ${(props) =>
    props.isEnlarged
      ? "0px 2px 10px rgba(0, 0, 0, 0.3)"
      : "0px 2px 10px rgba(0, 0, 0, 0.3)"};
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
  console.log(imagesData);
  const [enlargedMedia, setEnlargedMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [imagesData]);

  const handleMediaClick = (media) => {
    setEnlargedMedia(enlargedMedia === media ? null : media);
  };

  const renderMedia = (media, index) => {
    console.log(media);
    const isVideo = media.media_type && media.media_type.startsWith("Video");

    if (isVideo) {
      return (
        <Video
          key={index}
          src={media.file}
          controls
          isEnlarged={enlargedMedia === media}
          onClick={() => handleMediaClick(media)}
          onLoadedData={() => setLoading(false)} // Ensure loading state is updated for videos
        />
      );
    } else {
      return (
        <Media
          key={index}
          src={media.file}
          alt={`Media ${index + 1}`}
          isEnlarged={enlargedMedia === media}
          onClick={() => handleMediaClick(media)}
          onLoad={() => setLoading(false)} // Ensure loading state is updated for images
        />
      );
    }
  };

  return (
    <StyledTableCell>
      {loading ? (
        <CustomLoader open={loading} />
      ) : imagesData.length === 0 ? (
        <Message>No media available</Message>
      ) : (
        <MediaContainer>
          {imagesData.map((media, index) => (
            <MediaWrapper key={index}>
              <Heading>Media {index + 1}</Heading>
              {renderMedia(media, index)}
            </MediaWrapper>
          ))}
        </MediaContainer>
      )}
    </StyledTableCell>
  );
};

export default ImageView;
