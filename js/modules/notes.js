// Notes Module

const NotesModule = {
    notes: [],
    categories: ['Personal', 'Work', 'Ideas', 'Todo', 'Other'],

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.loadNotes();
        this.render();
    },

    cacheDOM() {
        this.notesContainer = document.getElementById('notesContainer');
        this.notesList = document.getElementById('notesList');
        this.addNoteBtn = document.getElementById('addNoteBtn');
        this.searchInput = document.getElementById('searchNotes');
    },

    bindEvents() {
        if (this.addNoteBtn) {
            this.addNoteBtn.addEventListener('click', () => this.openNoteEditor());
        }
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.filterNotes(e.target.value));
        }
    },

    async loadNotes() {
        try {
            this.notes = window.appHelpers.StorageManager.get('notes') || [];
        } catch (error) {
            console.error('Error loading notes:', error);
            this.notes = [];
        }
    },

    render(notesToRender = this.notes) {
        if (notesToRender.length === 0) {
            this.notesList.innerHTML = '<p class="empty-state">Belum ada catatan. <a href="#" id="addFirstNote">Buat catatan pertama</a></p>';
            document.getElementById('addFirstNote')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openNoteEditor();
            });
        } else {
            const html = notesToRender.map((note, index) => `
                <div class="note-card" id="note${index}">
                    <div class="note-header">
                        <h3>${note.title || 'Catatan Tanpa Judul'}</h3>
                        <span class="note-category">${note.category}</span>
                    </div>
                    <div class="note-content">
                        ${note.content.substring(0, 100)}...
                    </div>
                    <div class="note-footer">
                        <small>${window.appHelpers.formatDate(note.createdAt)}</small>
                        <div class="note-actions">
                            <button class="btn-icon" id="editNote${index}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" id="deleteNote${index}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            this.notesList.innerHTML = html;
            this.attachNoteActions();
        }
    },

    attachNoteActions() {
        this.notes.forEach((note, index) => {
            document.getElementById(`editNote${index}`)?.addEventListener('click', () => {
                this.openNoteEditor(index);
            });
            document.getElementById(`deleteNote${index}`)?.addEventListener('click', () => {
                this.deleteNote(index);
            });
        });
    },

    openNoteEditor(index = null) {
        const title = index !== null ? 'Edit Catatan' : 'Catatan Baru';
        const note = index !== null ? this.notes[index] : { title: '', content: '', category: 'Personal', tags: '' };

        const editor = `
            <div class="modal-backdrop" id="noteBackdrop">
                <div class="modal" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="btn-close" id="closeNoteModal"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="noteForm" class="modal-body">
                        <div class="form-group">
                            <label>Judul</label>
                            <input type="text" id="noteTitle" value="${note.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Kategori</label>
                            <select id="noteCategory">
                                ${this.categories.map(cat => `<option value="${cat}" ${cat === note.category ? 'selected' : ''}>${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Konten</label>
                            <textarea id="noteContent" rows="8" placeholder="Tulis catatan Anda...">${note.content}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Tags (pisahkan dengan koma)</label>
                            <input type="text" id="noteTags" value="${note.tags || ''}" placeholder="tag1, tag2, tag3">
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Simpan Catatan</button>
                            <button type="button" class="btn btn-secondary" id="cancelNoteBtn">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', editor);
        
        document.getElementById('closeNoteModal').addEventListener('click', () => {
            document.getElementById('noteBackdrop').remove();
        });
        document.getElementById('noteBackdrop').addEventListener('click', (e) => {
            if (e.target.id === 'noteBackdrop') {
                document.getElementById('noteBackdrop').remove();
            }
        });
        document.getElementById('cancelNoteBtn').addEventListener('click', () => {
            document.getElementById('noteBackdrop').remove();
        });
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNote(index);
        });
    },

    saveNote(index) {
        const noteData = {
            title: document.getElementById('noteTitle').value,
            content: document.getElementById('noteContent').value,
            category: document.getElementById('noteCategory').value,
            tags: document.getElementById('noteTags').value,
            createdAt: index !== null ? this.notes[index].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (index !== null) {
            this.notes[index] = noteData;
        } else {
            this.notes.push(noteData);
        }

        window.appHelpers.StorageManager.set('notes', this.notes);
        document.getElementById('noteBackdrop').remove();
        this.render();
        window.appHelpers.showToast('Catatan berhasil disimpan!', 'success');
    },

    deleteNote(index) {
        if (confirm('Hapus catatan ini?')) {
            this.notes.splice(index, 1);
            window.appHelpers.StorageManager.set('notes', this.notes);
            this.render();
            window.appHelpers.showToast('Catatan dihapus!', 'success');
        }
    },

    filterNotes(query) {
        const filtered = this.notes.filter(note =>
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.toLowerCase().includes(query.toLowerCase())
        );
        this.render(filtered);
    }
};

window.NotesModule = NotesModule;