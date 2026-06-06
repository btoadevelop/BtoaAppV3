// Tasks Module

const TasksModule = {
    tasks: [],
    priorities: ['High', 'Medium', 'Low'],
    statuses: ['To Do', 'In Progress', 'Done'],

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.loadTasks();
        this.render();
    },

    cacheDOM() {
        this.tasksContainer = document.getElementById('tasksContainer');
        this.tasksList = document.getElementById('tasksList');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.filterStatus = document.getElementById('filterStatus');
        this.filterPriority = document.getElementById('filterPriority');
    },

    bindEvents() {
        if (this.addTaskBtn) {
            this.addTaskBtn.addEventListener('click', () => this.openTaskModal());
        }
        if (this.filterStatus) {
            this.filterStatus.addEventListener('change', () => this.render());
        }
        if (this.filterPriority) {
            this.filterPriority.addEventListener('change', () => this.render());
        }
    },

    async loadTasks() {
        try {
            this.tasks = window.appHelpers.StorageManager.get('tasks') || [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.tasks = [];
        }
    },

    render() {
        let tasksToRender = this.tasks;
        
        if (this.filterStatus && this.filterStatus.value !== 'all') {
            tasksToRender = tasksToRender.filter(t => t.status === this.filterStatus.value);
        }
        if (this.filterPriority && this.filterPriority.value !== 'all') {
            tasksToRender = tasksToRender.filter(t => t.priority === this.filterPriority.value);
        }

        if (tasksToRender.length === 0) {
            this.tasksList.innerHTML = '<p class="empty-state">Tidak ada tugas. <a href="#" id="addFirstTask">Buat tugas pertama</a></p>';
            document.getElementById('addFirstTask')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTaskModal();
            });
        } else {
            const html = tasksToRender.map((task, index) => `
                <div class="task-card task-${task.status.toLowerCase().replace(' ', '-')}" id="task${index}">
                    <div class="task-header">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} id="taskCheck${index}">
                        <h4 class="${task.completed ? 'completed' : ''}">${task.title}</h4>
                        <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                    </div>
                    <div class="task-content">
                        <p>${task.description || 'Tidak ada deskripsi'}</p>
                    </div>
                    <div class="task-footer">
                        <div class="task-info">
                            <small>${window.appHelpers.formatDate(task.dueDate)}</small>
                            <span class="status-badge">${task.status}</span>
                        </div>
                        <div class="task-actions">
                            <button class="btn-icon" id="editTask${index}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" id="deleteTask${index}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            this.tasksList.innerHTML = html;
            this.attachTaskActions();
        }
    },

    attachTaskActions() {
        this.tasks.forEach((task, index) => {
            document.getElementById(`taskCheck${index}`)?.addEventListener('change', (e) => {
                this.tasks[index].completed = e.target.checked;
                window.appHelpers.StorageManager.set('tasks', this.tasks);
                this.render();
            });
            document.getElementById(`editTask${index}`)?.addEventListener('click', () => {
                this.openTaskModal(index);
            });
            document.getElementById(`deleteTask${index}`)?.addEventListener('click', () => {
                this.deleteTask(index);
            });
        });
    },

    openTaskModal(index = null) {
        const title = index !== null ? 'Edit Tugas' : 'Tugas Baru';
        const task = index !== null ? this.tasks[index] : { title: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '', completed: false };

        const modal = `
            <div class="modal-backdrop" id="taskBackdrop">
                <div class="modal" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="btn-close" id="closeTaskModal"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="taskForm" class="modal-body">
                        <div class="form-group">
                            <label>Judul Tugas</label>
                            <input type="text" id="taskTitle" value="${task.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi</label>
                            <textarea id="taskDesc" rows="4" placeholder="Deskripsi tugas...">${task.description}</textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Prioritas</label>
                                <select id="taskPriority">
                                    ${this.priorities.map(p => `<option value="${p}" ${p === task.priority ? 'selected' : ''}>${p}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Status</label>
                                <select id="taskStatus">
                                    ${this.statuses.map(s => `<option value="${s}" ${s === task.status ? 'selected' : ''}>${s}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Tanggal Deadline</label>
                            <input type="date" id="taskDueDate" value="${task.dueDate}" required>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Simpan Tugas</button>
                            <button type="button" class="btn btn-secondary" id="cancelTaskBtn">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modal);
        
        document.getElementById('closeTaskModal').addEventListener('click', () => {
            document.getElementById('taskBackdrop').remove();
        });
        document.getElementById('taskBackdrop').addEventListener('click', (e) => {
            if (e.target.id === 'taskBackdrop') {
                document.getElementById('taskBackdrop').remove();
            }
        });
        document.getElementById('cancelTaskBtn').addEventListener('click', () => {
            document.getElementById('taskBackdrop').remove();
        });
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask(index);
        });
    },

    saveTask(index) {
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDesc').value,
            priority: document.getElementById('taskPriority').value,
            status: document.getElementById('taskStatus').value,
            dueDate: document.getElementById('taskDueDate').value,
            completed: index !== null ? this.tasks[index].completed : false,
            createdAt: index !== null ? this.tasks[index].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (index !== null) {
            this.tasks[index] = taskData;
        } else {
            this.tasks.push(taskData);
        }

        window.appHelpers.StorageManager.set('tasks', this.tasks);
        document.getElementById('taskBackdrop').remove();
        this.render();
        window.appHelpers.showToast('Tugas berhasil disimpan!', 'success');
    },

    deleteTask(index) {
        if (confirm('Hapus tugas ini?')) {
            this.tasks.splice(index, 1);
            window.appHelpers.StorageManager.set('tasks', this.tasks);
            this.render();
            window.appHelpers.showToast('Tugas dihapus!', 'success');
        }
    }
};

window.TasksModule = TasksModule;