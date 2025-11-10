import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {LightBulbIcon, CubeIcon, BoltIcon, CogIcon, ClockIcon} from "@heroicons/react/16/solid/index.js";
import { getActionPositionStyle } from '../../utils/layoutUtils';
import useSwitchState from '../../hooks/useSwitchState';

/**
 * Action component for displaying interactive elements with multiple possibilities
 */
const Action = ({ actionData, aptData }) => {
  const { switchState, executeAction, getActionForState, cases } = useSwitchState(
    actionData.state, 
    actionData.cases
  );
  
  const [showOverlay, setShowOverlay] = useState(false);
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);
  
  // Map of icon components
  const icons = {
    cube: CubeIcon,
    lightbulb: LightBulbIcon,
    bolt: BoltIcon,
    vacuum: CogIcon,
    clock: ClockIcon,
  };
  
  // Get the icon component based on the action data
  const Icon = icons[actionData.icon] || icons.lightbulb;
  
  const handleMouseDown = useCallback(() => {
    longPressTriggered.current = false;
    
    if (cases.length > 2) {
      longPressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        setShowOverlay(true);
      }, 500); // 500ms for long press
    }
  }, [cases.length]);
  
  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    // Only execute single click action if long press wasn't triggered
    if (!longPressTriggered.current) {
      const action = getActionForState(switchState);
      if (action) {
        executeAction(action);
      }
    }
  }, [switchState, getActionForState, executeAction]);
  
  const handleMouseLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);
  
  const handleOverlayAction = useCallback((actionCase) => {
    executeAction(actionCase);
    setShowOverlay(false);
  }, [executeAction]);
  
  const closeOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);
  
  return (
    <>
      <div
        className={`absolute rounded-full w-10 h-10 border-3 transition-colors duration-300 ${
          switchState ? 'bg-yellow-400 border-yellow-100' : 'bg-gray-500 border-gray-200'
        }`}
        style={getActionPositionStyle(actionData.position, aptData)}
      >
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="w-full h-full flex items-center justify-center"
          aria-label={actionData.name}
        >
          <Icon
            className={`w-7 h-7 cursor-pointer ${
              switchState ? "text-yellow-100" : "text-gray-200"
            }`}
          />
        </button>
      </div>
      
      {/* Overlay for multiple cases */}
      {showOverlay && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeOverlay}
        >
          <div 
            className="bg-white rounded-lg p-4 max-w-xs w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {actionData.name}
            </h3>
            <div className="space-y-2">
              {cases.map((actionCase, index) => (
                <button
                  key={index}
                  onClick={() => handleOverlayAction(actionCase)}
                  className="w-full text-left px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-800"
                >
                  {actionCase.name}
                </button>
              ))}
            </div>
            <button
              onClick={closeOverlay}
              className="w-full mt-3 px-3 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors duration-200 text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

Action.propTypes = {
  actionData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    state: PropTypes.string.isRequired,
    cases: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        action: PropTypes.oneOf(['toggle', 'turnOn', 'turnOff', 'openLink', 'script']).isRequired,
        data: PropTypes.object.isRequired,
      })
    ).isRequired,
  }).isRequired,
  aptData: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

export default Action;
