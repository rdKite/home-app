import React from 'react';
import PropTypes from 'prop-types';
import { LightBulbIcon, CubeIcon } from "@heroicons/react/16/solid/index.js";
import { getActionPositionStyle } from '../../utils/layoutUtils';
import useSwitchState from '../../hooks/useSwitchState';

/**
 * Action component for displaying interactive elements like switches
 */
const Action = ({ actionData, aptData }) => {
  const { switchState, toggleSwitch } = useSwitchState(actionData.data.state);
  
  // Map of icon components
  const icons = {
    cube: CubeIcon,
    lightbulb: LightBulbIcon,
  };
  
  // Get the icon component based on the action data
  const Icon = icons[actionData.icon] || icons.lightbulb;
  
  return (
    <div
      className={`absolute rounded-full w-10 h-10 border-3 transition-colors duration-300 ${
        switchState ? 'bg-yellow-400 border-yellow-100' : 'bg-gray-500 border-gray-200'
      }`}
      style={getActionPositionStyle(actionData.position, aptData)}
    >
      {actionData.type === "switch" && (
        <button
          onClick={toggleSwitch}
          className="w-full h-full flex items-center justify-center"
          aria-label={`Toggle ${actionData.name}`}
        >
          <Icon
            className={`w-7 h-7 cursor-pointer ${
              switchState ? "text-yellow-100" : "text-gray-200"
            }`}
          />
        </button>
      )}

      {actionData.type === "switchWithLink" && (
        <button
          onClick={() => {
            if (!switchState) {
              toggleSwitch();
            } else {
              window.open(actionData.data.link, "_blank");
            }
          }}
          className="w-full h-full flex items-center justify-center"
          aria-label={switchState ? `Open ${actionData.name}` : `Turn on ${actionData.name}`}
        >
          <Icon
            className={`w-7 h-7 cursor-pointer ${
              switchState ? "text-yellow-100" : "text-gray-200"
            }`}
          />
        </button>
      )}
    </div>
  );
};

Action.propTypes = {
  actionData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    icon: PropTypes.string,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      state: PropTypes.string.isRequired,
      link: PropTypes.string,
    }).isRequired,
  }).isRequired,
  aptData: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

export default Action;