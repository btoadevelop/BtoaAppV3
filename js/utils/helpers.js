function formatCurrency(amount) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount); }
function formatDate(date) { const options = { year: 'numeric', month: 'long', day: 'numeric' }; return new Date(date).toLocaleDateString('id-ID', options); }
function validateEmail(email) { const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return regex.test(email); }
function validatePassword(password) {
    let strength = 0;
    const feedback = [];
    if (password.length >= 8) strength++; else feedback.push('Minimal 8 karakter');
    if (/[a-z]/.test(password)) strength++; else feedback.push('Gunakan huruf kecil');
    if (/[A-Z]/.test(password)) strength++; else feedback.push('Gunakan huruf besar');
    if (/[0-9]/.test(password)) strength++; else feedback.push('Gunakan angka');
    if (/[^a-zA-Z0-9]/.test(password)) strength++; else feedback.push('Gunakan karakter spesial');
    const scores = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    return { score: strength, label: scores[strength] || 'Sangat Lemah', feedback: feedback };
}
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, duration);
}
function getUserInitials(name) { return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2); }
const StorageManager = {
    set: (key, value) => { localStorage.setItem(`btoa_${key}`, JSON.stringify(value)); },
    get: (key) => { const item = localStorage.getItem(`btoa_${key}`); return item ? JSON.parse(item) : null; },
    remove: (key) => { localStorage.removeItem(`btoa_${key}`); },
    clear: () => { Object.keys(localStorage).filter(key => key.startsWith('btoa_')).forEach(key => localStorage.removeItem(key)); }
};
window.appHelpers = { formatCurrency, formatDate, validateEmail, validatePassword, showToast, getUserInitials, StorageManager };