import React from 'react';
import PropTypes from 'prop-types';
import {ChevronDownIcon, PlusIcon} from "@heroicons/react/16/solid/index.js";

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
          className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-700 cursor-pointer"
          aria-label="Select task list"
        >
          {taskLists.map((list) => (
            <option key={list.$id} value={list.$id}>
              {list.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
            <ChevronDownIcon className="w-4 h-4" />
        </div>
      </div>
      
      <button
        onClick={onNew}
        className="ml-4 bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded flex items-center cursor-pointer"
        aria-label="Add new task"
      >
        <PlusIcon className="w-5 h-5 mr-1" />
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