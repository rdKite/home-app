import { useState, useEffect } from "react";
import { account } from "./appwrite";
import AuthScreen from "./AuthScreen";
import TodoApp from "./TodoApp";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        account.get().then(setUser).catch(() => setUser(null));
    }, []);

    if (!user) {
        return <AuthScreen onLogin={setUser} />;
    }

    return <TodoApp user={user} />;
}

export default App;
