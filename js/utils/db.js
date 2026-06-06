// Database Utilities

const DBManager = {
    /**
     * Add document ke Firestore
     */
    addDocument: async function(collection, data) {
        try {
            const { db } = window.firebaseApp;
            const { addDoc, collection: fbCollection } = window.firebaseModules;
            
            const docRef = await addDoc(fbCollection(db, collection), {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            return docRef.id;
        } catch (error) {
            console.error('Error adding document:', error);
            return null;
        }
    },

    /**
     * Update document
     */
    updateDocument: async function(collection, docId, data) {
        try {
            const { db } = window.firebaseApp;
            const { updateDoc, doc } = window.firebaseModules;
            
            await updateDoc(doc(db, collection, docId), {
                ...data,
                updatedAt: new Date()
            });
            
            return true;
        } catch (error) {
            console.error('Error updating document:', error);
            return false;
        }
    },

    /**
     * Delete document
     */
    deleteDocument: async function(collection, docId) {
        try {
            const { db } = window.firebaseApp;
            const { deleteDoc, doc } = window.firebaseModules;
            
            await deleteDoc(doc(db, collection, docId));
            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            return false;
        }
    },

    /**
     * Get single document
     */
    getDocument: async function(collection, docId) {
        try {
            const { db } = window.firebaseApp;
            const { getDoc, doc } = window.firebaseModules;
            
            const docSnap = await getDoc(doc(db, collection, docId));
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (error) {
            console.error('Error getting document:', error);
            return null;
        }
    },

    /**
     * Get all documents dari collection
     */
    getCollection: async function(collection, whereConditions = []) {
        try {
            const { db } = window.firebaseApp;
            const { query, getDocs, collection: fbCollection, where } = window.firebaseModules;
            
            let q = fbCollection(db, collection);
            
            if (whereConditions.length > 0) {
                const conditions = whereConditions.map(([field, operator, value]) => 
                    where(field, operator, value)
                );
                q = query(fbCollection(db, collection), ...conditions);
            }
            
            const querySnapshot = await getDocs(q);
            const data = [];
            querySnapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            
            return data;
        } catch (error) {
            console.error('Error getting collection:', error);
            return [];
        }
    },

    /**
     * Real-time listener
     */
    onCollectionChange: function(collection, callback, whereConditions = []) {
        try {
            const { db } = window.firebaseApp;
            const { query, onSnapshot, collection: fbCollection, where } = window.firebaseModules;
            
            let q = fbCollection(db, collection);
            
            if (whereConditions.length > 0) {
                const conditions = whereConditions.map(([field, operator, value]) => 
                    where(field, operator, value)
                );
                q = query(fbCollection(db, collection), ...conditions);
            }
            
            return onSnapshot(q, (snapshot) => {
                const data = [];
                snapshot.forEach(doc => {
                    data.push({ id: doc.id, ...doc.data() });
                });
                callback(data);
            });
        } catch (error) {
            console.error('Error setting up listener:', error);
            return null;
        }
    }
};

// Export
window.DBManager = DBManager;