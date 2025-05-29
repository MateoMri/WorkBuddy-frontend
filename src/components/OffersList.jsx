import React from "react";
const OffersList = ({ offers, onEdit, onDelete }) => {
 return (
<div className="table-responsive">
<table className="table table-bordered">
<thead className="table-dark">
<tr>
<th>Nombre del cupón</th>
<th>Porcentaje</th>
<th>Estado</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>
         {offers.length === 0 ? (
<tr>
<td colSpan="4" className="text-center">No hay cupones</td>
</tr>
         ) : (
           offers.map((offer) => (
<tr key={offer._id}>
<td>{offer.name}</td>
<td>{offer.percentage}%</td>
<td>{offer.state || "activo"}</td>
<td>
<button
                   className="btn btn-warning btn-sm me-2"
                   onClick={() => onEdit(offer)}
>
                   Editar
</button>
<button
                   className="btn btn-danger btn-sm"
                   onClick={() => onDelete(offer._id)}
>
                   Borrar
</button>
</td>
</tr>
           ))
         )}
</tbody>
</table>
</div>
 );
};
export default OffersList;