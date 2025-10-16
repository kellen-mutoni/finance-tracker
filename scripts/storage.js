// --- Handles saving, loading, importing, and exporting ---

const STORAGE_KEY = 'budget-bytes-data';

export function saveState(transactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function loadState() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function exportTransactions(transactions) {
    const jsonString = JSON.stringify(transactions, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Simple validation for imported data
function isValidImport(data) {
    if (!Array.isArray(data)) return false;
    for (const item of data) {
        if (!item.id || !item.description || typeof item.amount !== 'number' || !item.category || !item.date) {
            return false;
        }
    }
    return true;
}

export function importTransactions(file, currentTransactions) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (!isValidImport(importedData)) {
                    throw new Error('Invalid file structure. Each record must have id, description, amount, category, and date.');
                }
                
                // Merge data, avoiding duplicates based on ID
                const existingIds = new Set(currentTransactions.map(t => t.id));
                const newData = importedData.filter(t => !existingIds.has(t.id));
                const combined = [...currentTransactions, ...newData];
                
                resolve(combined);

            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read the file.'));
        reader.readAsText(file);
    });
}