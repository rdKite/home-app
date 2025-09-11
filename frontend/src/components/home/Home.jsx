import React from 'react';
import { HOME_CONFIG } from '../../config';
import Room from './Room';
import Action from './Action';

/**
 * Home component for displaying the home layout with rooms and actions
 */
const Home = () => {
  return (
    <div className="text-white m-5">
      <h1 className="fixed">Home</h1>
      
      <div 
        className="relative max-w-screen max-h-screen"
        style={{
          aspectRatio: `${HOME_CONFIG.apt.width / HOME_CONFIG.apt.height}`
        }}
      >
        {/* Render rooms */}
        {HOME_CONFIG.rooms.map((room) => (
          <Room
            key={room.name}
            roomData={room}
            aptData={HOME_CONFIG.apt}
          />
        ))}
        
        {/* Render actions */}
        {HOME_CONFIG.actions.map((action) => (
          <Action
            key={action.name}
            actionData={action}
            aptData={HOME_CONFIG.apt}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;