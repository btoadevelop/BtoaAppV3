const EncryptionManager = {
    generatePassword: function(options = {}) {
        const { length = 16, includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSpecial = true } = options;
        let characters = '';
        let password = '';
        if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) characters += '0123456789';
        if (includeSpecial) characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        for (let i = 0; i < length; i++) { password += characters.charAt(Math.floor(Math.random() * characters.length)); }
        return password;
    },
    hashPassword: async function(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};
window.EncryptionManager = EncryptionManager;