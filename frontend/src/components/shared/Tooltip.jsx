/**
 * Tooltip — Reusable tooltip wrapper component
 */
export default function Tooltip({ text, children, position = 'top' }) {
  return (
    <div className="tooltip-wrapper" data-tooltip={text} data-tooltip-pos={position}>
      {children}
    </div>
  );
}
