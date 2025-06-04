import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { usePreferences } from './hooks/usePreferences';
import HomePage from './pages/HomePage';
import LoginForm from './components/LoginForm';
import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  const { preferences } = usePreferences();

  return (
    <div className={preferences.theme === 'dark' ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;