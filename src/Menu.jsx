import { auth } from "./firebase";
export default function Menu(){
    return(
        <>
            <a href={`/dash`}>Customer Management</a>
            <a href={`/account`}>Account Management</a>
            <button onClick={() => {
                    auth.signOut()
                    sessionStorage.removeItem("user")
                    window.location.href = "/"
                }
            }>logout</button>
        </>
    )
}