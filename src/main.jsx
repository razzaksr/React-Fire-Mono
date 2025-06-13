import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Menu from './Menu'
import App from './App.jsx'
import CustomerCRUD from './CustomerCRUD'
import AccountCRUD from './AccountCRUD'
import Login from './Login.jsx'
import PasswordReset from './PasswordReset.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {
      (sessionStorage.getItem("user")?
      <>
        <BrowserRouter>
          <Menu/>
          <Routes>
            <Route path="/dash" element={<CustomerCRUD />}/>
            <Route path="/account" element={<AccountCRUD />} />
            <Route path="/reset/:email" element={<PasswordReset />} />
          </Routes>
        </BrowserRouter>
      </>
      :
      <>
        <Login/>
      </>
      )
    }
  </StrictMode>,
)
