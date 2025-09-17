migrate((app) => {
    const collection = new Collection({
        type: "base",
        name: "task_lists",
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: '',
        deleteRule: '',
        fields: [
            {
                name: "name",
                type: "text",
                required: true
            }
        ]
    });
    app.save(collection);

}, (app) => {
    const collection = app.findCollectionByNameOrId("task_lists");
    return app.delete(collection);
});
