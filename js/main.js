// Main Application Logic

class BtoaApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.checkAuthentication();
        this.setupDarkMode();
    }

    setupEventListeners() {
        // Auth form events
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotForm = document.getElementById('forgotForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Form switching
        document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('register');
        });

        document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('login');
        });

        document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('forgot');
        });

        document.getElementById('backToLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('login');
        });

        // Password visibility toggle
        this.setupPasswordToggle();
    }

    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = btn.previousElementSibling;
                const icon = btn.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    switchAuthForm(formType) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotForm = document.getElementById('forgotForm');

        // Hide all forms
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        forgotForm.style.display = 'none';

        // Show selected form
        switch(formType) {
            case 'login':
                loginForm.style.display = 'block';
                break;
            case 'register':
                registerForm.style.display = 'block';
                break;
            case 'forgot':
                forgotForm.style.display = 'block';
                break;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!window.appHelpers.validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Email tidak valid';
            return;
        }

        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('loadingSpinner').style.display = 'flex';

        // TODO: Implement login logic
        window.appHelpers.showToast('Login functionality coming soon', 'info');
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!name.trim()) {
            document.getElementById('nameError').textContent = 'Nama tidak boleh kosong';
            return;
        }

        if (!window.appHelpers.validateEmail(email)) {
            document.getElementById('regEmailError').textContent = 'Email tidak valid';
            return;
        }

        if (password !== confirmPassword) {
            document.getElementById('confirmError').textContent = 'Password tidak sama';
            return;
        }

        const validation = window.appHelpers.validatePassword(password);
        if (validation.score < 2) {
            document.getElementById('regPasswordError').textContent = 'Password terlalu lemah';
            return;
        }

        document.getElementById('loadingSpinner').style.display = 'flex';

        // TODO: Implement register logic
        window.appHelpers.showToast('Registration functionality coming soon', 'info');
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;

        if (!window.appHelpers.validateEmail(email)) {
            document.getElementById('forgotError').textContent = 'Email tidak valid';
            return;
        }

        document.getElementById('loadingSpinner').style.display = 'flex';

        // TODO: Implement forgot password logic
        window.appHelpers.showToast('Password reset link sent to your email', 'success');
        document.getElementById('loadingSpinner').style.display = 'none';
        
        setTimeout(() => {
            this.switchAuthForm('login');
        }, 2000);
    }

    checkAuthentication() {
        // Check if user is already logged in
        const token = window.appHelpers.StorageManager.get('authToken');
        if (token) {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    }

    setupDarkMode() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const isDark = window.appHelpers.StorageManager.get('darkMode') || false;
            if (isDark) {
                document.documentElement.classList.add('dark-mode');
            }

            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark-mode');
                const isDarkNow = document.documentElement.classList.contains('dark-mode');
                window.appHelpers.StorageManager.set('darkMode', isDarkNow);
            });
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BtoaApp();
    });
} else {
    new BtoaApp();
}