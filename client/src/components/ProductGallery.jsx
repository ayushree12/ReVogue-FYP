import React, { useState } from 'react';

const ProductGallery = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images?.[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt="Product main"
            className="w-full h-96 object-contain"
          />
        ) : (
          <div className="w-full h-96 bg-slate-100"></div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images?.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image.publicId || image.url}
              onClick={() => setSelectedIndex(index)}
              className={`rounded-xl overflow-hidden border-2 transition ${
                index === selectedIndex
                  ? 'border-accent/80 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-20 object-contain bg-slate-50"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
