import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../../services/pocketbase';

/**
 * AuthScreen component for user login and registration
 */
const AuthScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper function: build a fake email from name
  const getFakeEmail = (name) => `${name.toLowerCase()}@local.app`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !password.trim()) {
      setError('Bitte Name und Passwort eingeben');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const fakeEmail = getFakeEmail(name);

      if (isRegister) {
        // Create new user
        await authService.createUser('', fakeEmail, password, name);
      }

      // Start session with name+password (via fake email)
      await authService.loginWithEmailPassword(fakeEmail, password);

      // Get logged in user
      const user = await authService.getCurrentUser();
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 shadow rounded-xl text-white">
      <h1 className="text-xl font-bold mb-4">
        {isRegister ? 'Registrieren' : 'Login'}
      </h1>
      
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            className="w-full border px-3 py-2 rounded bg-gray-700 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Passwort
          </label>
          <input
            id="password"
            type="password"
            placeholder="Passwort"
            className="w-full border px-3 py-2 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 ${
            loading 
              ? 'bg-violet-400 cursor-not-allowed' 
              : 'bg-violet-600 hover:bg-violet-500'
          } text-white rounded`}
          disabled={loading}
        >
          {loading 
            ? 'Wird bearbeitet...' 
            : isRegister 
              ? 'Registrieren' 
              : 'Login'
          }
        </button>
      </form>
      
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-3 text-sm text-violet-400 hover:text-violet-300 cursor-pointer"
        disabled={loading}
      >
        {isRegister
          ? 'Schon einen Account? Hier einloggen.'
          : 'Noch keinen Account? Hier registrieren.'}
      </button>
    </div>
  );
};

AuthScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default AuthScreen;