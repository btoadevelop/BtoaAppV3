// Calendar Module (placeholder untuk integrasi FullCalendar)

const CalendarModule = {
    events: [],

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.loadEvents();
        this.render();
    },

    cacheDOM() {
        this.calendarContainer = document.getElementById('calendarContainer');
        this.eventsList = document.getElementById('eventsList');
        this.addEventBtn = document.getElementById('addEventBtn');
    },

    bindEvents() {
        if (this.addEventBtn) {
            this.addEventBtn.addEventListener('click', () => this.openEventModal());
        }
    },

    async loadEvents() {
        try {
            this.events = window.appHelpers.StorageManager.get('events') || [];
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = [];
        }
    },

    render() {
        if (this.events.length === 0) {
            this.eventsList.innerHTML = '<p class="empty-state">Belum ada event. <a href="#" id="addFirstEvent">Buat event pertama</a></p>';
            document.getElementById('addFirstEvent')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openEventModal();
            });
        } else {
            const sorted = [...this.events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            const html = sorted.map((event, index) => `
                <div class="event-card">
                    <div class="event-date">
                        <span class="event-day">${new Date(event.startDate).getDate()}</span>
                        <span class="event-month">${new Date(event.startDate).toLocaleString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div class="event-content">
                        <h4>${event.title}</h4>
                        <p>${event.description || 'Tidak ada deskripsi'}</p>
                        <small>${window.appHelpers.formatDate(event.startDate)} - ${window.appHelpers.formatDate(event.endDate)}</small>
                    </div>
                    <div class="event-actions">
                        <button class="btn-icon" id="editEvent${index}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" id="deleteEvent${index}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            this.eventsList.innerHTML = html;
            this.attachEventActions();
        }
    },

    attachEventActions() {
        this.events.forEach((event, index) => {
            document.getElementById(`editEvent${index}`)?.addEventListener('click', () => {
                this.openEventModal(index);
            });
            document.getElementById(`deleteEvent${index}`)?.addEventListener('click', () => {
                this.deleteEvent(index);
            });
        });
    },

    openEventModal(index = null) {
        const title = index !== null ? 'Edit Event' : 'Event Baru';
        const event = index !== null ? this.events[index] : { title: '', description: '', startDate: '', endDate: '', location: '', reminder: true };

        const modal = `
            <div class="modal-backdrop" id="eventBackdrop">
                <div class="modal" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="btn-close" id="closeEventModal"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="eventForm" class="modal-body">
                        <div class="form-group">
                            <label>Judul Event</label>
                            <input type="text" id="eventTitle" value="${event.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi</label>
                            <textarea id="eventDesc" rows="3" placeholder="Deskripsi event...">${event.description}</textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Tanggal Mulai</label>
                                <input type="datetime-local" id="eventStart" value="${event.startDate}" required>
                            </div>
                            <div class="form-group">
                                <label>Tanggal Akhir</label>
                                <input type="datetime-local" id="eventEnd" value="${event.endDate}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Lokasi</label>
                            <input type="text" id="eventLocation" value="${event.location}">
                        </div>
                        <div class="form-group">
                            <label class="checkbox">
                                <input type="checkbox" id="eventReminder" ${event.reminder ? 'checked' : ''}>
                                <span>Ingatkan saya</span>
                            </label>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Simpan Event</button>
                            <button type="button" class="btn btn-secondary" id="cancelEventBtn">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modal);
        
        document.getElementById('closeEventModal').addEventListener('click', () => {
            document.getElementById('eventBackdrop').remove();
        });
        document.getElementById('eventBackdrop').addEventListener('click', (e) => {
            if (e.target.id === 'eventBackdrop') {
                document.getElementById('eventBackdrop').remove();
            }
        });
        document.getElementById('cancelEventBtn').addEventListener('click', () => {
            document.getElementById('eventBackdrop').remove();
        });
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent(index);
        });
    },

    saveEvent(index) {
        const eventData = {
            title: document.getElementById('eventTitle').value,
            description: document.getElementById('eventDesc').value,
            startDate: document.getElementById('eventStart').value,
            endDate: document.getElementById('eventEnd').value,
            location: document.getElementById('eventLocation').value,
            reminder: document.getElementById('eventReminder').checked,
            createdAt: index !== null ? this.events[index].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (index !== null) {
            this.events[index] = eventData;
        } else {
            this.events.push(eventData);
        }

        window.appHelpers.StorageManager.set('events', this.events);
        document.getElementById('eventBackdrop').remove();
        this.render();
        window.appHelpers.showToast('Event berhasil disimpan!', 'success');
    },

    deleteEvent(index) {
        if (confirm('Hapus event ini?')) {
            this.events.splice(index, 1);
            window.appHelpers.StorageManager.set('events', this.events);
            this.render();
            window.appHelpers.showToast('Event dihapus!', 'success');
        }
    }
};

window.CalendarModule = CalendarModule;