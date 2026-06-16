import { useEffect, useState } from "react";

const ProductImageUpload = ({ imageUrl, onImageSelect }) => {
  const [preview, setPreview] = useState(imageUrl || null);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // pass file to parent
    onImageSelect(file);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", marginBottom: 8 }}>
        Product Image
      </label>

      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: 10,
          background: "#1c1c1c",
          border: "1px dashed #444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span style={{ color: "#777", fontSize: 14 }}>
            No image selected
          </span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProductImageUpload;
