# BtoaAppV3 - Personal Management Application

Aplikasi manajemen pribadi yang komprehensif dengan fitur lengkap untuk mengelola autentikasi, profil, vault kata sandi, catatan, tugas, keuangan, kalender, dan riwayat perjalanan.

## 🌟 Fitur Utama

### 1. **Login Page** 🔐
- Autentikasi aman dengan Firebase Authentication
- Support untuk Email/Password dan Google Sign-In
- Validasi input real-time
- Password recovery functionality

### 2. **Profile** 👤
- Manajemen informasi pribadi
- Avatar upload ke Cloud Storage
- Pengaturan akun dan privasi
- History aktivitas pengguna

### 3. **Password Vault** 🔒
- Penyimpanan kata sandi terenkripsi
- Kategori untuk organisasi password
- Search dan filter functionality
- Password strength indicator
- Fitur generate password otomatis

### 4. **Notes** 📝
- Buat, edit, dan hapus catatan
- Kategori dan tags untuk organisasi
- Rich text editor
- Search functionality
- Arsip catatan lama

### 5. **Task Manager** ✅
- Membuat dan mengelola tugas
- Priority levels (High, Medium, Low)
- Due dates dan reminders
- Status tracking (To Do, In Progress, Done)
- Progress visualization

### 6. **Financial Tracker** 💰
- Pencatatan income dan expenses
- Kategori finansial
- Dashboard dengan statistik
- Chart dan grafik visualisasi
- Budget planning

### 7. **Calendar** 📅
- Integrasi event scheduling
- Tampilan bulanan dan mingguan
- Event management
- Reminder notifications

### 8. **Travel Timeline** 🗺️
- Recording lokasi dengan Google Maps
- Timeline visualization
- Trip management
- Location history

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Firebase (Realtime Database & Cloud Firestore)
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Cloud Storage
- **Maps**: Google Maps API
- **CSS Framework**: Custom responsive design

## 📁 Project Structure

```
BtoaAppV3/
├── index.html              # Main login page
├── dashboard.html          # Main application dashboard
├── css/
│   ├── style.css          # Global styles
│   ├── dashboard.css      # Dashboard styles
│   ├── responsive.css     # Responsive design
│   └── variables.css      # CSS variables
├── js/
│   ├── main.js            # Main application logic
│   ├── auth.js            # Authentication handler
│   ├── firebase-config.js # Firebase configuration
│   ├── modules/
│   │   ├── profile.js     # Profile module
│   │   ├── vault.js       # Password vault module
│   │   ├── notes.js       # Notes module
│   │   ├── tasks.js       # Tasks module
│   │   ├── financial.js   # Financial module
│   │   ├── calendar.js    # Calendar module
│   │   └── travel.js      # Travel module
│   └── utils/
│       ├── db.js          # Database utilities
│       ├── encryption.js  # Encryption utilities
│       └── helpers.js     # Helper functions
└── assets/
    ├── icons/
    ├── images/
    └── fonts/
```

## 🚀 Quick Start

### Prerequisites
- Node.js (for development)
- Firebase account
- Google Maps API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/btoadevelop/BtoaAppV3.git
cd BtoaAppV3
```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Update `js/firebase-config.js` dengan credentials Anda

3. Add Google Maps API:
   - Get API key from https://console.cloud.google.com
   - Update di `pages/travel.html`

4. Open `index.html` di browser

## 📝 Features Details

### Security
- End-to-end encryption untuk password vault
- Secure authentication dengan Firebase
- HTTPS untuk semua komunikasi
- Data validation dan sanitization

### Performance
- Lazy loading untuk images
- Caching strategies
- Optimized database queries
- Responsive design untuk semua devices

### User Experience
- Intuitive navigation
- Dark/Light mode support
- Offline functionality
- Real-time sync dengan server

## 🔧 Development

### Adding New Features
1. Create module di `js/modules/`
2. Update `index.html` atau dashboard.html
3. Add styling di `css/`
4. Connect to Firebase Firestore

### Database Schema

```
users/
  ├── {uid}/
  │   ├── profile/
  │   ├── passwords/
  │   ├── notes/
  │   ├── tasks/
  │   ├── finances/
  │   ├── events/
  │   └── trips/
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📄 License

MIT License

## 👨‍💻 Author

**btoadevelop**

---

**Version**: 3.0.0
