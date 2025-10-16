import { saveState, loadState } from './storage.js';

export let transactions = [];
let sortState = { key: 'date', direction: 'desc' };

export function initializeData() {
    transactions = loadState();
    sortTransactions();
}

export function addTransaction(description, amount, category, date) {
    const newTransaction = {
        id: `txn_${new Date().getTime()}`,
        description, amount, category, date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    sortTransactions();
    saveState(transactions);
}

export function deleteTransaction(idToDelete) {
    transactions = transactions.filter(txn => txn.id !== idToDelete);
    saveState(transactions);
}

export function updateTransactions(newTransactions) {
    transactions = newTransactions;
    sortTransactions();
    saveState(transactions);
}

export function sortTransactions(key) {
    if (key) {
        if (sortState.key === key) {
            sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortState.key = key;
            sortState.direction = 'asc';
        }
    }
    const direction = sortState.direction === 'asc' ? 1 : -1;
    transactions.sort((a, b) => {
        const valA = a[sortState.key];
        const valB = b[sortState.key];
        if (typeof valA === 'number') {
            return (valA - valB) * direction;
        } else {
            return valA.localeCompare(valB) * direction;
        }
    });
}


export function getDashboardStats(data) {
    if (data.length === 0) {
        return { totalRecords: 0, totalAmount: 0, topCategory: 'N/A' };
    }

    const totalRecords = data.length;
    const totalAmount = data.reduce((sum, txn) => sum + txn.amount, 0);

    const categoryCounts = data.reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + 1;
        return acc;
    }, {});

    const topCategory = Object.keys(categoryCounts).reduce((a, b) => 
        categoryCounts[a] > categoryCounts[b] ? a : b
    );

    return { totalRecords, totalAmount, topCategory };
}