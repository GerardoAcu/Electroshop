/**
 * Encabezado de página estándar: eyebrow + título + descripción opcional.
 * Se usa dentro del <div className="container"> de cada página.
 */
function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="page-header">
      {eyebrow && <span className="page__eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

export default PageHeader;
