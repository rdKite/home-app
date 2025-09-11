import React, { useState, useEffect } from "react";

export default function HomeRoom({ roomData, aptData, haUrl }) {
    const relativeX = (x) => (x / aptData.width) * 100;
    const relativeY = (y) => (y / aptData.height) * 100;

    const colors = {
        border: {
            gray: 'rgb(74, 85, 101)',
            green: 'rgb(0, 166, 62)',
            yellow: 'rgb(208, 135, 0)',
            orange: 'rgb(245, 74, 0)',
            red: 'rgb(231, 0, 11)',
        },
        text: {
            gray: 'rgb(209, 213, 220)',
            green: 'rgb(123, 241, 168)',
            yellow: 'rgb(255, 223, 32)',
            orange: 'rgb(255, 137, 4)',
            red: 'rgb(251, 44, 54)',
        },
        background: {
            gray:    { r: 209, g: 213, b: 220 },
            green:   { r: 0,   g: 130, b: 54 },
            yellow:  { r: 137, g: 75,  b: 0 },
            orange:  { r: 202, g: 53,  b: 0 },
            red:     { r: 193, g: 0,   b: 7 },
            blue:    { r: 20,  g: 71,  b: 230 },
            purple:  { r: 130, g: 0,   b: 219 },
        },
    }

    const [sensorsData, setSensorsData] = useState({
        temperature: null,
        humidity: null,
        co2: null,
    });

    const [humidityWarningSate, setHumidityWarningSate] = useState(0);
    const [co2WarningSate, setCo2WarningSate] = useState(0);
    const [maxWarningSate, setMaxWarningSate] = useState(0);
    const [borderColor, setBorderColor] = useState(colors.border.gray);

    const thresholds = () => {
        const data = {
            temperature: {
                default: { okayMin: 20, okayMax: 22, warningHigh: 25, alertHigh: 30, warningLow: 18, alertLow: 16 },
                bedroom: { okayMin: 18, okayMax: 20, warningHigh: 24, alertHigh: 28, warningLow: 16, alertLow: 14 },
                office: { okayMin: 20, okayMax: 22, warningHigh: 24, alertHigh: 28, warningLow: 18, alertLow: 16 },
                bathroom: { okayMin: 22, okayMax: 24, warningHigh: 28, alertHigh: 32, warningLow: 20, alertLow: 16 },
                outdoors: { okayMin: 18, okayMax: 25, warningHigh: 27, alertHigh: 32, warningLow: 12, alertLow: 0 },
            },
            humidity: {
                default: { okayMin: 45, okayMax: 55, warningHigh: 60, alertHigh: 70, warningLow: 40 },
                bathroom: { okayMin: 45, okayMax: 60, warningHigh: 65, alertHigh: 80, warningLow: 30 },
                outdoors: { okayMin: 0, okayMax: 100, warningHigh: 101, alertHigh: 101, warningLow: -1 },
            },
            co2: {
                default: { okay: 1000, warning: 1400, alert: 1980 },
            }
        };

        return {
            temperature: data.temperature[roomData.type] || data.temperature.default,
            humidity: data.humidity[roomData.type] || data.humidity.default,
            co2: data.co2[roomData.type] || data.co2.default
        };
    };

    const lerpColor = (c1, c2, t) => ({
        r: Math.round(c1.r + (c2.r - c1.r) * t),
        g: Math.round(c1.g + (c2.g - c1.g) * t),
        b: Math.round(c1.b + (c2.b - c1.b) * t),
    });

    // Dynamische Hintergrundfarbe basierend auf Temperatur
    const calculateBackgroundColor = (temp) => {
        if (temp === null || temp === undefined || isNaN(temp)) return colors.background.gray;

        const th = thresholds().temperature;
        if (!th) return colors.background.gray;

        if (temp >= th.alertHigh) return colors.background.red;
        if (temp <= th.alertLow) return colors.background.purple;

        if (temp > th.warningHigh) {
            const t = (temp - th.warningHigh) / (th.alertHigh - th.warningHigh);
            return lerpColor(colors.background.yellow, colors.background.red, t);
        }

        if (temp < th.warningLow) {
            const t = (temp - th.alertLow) / (th.warningLow - th.alertLow);
            return lerpColor(colors.background.purple, colors.background.blue, t);
        }

        if (temp > th.okayMax) {
            const t = (temp - th.okayMax) / (th.warningHigh - th.okayMax);
            return lerpColor(colors.background.green, colors.background.yellow, t);
        }

        if (temp < th.okayMin) {
            const t = (temp - th.warningLow) / (th.okayMin - th.warningLow);
            return lerpColor(colors.background.blue, colors.background.green, t);
        }

        return colors.background.green;
    };

    const calculateHumidityWarningState = (value) => {
        const th = thresholds().humidity;
        if (value > th.alertHigh) return 4;
        if (value > th.warningHigh) return 3;
        if (value < th.warningLow) return 3;
        if (value > th.okayMax) return 2;
        if (value < th.okayMin) return 2;
        return 1;
    };

    const calculateCo2WarningState = (value) => {
        const th = thresholds().co2;
        if (value > th.alert) return 4;
        if (value > th.warning) return 3;
        if (value > th.okay) return 2;
        return 1;
    };

    const updateWarningStates = (states) => {
        const humidityLevel = states.humidity ? calculateHumidityWarningState(parseFloat(states.humidity)) : 0;
        const co2Level = states.co2 ? calculateCo2WarningState(parseFloat(states.co2)) : 0;
        const maxLevel = Math.max(humidityLevel, co2Level);

        setHumidityWarningSate(humidityLevel);
        setCo2WarningSate(co2Level);
        setMaxWarningSate(maxLevel);

        switch (maxLevel) {
            case 2: setBorderColor(colors.border.yellow); break;
            case 3: setBorderColor(colors.border.orange); break;
            case 4: setBorderColor(colors.border.red); break;
            case 1:
            case 0:
            default:
                setBorderColor(colors.border.gray);
        }
    };

    const fetchSensorData = async () => {
        try {
            const sensorKeys = ["temperature", "humidity", "co2"];
            const results = {};

            for (const key of sensorKeys) {
                const sensorId = roomData.sensors?.[key];
                if (!sensorId) continue;

                try {
                    const res = await fetch(`${haUrl}states/sensor.${sensorId}`);
                    if (!res.ok) continue;
                    const data = await res.json();
                    results[key] = data.state;
                } catch (err) {
                    console.error(`Fehler beim Laden von ${key} (${sensorId}):`, err);
                }
            }

            if (Object.keys(results).length > 0) {
                setSensorsData((prev) => ({ ...prev, ...results }));
                updateWarningStates(results);
            }
        } catch (err) {
            console.error("Fehler beim Abrufen der Sensordaten:", err);
        }
    };

    useEffect(() => {
        fetchSensorData();
        const interval = setInterval(fetchSensorData, 30000);
        return () => clearInterval(interval);
    }, [roomData, haUrl]);

    return (
        <div>
            {roomData.coordinates.map((c, index) => {
                const tempColor = sensorsData.temperature
                    ? calculateBackgroundColor(parseFloat(sensorsData.temperature))
                    : colors.background.gray;
                const bgColorString = `rgb(${tempColor.r}, ${tempColor.g}, ${tempColor.b})`;

                return (
                    <div
                        key={index}
                        className="absolute"
                        style={{
                            left: `${relativeX(c.x)}%`,
                            top: `${relativeY(c.y)}%`,
                            width: `${relativeX(c.width)}%`,
                            height: `${relativeY(c.height)}%`,
                            borderWidth: "5px",
                            borderColor: borderColor,
                            borderStyle: c.borders.map((b) => (b ? "solid" : "none")).join(" "),
                            backgroundColor: bgColorString,
                            transition: "background-color 0.5s",
                        }}
                    />
                );
            })}

            {(sensorsData.temperature || sensorsData.humidity || sensorsData.co2) && (
                <div
                    className="absolute m-2 bg-black/60 text-white rounded p-2 shadow"
                    style={{
                        left: `${relativeX(roomData.coordinates[0].x)}%`,
                        top: `${relativeY(roomData.coordinates[0].y)}%`,
                    }}
                >
                    {sensorsData.temperature && <p>{sensorsData.temperature} °C</p>}
                    {sensorsData.humidity && (
                        <p
                            style={{
                                color: humidityWarningSate === 4 ? colors.text.red : humidityWarningSate === 3 ? colors.text.orange : humidityWarningSate === 2 ? colors.text.yellow : humidityWarningSate === 1 ? colors.text.green : colors.text.gray,
                                fontWeight: humidityWarningSate >= 3 ? "bold" : "normal",
                            }}
                        >
                            {sensorsData.humidity} %
                        </p>
                    )}
                    {sensorsData.co2 && (
                        <p
                            style={{
                                color: co2WarningSate === 4 ? colors.text.red : co2WarningSate === 3 ? colors.text.orange : co2WarningSate === 2 ? colors.text.yellow : co2WarningSate === 1 ? colors.text.green : colors.text.gray,
                                fontWeight: co2WarningSate >= 3 ? "bold" : "normal",
                            }}
                        >
                            {sensorsData.co2} ppm
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
