import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';

export default function AccountCRUD() {
  const [custId,setCustId] = useState("")
  const [formData, setFormData] = useState({
    accountNumber: '', customerId: '', accountBalance: '', status: 'active'
  });
  const [accounts, setAccounts] = useState([]);
  const [editId, setEditId] = useState(null);

  const accountsRef = collection(db, 'savingsAccounts');

  const findCustomer = async() => {
    var q = query(collection(db, "customers"), where("email", "==", sessionStorage.getItem("user")));
    const snapshots = await getDocs(q);
    const data = snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // alert(JSON.stringify(data[0]))
    setCustId(data[0]['customerId'])
    setFormData({...formData,customerId:data[0]['customerId']})
    // alert(data[0].customerId)
  }

  const fetchAccounts = async () => {
    const q = query(collection(db, "savingsAccounts"), where("customerId", "==", custId));
    const snapshot = await getDocs(q);
    setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { 
     findCustomer()
  }, []);
  useEffect(()=>{
    if(custId){
      // alert(custId)
      fetchAccounts();
      // alert(JSON.stringify(formData))
      // alert(JSON.stringify(accounts))
    }
  },[custId])

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      accountNumber: formData.accountNumber,
      customerId: formData.customerId,
      accountBalance: parseFloat(formData.accountBalance),
      status: formData.status
    };

    if (editId) {
      await updateDoc(doc(db, 'savingsAccounts', editId), data);
      setEditId(null);
    } else {
      await addDoc(accountsRef, data);
    }

    setFormData({ accountNumber: '', customerId: '', accountBalance: '', status: 'active' });
    fetchAccounts();
  };

  const handleEdit = (acc) => {
    setFormData(acc);
    setEditId(acc.id);
  };

  const handleDelete = async id => {
    await deleteDoc(doc(db, 'savingsAccounts', id));
    fetchAccounts();
  };

  return (
    <div>
      <h2>Account CRUD</h2>
      <form onSubmit={handleSubmit}>
        <input name="accountNumber" value={formData.accountNumber} placeholder="A/C No" onChange={handleChange} required />
        <input name="accountBalance" value={formData.accountBalance} placeholder="Balance" type="number" onChange={handleChange} required />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <button type="submit">{editId ? "Update" : "Add"} Account</button>
      </form>
      <ul>
        {accounts.map(acc => (
          <li key={acc.id}>
            <b>{acc.accountNumber}</b> - ₹{acc.accountBalance} (Cust ID: {acc.customerId})
            <button onClick={() => handleEdit(acc)}>Edit</button>
            <button onClick={() => handleDelete(acc.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
