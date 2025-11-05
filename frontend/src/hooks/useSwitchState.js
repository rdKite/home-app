import { useState, useEffect, useCallback } from 'react';
import homeAssistantService from '../services/homeAssistant';

/**
 * Custom hook for managing action state and execution
 * @param {string} stateEntityId - The entity ID to monitor for state
 * @param {Array} cases - Array of possible actions
 * @param {number} refreshInterval - Interval in milliseconds to refresh data (default: 10000)
 * @returns {Object} - Object containing state and functions to control actions
 */
const useSwitchState = (stateEntityId, cases = [], refreshInterval = 10000) => {
  const [switchState, setSwitchState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSwitchState = useCallback(async () => {
    if (!stateEntityId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await homeAssistantService.getState(stateEntityId);
      setSwitchState(data.state !== 'off');
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching switch state for ${stateEntityId}:`, err);
      setError(err.message || 'Failed to fetch switch state');
      setLoading(false);
    }
  }, [stateEntityId]);

  const executeAction = useCallback(async (actionCase) => {
    if (!actionCase) return;

    try {
      setLoading(true);
      setError(null);
      
      switch (actionCase.action) {
        case 'toggle': {
          const { domain, type, state } = actionCase.data;
          let targetKey = `${type}_id`;
          let toggleTargetId = state;
          
          if (targetKey === 'area_id') {
            toggleTargetId = state.split('.')[1];
          }
          
          const turnOn = !switchState;
          await homeAssistantService.toggleSwitch(domain, targetKey, toggleTargetId, turnOn);
          setSwitchState(turnOn);
          break;
        }
        
        case 'turnOn': {
          const { domain, type, state, brightness } = actionCase.data;
          let targetKey = `${type}_id`;
          let toggleTargetId = state;
          
          if (targetKey === 'area_id') {
            toggleTargetId = state.split('.')[1];
          }
          
          // If brightness is specified, use it for lights
          if (brightness !== undefined && domain === 'light') {
            await homeAssistantService.toggleSwitch(domain, targetKey, toggleTargetId, true, { brightness });
          } else {
            await homeAssistantService.toggleSwitch(domain, targetKey, toggleTargetId, true);
          }
          setSwitchState(true);
          break;
        }
        
        case 'turnOff': {
          const { domain, type, state } = actionCase.data;
          let targetKey = `${type}_id`;
          let toggleTargetId = state;
          
          if (targetKey === 'area_id') {
            toggleTargetId = state.split('.')[1];
          }
          
          await homeAssistantService.toggleSwitch(domain, targetKey, toggleTargetId, false);
          setSwitchState(false);
          break;
        }
        
        case 'openLink': {
          const { link } = actionCase.data;
          if (link) {
            window.open(link, '_blank');
          }
          break;
        }
        
        default:
          console.warn(`Unknown action type: ${actionCase.action}`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(`Error executing action:`, err);
      setError(err.message || 'Failed to execute action');
      setLoading(false);
      
      // Refresh the state to ensure it's correct
      fetchSwitchState();
    }
  }, [switchState, fetchSwitchState]);

  const getActionForState = useCallback((isActive) => {
    if (cases.length === 1) {
      return cases[0];
    } else if (cases.length >= 2) {
      // For 2+ cases, first is for "off" state, second is for "on" state
      return isActive ? cases[1] : cases[0];
    }
    return null;
  }, [cases]);

  useEffect(() => {
    fetchSwitchState();
    
    const interval = setInterval(fetchSwitchState, refreshInterval);
    return () => clearInterval(interval);
  }, [stateEntityId, refreshInterval, fetchSwitchState]);

  return {
    switchState,
    loading,
    error,
    executeAction,
    getActionForState,
    cases,
    refreshState: fetchSwitchState
  };
};

export default useSwitchState;
