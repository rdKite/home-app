import React from 'react';
import PropTypes from 'prop-types';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  PencilIcon
} from "@heroicons/react/16/solid/index.js";

/**
 * TodoItem component for displaying a single todo item
 */
const TodoItem = ({ todo, toggleTodo, onEdit, getDueInfo }) => {
  const { daysDiff, isDue } = getDueInfo(todo.dueAt);
  
  return (
    <li className={`p-3 rounded-lg ${todo.done ? 'bg-gray-800' : isDue ? 'bg-red-900' : 'bg-gray-700'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <p className={`text-lg ${todo.done ? 'line-through text-gray-500' : 'text-white'}`}>
              {todo.text}
            </p>

            {todo.repeatInterval ? (
              <p className="text-xs text-gray-400">
                <ArrowPathIcon className="w-3 h-3 inline mr-1"/>
                {todo.repeatInterval} Tage |
                {daysDiff !== null && !todo.done && (
                  <span className={isDue ? 'text-red-400 ml-2' : 'text-green-400 ml-1'}>
                    {isDue ? 'Fällig' : `Fällig in ${daysDiff} Tagen`}
                  </span>
                )}
              </p>
            ) : '' }
          </div>
        </div>

        <div>
          <button
              onClick={() => toggleTodo(todo)}
              className={`${! todo.done ? 'text-gray-300' : 'text-gray-600'} hover:text-violet-500 cursor-pointer`}
              aria-label="Edit todo"
          >
            <CheckCircleIcon className="w-7 h-7" />
          </button>

          <button
              onClick={() => onEdit(todo)}
              className="text-gray-300 hover:text-violet-500 cursor-pointer ml-2"
              aria-label="Edit todo"
          >
            <PencilIcon className="w-7 h-7" />
          </button>
        </div>

      </div>
    </li>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
    repeatInterval: PropTypes.number,
    dueAt: PropTypes.string,
  }).isRequired,
  toggleTodo: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  getDueInfo: PropTypes.func.isRequired,
};

export default TodoItem;