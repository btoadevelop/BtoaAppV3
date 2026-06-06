// Travel Timeline Module

const TravelModule = {
    locations: [],
    trips: [],

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.loadLocations();
        this.render();
    },

    cacheDOM() {
        this.travelContainer = document.getElementById('travelContainer');
        this.tripsList = document.getElementById('tripsList');
        this.addTripBtn = document.getElementById('addTripBtn');
        this.mapContainer = document.getElementById('mapContainer');
    },

    bindEvents() {
        if (this.addTripBtn) {
            this.addTripBtn.addEventListener('click', () => this.openTripModal());
        }
    },

    async loadLocations() {
        try {
            this.locations = window.appHelpers.StorageManager.get('locations') || [];
            this.trips = window.appHelpers.StorageManager.get('trips') || [];
        } catch (error) {
            console.error('Error loading locations:', error);
            this.locations = [];
            this.trips = [];
        }
    },

    render() {
        if (this.trips.length === 0) {
            this.tripsList.innerHTML = '<p class="empty-state">Belum ada perjalanan. <a href="#" id="addFirstTrip">Catat perjalanan pertama</a></p>';
            document.getElementById('addFirstTrip')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTripModal();
            });
        } else {
            const html = this.trips.map((trip, index) => `
                <div class="trip-card">
                    <div class="trip-header">
                        <h3>${trip.destination}</h3>
                        <span class="trip-date">${window.appHelpers.formatDate(trip.startDate)} - ${window.appHelpers.formatDate(trip.endDate)}</span>
                    </div>
                    <div class="trip-content">
                        <p>${trip.description || 'Tidak ada deskripsi'}</p>
                        <div class="trip-locations">
                            <p><strong>Lokasi yang dikunjungi:</strong> ${trip.locationsVisited || '-'}</p>
                        </div>
                    </div>
                    <div class="trip-actions">
                        <button class="btn-icon" id="viewTrip${index}" title="View">
                            <i class="fas fa-map"></i>
                        </button>
                        <button class="btn-icon" id="editTrip${index}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" id="deleteTrip${index}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            this.tripsList.innerHTML = html;
            this.attachTripActions();
        }
    },

    attachTripActions() {
        this.trips.forEach((trip, index) => {
            document.getElementById(`viewTrip${index}`)?.addEventListener('click', () => {
                this.showTripMap(index);
            });
            document.getElementById(`editTrip${index}`)?.addEventListener('click', () => {
                this.openTripModal(index);
            });
            document.getElementById(`deleteTrip${index}`)?.addEventListener('click', () => {
                this.deleteTrip(index);
            });
        });
    },

    openTripModal(index = null) {
        const title = index !== null ? 'Edit Perjalanan' : 'Perjalanan Baru';
        const trip = index !== null ? this.trips[index] : { destination: '', startDate: '', endDate: '', description: '', locationsVisited: '' };

        const modal = `
            <div class="modal-backdrop" id="tripBackdrop">
                <div class="modal" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="btn-close" id="closeTripModal"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="tripForm" class="modal-body">
                        <div class="form-group">
                            <label>Destinasi</label>
                            <input type="text" id="tripDestination" value="${trip.destination}" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Tanggal Mulai</label>
                                <input type="date" id="tripStart" value="${trip.startDate}" required>
                            </div>
                            <div class="form-group">
                                <label>Tanggal Akhir</label>
                                <input type="date" id="tripEnd" value="${trip.endDate}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi</label>
                            <textarea id="tripDesc" rows="3" placeholder="Deskripsi perjalanan...">${trip.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Lokasi yang Dikunjungi (pisahkan dengan koma)</label>
                            <input type="text" id="tripLocations" value="${trip.locationsVisited}" placeholder="Jakarta, Bandung, Yogyakarta">
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Simpan Perjalanan</button>
                            <button type="button" class="btn btn-secondary" id="cancelTripBtn">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modal);
        
        document.getElementById('closeTripModal').addEventListener('click', () => {
            document.getElementById('tripBackdrop').remove();
        });
        document.getElementById('tripBackdrop').addEventListener('click', (e) => {
            if (e.target.id === 'tripBackdrop') {
                document.getElementById('tripBackdrop').remove();
            }
        });
        document.getElementById('cancelTripBtn').addEventListener('click', () => {
            document.getElementById('tripBackdrop').remove();
        });
        document.getElementById('tripForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTrip(index);
        });
    },

    saveTrip(index) {
        const tripData = {
            destination: document.getElementById('tripDestination').value,
            startDate: document.getElementById('tripStart').value,
            endDate: document.getElementById('tripEnd').value,
            description: document.getElementById('tripDesc').value,
            locationsVisited: document.getElementById('tripLocations').value,
            createdAt: index !== null ? this.trips[index].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (index !== null) {
            this.trips[index] = tripData;
        } else {
            this.trips.push(tripData);
        }

        window.appHelpers.StorageManager.set('trips', this.trips);
        document.getElementById('tripBackdrop').remove();
        this.render();
        window.appHelpers.showToast('Perjalanan berhasil disimpan!', 'success');
    },

    deleteTrip(index) {
        if (confirm('Hapus perjalanan ini?')) {
            this.trips.splice(index, 1);
            window.appHelpers.StorageManager.set('trips', this.trips);
            this.render();
            window.appHelpers.showToast('Perjalanan dihapus!', 'success');
        }
    },

    showTripMap(index) {
        const trip = this.trips[index];
        const mapModal = `
            <div class="modal-backdrop" id="mapBackdrop">
                <div class="modal" style="max-width: 800px; max-height: 600px;">
                    <div class="modal-header">
                        <h2>${trip.destination}</h2>
                        <button class="btn-close" id="closeMapModal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body" style="height: 500px;">
                        <p>Map integration dengan Google Maps akan ditampilkan di sini.</p>
                        <p><strong>Lokasi:</strong> ${trip.locationsVisited}</p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', mapModal);
        document.getElementById('closeMapModal').addEventListener('click', () => {
            document.getElementById('mapBackdrop').remove();
        });
    }
};

window.TravelModule = TravelModule;