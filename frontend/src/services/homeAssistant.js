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
   * Toggle a switch
   * @param {string} entityId - The ID of the switch entity
   * @param {boolean} turnOn - Whether to turn the switch on or off
   * @returns {Promise<Object>} - The response from the API
   */
  async toggleSwitch(entityId, turnOn) {
    const action = turnOn ? 'turn_on' : 'turn_off';
    
    try {
      const response = await fetch(`${this.baseUrl}services/switch/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity_id: entityId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle switch ${entityId}: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error toggling switch ${entityId}:`, error);
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