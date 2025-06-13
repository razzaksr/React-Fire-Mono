import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "./firebase";
import { deleteUser,reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function CustomerCRUD() {
  const nav = useNavigate()
  const storedUser = sessionStorage.getItem("user");
  const [customer, setCustomer] = useState({
      id:'',customerId: '', name: '', phoneNumber: '', email: '', aadhaar: '', pan: '', address: '', password:''
  });

  const handleChange = e => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const fetchCustomers = async () => {
    const q = query(collection(db, "customers"), where("email", "==", storedUser));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // alert(JSON.stringify(data))
    setCustomer(data[0]);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEdit = async () => {
    await updateDoc(doc(db, "customers", customer.id), customer);
    setCustomer({
      customerId: '', name: '', phoneNumber: '',
      email: '', aadhaar: '', pan: '', address: '', password: ''
    });
    nav("/");
  };

  const handleDelete = async () => {
    var user = auth.currentUser
    try {
      // 🔐 Step 1: Re-authenticate
      const passw = prompt("enter current password","")
      const credential = EmailAuthProvider.credential(sessionStorage.getItem("user"), passw);
      await reauthenticateWithCredential(user, credential);
  
      // 🗑️ Step 2: Delete user
      await deleteUser(user);
      await deleteDoc(doc(db, "customers", customer.id));
      sessionStorage.removeItem("user"); // remove your custom email/session data
      console.log("User deleted successfully.");
      console.log("User account deleted successfully.");
  
      // 🔁 Optional: Redirect to login or home
      sessionStorage.removeItem("user");
      nav("/"); // If using react-router-dom
  
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <div>
      <h3>Manage Customer</h3>
        <form>
            <input name="name" value={customer.name} placeholder="Name" onChange={handleChange} required />
            <input name="phoneNumber" value={customer.phoneNumber} placeholder="Phone" onChange={handleChange} required />
            <input name="aadhaar" value={customer.aadhaar} placeholder="Aadhaar" onChange={handleChange} required />
            <input name="pan" value={customer.pan} placeholder="PAN" onChange={handleChange} required />
            <textarea name="address" value={customer.address} placeholder="Address" onChange={handleChange} required />
        </form>
        <button onClick={handleEdit}>Update</button>
        <button onClick={handleDelete}>Delete</button>
        <a href={`/reset/${customer.email}`}>Password Reset</a>
    </div>
  );
}