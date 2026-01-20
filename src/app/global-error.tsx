"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
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
          <h1 style={{ fontSize: "2rem", color: "#111111" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6b6b6b" }}>Please try again</p>
          <button onClick={() => reset()}>Try Again</button>
        </div>
      </body>
    </html>
  );
}
