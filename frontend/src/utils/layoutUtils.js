/**
 * Utility functions for layout calculations
 */

/**
 * Calculate relative X position as a percentage of apartment width
 * @param {number} x - Absolute X position
 * @param {number} aptWidth - Apartment width
 * @returns {number} - Relative X position as percentage
 */
export const calculateRelativeX = (x, aptWidth) => {
  return (x / aptWidth) * 100;
};

/**
 * Calculate relative Y position as a percentage of apartment height
 * @param {number} y - Absolute Y position
 * @param {number} aptHeight - Apartment height
 * @returns {number} - Relative Y position as percentage
 */
export const calculateRelativeY = (y, aptHeight) => {
  return (y / aptHeight) * 100;
};

/**
 * Calculate relative width as a percentage of apartment width
 * @param {number} width - Absolute width
 * @param {number} aptWidth - Apartment width
 * @returns {number} - Relative width as percentage
 */
export const calculateRelativeWidth = (width, aptWidth) => {
  return (width / aptWidth) * 100;
};

/**
 * Calculate relative height as a percentage of apartment height
 * @param {number} height - Absolute height
 * @param {number} aptHeight - Apartment height
 * @returns {number} - Relative height as percentage
 */
export const calculateRelativeHeight = (height, aptHeight) => {
  return (height / aptHeight) * 100;
};

/**
 * Convert border array to CSS border style
 * @param {Array<boolean>} borders - Array of boolean values [top, right, bottom, left]
 * @returns {string} - CSS border style
 */
export const bordersToCss = (borders) => {
  return borders.map((b) => (b ? "solid" : "none")).join(" ");
};

/**
 * Generate position style for a room coordinate
 * @param {Object} coordinate - Room coordinate object
 * @param {Object} aptData - Apartment data
 * @param {string} borderColor - Border color
 * @returns {Object} - Style object for the room
 */
export const getRoomPositionStyle = (coordinate, aptData, borderColor) => {
  return {
    left: `${calculateRelativeX(coordinate.x, aptData.width)}%`,
    top: `${calculateRelativeY(coordinate.y, aptData.height)}%`,
    width: `${calculateRelativeWidth(coordinate.width, aptData.width)}%`,
    height: `${calculateRelativeHeight(coordinate.height, aptData.height)}%`,
    borderWidth: "5px",
    borderColor: borderColor,
    borderStyle: bordersToCss(coordinate.borders),
  };
};

/**
 * Generate position style for an action button
 * @param {Object} position - Position object with x and y properties
 * @param {Object} aptData - Apartment data
 * @returns {Object} - Style object for the action button
 */
export const getActionPositionStyle = (position, aptData) => {
  return {
    left: `${calculateRelativeX(position.x, aptData.width)}%`,
    top: `${calculateRelativeY(position.y, aptData.height)}%`,
    transform: 'translate(-50%, -50%)',
  };
};

/**
 * Generate position style for a sensor display
 * @param {Object} coordinate - Room coordinate object (first coordinate)
 * @param {Object} aptData - Apartment data
 * @returns {Object} - Style object for the sensor display
 */
export const getSensorDisplayPositionStyle = (coordinate, aptData) => {
  return {
    left: `${calculateRelativeX(coordinate.x, aptData.width)}%`,
    top: `${calculateRelativeY(coordinate.y, aptData.height)}%`,
  };
};