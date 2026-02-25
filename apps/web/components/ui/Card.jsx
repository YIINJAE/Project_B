export function Card({ children, className = "" }) {
  var mergedClassName = className ? "c-card " + className : "c-card";
  return <article className={mergedClassName}>{children}</article>;
}
