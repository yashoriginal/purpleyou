"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ backgroundColor: "white", margin: 0, padding: 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "white",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                color: "#111111",
                marginBottom: "1rem",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: "#6b6b6b",
                marginBottom: "2rem",
              }}
            >
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: "#5540b7",
                color: "white",
                padding: "0.75rem 2rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#3d2d7f";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "#5540b7";
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
