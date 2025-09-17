import { useState, useEffect, useCallback } from 'react';
import homeAssistantService from '../services/homeAssistant';

/**
 * Custom hook for managing switch state
 * @param {string} domain - The domain of the switch, e.g. 'switch' or 'light'
 * @param {string} targetKey - The key of the switch, e.g. 'bedroom_light' or 'living_room_light'
 * @param {string} targetId - The entity ID of the switch
 * @param {number} refreshInterval - Interval in milliseconds to refresh data (default: 10000)
 * @returns {Object} - Object containing switch state and functions to control it
 */
const useSwitchState = (domain, targetKey, targetId, refreshInterval = 10000) => {
  const [switchState, setSwitchState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  targetKey = `${targetKey}_id`

  const fetchSwitchState = useCallback(async () => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await homeAssistantService.getState(targetId);
      setSwitchState(data.state !== 'off');
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching switch state for ${targetId}:`, err);
      setError(err.message || 'Failed to fetch switch state');
      setLoading(false);
    }
  }, [targetId]);

  const toggleSwitch = useCallback(async () => {
    if (!targetId) return;

    let toggleTargetId = targetId;
    if (targetKey ===  'area_id') {
      toggleTargetId = targetId.split('.')[1];
    }

    try {
      setLoading(true);
      setError(null);
      
      // Determine whether to turn on or off based on current state
      const turnOn = !switchState;
      
      await homeAssistantService.toggleSwitch(domain, targetKey, toggleTargetId, turnOn);
      
      // Optimistically update the state
      setSwitchState(turnOn);
      
      setLoading(false);
    } catch (err) {
      console.error(`Error toggling entity ${toggleTargetId}:`, err);
      setError(err.message || 'Failed to toggle switch');
      setLoading(false);
      
      // Refresh the state to ensure it's correct
      fetchSwitchState();
    }
  }, [targetId, switchState, fetchSwitchState]);

  useEffect(() => {
    fetchSwitchState();
    
    const interval = setInterval(fetchSwitchState, refreshInterval);
    return () => clearInterval(interval);
  }, [targetId, refreshInterval, fetchSwitchState]);

  return {
    switchState,
    loading,
    error,
    toggleSwitch,
    refreshState: fetchSwitchState
  };
};

export default useSwitchState;