// Encryption Utilities untuk keamanan password
window.EncryptionManager = {
    // Simple hashing function (untuk demo - gunakan bcrypt di production)
    hashPassword: async function(password) {
        // Convert string to ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        // Use SubtleCrypto untuk hashing
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        // Convert ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    },

    // Verify password dengan hash
    verifyPassword: async function(password, hash) {
        const passwordHash = await this.hashPassword(password);
        return passwordHash === hash;
    },

    // Generate random salt
    generateSalt: function() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    // Encrypt sensitive data (basic encryption)
    encrypt: function(data, key = 'default_key') {
        try {
            // Simple encoding - ini BUKAN enkripsi sebenarnya, hanya untuk demo
            // Gunakan library seperti TweetNaCl.js atau libsodium di production
            const encoded = btoa(JSON.stringify(data));
            return encoded;
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    },

    // Decrypt data
    decrypt: function(encryptedData, key = 'default_key') {
        try {
            const decoded = atob(encryptedData);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
};