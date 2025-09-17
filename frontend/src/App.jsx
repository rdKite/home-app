import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

import { authService } from "./services/pocketbase";
import AuthScreen from "./components/auth/AuthScreen";
import TodoApp from "./components/todo/TodoApp";
import Home from "./components/home/Home";

/**
 * Main App component
 */
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    navigate("/home");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/tasks" /> : <AuthScreen onLogin={handleLogin} />} 
      />
      {/* Allow access to tasks without requiring login */}
      <Route path="/tasks" element={<TodoApp user={user} />} />
      <Route path="/tasks/:listId" element={<TaskListRoute user={user} />} />

      <Route path="/home" element={<Home user={user} />} />
    </Routes>
  );
};

/**
 * Route component for task lists
 */
const TaskListRoute = ({ user }) => {
  const { listId } = useParams();
  return <TodoApp user={user} listId={listId} />;
};

export default App;
