import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { account } from "./appwrite";
import AuthScreen from "./AuthScreen";
import TodoApp from "./TodoApp";

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
            <Route path="/" element={user ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
            <Route 
                path="/login" 
                element={user ? <Navigate to="/tasks" /> : <AuthScreen onLogin={handleLogin} />} 
            />
            <Route path="/tasks" element={user ? <TodoApp user={user} /> : <Navigate to="/login" />} />
            <Route 
                path="/tasks/:listId" 
                element={user ? <TaskListRoute user={user} /> : <Navigate to="/login" />} 
            />
        </Routes>
    );
}

function TaskListRoute({ user }) {
    const { listId } = useParams();
    return <TodoApp user={user} listId={listId} />;
}

export default App;
