import React from "react";

export default function TodoDialog({
   dialogRef,
   newTodo,
   setNewTodo,
   repeatInterval,
   setRepeatInterval,
   onClose,
   onSave,
   onDelete,
   editingTodo
}) {
    return (
        <dialog ref={dialogRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 w-96 text-white max-w-full bg-gray-900 border border-violet-700 backdrop:bg-gray-900 backdrop:opacity-60">
            <h2 className="text-xl font-semibold mb-4">
                {editingTodo ? "Eintrag bearbeiten" : "Neuen Eintrag hinzufügen"}
            </h2>
            <form onSubmit={onSave} className="flex flex-col gap-3">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="border rounded-xl px-3 py-2"
                    placeholder="Neues Todo..."
                />
                <input
                    type="number"
                    min="1"
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(e.target.value)}
                    className="border rounded-xl px-3 py-2"
                    placeholder="Wiederholung (Tage, optional)"
                />
                <div className="flex justify-between gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1 border rounded-xl cursor-pointer"
                    >
                        Abbrechen
                    </button>
                    <div className="flex gap-2">
                        {editingTodo && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl shadow cursor-pointer"
                            >
                                Löschen
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-xl shadow cursor-pointer"
                        >
                            Speichern
                        </button>
                    </div>
                </div>
            </form>
        </dialog>
    );
}
