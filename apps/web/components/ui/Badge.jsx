export function Badge({ children, className = "" }) {
  var mergedClassName = className ? "c-badge " + className : "c-badge";
  return <span className={mergedClassName}>{children}</span>;
}
