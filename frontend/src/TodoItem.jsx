import React from "react";
import {
    CheckCircleIcon,
    XCircleIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";

export default function TodoItem({ todo, toggleTodo, onEdit, getDueInfo }) {
    const dueInfo = todo.dueAt ? getDueInfo(todo.dueAt) : null;

    let dueText = "";
    if (dueInfo) {
        const { daysDiff, isDue } = dueInfo;
        if (daysDiff === 0) dueText = "heute";
        else if (daysDiff > 0) dueText = `in ${daysDiff} Tag${daysDiff > 1 ? "en" : ""}`;
        else dueText = `vor ${Math.abs(daysDiff)} Tag${Math.abs(daysDiff) > 1 ? "en" : ""}`;

        dueText = (
            <div className={`text-sm ${isDue ? "text-red-600" : "text-green-600"}`}>
                fällig: {dueText}
            </div>
        );
    }

    return (
        <li
            className={`flex justify-between items-center p-3 rounded-xl text-white border border-solid border-violet-600 ${
                todo.done ? "opacity-50 line-through" : ""
            }`}
        >
            <div>
                <span>{todo.text}</span>
                {dueText}
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => onEdit(todo)} className="cursor-pointer">
                    <PencilSquareIcon className="w-7 h-7 text-white" />
                </button>
                <button onClick={() => toggleTodo(todo)} className="cursor-pointer">
                    {todo.done ? (
                        <XCircleIcon className="w-7 h-7 text-white" />
                    ) : (
                        <CheckCircleIcon className="w-7 h-7 text-white" />
                    )}
                </button>
            </div>
        </li>
    );
}
