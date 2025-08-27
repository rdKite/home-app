import React from "react";

export default function TaskListDropdown({ taskLists, selectedList, onChange, onNew }) {
    return (
        <div className="flex items-center gap-4 mb-6 text-white">
            <label htmlFor="taskList" className="font-medium">
                Liste:
            </label>
            <select
                id="taskList"
                value={selectedList}
                onChange={(e) => onChange(e.target.value)}
                className="border rounded-xl px-3 py-2 cursor-pointer"
            >
                {taskLists.map((list) => (
                    <option key={list.$id} value={list.$id}>
                        {list.name}
                    </option>
                ))}
            </select>

            <button
                onClick={onNew}
                className="ml-auto px-4 py-2 bg-violet-600 text-white rounded-xl shadow cursor-pointer"
            >
                Neuer Eintrag
            </button>
        </div>
    );
}
