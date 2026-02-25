import Link from "next/link";

export function Button({ href, variant = "primary", children }) {
  var className = variant === "secondary" ? "c-btn c-btn-secondary" : "c-btn";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <button className={className}>{children}</button>;
}
