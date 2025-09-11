import { useState, useEffect, useCallback } from 'react';
import homeAssistantService from '../services/homeAssistant';

/**
 * Custom hook for managing switch state
 * @param {string} entityId - The entity ID of the switch
 * @param {number} refreshInterval - Interval in milliseconds to refresh data (default: 10000)
 * @returns {Object} - Object containing switch state and functions to control it
 */
const useSwitchState = (entityId, refreshInterval = 10000) => {
  const [switchState, setSwitchState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSwitchState = useCallback(async () => {
    if (!entityId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await homeAssistantService.getState(entityId);
      setSwitchState(data.state !== 'off');
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching switch state for ${entityId}:`, err);
      setError(err.message || 'Failed to fetch switch state');
      setLoading(false);
    }
  }, [entityId]);

  const toggleSwitch = useCallback(async () => {
    if (!entityId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Determine whether to turn on or off based on current state
      const turnOn = !switchState;
      
      await homeAssistantService.toggleSwitch(entityId, turnOn);
      
      // Optimistically update the state
      setSwitchState(turnOn);
      
      setLoading(false);
    } catch (err) {
      console.error(`Error toggling switch ${entityId}:`, err);
      setError(err.message || 'Failed to toggle switch');
      setLoading(false);
      
      // Refresh the state to ensure it's correct
      fetchSwitchState();
    }
  }, [entityId, switchState, fetchSwitchState]);

  useEffect(() => {
    fetchSwitchState();
    
    const interval = setInterval(fetchSwitchState, refreshInterval);
    return () => clearInterval(interval);
  }, [entityId, refreshInterval, fetchSwitchState]);

  return {
    switchState,
    loading,
    error,
    toggleSwitch,
    refreshState: fetchSwitchState
  };
};

export default useSwitchState;