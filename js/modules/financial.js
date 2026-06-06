// Financial Tracker Module

const FinancialModule = {
    transactions: [],
    categories: {
        income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'],
        expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Other']
    },

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.loadTransactions();
        this.render();
        this.updateChart();
    },

    cacheDOM() {
        this.financialContainer = document.getElementById('financialContainer');
        this.transactionsList = document.getElementById('transactionsList');
        this.addTransactionBtn = document.getElementById('addTransactionBtn');
        this.summaryTotal = document.getElementById('summaryTotal');
        this.summaryIncome = document.getElementById('summaryIncome');
        this.summaryExpense = document.getElementById('summaryExpense');
    },

    bindEvents() {
        if (this.addTransactionBtn) {
            this.addTransactionBtn.addEventListener('click', () => this.openTransactionModal());
        }
    },

    async loadTransactions() {
        try {
            this.transactions = window.appHelpers.StorageManager.get('transactions') || [];
        } catch (error) {
            console.error('Error loading transactions:', error);
            this.transactions = [];
        }
    },

    render() {
        this.updateSummary();
        if (this.transactions.length === 0) {
            this.transactionsList.innerHTML = '<p class="empty-state">Belum ada transaksi. <a href="#" id="addFirstTransaction">Tambah transaksi pertama</a></p>';
            document.getElementById('addFirstTransaction')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTransactionModal();
            });
        } else {
            const sorted = [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
            const html = sorted.map((transaction, index) => `
                <div class="transaction-item transaction-${transaction.type}">
                    <div class="transaction-icon" style="color: ${transaction.type === 'income' ? '#2ecc71' : '#e74c3c'}">
                        <i class="fas fa-${transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}"></i>
                    </div>
                    <div class="transaction-info">
                        <h4>${transaction.description}</h4>
                        <small>${transaction.category} • ${window.appHelpers.formatDate(transaction.date)}</small>
                    </div>
                    <div class="transaction-amount" style="color: ${transaction.type === 'income' ? '#2ecc71' : '#e74c3c'}">
                        ${transaction.type === 'income' ? '+' : '-'}${window.appHelpers.formatCurrency(transaction.amount)}
                    </div>
                    <div class="transaction-actions">
                        <button class="btn-icon" id="editTrans${index}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" id="deleteTrans${index}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            this.transactionsList.innerHTML = html;
            this.attachTransactionActions();
        }
    },

    attachTransactionActions() {
        this.transactions.forEach((transaction, index) => {
            document.getElementById(`editTrans${index}`)?.addEventListener('click', () => {
                this.openTransactionModal(index);
            });
            document.getElementById(`deleteTrans${index}`)?.addEventListener('click', () => {
                this.deleteTransaction(index);
            });
        });
    },

    updateSummary() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const total = income - expense;

        if (this.summaryTotal) this.summaryTotal.textContent = window.appHelpers.formatCurrency(total);
        if (this.summaryIncome) this.summaryIncome.textContent = window.appHelpers.formatCurrency(income);
        if (this.summaryExpense) this.summaryExpense.textContent = window.appHelpers.formatCurrency(expense);
    },

    openTransactionModal(index = null) {
        const title = index !== null ? 'Edit Transaksi' : 'Transaksi Baru';
        const transaction = index !== null ? this.transactions[index] : { type: 'expense', description: '', amount: '', category: 'Other', date: new Date().toISOString().split('T')[0] };

        const modal = `
            <div class="modal-backdrop" id="transBackdrop">
                <div class="modal" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="btn-close" id="closeTransModal"><i class="fas fa-times"></i></button>
                    </div>
                    <form id="transactionForm" class="modal-body">
                        <div class="form-group">
                            <label>Tipe</label>
                            <div class="radio-group">
                                <label class="radio">
                                    <input type="radio" name="transType" value="income" ${transaction.type === 'income' ? 'checked' : ''}>
                                    <span>Pemasukan</span>
                                </label>
                                <label class="radio">
                                    <input type="radio" name="transType" value="expense" ${transaction.type === 'expense' ? 'checked' : ''}>
                                    <span>Pengeluaran</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi</label>
                            <input type="text" id="transDesc" value="${transaction.description}" required>
                        </div>
                        <div class="form-group">
                            <label>Jumlah</label>
                            <input type="number" id="transAmount" value="${transaction.amount}" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Kategori</label>
                            <select id="transCategory">
                                <option value="Other">Pilih Kategori</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Tanggal</label>
                            <input type="date" id="transDate" value="${transaction.date}" required>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Simpan Transaksi</button>
                            <button type="button" class="btn btn-secondary" id="cancelTransBtn">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modal);
        
        const typeRadios = document.querySelectorAll('input[name="transType"]');
        const categorySelect = document.getElementById('transCategory');
        
        const updateCategories = () => {
            const type = document.querySelector('input[name="transType"]:checked').value;
            const categories = this.categories[type];
            categorySelect.innerHTML = categories.map(cat => 
                `<option value="${cat}" ${cat === transaction.category ? 'selected' : ''}>${cat}</option>`
            ).join('');
        };
        
        updateCategories();
        typeRadios.forEach(radio => radio.addEventListener('change', updateCategories));
        
        document.getElementById('closeTransModal').addEventListener('click', () => {
            document.getElementById('transBackdrop').remove();
        });
        document.getElementById('transBackdrop').addEventListener('click', (e) => {
            if (e.target.id === 'transBackdrop') {
                document.getElementById('transBackdrop').remove();
            }
        });
        document.getElementById('cancelTransBtn').addEventListener('click', () => {
            document.getElementById('transBackdrop').remove();
        });
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction(index);
        });
    },

    saveTransaction(index) {
        const transData = {
            type: document.querySelector('input[name="transType"]:checked').value,
            description: document.getElementById('transDesc').value,
            amount: parseFloat(document.getElementById('transAmount').value),
            category: document.getElementById('transCategory').value,
            date: document.getElementById('transDate').value,
            createdAt: index !== null ? this.transactions[index].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (index !== null) {
            this.transactions[index] = transData;
        } else {
            this.transactions.push(transData);
        }

        window.appHelpers.StorageManager.set('transactions', this.transactions);
        document.getElementById('transBackdrop').remove();
        this.render();
        this.updateChart();
        window.appHelpers.showToast('Transaksi berhasil disimpan!', 'success');
    },

    deleteTransaction(index) {
        if (confirm('Hapus transaksi ini?')) {
            this.transactions.splice(index, 1);
            window.appHelpers.StorageManager.set('transactions', this.transactions);
            this.render();
            this.updateChart();
            window.appHelpers.showToast('Transaksi dihapus!', 'success');
        }
    },

    updateChart() {
        // Chart implementation akan ditambahkan dengan Chart.js
        console.log('Chart update - Total transactions:', this.transactions.length);
    }
};

window.FinancialModule = FinancialModule;