// Password Vault Module

const VaultModule = {
    passwords: [],
    categories: ['Social Media', 'Email', 'Banking', 'Work', 'Other'],

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.loadPasswords();
        this.render();
    },

    cacheDOM() {
        this.vaultContainer = document.getElementById('vaultContainer');
        this.vaultList = document.getElementById('vaultList');
        this.addPasswordBtn = document.getElementById('addPasswordBtn');
        this.passwordModal = document.getElementById('passwordModal');
        this.passwordForm = document.getElementById('passwordForm');
    },

    bindEvents() {
        if (this.addPasswordBtn) {
            this.addPasswordBtn.addEventListener('click', () => this.openPasswordModal());
        }
        if (this.passwordForm) {
            this.passwordForm.addEventListener('submit', (e) => this.handleSavePassword(e));
        }
    },

    async loadPasswords() {
        try {
            this.passwords = window.appHelpers.StorageManager.get('passwords') || [];
        } catch (error) {
            console.error('Error loading passwords:', error);
            this.passwords = [];
        }
    },

    render() {
        if (this.passwords.length === 0) {
            this.vaultList.innerHTML = '<p class="empty-state">Belum ada password tersimpan. <a href="#" id="addNewPassword">Tambah yang pertama</a></p>';
            document.getElementById('addNewPassword')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPasswordModal();
            });
        } else {
            const html = this.passwords.map((pwd, index) => `
                <div class="vault-item">
                    <div class="vault-header">
                        <div class="vault-icon" style="color: ${this.getCategoryColor(pwd.category)}">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="vault-info">
                            <h4>${pwd.name}</h4>
                            <p>${pwd.username}</p>
                        </div>
                        <span class="vault-category">${pwd.category}</span>
                    </div>
                    <div class="vault-actions">
                        <button class="btn-icon" id="copyBtn${index}" title="Copy Password">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon" id="editBtn${index}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" id="deleteBtn${index}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            this.vaultList.innerHTML = html;
            this.attachPasswordActions();
        }
    },

    attachPasswordActions() {
        this.passwords.forEach((pwd, index) => {
            document.getElementById(`copyBtn${index}`)?.addEventListener('click', () => {
                navigator.clipboard.writeText(pwd.password);
                window.appHelpers.showToast('Password disalin!', 'success');
            });
            document.getElementById(`editBtn${index}`)?.addEventListener('click', () => {
                this.openPasswordModal(index);
            });
            document.getElementById(`deleteBtn${index}`)?.addEventListener('click', () => {
                this.deletePassword(index);
            });
        });
    },

    openPasswordModal(index = null) {
        const title = index !== null ? 'Edit Password' : 'Tambah Password Baru';
        const pwd = index !== null ? this.passwords[index] : { name: '', username: '', password: '', category: 'Other', url: '' };

        const modal = `
            <div class="modal-backdrop" id="passwordBackdrop">
                <div class="modal">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="btn-close" id="closePasswordModal"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="passwordForm" class="modal-body">
                        <div class="form-group">
                            <label>Nama Layanan</label>
                            <input type="text" id="pwdName" value="${pwd.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Username/Email</label>
                            <input type="text" id="pwdUsername" value="${pwd.username}" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <div class="input-group">
                                <input type="password" id="pwdPassword" value="${pwd.password}" required>
                                <button type="button" class="btn-icon" id="generateBtn">
                                    <i class="fas fa-magic"></i>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Kategori</label>
                            <select id="pwdCategory">
                                ${this.categories.map(cat => `<option value="${cat}" ${cat === pwd.category ? 'selected' : ''}>${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>URL (Opsional)</label>
                            <input type="url" id="pwdUrl" value="${pwd.url || ''}">
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Simpan</button>
                            <button type="button" class="btn btn-secondary" id="cancelPasswordBtn">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modal);
        
        document.getElementById('closePasswordModal').addEventListener('click', () => {
            document.getElementById('passwordBackdrop').remove();
        });
        document.getElementById('passwordBackdrop').addEventListener('click', (e) => {
            if (e.target.id === 'passwordBackdrop') {
                document.getElementById('passwordBackdrop').remove();
            }
        });
        document.getElementById('cancelPasswordBtn').addEventListener('click', () => {
            document.getElementById('passwordBackdrop').remove();
        });
        document.getElementById('generateBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const generated = window.EncryptionManager.generatePassword();
            document.getElementById('pwdPassword').value = generated;
        });
        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePassword(index);
        });
    },

    savePassword(index) {
        const pwdData = {
            name: document.getElementById('pwdName').value,
            username: document.getElementById('pwdUsername').value,
            password: document.getElementById('pwdPassword').value,
            category: document.getElementById('pwdCategory').value,
            url: document.getElementById('pwdUrl').value,
            createdAt: index !== null ? this.passwords[index].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (index !== null) {
            this.passwords[index] = pwdData;
        } else {
            this.passwords.push(pwdData);
        }

        window.appHelpers.StorageManager.set('passwords', this.passwords);
        document.getElementById('passwordBackdrop').remove();
        this.render();
        window.appHelpers.showToast('Password berhasil disimpan!', 'success');
    },

    deletePassword(index) {
        if (confirm('Apakah Anda yakin ingin menghapus password ini?')) {
            this.passwords.splice(index, 1);
            window.appHelpers.StorageManager.set('passwords', this.passwords);
            this.render();
            window.appHelpers.showToast('Password dihapus!', 'success');
        }
    },

    getCategoryColor(category) {
        const colors = {
            'Social Media': '#3498db',
            'Email': '#e74c3c',
            'Banking': '#2ecc71',
            'Work': '#f39c12',
            'Other': '#95a5a6'
        };
        return colors[category] || '#95a5a6';
    }
};

window.VaultModule = VaultModule;