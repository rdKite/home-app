import React from 'react';
import PropTypes from 'prop-types';

/**
 * TaskListDropdown component for selecting a task list
 */
const TaskListDropdown = ({ taskLists, selectedList, onChange, onNew }) => {
  return (
    <div className="flex items-center mb-6">
      <div className="relative flex-grow">
        <select
          value={selectedList}
          onChange={(e) => onChange(e.target.value)}
          className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-700"
          aria-label="Select task list"
        >
          {taskLists.map((list) => (
            <option key={list.$id} value={list.$id}>
              {list.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      
      <button
        onClick={onNew}
        className="ml-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded flex items-center"
        aria-label="Add new task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Neu
      </button>
    </div>
  );
};

TaskListDropdown.propTypes = {
  taskLists: PropTypes.arrayOf(
    PropTypes.shape({
      $id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedList: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired,
};

export default TaskListDropdown;