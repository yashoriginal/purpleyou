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
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#111111] mb-4">
              Something went wrong
            </h1>
            <p className="text-[#6b6b6b] mb-8">
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={() => reset()}
              className="bg-[#5540b7] text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-[#3d2d7f] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
