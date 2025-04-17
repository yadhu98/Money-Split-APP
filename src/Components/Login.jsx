import React, { useState } from 'react';
import { authenticateUser, registerAuthenticatedUsertoLocalStorage } from '../utils/auth';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = authenticateUser(username, password);
    registerAuthenticatedUsertoLocalStorage(username)
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials');
    }
  };


  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      name: "Leanne Graham",
      password: "12345",
    </div>
  );
}

export default Login;