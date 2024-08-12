import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CustomLoader } from "../../../Components/CustomLoader";

const StyledTableCell = styled.td`
  text-align: center;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const ImageWrapper = styled.div`
  margin: 10px;
  text-align: center;
`;

const Image = styled.img`
  width: ${(props) => (props.isEnlarged ? "500px" : "200px")}; // Updated size
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

const CapaImageView = ({ imagesData }) => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [imagesData]);

  const handleImageClick = (image) => {
    setEnlargedImage(enlargedImage === image ? null : image);
  };

  return (
    <StyledTableCell>
      {loading ? (
        <CustomLoader open={loading} />
      ) : imagesData.length === 0 ? (
        <Message>No images available</Message>
      ) : (
        <ImageContainer>
          {imagesData.map((image, index) => (
            <ImageWrapper key={index}>
              <Heading>Image {index + 1}</Heading>
              <Image
                src={image.file}
                alt={`Image ${index + 1}`}
                isEnlarged={enlargedImage === image}
                onClick={() => handleImageClick(image)}
                onLoad={() => setLoading(false)} // Ensure loading state is updated
              />
            </ImageWrapper>
          ))}
        </ImageContainer>
      )}
    </StyledTableCell>
  );
};

export default CapaImageView;
