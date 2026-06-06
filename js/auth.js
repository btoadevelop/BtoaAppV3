// Authentication Handler

const AuthManager = {
    /**
     * Register user dengan email dan password
     */
    register: async function(email, password, userData) {
        try {
            const { auth, db } = window.firebaseApp;
            const { createUserWithEmailAndPassword, updateProfile } = window.firebaseModules;
            
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update profile
            await updateProfile(user, {
                displayName: userData.name
            });
            
            // Store additional data di Firestore
            await window.DBManager.addDocument(`users/${user.uid}/profile`, {
                uid: user.uid,
                email: user.email,
                name: userData.name,
                createdAt: new Date()
            });
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Login dengan email dan password
     */
    login: async function(email, password) {
        try {
            const { auth } = window.firebaseApp;
            const { signInWithEmailAndPassword } = window.firebaseModules;
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Login dengan Google
     */
    loginWithGoogle: async function() {
        try {
            const { auth } = window.firebaseApp;
            const { signInWithPopup, GoogleAuthProvider } = window.firebaseModules;
            
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            return { success: true, user: result.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Logout
     */
    logout: async function() {
        try {
            const { auth } = window.firebaseApp;
            const { signOut } = window.firebaseModules;
            
            await signOut(auth);
            window.appHelpers.StorageManager.clear();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Reset password
     */
    resetPassword: async function(email) {
        try {
            const { auth } = window.firebaseApp;
            const { sendPasswordResetEmail } = window.firebaseModules;
            
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Get current user
     */
    getCurrentUser: function() {
        return new Promise((resolve) => {
            const { auth } = window.firebaseApp;
            const { onAuthStateChanged } = window.firebaseModules;
            
            onAuthStateChanged(auth, (user) => {
                resolve(user);
            });
        });
    },

    /**
     * Check authentication state
     */
    onAuthStateChange: function(callback) {
        const { auth } = window.firebaseApp;
        const { onAuthStateChanged } = window.firebaseModules;
        
        return onAuthStateChanged(auth, (user) => {
            callback(user);
        });
    }
};

// Export
window.AuthManager = AuthManager;