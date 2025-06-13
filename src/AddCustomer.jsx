import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddCustomer() {
  const [customer, setCustomer] = useState({
    customerId: '',
    name: '',
    phoneNumber: '',
    email: '',
    aadhaar: '',
    pan: '',
    address: ''
  });

  const handleChange = e => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const docData = {
      ...customer,
      customerId: parseInt(customer.customerId)
    };
    await addDoc(collection(db, 'customers'), docData);
    alert("Customer Added");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="customerId" placeholder="Customer ID" onChange={handleChange} required />
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="phoneNumber" placeholder="Phone" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="aadhaar" placeholder="Aadhaar" onChange={handleChange} required />
      <input name="pan" placeholder="PAN" onChange={handleChange} required />
      <textarea name="address" placeholder="Address" onChange={handleChange} required />
      <button type="submit">Add Customer</button>
    </form>
  );
}
