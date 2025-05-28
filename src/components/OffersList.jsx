import React from "react";
const OffersList = ({ offers, onEdit, onDelete }) => {
 return (
<div className="container mt-4">
<div className="card shadow">
<div className="card-header bg-dark text-white">Lista de Descuentos</div>
<div className="card-body table-responsive">
<table className="table table-striped table-bordered">
<thead className="table-light">
<tr>
<th>Producto</th>
<th>Descuento</th>
<th>Desde</th>
<th>Hasta</th>
<th>Estado</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>
             {offers.map((offer) => (
<tr key={offer._id}>
<td>{offer.productId}</td>
<td>{offer.percentage ? `${offer.percentage}%` : `$${offer.value}`}</td>
<td>{offer.from?.substring(0, 10)}</td>
<td>{offer.to?.substring(0, 10)}</td>
<td>{offer.state}</td>
<td>
<div className="d-flex gap-2">
<button className="btn btn-sm btn-primary" onClick={() => onEdit(offer)}>
                       Editar
</button>
<button className="btn btn-sm btn-danger" onClick={() => onDelete(offer._id)}>
                       Borrar
</button>
</div>
</td>
</tr>
             ))}
             {offers.length === 0 && (
<tr>
<td colSpan="6" className="text-center text-muted">
                   No hay descuentos disponibles.
</td>
</tr>
             )}
</tbody>
</table>
</div>
</div>
</div>
 );
};
export default OffersList;