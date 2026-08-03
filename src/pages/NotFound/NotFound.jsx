import Button from "../../components/common/Button";

function NotFound() {
  return (
    <div className="page">
      <div className="container not-found">
        <span className="page__eyebrow">Error 404</span>
        <h1>No encontramos esta página</h1>
        <p>La dirección a la que intentaste acceder no existe o fue movida.</p>
        <Button to="/">Volver al inicio</Button>
      </div>
    </div>
  );
}

export default NotFound;
