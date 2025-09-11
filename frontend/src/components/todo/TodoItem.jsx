import React from 'react';
import PropTypes from 'prop-types';

/**
 * TodoItem component for displaying a single todo item
 */
const TodoItem = ({ todo, toggleTodo, onEdit, getDueInfo }) => {
  const { daysDiff, isDue } = getDueInfo(todo.dueAt);
  
  return (
    <li className={`p-3 rounded-lg ${todo.done ? 'bg-gray-700' : isDue ? 'bg-red-900' : 'bg-gray-800'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo)}
            className="w-5 h-5 mr-3 rounded"
          />
          
          <div>
            <p className={`text-lg ${todo.done ? 'line-through text-gray-400' : 'text-white'}`}>
              {todo.text}
            </p>
            
            {todo.repeatInterval && (
              <p className="text-xs text-gray-400">
                Wiederholt sich alle {todo.repeatInterval} Tage
                {daysDiff !== null && !todo.done && (
                  <span className={isDue ? 'text-red-400 ml-2' : 'text-gray-400 ml-2'}>
                    {isDue ? 'Fällig' : `Fällig in ${daysDiff} Tagen`}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onEdit(todo)}
          className="text-gray-400 hover:text-white"
          aria-label="Edit todo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
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