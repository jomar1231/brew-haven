/**
 * BREW HAVEN - Badge Component
 * Usage: <Badge color="green">Bestseller</Badge>
 */

export default function Badge({ children, color = "brown" }) {
  // ── Color Styles ─────────────────────────
  const colors = {
    brown: { backgroundColor: "#faefd8", color: "#7b3f1e" },
    green: { backgroundColor: "#dcfce7", color: "#166534" },
    red:   { backgroundColor: "#fee2e2", color: "#991b1b" },
    blue:  { backgroundColor: "#dbeafe", color: "#1e40af" },
    yellow:{ backgroundColor: "#fef9c3", color: "#854d0e" },
    gray:  { backgroundColor: "#f3f4f6", color: "#374151" },
  };

  return (
    <span
      style={colors[color] || colors.brown}
      className="inline-block px-2 py-0.5 rounded-full
                 text-xs font-bold uppercase tracking-wide"
    >
      {children}
    </span>
  );
}