/**
 * BREW HAVEN - Spinner + PageLoader Components
 */

// ─────────────────────────────────────────
// Default Export — Spinner
// ─────────────────────────────────────────
export default function Spinner({ size = "md", className = "" }) {

  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]}
          rounded-full
          animate-spin
        `}
        style={{
          borderColor: "#faefd8",
          borderTopColor: "#7b3f1e",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────
// Named Export — PageLoader
// ─────────────────────────────────────────
export function PageLoader() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "#fdf8f0" }}
    >
      <div
        className="w-16 h-16 rounded-full border-4 animate-spin"
        style={{
          borderColor: "#faefd8",
          borderTopColor: "#7b3f1e",
        }}
      />
      <p className="text-sm font-bold tracking-wide"
         style={{ color: "#7b3f1e" }}>
        Brewing something special...
      </p>
    </div>
  );
}