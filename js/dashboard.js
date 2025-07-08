import { getTransactions } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const transactions = getTransactions();

    if (transactions.length === 0) {
        document.getElementById('onboarding-section').classList.remove('hidden');
        document.getElementById('dashboard-content').classList.add('hidden');
    } else {
        document.getElementById('onboarding-section').classList.add('hidden');
        document.getElementById('dashboard-content').classList.remove('hidden');
        renderDashboard(transactions);
    }
});

function renderDashboard(transactions) {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('total-income').textContent = currencyFormatter.format(totalIncome);
    document.getElementById('total-expenses').textContent = currencyFormatter.format(totalExpenses);
    document.getElementById('current-balance').textContent = currencyFormatter.format(totalIncome - totalExpenses);

    renderRecentTransactions(transactions.slice(0, 5));
    if (document.getElementById('expenseChart')) {
        renderExpenseChart(transactions);
    }
}

function renderRecentTransactions(transactions) {
    const listEl = document.getElementById('recent-transactions-list');
    listEl.innerHTML = ''; 
    if (transactions.length === 0) {
        listEl.innerHTML = '<p class="text-center text-text-secondary py-4">No transactions yet.</p>';
        return;
    }
    transactions.forEach(tx => {
        const isExpense = tx.type === 'expense';
        const itemEl = document.createElement('div');
        itemEl.className = 'flex items-center justify-between p-2';
        itemEl.innerHTML = `
            <div>
                <p class="font-medium">${tx.description || 'Transaction'}</p>
                <p class="text-sm text-text-secondary">${new Date(tx.date).toLocaleDateString()}</p>
            </div>
            <span class="font-data font-semibold ${isExpense ? 'text-error' : 'text-success'}">${isExpense ? '-' : '+'}${currencyFormatter.format(tx.amount)}</span>
        `;
        listEl.appendChild(itemEl);
    });
}

function renderExpenseChart(transactions) {
    const expenseData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const category = t.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});

    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);
    
    if (labels.length === 0) return;

    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{ data, backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}
