const DB_KEY = 'expenseTrackerData';

function getInitialData() {
    return { transactions: [], settings: { currency: 'INR' } };
}

export function getDatabase() {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : getInitialData();
}

export function saveDatabase(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getTransactions() {
    const { transactions } = getDatabase();
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function saveTransaction(tx) {
    const db = getDatabase();
    const existingIndex = db.transactions.findIndex(t => t.id === tx.id);
    if (existingIndex > -1) {
        db.transactions[existingIndex] = { ...db.transactions[existingIndex], ...tx, updatedAt: new Date().toISOString() };
    } else {
        tx.id = tx.id || Date.now().toString();
        tx.createdAt = new Date().toISOString();
        db.transactions.push(tx);
    }
    saveDatabase(db);
    return tx;
}

export function getTransactionById(id) {
    const { transactions } = getDatabase();
    return transactions.find(t => t.id === id);
}

export function deleteTransaction(id) {
    const db = getDatabase();
    db.transactions = db.transactions.filter(t => t.id !== id);
    saveDatabase(db);
}
