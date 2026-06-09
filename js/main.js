// Main Application
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

        // Switch form listeners
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

        // Google login (placeholder)
        document.getElementById('googleLoginBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.appHelpers.showToast('Google login coming soon', 'info');
        });

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

                // Update color based on strength
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

        // Clear errors when switching forms
        window.appHelpers.clearFormErrors('loginForm');
        window.appHelpers.clearFormErrors('registerForm');
        window.appHelpers.clearFormErrors('forgotForm');

        switch (formType) {
            case 'login':
                if (loginForm) loginForm.style.display = 'block';
                break;
            case 'register':
                if (registerForm) registerForm.style.display = 'block';
                break;
            case 'forgot':
                if (forgotForm) forgotForm.style.display = 'block';
                break;
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Clear previous errors
        window.appHelpers.clearFormErrors('loginForm');

        // Validation
        if (!email) {
            document.getElementById('emailError').textContent = 'Email harus diisi';
            return;
        }
        if (!window.appHelpers.validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Email tidak valid';
            return;
        }
        if (!password) {
            document.getElementById('passwordError').textContent = 'Password harus diisi';
            return;
        }

        // Show loading
        document.getElementById('loadingSpinner').style.display = 'flex';

        try {
            // Call auth manager
            const result = await window.AuthManager.login(email, password);

            if (result.success) {
                // Save remember me preference
                if (rememberMe) {
                    window.appHelpers.StorageManager.set('rememberEmail', email);
                }

                window.appHelpers.showToast(result.message, 'success');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            window.appHelpers.handleError(error, 'loginForm');
            console.error('Login error:', error);
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsCheck = document.getElementById('termsCheck').checked;

        // Clear previous errors
        window.appHelpers.clearFormErrors('registerForm');

        // Validation
        if (!name) {
            document.getElementById('nameError').textContent = 'Nama harus diisi';
            return;
        }
        if (!window.appHelpers.validateName(name)) {
            document.getElementById('nameError').textContent = 'Nama harus 2-50 karakter';
            return;
        }
        if (!email) {
            document.getElementById('regEmailError').textContent = 'Email harus diisi';
            return;
        }
        if (!window.appHelpers.validateEmail(email)) {
            document.getElementById('regEmailError').textContent = 'Email tidak valid';
            return;
        }
        if (!password) {
            document.getElementById('regPasswordError').textContent = 'Password harus diisi';
            return;
        }
        if (password !== confirmPassword) {
            document.getElementById('confirmError').textContent = 'Password tidak sama';
            return;
        }
        if (!termsCheck) {
            document.getElementById('nameError').textContent = 'Anda harus setuju dengan Terms & Conditions';
            return;
        }

        // Show loading
        document.getElementById('loadingSpinner').style.display = 'flex';

        try {
            // Call auth manager
            const result = await window.AuthManager.register(name, email, password, confirmPassword);

            if (result.success) {
                window.appHelpers.showToast(result.message, 'success');

                // Clear form
                document.getElementById('registerForm').reset();

                // Switch to login form
                setTimeout(() => {
                    this.switchAuthForm('login');
                    document.getElementById('loginEmail').value = email;
                }, 1500);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            window.appHelpers.handleError(error, 'registerForm');
            console.error('Register error:', error);
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();

        const email = document.getElementById('forgotEmail').value.trim();

        // Clear previous errors
        document.getElementById('forgotError').textContent = '';

        if (!email) {
            document.getElementById('forgotError').textContent = 'Email harus diisi';
            return;
        }
        if (!window.appHelpers.validateEmail(email)) {
            document.getElementById('forgotError').textContent = 'Email tidak valid';
            return;
        }

        // Show loading
        document.getElementById('loadingSpinner').style.display = 'flex';

        try {
            const result = await window.AuthManager.resetPassword(email);

            if (result.success) {
                window.appHelpers.showToast(result.message, 'success');

                // Clear form
                document.getElementById('forgotForm').reset();

                // Switch back to login after 3 seconds
                setTimeout(() => {
                    this.switchAuthForm('login');
                }, 3000);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            window.appHelpers.handleError(error, 'forgotForm');
            console.error('Forgot password error:', error);
        } finally {
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    checkAuthentication() {
        const auth = window.AuthManager.checkAuth();

        // Jika sudah login dan di halaman login, redirect ke dashboard
        if (auth.isAuthenticated && window.location.pathname.includes('index.html')) {
            window.location.href = 'dashboard.html';
        }

        // Jika belum login dan di halaman dashboard, redirect ke login
        if (!auth.isAuthenticated && window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }

        this.currentUser = auth.user;
    }

    setupDarkMode() {
        const isDark = window.appHelpers.StorageManager.get('darkMode') || false;
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
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