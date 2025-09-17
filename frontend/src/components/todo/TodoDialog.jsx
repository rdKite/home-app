import React from 'react';
import PropTypes from 'prop-types';

/**
 * TodoDialog component for creating and editing todos
 */
const TodoDialog = ({
  dialogRef,
  newTodo,
  setNewTodo,
  repeatInterval,
  setRepeatInterval,
  onClose,
  onSave,
  onDelete,
  editingTodo,
}) => {
  return (
    <dialog
      ref={dialogRef}
      className="p-6 rounded-lg bg-gray-800 text-white shadow-xl backdrop:bg-black/50 w-full max-w-md"
    >
      <h2 className="text-xl font-bold mb-4">
        {editingTodo ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
      </h2>
      
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label htmlFor="todoText" className="block text-sm font-medium mb-1">
            Aufgabe
          </label>
          <input
            id="todoText"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Was muss erledigt werden?"
            autoFocus
          />
        </div>
        
        <div>
          <label htmlFor="repeatInterval" className="block text-sm font-medium mb-1">
            Wiederholung (Tage)
          </label>
          <input
            id="repeatInterval"
            type="number"
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Leer lassen für keine Wiederholung"
            min="0"
          />
          <p className="text-xs text-gray-400 mt-1">
            Leer lassen für keine Wiederholung
          </p>
        </div>
        
        <div className="flex justify-between pt-4">
          <div>
            {editingTodo && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded"
              >
                Löschen
              </button>
            )}
          </div>
          
          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-700 hover:bg-violet-600 rounded cursor-pointer"
            >
              Speichern
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
};

TodoDialog.propTypes = {
  dialogRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  newTodo: PropTypes.string.isRequired,
  setNewTodo: PropTypes.func.isRequired,
  repeatInterval: PropTypes.string.isRequired,
  setRepeatInterval: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  editingTodo: PropTypes.object,
};

export default TodoDialog;