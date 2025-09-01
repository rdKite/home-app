import { useState } from "react";
import { account } from "./appwrite";
import { ID } from "appwrite";

export default function AuthScreen({ onLogin }) {
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    // Hilfsfunktion: baut aus Name eine Fake-Mail
    const getFakeEmail = (name) => `${name.toLowerCase()}@local.app`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fakeEmail = getFakeEmail(name);

            if (isRegister) {
                // neuen User anlegen
                await account.create(ID.unique(), fakeEmail, password, name);
            }

            // Session mit Name+Passwort starten (über Fake-Mail)
            await account.createEmailPasswordSession(fakeEmail, password);

            // eingeloggten User holen
            const user = await account.get();
            onLogin(user);
        } catch (err) {
            alert("Fehler: " + err.message);
        }
    };

    return (
        <div className="max-w-sm mx-auto p-6 shadow rounded-xl text-white">
            <h1 className="text-xl font-bold mb-4">
                {isRegister ? "Registrieren" : "Login"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border px-3 py-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    className="w-full py-2 bg-violet-600 text-white rounded"
                >
                    {isRegister ? "Registrieren" : "Login"}
                </button>
            </form>
            <p
                onClick={() => setIsRegister(!isRegister)}
                className="mt-3 text-sm text-violet-600 cursor-pointer"
            >
                {isRegister
                    ? "Schon einen Account? Hier einloggen."
                    : "Noch keinen Account? Hier registrieren."}
            </p>
        </div>
    );
}
