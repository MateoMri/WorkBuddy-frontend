import React, { useEffect, useState } from "react";
import OfferForm from "../components/OfferForm";
import OffersList from "../components/OffersList";
const Offers = () => {
 const [offers, setOffers] = useState([]);
 const [editMode, setEditMode] = useState(false);
 const [selectedOffer, setSelectedOffer] = useState(null);
 // Obtener todas las ofertas al cargar
 useEffect(() => {
   fetchOffers();
 }, []);
 const fetchOffers = async () => {
   try {
     const res = await fetch("http://localhost:3000/api/offers"); // Asegúrate de que tu backend esté en esta ruta
     const data = await res.json();
     setOffers(data);
   } catch (err) {
     console.error("Error al cargar ofertas:", err);
   }
 };
 const handleCreate = async (offer) => {
   try {
     const res = await fetch("http://localhost:3000/api/offers", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(offer),
     });
     if (res.ok) fetchOffers();
   } catch (err) {
     console.error("Error al crear oferta:", err);
   }
 };
 const handleUpdate = async (id, updatedOffer) => {
   try {
     const res = await fetch(`http://localhost:3000/api/offers/${id}`, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(updatedOffer),
     });
     if (res.ok) {
       setEditMode(false);
       setSelectedOffer(null);
       fetchOffers();
     }
   } catch (err) {
     console.error("Error al actualizar oferta:", err);
   }
 };
 const handleDelete = async (id) => {
   try {
     const res = await fetch(`http://localhost:3000/api/offers/${id}`, {
       method: "DELETE",
     });
     if (res.ok) fetchOffers();
   } catch (err) {
     console.error("Error al borrar oferta:", err);
   }
 };
 const handleEdit = (offer) => {
   setEditMode(true);
   setSelectedOffer(offer);
 };
 const clearSelected = () => {
   setSelectedOffer(null);
 };
 return (
<div className="container py-4">
<h2 className="text-center mb-4">Gestión de Descuentos</h2>
<OfferForm
       onCreate={handleCreate}
       onUpdate={handleUpdate}
       editMode={editMode}
       selectedOffer={selectedOffer}
       setEditMode={setEditMode}
       clearSelected={clearSelected}
     />
<OffersList
       offers={offers}
       onEdit={handleEdit}
       onDelete={handleDelete}
     />
</div>
 );
};
export default Offers;