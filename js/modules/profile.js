// Profile Module

const ProfileModule = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadProfile();
    },

    cacheDOM() {
        this.profileForm = document.getElementById('profileForm');
        this.avatarInput = document.getElementById('avatarInput');
        this.avatarPreview = document.getElementById('avatarPreview');
        this.profileContent = document.getElementById('profileContent');
    },

    bindEvents() {
        if (this.avatarInput) {
            this.avatarInput.addEventListener('change', (e) => this.handleAvatarChange(e));
        }
        if (this.profileForm) {
            this.profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }
    },

    async loadProfile() {
        try {
            const profileData = window.appHelpers.StorageManager.get('profileData');
            if (profileData) {
                this.displayProfile(profileData);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    },

    displayProfile(data) {
        const html = `
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <img id="avatarPreview" src="${data.avatar || 'https://via.placeholder.com/120'}" alt="Avatar">
                        <label for="avatarInput" class="avatar-upload">
                            <i class="fas fa-camera"></i>
                        </label>
                        <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                    </div>
                    <div class="profile-info">
                        <h2>${data.name || 'User'}</h2>
                        <p>${data.email || 'email@example.com'}</p>
                    </div>
                </div>

                <form id="profileForm" class="profile-form">
                    <div class="form-section">
                        <h3>Informasi Pribadi</h3>
                        <div class="form-group">
                            <label>Nama Lengkap</label>
                            <input type="text" id="fullName" value="${data.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="email" value="${data.email || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Nomor Telepon</label>
                            <input type="tel" id="phone" value="${data.phone || ''}">
                        </div>
                        <div class="form-group">
                            <label>Tanggal Lahir</label>
                            <input type="date" id="birthDate" value="${data.birthDate || ''}">
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Alamat</h3>
                        <div class="form-group">
                            <label>Alamat</label>
                            <textarea id="address" rows="3">${data.address || ''}</textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Kota</label>
                                <input type="text" id="city" value="${data.city || ''}">
                            </div>
                            <div class="form-group">
                                <label>Provinsi</label>
                                <input type="text" id="province" value="${data.province || ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Kode Pos</label>
                            <input type="text" id="zipCode" value="${data.zipCode || ''}">
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Simpan Perubahan
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancelBtn">
                            <i class="fas fa-times"></i> Batal
                        </button>
                    </div>
                </form>
            </div>
        `;
        this.profileContent.innerHTML = html;
        this.cacheDOM();
        this.bindEvents();
    },

    handleAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    },

    async handleProfileUpdate(e) {
        e.preventDefault();
        try {
            const profileData = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthDate: document.getElementById('birthDate').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                province: document.getElementById('province').value,
                zipCode: document.getElementById('zipCode').value,
                avatar: this.avatarPreview.src,
                updatedAt: new Date().toISOString()
            };

            window.appHelpers.StorageManager.set('profileData', profileData);
            window.appHelpers.showToast('Profil berhasil diperbarui!', 'success');
        } catch (error) {
            window.appHelpers.showToast('Gagal memperbarui profil', 'error');
            console.error('Error updating profile:', error);
        }
    }
};

window.ProfileModule = ProfileModule;