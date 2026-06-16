const PaymentStatusBadge = ({ status }) => {
  let bg = "#374151"; // default (gray)
  let text = "Unknown";

  if (status === "paid") {
    bg = "#166534"; // green
    text = "Paid";
  } else if (status === "pending") {
    bg = "#92400e"; // yellow
    text = "Pending";
  } else if (status === "failed") {
    bg = "#7f1d1d"; // red
    text = "Failed";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        background: bg,
        color: "#fff",
        textTransform: "capitalize",
      }}
    >
      {text}
    </span>
  );
};

export default PaymentStatusBadge;
