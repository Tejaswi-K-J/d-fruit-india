import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
          background: "var(--cream)",
        }}>
          <span style={{ fontSize: 56, marginBottom: 16 }}>🌿</span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            color: "var(--ink)",
            marginBottom: 10,
          }}>
            Something went wrong
          </h2>
          <p style={{ color: "var(--ink-muted)", marginBottom: 28, maxWidth: 420 }}>
            We hit a small snag. Please refresh the page — your cart is safe.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 28px",
              background: "var(--saffron)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r-md)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;