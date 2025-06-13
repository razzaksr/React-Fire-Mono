import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            sessionStorage.setItem("user", userCredential.user.email);
            alert("Login Successful "+userCredential.user.email);
            // Suggested code may be subject to a license. Learn more: ~LicenseLog:940508374.
            window.location.href = "/";
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <>
            {
                (isSignUp==false)?
                <>
                    <div>
                        <h3>Login</h3>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <button onClick={handleLogin}>Login</button>
                        <button onClick={() => setIsSignUp(true)}>Signup here</button>
                    </div>
                </>
                :
                <>
                    <Signup/>
                </>
            }
        </>
    );
}