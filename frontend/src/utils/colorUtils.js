import { COLORS, SENSOR_THRESHOLDS } from '../config';

/**
 * Linear interpolation between two colors
 * @param {Object} c1 - First color with r, g, b properties
 * @param {Object} c2 - Second color with r, g, b properties
 * @param {number} t - Interpolation factor (0-1)
 * @returns {Object} - Interpolated color with r, g, b properties
 */
export const lerpColor = (c1, c2, t) => ({
  r: Math.round(c1.r + (c2.r - c1.r) * t),
  g: Math.round(c1.g + (c2.g - c1.g) * t),
  b: Math.round(c1.b + (c2.b - c1.b) * t),
});

/**
 * Calculate background color based on temperature and room type
 * @param {number} temp - Temperature value
 * @param {string} roomType - Type of room (default, bedroom, office, etc.)
 * @returns {Object} - Color with r, g, b properties
 */
export const calculateBackgroundColor = (temp, roomType = 'default') => {
  if (temp === null || temp === undefined || isNaN(temp)) {
    return COLORS.background.gray;
  }

  const thresholds = SENSOR_THRESHOLDS.temperature[roomType] || SENSOR_THRESHOLDS.temperature.default;
  if (!thresholds) return COLORS.background.gray;

  if (temp >= thresholds.alertHigh) return COLORS.background.red;
  if (temp <= thresholds.alertLow) return COLORS.background.purple;

  if (temp > thresholds.warningHigh) {
    const t = (temp - thresholds.warningHigh) / (thresholds.alertHigh - thresholds.warningHigh);
    return lerpColor(COLORS.background.yellow, COLORS.background.red, t);
  }

  if (temp < thresholds.warningLow) {
    const t = (temp - thresholds.alertLow) / (thresholds.warningLow - thresholds.alertLow);
    return lerpColor(COLORS.background.purple, COLORS.background.blue, t);
  }

  if (temp > thresholds.okayMax) {
    const t = (temp - thresholds.okayMax) / (thresholds.warningHigh - thresholds.okayMax);
    return lerpColor(COLORS.background.green, COLORS.background.yellow, t);
  }

  if (temp < thresholds.okayMin) {
    const t = (temp - thresholds.warningLow) / (thresholds.okayMin - thresholds.warningLow);
    return lerpColor(COLORS.background.blue, COLORS.background.green, t);
  }

  return COLORS.background.green;
};

/**
 * Convert RGB color object to CSS color string
 * @param {Object} color - Color with r, g, b properties
 * @returns {string} - CSS color string (rgb format)
 */
export const rgbToString = (color) => {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
};

/**
 * Calculate warning state for humidity
 * @param {number} value - Humidity value
 * @param {string} roomType - Type of room
 * @returns {number} - Warning state (0-4)
 */
export const calculateHumidityWarningState = (value, roomType = 'default') => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  
  const thresholds = SENSOR_THRESHOLDS.humidity[roomType] || SENSOR_THRESHOLDS.humidity.default;
  if (!thresholds) return 0;
  
  if (value > thresholds.alertHigh) return 4;
  if (value > thresholds.warningHigh) return 3;
  if (value < thresholds.warningLow) return 3;
  if (value > thresholds.okayMax) return 2;
  if (value < thresholds.okayMin) return 2;
  return 1;
};

/**
 * Calculate warning state for CO2
 * @param {number} value - CO2 value
 * @returns {number} - Warning state (0-4)
 */
export const calculateCO2WarningState = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  
  const thresholds = SENSOR_THRESHOLDS.co2.default;
  if (!thresholds) return 0;
  
  if (value > thresholds.alert) return 4;
  if (value > thresholds.warning) return 3;
  if (value > thresholds.okay) return 2;
  return 1;
};

/**
 * Get text color based on warning state
 * @param {number} warningState - Warning state (0-4)
 * @returns {string} - CSS color string
 */
export const getTextColorByWarningState = (warningState) => {
  switch (warningState) {
    case 4: return COLORS.text.red;
    case 3: return COLORS.text.orange;
    case 2: return COLORS.text.yellow;
    case 1: return COLORS.text.green;
    default: return COLORS.text.gray;
  }
};

/**
 * Get border color based on warning state
 * @param {number} warningState - Warning state (0-4)
 * @returns {string} - CSS color string
 */
export const getBorderColorByWarningState = (warningState) => {
  switch (warningState) {
    case 4: return COLORS.border.red;
    case 3: return COLORS.border.orange;
    case 2: return COLORS.border.yellow;
    case 1:
    case 0:
    default: return COLORS.border.gray;
  }
};