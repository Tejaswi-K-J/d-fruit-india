const ProductsSkeleton = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 20,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          style={{
            background: "#1c1c1c",
            padding: 15,
            borderRadius: 8,
            height: 260,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 160,
              borderRadius: 6,
              background:
                "linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.4s infinite",
            }}
          />

          <div
            style={{
              height: 16,
              width: "70%",
              marginTop: 15,
              borderRadius: 4,
              background:
                "linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.4s infinite",
            }}
          />

          <div
            style={{
              height: 14,
              width: "40%",
              marginTop: 10,
              borderRadius: 4,
              background:
                "linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.4s infinite",
            }}
          />
        </div>
      ))}

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}
      </style>
    </div>
  );
};

export default ProductsSkeleton;
