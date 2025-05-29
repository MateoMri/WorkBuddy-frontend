import React, { useEffect, useState } from "react";
const OfferForm = ({ addOffer, updateOffer, editingOffer, cancelEdit }) => {
 const [formData, setFormData] = useState({
   name: "",
   percentage: "",
   state: "activo", // viene del backend
 });
 useEffect(() => {
   if (editingOffer) {
     setFormData({
       name: editingOffer.name,
       percentage: editingOffer.percentage,
       state: editingOffer.state || "activo",
     });
   }
 }, [editingOffer]);
 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData((prev) => ({ ...prev, [name]: value }));
 };
 const handleSubmit = (e) => {
   e.preventDefault();
   if (editingOffer) {
     updateOffer(editingOffer._id, formData);
   } else {
     addOffer(formData);
   }
   setFormData({ name: "", percentage: "", state: "activo" });
 };
 return (
<form onSubmit={handleSubmit} className="p-3 border rounded mb-4">
<h5>{editingOffer ? "Editar cupón" : "Agregar nuevo cupón"}</h5>
<div className="mb-2">
<label className="form-label">Nombre del cupón:</label>
<input
         type="text"
         className="form-control"
         name="name"
         value={formData.name}
         onChange={handleChange}
         required
       />
</div>
<div className="mb-2">
<label className="form-label">Porcentaje de descuento:</label>
<input
         type="number"
         className="form-control"
         name="percentage"
         value={formData.percentage}
         onChange={handleChange}
         min={1}
         max={100}
         required
       />
</div>
<div className="d-flex gap-2">
<button type="submit" className="btn btn-primary">
         {editingOffer ? "Actualizar" : "Agregar"}
</button>
       {editingOffer && (
<button type="button" className="btn btn-secondary" onClick={cancelEdit}>
           Cancelar
</button>
       )}
</div>
</form>
 );
};
export default OfferForm;