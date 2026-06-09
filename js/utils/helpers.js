// Helper Functions dan Utilities
window.appHelpers = {
    // Email Validation
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 100;
    },

    // Password Validation
    validatePassword: function(password) {
        let score = 0;
        let label = 'Weak';

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.< >\/?]/.test(password)) score++;

        if (score === 1) label = 'Weak';
        else if (score === 2) label = 'Fair';
        else if (score === 3) label = 'Good';
        else if (score === 4) label = 'Strong';
        else if (score === 5) label = 'Very Strong';

        return { score, label, isValid: score >= 2 };
    },

    // Name Validation
    validateName: function(name) {
        const trimmed = name.trim();
        return trimmed.length >= 2 && trimmed.length <= 50 && !/[<>]/.test(trimmed);
    },

    // Storage Manager
    StorageManager: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Storage error:', error);
                return false;
            }
        },

        get: function(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Storage error:', error);
                return null;
            }
        },

        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Storage error:', error);
                return false;
            }
        },

        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('Storage error:', error);
                return false;
            }
        }
    },

    // Toast Notification
    showToast: function(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        else if (type === 'error') icon = 'fa-exclamation-circle';
        else if (type === 'warning') icon = 'fa-exclamation-triangle';

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 200ms ease-in forwards';
            setTimeout(() => toast.remove(), 200);
        }, duration);
    },

    // Error Handler
    handleError: function(error, formId = null) {
        let message = 'Terjadi kesalahan. Silakan coba lagi.';

        if (error.code === 'auth/email-already-in-use') {
            message = 'Email sudah terdaftar. Gunakan email lain atau login.';
        } else if (error.code === 'auth/weak-password') {
            message = 'Password terlalu lemah. Gunakan minimal 8 karakter.';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Format email tidak valid.';
        } else if (error.code === 'auth/user-not-found') {
            message = 'Email tidak ditemukan. Silakan daftar terlebih dahulu.';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Password salah. Silakan coba lagi.';
        } else if (error.code === 'auth/too-many-requests') {
            message = 'Terlalu banyak percobaan login. Coba beberapa menit kemudian.';
        } else if (error.message) {
            message = error.message;
        }

        this.showToast(message, 'error');

        if (formId) {
            const form = document.getElementById(formId);
            if (form) {
                const errorElement = form.querySelector('.error-message');
                if (errorElement) {
                    errorElement.textContent = message;
                }
            }
        }

        return message;
    },

    // Clear Form Errors
    clearFormErrors: function(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
    }
};