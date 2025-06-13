import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';

const PasswordReset = () => {
    const {email} = useParams()
    const [message, setMessage] = useState('');
    const nav = useNavigate()
    const handleReset = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(`Password reset email sent to ${email}`);
            sessionStorage.removeItem("user")
            nav("/")
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
            <button type="submit">Send Reset Link</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordReset;