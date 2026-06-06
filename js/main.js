class BtoaApp {
    constructor() { this.currentUser = null; this.init(); }
    async init() { this.setupEventListeners(); this.checkAuthentication(); this.setupDarkMode(); }
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotForm = document.getElementById('forgotForm');
        if (loginForm) { loginForm.addEventListener('submit', (e) => this.handleLogin(e)); }
        if (registerForm) { registerForm.addEventListener('submit', (e) => this.handleRegister(e)); }
        if (forgotForm) { forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e)); }
        document.getElementById('switchToRegister')?.addEventListener('click', (e) => { e.preventDefault(); this.switchAuthForm('register'); });
        document.getElementById('switchToLogin')?.addEventListener('click', (e) => { e.preventDefault(); this.switchAuthForm('login'); });
        document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => { e.preventDefault(); this.switchAuthForm('forgot'); });
        document.getElementById('backToLogin')?.addEventListener('click', (e) => { e.preventDefault(); this.switchAuthForm('login'); });
        this.setupPasswordToggle();
        this.setupPasswordStrength();
    }
    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = btn.previousElementSibling;
                const icon = btn.querySelector('i');
                if (input.type === 'password') { input.type = 'text'; icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
                else { input.type = 'password'; icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
            });
        });
    }
    setupPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        if (!passwordInput) return;
        passwordInput.addEventListener('input', () => {
            const validation = window.appHelpers.validatePassword(passwordInput.value);
            const fill = document.getElementById('strengthFill');
            const text = document.getElementById('strengthText');
            if (fill && text) {
                const width = (validation.score / 5) * 100;
                fill.style.width = width + '%';
                text.textContent = validation.label;
                if (validation.score <= 1) fill.style.backgroundColor = '#e74c3c';
                else if (validation.score === 2) fill.style.backgroundColor = '#f39c12';
                else if (validation.score === 3) fill.style.backgroundColor = '#f1c40f';
                else if (validation.score === 4) fill.style.backgroundColor = '#2ecc71';
                else fill.style.backgroundColor = '#27ae60';
            }
        });
    }
    switchAuthForm(formType) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotForm = document.getElementById('forgotForm');
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (forgotForm) forgotForm.style.display = 'none';
        switch(formType) {
            case 'login': if (loginForm) loginForm.style.display = 'block'; break;
            case 'register': if (registerForm) registerForm.style.display = 'block'; break;
            case 'forgot': if (forgotForm) forgotForm.style.display = 'block'; break;
        }
    }
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        if (!window.appHelpers.validateEmail(email)) { document.getElementById('emailError').textContent = 'Email tidak valid'; return; }
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('loadingSpinner').style.display = 'flex';
        window.appHelpers.showToast('Login functionality coming soon', 'info');
        document.getElementById('loadingSpinner').style.display = 'none';
    }
    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (!name.trim()) { document.getElementById('nameError').textContent = 'Nama tidak boleh kosong'; return; }
        if (!window.appHelpers.validateEmail(email)) { document.getElementById('regEmailError').textContent = 'Email tidak valid'; return; }
        if (password !== confirmPassword) { document.getElementById('confirmError').textContent = 'Password tidak sama'; return; }
        const validation = window.appHelpers.validatePassword(password);
        if (validation.score < 2) { document.getElementById('regPasswordError').textContent = 'Password terlalu lemah'; return; }
        document.getElementById('loadingSpinner').style.display = 'flex';
        window.appHelpers.showToast('Registration functionality coming soon', 'info');
        document.getElementById('loadingSpinner').style.display = 'none';
    }
    async handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        if (!window.appHelpers.validateEmail(email)) { document.getElementById('forgotError').textContent = 'Email tidak valid'; return; }
        document.getElementById('loadingSpinner').style.display = 'flex';
        window.appHelpers.showToast('Password reset link sent to your email', 'success');
        document.getElementById('loadingSpinner').style.display = 'none';
        setTimeout(() => { this.switchAuthForm('login'); }, 2000);
    }
    checkAuthentication() { const token = window.appHelpers.StorageManager.get('authToken'); if (token && window.location.pathname.endsWith('index.html')) { window.location.href = 'dashboard.html'; } }
    setupDarkMode() { const isDark = window.appHelpers.StorageManager.get('darkMode') || false; if (isDark) { document.documentElement.classList.add('dark-mode'); } }
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => { new BtoaApp(); }); } else { new BtoaApp(); }