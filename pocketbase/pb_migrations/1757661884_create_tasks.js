migrate((app) => {
    const taskListCollection = app.findCollectionByNameOrId("task_lists");

    const collection = new Collection({
        type: "base",
        name: "tasks",
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: '',
        deleteRule: '',
        fields: [
            {
                name: "text",
                type: "text",
                required: true,
            },
            {
                name: "done",
                type: "bool",
                required: false,
            },
            {
                name: "dueAt",
                type: "date",
                required: false,
            },
            {
                name: "repeatInterval",
                type: "number",
                required: false,
            },
            {
                name: "taskList",
                type: "relation",
                required: true,
                collectionId: taskListCollection.id,
                maxSelect: 1,
                cascadeDelete: true,
            },
        ]
    });
    app.save(collection);

}, (app) => {
    const collection = app.findCollectionByNameOrId("tasks");
    return app.delete(collection);
});
