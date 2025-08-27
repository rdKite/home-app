import React, { useEffect, useRef, useState } from "react";
import { databases } from "./appwrite";
import TaskListDropdown from "./TaskListDropdown";
import TodoDialog from "./TodoDialog";
import TodoItem from "./TodoItem";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const COLLECTION_ID_TASKS = import.meta.env.VITE_COLLECTION_ID_TASKS;
const COLLECTION_ID_LISTS = import.meta.env.VITE_COLLECTION_ID_TASK_LISTS;

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [taskLists, setTaskLists] = useState([]);
    const [selectedList, setSelectedList] = useState("");
    const [newTodo, setNewTodo] = useState("");
    const [repeatInterval, setRepeatInterval] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const dialogRef = useRef(null);

    const loadTaskLists = async () => {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_LISTS);
        setTaskLists(response.documents);
        if (response.documents.length > 0 && !selectedList) {
            setSelectedList(response.documents[0].$id);
        }
    };

    const loadTodos = async () => {
        if (!selectedList) return;
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_TASKS,
            [Query.equal("taskLists", selectedList)]
        );

        const now = new Date();
        const sorted = response.documents.sort((a, b) => {
            const groupA = a.done ? 3 : !a.dueAt || new Date(a.dueAt) < now ? 1 : 2;
            const groupB = b.done ? 3 : !b.dueAt || new Date(b.dueAt) < now ? 1 : 2;
            return groupA !== groupB ? groupA - groupB : a.text.localeCompare(b.text, "de");
        });

        setTodos(sorted);
    };

    useEffect(() => { loadTaskLists(); }, []);
    useEffect(() => { loadTodos(); }, [selectedList]);

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

    const saveTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim() || !selectedList) return;

        const dueAt = new Date();
        dueAt.setHours(0, 0, 0, 0);

        if (editingTodo) {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID_TASKS, editingTodo.$id, {
                text: newTodo,
                repeatInterval: repeatInterval ? parseInt(repeatInterval, 10) : null,
                dueAt: repeatInterval ? dueAt.toISOString() : null,
            });
        } else {
            await databases.createDocument(DATABASE_ID, COLLECTION_ID_TASKS, "unique()", {
                text: newTodo,
                done: false,
                taskLists: selectedList,
                repeatInterval: repeatInterval ? parseInt(repeatInterval, 10) : null,
                dueAt: repeatInterval ? dueAt.toISOString() : null,
            });
        }

        setNewTodo(""); setRepeatInterval(""); setEditingTodo(null);
        closeDialog(); await loadTodos();
    };

    const toggleTodo = async (todo) => {
        if (todo.repeatInterval && todo.repeatInterval > 0) {
            const nextDue = new Date();
            nextDue.setDate(nextDue.getDate() + todo.repeatInterval);
            nextDue.setHours(0, 0, 0, 0);
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID_TASKS, todo.$id, {
                dueAt: nextDue.toISOString(),
            });
        } else {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID_TASKS, todo.$id, {
                done: !todo.done,
            });
        }
        await loadTodos();
    };

    const deleteTodo = async () => {
        if (!editingTodo) return;
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_TASKS, editingTodo.$id);
        setEditingTodo(null); setNewTodo(""); setRepeatInterval("");
        closeDialog(); await loadTodos();
    };

    const getDueInfo = (dueAt) => {
        if (!dueAt) return { daysDiff: null, isDue: false };
        const dueDate = new Date(dueAt);
        const today = new Date(); today.setHours(0,0,0,0); dueDate.setHours(0,0,0,0);
        const diffDays = Math.round((dueDate - today) / (1000*60*60*24));
        return { daysDiff: diffDays, isDue: diffDays <= 0 };
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-white">Listen</h1>
            <TaskListDropdown taskLists={taskLists} selectedList={selectedList} onChange={setSelectedList} onNew={openNewDialog} />
            <TodoDialog
                dialogRef={dialogRef}
                newTodo={newTodo}
                setNewTodo={setNewTodo}
                repeatInterval={repeatInterval}
                setRepeatInterval={setRepeatInterval}
                onClose={closeDialog}
                onSave={saveTodo}
                onDelete={deleteTodo}
                editingTodo={editingTodo}
            />
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <TodoItem key={todo.$id} todo={todo} toggleTodo={toggleTodo} onEdit={openEditDialog} getDueInfo={getDueInfo} />
                ))}
            </ul>
        </div>
    );
}
