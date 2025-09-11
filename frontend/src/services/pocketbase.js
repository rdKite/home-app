import PocketBase from 'pocketbase';
import { API_URLS, DATABASE } from '../config';

/**
 * PocketBase client instance
 */
const pb = new PocketBase(API_URLS.POCKETBASE);

/**
 * Authentication service for PocketBase
 */
export const authService = {
  /**
   * Get current user
   * @returns {Promise<Object>} - The current user
   * @throws {Error} - If user is not authenticated
   */
  getCurrentUser: async () => {
    if (pb.authStore.isValid) {
      return pb.authStore.model;
    }
    throw new Error('User not authenticated');
  },
  
  /**
   * Create a new user
   * @param {string} id - User ID
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise<Object>} - The created user
   */
  createUser: async (id, email, password, name) => {
    return await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name,
    });
  },
  
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - The authenticated user
   */
  loginWithEmailPassword: async (email, password) => {
    return await pb.collection('users').authWithPassword(email, password);
  },
  
  /**
   * Logout the current user
   */
  logout: async () => {
    pb.authStore.clear();
  }
};

/**
 * Database service for PocketBase
 */
export const databaseService = {
  /**
   * List documents from a collection
   * @param {string} collectionId - The collection ID
   * @param {Array} queries - Query filters
   * @returns {Promise<Object>} - The documents
   */
  listDocuments: async (collectionId, queries = []) => {
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
  
  /**
   * Create a document
   * @param {string} collectionId - The collection ID
   * @param {string} id - The document ID (unused)
   * @param {Object} data - The document data
   * @returns {Promise<Object>} - The created document
   */
  createDocument: async (collectionId, id, data) => {
    return await pb.collection(collectionId).create(data);
  },
  
  /**
   * Update a document
   * @param {string} collectionId - The collection ID
   * @param {string} id - The document ID
   * @param {Object} data - The document data
   * @returns {Promise<Object>} - The updated document
   */
  updateDocument: async (collectionId, id, data) => {
    return await pb.collection(collectionId).update(id, data);
  },
  
  /**
   * Delete a document
   * @param {string} collectionId - The collection ID
   * @param {string} id - The document ID
   * @returns {Promise<Object>} - The response
   */
  deleteDocument: async (collectionId, id) => {
    return await pb.collection(collectionId).delete(id);
  }
};

/**
 * Query builder for PocketBase
 */
export const Query = {
  /**
   * Create an equality query
   * @param {string} attribute - The attribute to compare
   * @param {string} value - The value to compare with
   * @returns {string} - The query string
   */
  equal: (attribute, value) => `${attribute}="${value}"`
};

// Export the PocketBase instance for direct access if needed
export default pb;