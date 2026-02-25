export function Section({ title, id, children }) {
  return (
    <section className="c-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}
