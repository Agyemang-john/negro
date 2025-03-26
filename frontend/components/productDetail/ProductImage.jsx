import React from "react";
import ReactImageMagnify from "react-image-magnify";

const ProductImage = ({ mainImage }) => {
  return (
    <div style={{ width: "400px", position: "relative", zIndex: 10 }}>
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: "Product Image",
            isFluidWidth: true,
            src: mainImage,
          },
          largeImage: {
            src: mainImage,
            width: 1200, // High resolution
            height: 1200,
          },
          enlargedImageContainerDimensions: {
            width: "150%",
            height: "100%",
          },
        }}
      />
    </div>
  );
};

export default ProductImage;
