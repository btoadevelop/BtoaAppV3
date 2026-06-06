// Encryption Utilities untuk Password Vault

const EncryptionManager = {
    /**
     * Generate random key untuk encryption
     */
    generateKey: async function() {
        return crypto.getRandomValues(new Uint8Array(32));
    },

    /**
     * Encrypt data dengan AES-256-GCM
     */
    encrypt: async function(data, key) {
        try {
            // Generate IV
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            // Import key
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                key,
                { name: 'AES-GCM' },
                false,
                ['encrypt']
            );

            // Encrypt
            const encoder = new TextEncoder();
            const encryptedData = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                cryptoKey,
                encoder.encode(JSON.stringify(data))
            );

            // Combine IV + encrypted data
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encryptedData), iv.length);

            // Convert to base64
            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    },

    /**
     * Decrypt data
     */
    decrypt: async function(encryptedData, key) {
        try {
            // Convert from base64
            const combined = Uint8Array.from(
                atob(encryptedData),
                c => c.charCodeAt(0)
            );

            // Extract IV
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            // Import key
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                key,
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );

            // Decrypt
            const decryptedData = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                cryptoKey,
                data
            );

            // Decode
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(decryptedData));
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    },

    /**
     * Generate password
     */
    generatePassword: function(options = {}) {
        const {
            length = 16,
            includeUppercase = true,
            includeLowercase = true,
            includeNumbers = true,
            includeSpecial = true,
            excludeAmbiguous = false
        } = options;

        let characters = '';
        let password = '';

        if (includeLowercase) {
            const lower = excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
            characters += lower;
        }
        if (includeUppercase) {
            const upper = excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            characters += upper;
        }
        if (includeNumbers) {
            const nums = excludeAmbiguous ? '23456789' : '0123456789';
            characters += nums;
        }
        if (includeSpecial) {
            characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }

        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return password;
    },

    /**
     * Hash password dengan SHA-256
     */
    hashPassword: async function(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

// Export
window.EncryptionManager = EncryptionManager;