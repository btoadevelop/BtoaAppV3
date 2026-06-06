// Helper Functions

/**
 * Format currency untuk Indonesia
 * @param {number} amount - Jumlah uang
 * @returns {string} - Format mata uang
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

/**
 * Format date ke Indonesian format
 * @param {Date|string} date - Tanggal
 * @returns {string} - Format tanggal
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('id-ID', options);
}

/**
 * Format time
 * @param {string} time - Waktu dalam format HH:mm
 * @returns {string} - Format waktu
 */
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
}

/**
 * Validate email
 * @param {string} email - Email
 * @returns {boolean} - Validasi email
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {object} - Strength score dan message
 */
function validatePassword(password) {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('Minimal 8 karakter');

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Gunakan huruf kecil');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Gunakan huruf besar');

    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Gunakan angka');

    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    else feedback.push('Gunakan karakter spesial');

    const scores = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    
    return {
        score: strength,
        label: scores[strength] || 'Sangat Lemah',
        feedback: feedback
    };
}

/**
 * Show toast notification
 * @param {string} message - Pesan
 * @param {string} type - Tipe (success, error, warning, info)
 * @param {number} duration - Durasi (ms)
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

/**
 * Debounce function
 * @param {Function} func - Fungsi yang akan di-debounce
 * @param {number} wait - Waktu tunggu (ms)
 * @returns {Function} - Fungsi yang sudah di-debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Fungsi yang akan di-throttle
 * @param {number} limit - Batas waktu (ms)
 * @returns {Function} - Fungsi yang sudah di-throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Get user initials
 * @param {string} name - Nama user
 * @returns {string} - Initials
 */
function getUserInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Local storage dengan prefix
 */
const StorageManager = {
    set: (key, value) => {
        localStorage.setItem(`btoa_${key}`, JSON.stringify(value));
    },
    get: (key) => {
        const item = localStorage.getItem(`btoa_${key}`);
        return item ? JSON.parse(item) : null;
    },
    remove: (key) => {
        localStorage.removeItem(`btoa_${key}`);
    },
    clear: () => {
        Object.keys(localStorage)
            .filter(key => key.startsWith('btoa_'))
            .forEach(key => localStorage.removeItem(key));
    }
};

// Export
window.appHelpers = {
    formatCurrency,
    formatDate,
    formatTime,
    validateEmail,
    validatePassword,
    showToast,
    debounce,
    throttle,
    getUserInitials,
    StorageManager
};