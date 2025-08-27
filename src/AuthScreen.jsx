import { useState } from "react";
import { account } from "./appwrite";

export default function AuthScreen({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await account.create("unique()", email, password, name);
            }
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            onLogin(user);
        } catch (err) {
            alert("Fehler: " + err.message);
        }
    };

    return (
        <div className="max-w-sm mx-auto p-6 shadow rounded-xl">
            <h1 className="text-xl font-bold mb-4">
                {isRegister ? "Registrieren" : "Login"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full border px-3 py-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                <input
                    type="email"
                    placeholder="E-Mail"
                    className="w-full border px-3 py-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Passwort"
                    className="w-full border px-3 py-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded"
                >
                    {isRegister ? "Registrieren" : "Login"}
                </button>
            </form>
            <p
                onClick={() => setIsRegister(!isRegister)}
                className="mt-3 text-sm text-blue-600 cursor-pointer"
            >
                {isRegister
                    ? "Schon einen Account? Hier einloggen."
                    : "Noch keinen Account? Hier registrieren."}
            </p>
        </div>
    );
}
