import { API_URLS } from '../config';

/**
 * Home Assistant API service
 * Provides methods for interacting with the Home Assistant API
 */
class HomeAssistantService {
  constructor() {
    this.baseUrl = API_URLS.HOME_ASSISTANT;
  }

  /**
   * Get the state of an entity
   * @param {string} entityId - The ID of the entity
   * @returns {Promise<Object>} - The entity state
   */
  async getState(entityId) {
    try {
      const response = await fetch(`${this.baseUrl}states/${entityId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch state for ${entityId}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching state for ${entityId}:`, error);
      throw error;
    }
  }

  /**
   * Get the state of a sensor
   * @param {string} sensorId - The ID of the sensor
   * @returns {Promise<Object>} - The sensor state
   */
  async getSensorState(sensorId) {
    return this.getState(`sensor.${sensorId}`);
  }

  /**
   * Toggle an entity, group, or area in Home Assistant
   * @param {string} domain - The domain, e.g. "light" or "switch"
   * @param {string} targetKey - "entity_id", "area_id", or "device_id"
   * @param {string} targetValue - The value for the target
   * @param {boolean} turnOn - Whether to turn it on or off
   * @returns {Promise<Object>} - The response from the API
   */
  async toggleSwitch(domain, targetKey, targetValue, turnOn) {
    const action = turnOn ? 'turn_on' : 'turn_off';

    try {
      const response = await fetch(`${this.baseUrl}services/${domain}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`, // wichtig: Token mitschicken
        },
        body: JSON.stringify({
          [targetKey]: targetValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle ${domain} ${targetValue}: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error toggling ${domain} ${targetValue}:`, error);
      throw error;
    }
  }


  /**
   * Fetch multiple sensor states
   * @param {Object} sensors - Object with sensor types as keys and sensor IDs as values
   * @returns {Promise<Object>} - Object with sensor types as keys and sensor states as values
   */
  async fetchSensorData(sensors) {
    try {
      const results = {};
      const sensorKeys = Object.keys(sensors);

      for (const key of sensorKeys) {
        const sensorId = sensors[key];
        if (!sensorId) continue;

        try {
          const data = await this.getSensorState(sensorId);
          results[key] = data.state;
        } catch (err) {
          console.error(`Error fetching ${key} (${sensorId}):`, err);
        }
      }

      return results;
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const homeAssistantService = new HomeAssistantService();
export default homeAssistantService;