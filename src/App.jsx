import React, { useEffect, useState } from 'react';
import './index.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import { deleteAuthUseronLogout, isAuthenticatedUser } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    deleteAuthUseronLogout()
    setUser(null);
  };

  useEffect(() =>{
    const userAuth = isAuthenticatedUser()
    if(userAuth){
      setUser(userAuth)
    }
  },[])

  console.log(user)

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;