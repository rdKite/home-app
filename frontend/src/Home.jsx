import React from 'react';
import HomeRoom from "./HomeRoom.jsx";
import HomeAction from "./HomeAction.jsx";

const HA_URL = 'http://localhost:4000/ha/api/';

export default function Home() {

    const config = {
        'apt': {
            width: 851,
            height: 1138,
        },
        'rooms': [
            {
                name: 'Wohnzimmer',
                type: 'default',
                coordinates: [
                    {
                        x: 449,
                        y: 347,
                        width: 402,
                        height: 641,
                        borders: [
                            true, true, true, true,
                        ],
                    },
                ],
                sensors: {
                    temperature: 'esp_02_temperature',
                    humidity: 'esp_02_humidity',
                    co2: 'esp_02_co2_value',
                }
            },
            {
                name: 'Büro',
                type: 'office',
                coordinates: [
                    {
                        x: 0,
                        y: 608,
                        width: 409,
                        height: 380,
                        borders: [
                            true, true, true, true,
                        ],
                    },
                ],
                sensors: {
                    temperature: 'esp_01_temperature',
                    humidity: 'esp_01_humidity',
                }
            },
            {
                name: 'Küche',
                type: 'default',
                coordinates: [
                    {
                        x: 0,
                        y: 0,
                        width: 282,
                        height: 264,
                        borders: [
                            true, true, true, true,
                        ],
                    },
                ],
                sensors: {}
            },
            {
                name: 'Schlafzimmer',
                type: 'bedroom',
                coordinates: [
                    {
                        x: 0,
                        y: 279,
                        width: 282,
                        height: 314,
                        borders: [
                            true, true, true, true,
                        ],
                    },
                ],
                sensors: {}
            },
            {
                name: 'Balkon',
                type: 'outdoors',
                coordinates: [
                    {
                        x: 0,
                        y: 1003,
                        width: 851,
                        height: 135,
                        borders: [
                            true, true, true, true,
                        ],
                    },
                ],
                sensors: {
                    temperature: 't_h_outdoor_temperatur',
                    humidity: 't_h_outdoor_luftfeuchtigkeit',
                }
            },
            {
                name: 'Duschband',
                type: 'bathroom',
                coordinates: [
                    {
                        x: 636,
                        y: 0,
                        width: 215,
                        height: 143,
                        borders: [
                            true, true, true, true,
                        ],
                    },
                ],
                sensors: {}
            },
            {
                name: 'Toilette',
                type: 'bathroom',
                coordinates: [
                    {
                        x: 636,
                        y: 199,
                        width: 215,
                        height: 133,
                        borders: [
                            true, true, true, true,
                        ],
                    },
                ],
                sensors: {}
            },
            {
                name: 'Flur',
                type: 'default',
                coordinates: [
                    {
                        x: 297,
                        y: 0,
                        width: 112,
                        height: 185,
                        borders: [
                            true, true, false, true,
                        ],
                    },
                    {
                        x: 297,
                        y: 185,
                        width: 112,
                        height: 123,
                        borders: [
                            false, false, false, true,
                        ],
                    },
                    {
                        x: 297,
                        y: 308,
                        width: 112,
                        height: 285,
                        borders: [
                            false, true, true, true,
                        ],
                    },
                    {
                        x: 409,
                        y: 185,
                        width: 40,
                        height: 123,
                        borders: [
                            true, false, true, false,
                        ],
                    },
                    {
                        x: 449,
                        y: 0,
                        width: 172,
                        height: 185,
                        borders: [
                            true, true, false, true,
                        ],
                    },
                    {
                        x: 449,
                        y: 185,
                        width: 172,
                        height: 123,
                        borders: [
                            false, true, false, false,
                        ],
                    },
                    {
                        x: 449,
                        y: 308,
                        width: 172,
                        height: 25,
                        borders: [
                            false, true, true, true,
                        ],
                    },
                ],
                sensors: {}
            },
        ],
        actions: [
            {
                name: "Lichtschalter Wohnzimmer",
                type: "switch",
                icon: "lightbulb",
                position: {
                    x: 650,
                    y: 600,
                },
                data: {
                    state: "light.wohnzimmer",
                }
            },
            {
                name: "Lichtschalter Flur",
                type: "switch",
                icon: "lightbulb",
                position: {
                    x: 430,
                    y: 250,
                },
                data: {
                    state: "switch.innr_steckdose_02_schalter",
                }
            },
            {
                name: "Longneck Büro",
                type: "switch",
                icon: "lightbulb",
                position: {
                    x: 200,
                    y: 650,
                },
                data: {
                    state: "switch.wiz_socket_73054a",
                }
            },
            {
                name: "Prusa KM3.5 Büro",
                type: "switchWithLink",
                icon: "cube",
                position: {
                    x: 120,
                    y: 650,
                },
                data: {
                    state: "switch.wiz_socket_73054a",
                    link: 'http://192.168.178.69/'
                }
            },
        ]
    };

    return (
        <div className="text-white m-5">
            <h1 className="fixed">
                Home
            </h1>
            <div className="relative max-w-screen max-h-screen"
                 style={{
                     aspectRatio: `${config.apt.width / config.apt.height}`
                }}
            >
                { config.rooms.map((room) => (
                    <HomeRoom
                        key={room.name}
                        roomData={room}
                        aptData={config.apt}
                        haUrl={HA_URL}
                    />
                ))}
                { config.actions.map((action) => (
                    <div key={action.name}>
                        <HomeAction
                            actionData={action}
                            aptData={config.apt}
                            homeUrl={HA_URL}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}