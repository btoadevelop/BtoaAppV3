// Authentication Manager dengan Firebase Integration
const AuthManager = {
    // Daftar user baru
    register: async function(name, email, password, confirmPassword) {
        try {
            // Validasi input
            if (!window.appHelpers.validateName(name)) {
                throw new Error('Nama harus 2-50 karakter');
            }

            if (!window.appHelpers.validateEmail(email)) {
                throw new Error('Format email tidak valid');
            }

            if (password !== confirmPassword) {
                throw new Error('Password tidak sama');
            }

            const validation = window.appHelpers.validatePassword(password);
            if (!validation.isValid) {
                throw new Error(`Password tidak kuat. Minimum 8 karakter dengan kombinasi huruf, angka, dan simbol.`);
            }

            // Cek apakah email sudah terdaftar
            const existingUser = window.appHelpers.StorageManager.get(`user_${email}`);
            if (existingUser) {
                throw new Error('Email sudah terdaftar. Silakan login atau gunakan email lain');
            }

            // Hash password
            const hashedPassword = await window.EncryptionManager.hashPassword(password);
            const salt = window.EncryptionManager.generateSalt();

            // Buat user object
            const userData = {
                id: this.generateUserId(),
                name: name,
                email: email,
                password: hashedPassword,
                salt: salt,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isEmailVerified: false,
                profile: {
                    avatar: null,
                    bio: '',
                    phone: ''
                }
            };

            // Simpan ke storage
            window.appHelpers.StorageManager.set(`user_${email}`, userData);
            window.appHelpers.StorageManager.set('users_list', 
                [...(window.appHelpers.StorageManager.get('users_list') || []), email]
            );

            console.log('✓ User registered:', email);
            return { success: true, message: 'Registrasi berhasil! Silakan login.', user: userData };

        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Login user
    login: async function(email, password) {
        try {
            // Validasi input
            if (!window.appHelpers.validateEmail(email)) {
                throw new Error('Format email tidak valid');
            }

            if (!password || password.length < 6) {
                throw new Error('Password harus diisi');
            }

            // Cari user berdasarkan email
            const userData = window.appHelpers.StorageManager.get(`user_${email}`);
            if (!userData) {
                throw new Error('Email tidak ditemukan. Silakan daftar terlebih dahulu');
            }

            // Verifikasi password
            const isPasswordValid = await window.EncryptionManager.verifyPassword(password, userData.password);
            if (!isPasswordValid) {
                throw new Error('Password salah. Silakan coba lagi');
            }

            // Buat session token
            const sessionToken = this.generateSessionToken();
            const sessionData = {
                userId: userData.id,
                email: email,
                name: userData.name,
                token: sessionToken,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            };

            // Simpan session
            window.appHelpers.StorageManager.set('authToken', sessionToken);
            window.appHelpers.StorageManager.set('currentUser', sessionData);

            // Update last login
            userData.lastLogin = new Date().toISOString();
            window.appHelpers.StorageManager.set(`user_${email}`, userData);

            console.log('✓ User logged in:', email);
            return { success: true, message: 'Login berhasil!', user: sessionData };

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    // Logout user
    logout: async function() {
        try {
            window.appHelpers.StorageManager.remove('authToken');
            window.appHelpers.StorageManager.remove('currentUser');
            console.log('✓ User logged out');
            return { success: true, message: 'Logout berhasil' };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    // Reset password
    resetPassword: async function(email) {
        try {
            if (!window.appHelpers.validateEmail(email)) {
                throw new Error('Format email tidak valid');
            }

            const userData = window.appHelpers.StorageManager.get(`user_${email}`);
            if (!userData) {
                throw new Error('Email tidak ditemukan');
            }

            // Generate reset token
            const resetToken = this.generateSessionToken();
            const resetData = {
                email: email,
                token: resetToken,
                expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString() // 1 hour
            };

            window.appHelpers.StorageManager.set(`reset_${email}`, resetData);

            console.log('✓ Password reset link generated for:', email);
            console.log('Reset token:', resetToken); // Log untuk testing - hapus di production

            return { 
                success: true, 
                message: 'Link reset password telah dikirim ke email Anda',
                resetToken: resetToken // Return untuk testing - hapus di production
            };

        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: error.message };
        }
    },

    // Change password
    changePassword: async function(email, oldPassword, newPassword) {
        try {
            if (!window.appHelpers.validateEmail(email)) {
                throw new Error('Format email tidak valid');
            }

            const userData = window.appHelpers.StorageManager.get(`user_${email}`);
            if (!userData) {
                throw new Error('User tidak ditemukan');
            }

            // Verifikasi password lama
            const isOldPasswordValid = await window.EncryptionManager.verifyPassword(oldPassword, userData.password);
            if (!isOldPasswordValid) {
                throw new Error('Password lama tidak cocok');
            }

            // Validasi password baru
            const validation = window.appHelpers.validatePassword(newPassword);
            if (!validation.isValid) {
                throw new Error('Password baru tidak kuat');
            }

            // Hash password baru
            const newHashedPassword = await window.EncryptionManager.hashPassword(newPassword);
            userData.password = newHashedPassword;
            userData.salt = window.EncryptionManager.generateSalt();

            window.appHelpers.StorageManager.set(`user_${email}`, userData);

            console.log('✓ Password changed for:', email);
            return { success: true, message: 'Password berhasil diubah' };

        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, error: error.message };
        }
    },

    // Check authentication status
    checkAuth: function() {
        const token = window.appHelpers.StorageManager.get('authToken');
        const currentUser = window.appHelpers.StorageManager.get('currentUser');

        if (!token || !currentUser) {
            return { isAuthenticated: false };
        }

        // Check apakah session sudah expired
        if (new Date() > new Date(currentUser.expiresAt)) {
            this.logout();
            return { isAuthenticated: false };
        }

        return { 
            isAuthenticated: true, 
            user: currentUser,
            token: token
        };
    },

    // Helper: Generate user ID
    generateUserId: function() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Helper: Generate session token
    generateSessionToken: function() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
};

window.AuthManager = AuthManager;