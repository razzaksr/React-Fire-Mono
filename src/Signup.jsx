import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function Signup() {
    const customersRef = collection(db, 'customers');
    const [formData, setFormData] = useState({
        customerId: '', name: '', phoneNumber: '', email: '', aadhaar: '', pan: '', address: '', password:''
    });
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSignup = async (e) => {
        try {
            e.preventDefault();
            var datas = { ...formData, customerId: uuidv4() };
            const {password, ...data} = datas;
            // alert(JSON.stringify(data))
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            await addDoc(customersRef, data);
            setFormData({ password: '', name: '', phoneNumber: '', email: '', aadhaar: '', pan: '', address: '' });
            window.location.href = "/";
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div>
        <h3>Signup</h3>
        <form>
            <input name="name" value={formData.name} placeholder="Name" onChange={handleChange} required />
            <input name="phoneNumber" value={formData.phoneNumber} placeholder="Phone" onChange={handleChange} required />
            <input name="email" value={formData.email} placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required />
            <input name="aadhaar" value={formData.aadhaar} placeholder="Aadhaar" onChange={handleChange} required />
            <input name="pan" value={formData.pan} placeholder="PAN" onChange={handleChange} required />
            <textarea name="address" value={formData.address} placeholder="Address" onChange={handleChange} required />
        </form>
        <button onClick={handleSignup}>Register</button>
        </div>
    );
}