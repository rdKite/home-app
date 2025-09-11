import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

import { account } from "./pocketbase";
import AuthScreen from "./AuthScreen";
import TodoApp from "./TodoApp";
import Home from "./Home.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        account.get()
            .then((userData) => {
                setUser(userData);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        navigate("/tasks");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/tasks" />} />
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
}

function TaskListRoute({ user }) {
    const { listId } = useParams();
    return <TodoApp user={user} listId={listId} />;
}

export default App;
