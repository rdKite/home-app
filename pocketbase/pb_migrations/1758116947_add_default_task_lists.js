migrate((app) => {
    const taskListCollection = app.findCollectionByNameOrId("task_lists");

    const listEinkaufsliste = new Record(taskListCollection);
    listEinkaufsliste.set("name", "Einkaufsliste");

    const listHaushalt = new Record(taskListCollection);
    listHaushalt.set("name", "Haushalt");

    try {
        app.save(listEinkaufsliste);
        app.save(listHaushalt);
    } catch (error) {
        console.error("Error creating default task lists:", error);
    }
}, (app) => {})