import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../config';
import { calculateBackgroundColor, rgbToString, getTextColorByWarningState } from '../../utils/colorUtils';
import { getRoomPositionStyle, getSensorDisplayPositionStyle } from '../../utils/layoutUtils';
import useSensorData from '../../hooks/useSensorData';

/**
 * Room component for displaying a room with sensor data
 */
const Room = ({ roomData, aptData }) => {
  const { sensorsData, warningStates } = useSensorData(roomData.sensors, roomData.type);
  
  return (
    <div>
      {/* Render room coordinates */}
      {roomData.coordinates.map((coordinate, index) => {
        const tempColor = sensorsData.temperature
          ? calculateBackgroundColor(parseFloat(sensorsData.temperature), roomData.type)
          : COLORS.background.gray;
          
        const bgColorString = rgbToString(tempColor);

        return (
          <div
            key={index}
            className="absolute"
            style={{
              ...getRoomPositionStyle(coordinate, aptData, warningStates.borderColor),
              backgroundColor: bgColorString,
              transition: "background-color 0.5s",
            }}
          />
        );
      })}

      {/* Render sensor data display */}
      {(sensorsData.temperature || sensorsData.humidity || sensorsData.co2 || sensorsData.pressure) && (
        <div
          className="absolute m-2 bg-black/60 text-white rounded p-2 shadow"
          style={getSensorDisplayPositionStyle(roomData.coordinates[0], aptData)}
        >
          {sensorsData.temperature && <p>{sensorsData.temperature} °C</p>}
          
          {sensorsData.humidity && (
            <p
              style={{
                color: getTextColorByWarningState(warningStates.humidity),
                fontWeight: warningStates.humidity >= 3 ? "bold" : "normal",
              }}
            >
              {sensorsData.humidity} %
            </p>
          )}
          
          {sensorsData.co2 && (
            <p
              style={{
                color: getTextColorByWarningState(warningStates.co2),
                fontWeight: warningStates.co2 >= 3 ? "bold" : "normal",
              }}
            >
              {sensorsData.co2} ppm
            </p>
          )}

          {sensorsData.pressure && <p>{sensorsData.pressure} hPa</p>}
        </div>
      )}
    </div>
  );
};

Room.propTypes = {
  roomData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    coordinates: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        borders: PropTypes.arrayOf(PropTypes.bool).isRequired,
      })
    ).isRequired,
    sensors: PropTypes.object,
  }).isRequired,
  aptData: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

export default Room;