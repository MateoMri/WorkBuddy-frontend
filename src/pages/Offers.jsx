import React, { useEffect, useState } from "react";
import OfferForm from "../components/OfferForm";
import OffersList from "../components/OffersList";
const Offers = () => {
 const [offers, setOffers] = useState([]);
 const [editingOffer, setEditingOffer] = useState(null);
 useEffect(() => {
   fetchOffers();
 }, []);
 const fetchOffers = async () => {
   const res = await fetch("http://localhost:4000/wb/offers");
   const data = await res.json();
   setOffers(data);
 };
 const addOffer = async (newOffer) => {
   await fetch("http://localhost:4000/wb/offers", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(newOffer),
   });
   fetchOffers();
 };
 const updateOffer = async (id, updatedData) => {
   await fetch(`http://localhost:4000/wb/offers/${id}`, {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(updatedData),
   });
   setEditingOffer(null);
   fetchOffers();
 };
 const deleteOffer = async (id) => {
   await fetch(`http://localhost:4000/wb/offers/${id}`, {
     method: "DELETE",
   });
   fetchOffers();
 };
 return (
<div className="container mt-4">
<OfferForm
       addOffer={addOffer}
       updateOffer={updateOffer}
       editingOffer={editingOffer}
       cancelEdit={() => setEditingOffer(null)}
     />
<OffersList
       offers={offers}
       onEdit={(offer) => setEditingOffer(offer)}
       onDelete={deleteOffer}
     />
</div>
 );
};
export default Offers;