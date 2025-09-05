import PocketBase from 'pocketbase';

// Initialize PocketBase client
// Using the URL from docker-compose.yaml (pocketbase service on port 8090)
const pb = new PocketBase('http://localhost:8090');

// Create a wrapper for authentication
export const account = {
    // Get current user
    get: async () => {
        if (pb.authStore.isValid) {
            return pb.authStore.model;
        }
        throw new Error('User not authenticated');
    },
    
    // Create a new user
    create: async (id, email, password, name) => {
        return await pb.collection('users').create({
            email,
            password,
            passwordConfirm: password,
            name,
        });
    },
    
    // Login with email and password
    createEmailPasswordSession: async (email, password) => {
        return await pb.collection('users').authWithPassword(email, password);
    },
    
    // Logout
    deleteSession: async () => {
        pb.authStore.clear();
    }
};

// Create a wrapper for database operations
export const databases = {
    // List documents from a collection
    listDocuments: async (databaseId, collectionId, queries = []) => {
        let filter = '';

        if (queries.length > 0) {
            // Handle the specific case we're using in TodoApp.jsx
            // [Query.equal("taskLists", selectedList)]
            const equalQuery = queries.find(q => q.includes('='));
            if (equalQuery) {
                const [field, value] = equalQuery.split('=');
                filter = `${field}="${value.replace(/"/g, '')}"`;
            }
        }
        
        const records = await pb.collection(collectionId).getList(1, 100, {
            filter: filter
        });

        return {
            documents: records.items.map(item => ({
                ...item,
                $id: item.id
            }))
        };
    },
    
    // Create a document
    createDocument: async (databaseId, collectionId, id, data) => {
        return await pb.collection(collectionId).create(data);
    },
    
    // Update a document
    updateDocument: async (databaseId, collectionId, id, data) => {
        return await pb.collection(collectionId).update(id, data);
    },
    
    // Delete a document
    deleteDocument: async (databaseId, collectionId, id) => {
        return await pb.collection(collectionId).delete(id);
    }
};

export const Query = {
    equal: (attribute, value) => `${attribute}="${value}"`
};

// Export the PocketBase instance for direct access if needed
export default pb;