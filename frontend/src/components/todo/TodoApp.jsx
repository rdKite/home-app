import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import TaskListDropdown from './TaskListDropdown';
import TodoDialog from './TodoDialog';
import TodoItem from './TodoItem';
import useTodoData from '../../hooks/useTodoData';

/**
 * TodoApp component for managing todos
 */
const TodoApp = ({ listId }) => {
  const {
    todos,
    taskLists,
    selectedList,
    handleListChange,
    toggleTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    getDueInfo,
  } = useTodoData(listId);

  const [newTodo, setNewTodo] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const dialogRef = useRef(null);

  // Dialog management
  const closeDialog = () => dialogRef.current?.close();
  
  const openEditDialog = (todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
    setRepeatInterval(todo.repeatInterval || "");
    dialogRef.current?.showModal();
  };
  
  const openNewDialog = () => {
    setEditingTodo(null);
    setNewTodo("");
    setRepeatInterval("");
    dialogRef.current?.showModal();
  };

  // Save todo (create or update)
  const saveTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !selectedList) return;

    if (editingTodo) {
      await updateTodo(editingTodo.$id, {
        text: newTodo,
        repeatInterval: repeatInterval ? parseInt(repeatInterval, 10) : null,
        dueAt: repeatInterval ? new Date().toISOString() : null,
      });
    } else {
      await createTodo(newTodo, repeatInterval);
    }

    setNewTodo("");
    setRepeatInterval("");
    setEditingTodo(null);
    closeDialog();
  };

  // Delete current editing todo
  const handleDeleteTodo = async () => {
    if (!editingTodo) return;
    await deleteTodo(editingTodo.$id);
    setEditingTodo(null);
    setNewTodo("");
    setRepeatInterval("");
    closeDialog();
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Listen</h1>
      
      <TaskListDropdown
        taskLists={taskLists}
        selectedList={selectedList}
        onChange={handleListChange}
        onNew={openNewDialog}
      />
      
      <TodoDialog
        dialogRef={dialogRef}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        repeatInterval={repeatInterval}
        setRepeatInterval={setRepeatInterval}
        onClose={closeDialog}
        onSave={saveTodo}
        onDelete={handleDeleteTodo}
        editingTodo={editingTodo}
      />
      
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.$id}
            todo={todo}
            toggleTodo={toggleTodo}
            onEdit={openEditDialog}
            getDueInfo={getDueInfo}
          />
        ))}
      </ul>
    </div>
  );
};

TodoApp.propTypes = {
  listId: PropTypes.string,
};

export default TodoApp;