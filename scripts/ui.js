import { transactions, initializeData, addTransaction, deleteTransaction, updateTransactions, sortTransactions, getDashboardStats } from './state.js';
import { exportTransactions, importTransactions } from './storage.js';
const mobileFormModal = document.getElementById('form-modal-mobile');
const mobileForm = document.getElementById('transaction-form-mobile');
const addBtnMobile = document.getElementById('add-btn-mobile');
const cancelBtnMobile = document.getElementById('cancel-btn-mobile');
const desktopForm = document.getElementById('transaction-form-desktop');
const cardsContainer = document.getElementById('transaction-cards');
const tableBody = document.getElementById('table-body');
const tableHeader = document.querySelector('#transaction-table thead');
const totalRecordsEl = document.getElementById('total-records');
const totalAmountEl = document.getElementById('total-amount');
const topCategoryEl = document.getElementById('top-category');
const searchInput = document.getElementById('search-input');
const statusAnnouncer = document.getElementById('status-announcer');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');

function highlightMatches(text, regex) {
    if (!regex) return text;
    const sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return sanitizedText.replace(regex, (match) => `<mark>${match}</mark>`);
}

function updateDashboard(data) {
    const stats = getDashboardStats(data);
    totalRecordsEl.textContent = stats.totalRecords;
    totalAmountEl.textContent = stats.totalAmount.toFixed(2);
    topCategoryEl.textContent = stats.topCategory;
}

function renderTransactions(dataToRender, regex) {
    cardsContainer.innerHTML = '';
    tableBody.innerHTML = '';

    if (dataToRender.length === 0) {
        cardsContainer.innerHTML = '<p>No matching transactions found.</p>';
        tableBody.innerHTML = '<tr><td colspan="5">No matching transactions found.</td></tr>';
    } else {
        dataToRender.forEach(txn => {
            const highlightedDesc = highlightMatches(txn.description, regex);
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<p><strong>Description:</strong> ${highlightedDesc}</p><p><strong>Amount:</strong> <span class="amount">$${txn.amount.toFixed(2)}</span></p><p><strong>Category:</strong> ${txn.category}</p><p><strong>Date:</strong> ${txn.date}</p><button class="delete-btn" data-id="${txn.id}">Delete</button>`;
            cardsContainer.appendChild(card);
            
            const row = document.createElement('tr');
            row.innerHTML = `<td>${txn.date}</td><td>${highlightedDesc}</td><td>$${txn.amount.toFixed(2)}</td><td>${txn.category}</td><td><button class="delete-btn" data-id="${txn.id}">Delete</button></td>`;
            tableBody.appendChild(row);
        });
    }
    updateDashboard(dataToRender);
}

addBtnMobile.addEventListener('click', () => { mobileForm.reset(); mobileFormModal.classList.remove('hidden'); });
cancelBtnMobile.addEventListener('click', () => { mobileFormModal.classList.add('hidden'); });

mobileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTransaction(
        document.getElementById('desc-mobile').value,
        parseFloat(document.getElementById('amount-mobile').value),
        document.getElementById('category-mobile').value,
        document.getElementById('date-mobile').value
    );
    renderTransactions(transactions);
    statusAnnouncer.textContent = `Transaction for ${document.getElementById('desc-mobile').value} added.`;
    mobileForm.reset();
    mobileFormModal.classList.add('hidden');
});

desktopForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTransaction(
        document.getElementById('desc-desktop').value,
        parseFloat(document.getElementById('amount-desktop').value),
        document.getElementById('category-desktop').value,
        document.getElementById('date-desktop').value
    );
    renderTransactions(transactions);
    statusAnnouncer.textContent = `Transaction for ${document.getElementById('desc-desktop').value} added.`;
    desktopForm.reset();
});

document.querySelector('main').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        const deletedTxn = transactions.find(t => t.id === id);
        deleteTransaction(id);
        renderTransactions(transactions);
        statusAnnouncer.textContent = `Transaction for ${deletedTxn.description} deleted.`;
    }
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    let regex;
    try {
        regex = new RegExp(searchTerm, 'gi');
        searchInput.classList.remove('invalid');
    } catch (e) { searchInput.classList.add('invalid'); return; }
    if (!searchTerm) { renderTransactions(transactions); return; }
    const filtered = transactions.filter(txn => regex.test(txn.description));
    renderTransactions(filtered, regex);
});

exportBtn.addEventListener('click', () => { exportTransactions(transactions); });
importBtn.addEventListener('click', () => { importFile.click(); });

importFile.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
        const newTransactionList = await importTransactions(file, transactions);
        updateTransactions(newTransactionList);
        renderTransactions(transactions);
        statusAnnouncer.textContent = 'Data imported successfully!';
        alert('Data imported successfully!');
    } catch (error) {
        statusAnnouncer.textContent = `Error importing data: ${error.message}`;
        alert(`Error importing data: ${error.message}`);
    } finally { importFile.value = ''; }
});

tableHeader.addEventListener('click', (e) => {
    const key = e.target.dataset.sort;
    if (key) {
        sortTransactions(key);
        renderTransactions(transactions);
    }
});

function init() {
    initializeData();
    renderTransactions(transactions);
}
init();