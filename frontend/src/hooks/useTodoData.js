import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { databaseService, Query } from '../services/pocketbase';
import { DATABASE } from '../config';

/**
 * Custom hook for managing todo data
 * @param {string} listId - ID of the selected task list
 * @returns {Object} - Object containing todo data and functions to manage it
 */
const useTodoData = (listId) => {
  const [todos, setTodos] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load task lists
  const loadTaskLists = useCallback(async () => {
    try {
      setLoading(true);
      const response = await databaseService.listDocuments(
        DATABASE.COLLECTIONS.TASK_LISTS
      );
      
      setTaskLists(response.documents);

      if (response.documents.length > 0) {
        // If listId is provided and exists in taskLists, use it
        if (listId && response.documents.some(list => list.$id === listId)) {
          setSelectedList(listId);
        } 
        // Otherwise, if no list is selected, use the first one
        else if (!selectedList) {
          setSelectedList(response.documents[0].$id);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading task lists:', error);
      setLoading(false);
    }
  }, [listId, selectedList]);

  // Load todos for the selected list
  const loadTodos = useCallback(async () => {
    if (!selectedList) {
      setTodos([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await databaseService.listDocuments(
        DATABASE.COLLECTIONS.TASKS,
        [Query.equal("taskList", selectedList)]
      );

      const now = new Date();
      const sorted = response.documents.sort((a, b) => {
        const groupA = a.done ? 3 : !a.dueAt || new Date(a.dueAt) < now ? 1 : 2;
        const groupB = b.done ? 3 : !b.dueAt || new Date(b.dueAt) < now ? 1 : 2;
        return groupA !== groupB ? groupA - groupB : a.text.localeCompare(b.text, "de");
      });

      setTodos(sorted);
      setLoading(false);
    } catch (error) {
      console.error('Error loading todos:', error);
      setLoading(false);
    }
  }, [selectedList]);

  // Handle list selection change
  const handleListChange = useCallback((newListId) => {
    setSelectedList(newListId);
    navigate(`/tasks/${newListId}`);
  }, [navigate]);

  // Create a new todo
  const createTodo = useCallback(async (text, repeatInterval) => {
    if (!text.trim() || !selectedList) return;

    try {
      setLoading(true);
      const dueAt = new Date();
      dueAt.setHours(0, 0, 0, 0);

      await databaseService.createDocument(
        DATABASE.COLLECTIONS.TASKS,
        "",
        {
          text,
          done: false,
          taskList: selectedList,
          repeatInterval: repeatInterval ? parseInt(repeatInterval, 10) : null,
          dueAt: repeatInterval ? dueAt.toISOString() : null,
        }
      );

      await loadTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
      setLoading(false);
    }
  }, [selectedList, loadTodos]);

  // Update a todo
  const updateTodo = useCallback(async (todoId, data) => {
    try {
      setLoading(true);
      await databaseService.updateDocument(
        DATABASE.COLLECTIONS.TASKS,
        todoId,
        data
      );
      await loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      setLoading(false);
    }
  }, [loadTodos]);

  // Toggle a todo's done state
  const toggleTodo = useCallback(async (todo) => {
    try {
      setLoading(true);
      
      if (todo.repeatInterval && todo.repeatInterval > 0) {
        const nextDue = new Date();
        nextDue.setDate(nextDue.getDate() + todo.repeatInterval);
        nextDue.setHours(0, 0, 0, 0);
        
        await updateTodo(todo.$id, {
          dueAt: nextDue.toISOString(),
        });
      } else {
        await updateTodo(todo.$id, {
          done: !todo.done,
        });
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      setLoading(false);
    }
  }, [updateTodo]);

  // Delete a todo
  const deleteTodo = useCallback(async (todoId) => {
    try {
      setLoading(true);
      await databaseService.deleteDocument(
        DATABASE.COLLECTIONS.TASKS,
        todoId
      );
      await loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setLoading(false);
    }
  }, [loadTodos]);

  // Calculate due info for a todo
  const getDueInfo = useCallback((dueAt) => {
    if (!dueAt) return { daysDiff: null, isDue: false };
    
    const dueDate = new Date(dueAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));
    return { daysDiff: diffDays, isDue: diffDays <= 0 };
  }, []);

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadTaskLists();
  }, [loadTaskLists]);

  useEffect(() => {
    loadTodos();
  }, [selectedList, loadTodos]);

  return {
    todos,
    taskLists,
    selectedList,
    loading,
    handleListChange,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    getDueInfo,
    refreshTodos: loadTodos,
  };
};

export default useTodoData;