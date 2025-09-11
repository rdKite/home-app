import { useState, useEffect } from 'react';
import homeAssistantService from '../services/homeAssistant';
import { calculateHumidityWarningState, calculateCO2WarningState, getBorderColorByWarningState } from '../utils/colorUtils';

/**
 * Custom hook for fetching and managing sensor data
 * @param {Object} sensors - Object with sensor types as keys and sensor IDs as values
 * @param {string} roomType - Type of room (default, bedroom, office, etc.)
 * @param {number} refreshInterval - Interval in milliseconds to refresh data (default: 30000)
 * @returns {Object} - Object containing sensor data and warning states
 */
const useSensorData = (sensors, roomType = 'default', refreshInterval = 30000) => {
  const [sensorsData, setSensorsData] = useState({
    temperature: null,
    humidity: null,
    co2: null,
  });
  
  const [warningStates, setWarningStates] = useState({
    humidity: 0,
    co2: 0,
    max: 0,
    borderColor: null,
  });

  const updateWarningStates = (data) => {
    const humidityLevel = data.humidity 
      ? calculateHumidityWarningState(parseFloat(data.humidity), roomType) 
      : 0;
      
    const co2Level = data.co2 
      ? calculateCO2WarningState(parseFloat(data.co2)) 
      : 0;
      
    const maxLevel = Math.max(humidityLevel, co2Level);
    
    setWarningStates({
      humidity: humidityLevel,
      co2: co2Level,
      max: maxLevel,
      borderColor: getBorderColorByWarningState(maxLevel),
    });
  };

  const fetchSensorData = async () => {
    try {
      // Skip if no sensors are defined
      if (!sensors || Object.keys(sensors).length === 0) {
        return;
      }
      
      const results = await homeAssistantService.fetchSensorData(sensors);
      
      if (Object.keys(results).length > 0) {
        setSensorsData((prev) => ({ ...prev, ...results }));
        updateWarningStates(results);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    
    const interval = setInterval(fetchSensorData, refreshInterval);
    return () => clearInterval(interval);
  }, [sensors, roomType, refreshInterval]);

  return {
    sensorsData,
    warningStates,
    refreshData: fetchSensorData,
  };
};

export default useSensorData;