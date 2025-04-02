import { useState } from "react";

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    landlordEmail: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/listings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseInt(form.price) }),
    });
    const data = await res.json();
    alert(data.message || "Listing created!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Listing</h2>
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <input placeholder="Price" onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Landlord Email" onChange={(e) => setForm({ ...form, landlordEmail: e.target.value })} />
      <button type="submit">Create</button>
    </form>
  );
}
