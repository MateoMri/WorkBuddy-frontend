import React, { useState, useEffect } from "react";
const OfferForm = ({ onCreate, onUpdate, editMode, selectedOffer, setEditMode, clearSelected }) => {
 const [form, setForm] = useState({
   productId: "",
   discountType: "",
   percentage: "",
   value: "",
   from: "",
   to: "",
   state: "Activo",
 });
 useEffect(() => {
   if (editMode && selectedOffer) {
     setForm(selectedOffer);
   } else {
     resetForm();
   }
 }, [editMode, selectedOffer]);
 const handleChange = (e) => {
   const { name, value } = e.target;
   setForm({ ...form, [name]: value });
 };
 const handleSubmit = (e) => {
   e.preventDefault();
   editMode ? onUpdate(form._id, form) : onCreate(form);
   resetForm();
 };
 const resetForm = () => {
   setForm({
     productId: "",
     discountType: "",
     percentage: "",
     value: "",
     from: "",
     to: "",
     state: "Activo",
   });
   setEditMode(false);
   clearSelected();
 };
 return (
<div className="container mt-4">
<div className="card shadow">
<div className="card-header bg-primary text-white">
         {editMode ? "Editar descuento" : "Nuevo descuento"}
</div>
<div className="card-body">
<form onSubmit={handleSubmit}>
<div className="mb-3">
<label className="form-label">ID del producto</label>
<input name="productId" className="form-control" value={form.productId} onChange={handleChange} required />
</div>
<div className="mb-3">
<label className="form-label">Tipo de descuento</label>
<input name="discountType" className="form-control" value={form.discountType} onChange={handleChange} />
</div>
<div className="mb-3">
<label className="form-label">Porcentaje (%)</label>
<input name="percentage" type="number" className="form-control" value={form.percentage} onChange={handleChange} />
</div>
<div className="mb-3">
<label className="form-label">Valor ($)</label>
<input name="value" type="number" className="form-control" value={form.value} onChange={handleChange} />
</div>
<div className="mb-3">
<label className="form-label">Desde</label>
<input name="from" type="date" className="form-control" value={form.from} onChange={handleChange} required />
</div>
<div className="mb-3">
<label className="form-label">Hasta</label>
<input name="to" type="date" className="form-control" value={form.to} onChange={handleChange} required />
</div>
<div className="mb-3">
<label className="form-label">Estado</label>
<input name="state" className="form-control" value={form.state} readOnly />
</div>
<div className="d-flex gap-2">
<button type="submit" className="btn btn-success">
               {editMode ? "Actualizar" : "Subir"}
</button>
<button type="button" className="btn btn-secondary" onClick={resetForm}>
               {editMode ? "Cancelar" : "Limpiar"}
</button>
</div>
</form>
</div>
</div>
</div>
 );
};
export default OfferForm;