import React, { useEffect, useState } from 'react';
import {
    CubeIcon,
    LightBulbIcon,
} from "@heroicons/react/16/solid/index.js";

export default function HomeAction({ actionData, aptData, homeUrl }) {
    const relativeX = (x) => (x / aptData.width) * 100;
    const relativeY = (y) => (y / aptData.height) * 100;

    const [switchState, setSwitchState] = useState(false);

    const icons = {
        cube: CubeIcon,
        lightbulb: LightBulbIcon,
    }

    const Icon = icons[actionData.icon] || icons.lightbulb;

    const fetchSwitchState = async () => {
        try {
            const response = await fetch(`${homeUrl}states/${actionData.data.state}`);
            const data = await response.json();
            console.log('DATA: ', data.state);
            setSwitchState(data.state !== 'off');
        } catch (err) {
            console.error("Fehler beim Laden des Zustands:", err);
        }
    };

    const toggleSwitch = async () => {
        try {
            // Determine whether to turn on or off based on current state
            const action = switchState ? 'turn_off' : 'turn_on';

            // API-Call zum Auslösen der Automation
            const response = await fetch(`${homeUrl}services/switch/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    entity_id: actionData.data.state,
                }),
            });
            console.log('RESPONSE: ', response);

            if (!response.ok) {
                throw new Error(`Fehler: ${response.status}`);
            }

            // Optimistisch den Zustand lokal umschalten
            setSwitchState((prev) => !prev);
        } catch (err) {
            console.error("Fehler beim Umschalten:", err);
        }
    };

    useEffect(() => {
        fetchSwitchState();
        const interval = setInterval(fetchSwitchState, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`absolute rounded-full w-10 h-10 border-3 transition-colors duration-300 ${
                switchState ? 'bg-yellow-400 border-yellow-100' : 'bg-gray-500 border-gray-200'
            }`}
            style={{
                left: `${relativeX(actionData.position.x)}%`,
                top: `${relativeY(actionData.position.y)}%`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            {actionData.type === "switch" && (
                <button
                    onClick={toggleSwitch}
                    className="w-full h-full flex items-center justify-center"
                >
                    <LightBulbIcon
                        className={`w-7 h-7 cursor-pointer ${
                            switchState ? "text-yellow-100" : "text-gray-200"
                        }`}
                    />
                </button>
            )}

            {actionData.type === "switchWithLink" && (
                <button
                    onClick={() => {
                        if (!switchState) {
                            toggleSwitch();
                        } else {
                            window.open(actionData.data.link, "_blank");
                        }
                    }}
                    className="w-full h-full flex items-center justify-center"
                >
                    <Icon
                        className={`w-7 h-7 cursor-pointer ${
                            switchState ? "text-yellow-100" : "text-gray-200"
                        }`}
                    />
                </button>
            )}
        </div>
    );
}
