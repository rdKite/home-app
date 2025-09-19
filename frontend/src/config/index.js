// Configuration file for the application

// API URLs
export const API_URLS = {
  HOME_ASSISTANT: 'http://home.local:4000/ha/api/',
  POCKETBASE: 'http://home.local:8090',
};

// Database constants
export const DATABASE = {
  ID: 'pb_database',
  COLLECTIONS: {
    TASKS: 'tasks',
    TASK_LISTS: 'task_lists',
  },
};

// Home configuration
export const HOME_CONFIG = {
  apt: {
    width: 851,
    height: 1138,
  },
  rooms: [
    {
      name: 'Wohnzimmer',
      type: 'default',
      coordinates: [
        {
          x: 449,
          y: 347,
          width: 402,
          height: 641,
          borders: [true, true, true, true],
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
          borders: [true, true, true, true],
        },
      ],
      sensors: {
        temperature: 'esp_01_temperature',
        humidity: 'esp_01_humidity',
        co2: 'esp_01_co2_value',
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
          borders: [true, true, true, true],
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
          borders: [true, true, true, true],
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
          borders: [true, true, true, true],
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
          borders: [true, true, true, true],
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
          borders: [true, true, true, true],
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
          borders: [true, true, false, true],
        },
        {
          x: 297,
          y: 185,
          width: 112,
          height: 123,
          borders: [false, false, false, true],
        },
        {
          x: 297,
          y: 308,
          width: 112,
          height: 285,
          borders: [false, true, true, true],
        },
        {
          x: 409,
          y: 185,
          width: 40,
          height: 123,
          borders: [true, false, true, false],
        },
        {
          x: 449,
          y: 0,
          width: 172,
          height: 185,
          borders: [true, true, false, true],
        },
        {
          x: 449,
          y: 185,
          width: 172,
          height: 123,
          borders: [false, true, false, false],
        },
        {
          x: 449,
          y: 308,
          width: 172,
          height: 25,
          borders: [false, true, true, true],
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
        domain: "light",
        type: "area",
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
        domain: "switch",
        type: "entity",
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
        domain: "switch",
        type: "entity",
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
        domain: "switch",
        type: "entity",
        state: "switch.innr_steckdose_01_schalter",
        link: 'http://192.168.178.69/'
      }
    },
    {
      name: "Lichtschalter Schlafzimmer",
      type: "switch",
      icon: "lightbulb",
      position: {
        x: 140,
        y: 430,
      },
      data: {
        domain: "light",
        type: "area",
        state: "light.schlafzimmer",
      }
    },
  ]
};

// Sensor thresholds
export const SENSOR_THRESHOLDS = {
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

// UI Colors
export const COLORS = {
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
};