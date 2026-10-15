/**
 * ApexTrust Online Banking System - Core Application Controller
 * Handles UI interactions, role management, transactional workflows,
 * Chart.js analytics, and CRUD operations.
 */

let currentRole = 'customer'; // 'customer' or 'admin'
let chartTxVolumeInstance = null;
let chartAccountDistInstance = null;
let isCardNumberRevealed = false;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const db = window.BankStore.get();

  // Populate UI with database values
  updateHeaderUserInfo();
  renderCustomerAccounts();
  renderCustomerRecentTransactions();
  renderCustomerFullTransactions();
  renderCustomerServicesApplications();
  renderCustomerProfile();

  renderAdminUsersTable();
  renderAdminTransactionsTable();
  loadAdminSystemSettings();
  renderAdminMetrics();

  // Initialize interactive loan EMI calculator
  calculateEMI();

  // Render Charts
  setTimeout(() => {
    initOrUpdateCharts();
  }, 100);

  // Check Maintenance alert
  checkMaintenanceMode();
}

/**
 * Role & Tab Navigation
 */
function switchRole(role) {
  currentRole = role;
  const db = window.BankStore.get();

  const customerNav = document.getElementById('customerNavTabs');
  const adminNav = document.getElementById('adminNavTabs');
  const roleBtnCustomer = document.getElementById('roleBtnCustomer');
  const roleBtnAdmin = document.getElementById('roleBtnAdmin');
  const portalBadge = document.getElementById('portalModeBadge');
  const portalBadgeText = document.getElementById('portalBadgeText');

  // Deactivate all views
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

  if (role === 'customer') {
    customerNav.style.display = 'flex';
    adminNav.style.display = 'none';

    roleBtnCustomer.classList.add('active');
    roleBtnAdmin.classList.remove('active');

    portalBadge.style.background = '#eff6ff';
    portalBadge.style.borderColor = '#bfdbfe';
    portalBadge.style.color = '#1e40af';
    portalBadgeText.textContent = 'Customer Banking Dashboard';

    // Show default customer tab
    showCustomerTab('account-overview');
    showToast('Customer Portal', 'Switched to Customer Banking experience.', 'info');
  } else {
    customerNav.style.display = 'none';
    adminNav.style.display = 'flex';

    roleBtnCustomer.classList.remove('active');
    roleBtnAdmin.classList.add('active');

    portalBadge.style.background = '#fef2f2';
    portalBadge.style.borderColor = '#fecaca';
    portalBadge.style.color = '#991b1b';
    portalBadgeText.textContent = 'Administrator Control Panel';

    // Show default admin tab
    showAdminTab('admin-metrics');
    showToast('Admin Portal', 'Switched to System Administration mode.', 'warning');
  }

  updateHeaderUserInfo();
}

function showCustomerTab(tabName) {
  // Update nav buttons
  const customerNav = document.getElementById('customerNavTabs');
  customerNav.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));

  // Find clicked button
  const buttons = customerNav.querySelectorAll('.nav-tab-btn');
  if (tabName === 'account-overview') buttons[0]?.classList.add('active');
  if (tabName === 'perform-transaction') buttons[1]?.classList.add('active');
  if (tabName === 'transaction-history') buttons[2]?.classList.add('active');
  if (tabName === 'banking-services') buttons[3]?.classList.add('active');
  if (tabName === 'profile-management') buttons[4]?.classList.add('active');

  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const targetSection = document.getElementById(`view-${tabName}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Refresh data if needed
  if (tabName === 'account-overview') {
    renderCustomerAccounts();
    renderCustomerRecentTransactions();
  } else if (tabName === 'transaction-history') {
    renderCustomerFullTransactions();
  } else if (tabName === 'perform-transaction') {
    updateTransferBalancePreview();
  }
}

function showAdminTab(tabName) {
  const adminNav = document.getElementById('adminNavTabs');
  adminNav.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));

  const buttons = adminNav.querySelectorAll('.nav-tab-btn');
  if (tabName === 'admin-metrics') buttons[0]?.classList.add('active');
  if (tabName === 'admin-users') buttons[1]?.classList.add('active');
  if (tabName === 'admin-transactions') buttons[2]?.classList.add('active');
  if (tabName === 'admin-settings') buttons[3]?.classList.add('active');

  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const targetSection = document.getElementById(`view-${tabName}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  if (tabName === 'admin-metrics') {
    renderAdminMetrics();
    setTimeout(initOrUpdateCharts, 50);
  } else if (tabName === 'admin-users') {
    renderAdminUsersTable();
  } else if (tabName === 'admin-transactions') {
    renderAdminTransactionsTable();
  } else if (tabName === 'admin-settings') {
    loadAdminSystemSettings();
  }
}

function updateHeaderUserInfo() {
  const db = window.BankStore.get();
  const avatar = document.getElementById('userAvatar');
  const name = document.getElementById('userDisplayName');
  const roleLabel = document.getElementById('userDisplayRole');
  const bankTitle = document.getElementById('headerBankTitle');

  bankTitle.textContent = db.systemSettings.bankName || 'ApexTrust Bank';

  if (currentRole === 'customer') {
    avatar.className = 'user-avatar-circle';
    avatar.textContent = db.currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    name.textContent = db.currentUser.name;
    roleLabel.textContent = `Customer • #${db.currentUser.accountNumber}`;
    document.getElementById('welcomeUserName').textContent = db.currentUser.name.split(' ')[0];
  } else {
    avatar.className = 'user-avatar-circle admin';
    avatar.textContent = 'AK';
    name.textContent = 'Aakash Kumar';
    roleLabel.textContent = 'Administrator • Security IT';
  }
}

/**
 * Customer Dashboard View Rendering
 */
function renderCustomerAccounts() {
  const db = window.BankStore.get();
  const grid = document.getElementById('customerAccountsGrid');
  grid.innerHTML = '';

  db.accounts.forEach(acc => {
    const card = document.createElement('div');
    card.className = 'account-stat-card';

    let tagClass = 'tag-checking';
    if (acc.type === 'Savings') tagClass = 'tag-savings';
    if (acc.type === 'Investment') tagClass = 'tag-investment';

    let extraBadge = '';
    if (acc.type === 'Savings') {
      extraBadge = `<span class="account-extra-info">APY: <strong>${acc.apy}%</strong> • YTD Interest: <strong>$${acc.interestEarnedYTD.toFixed(2)}</strong></span>`;
    } else if (acc.type === 'Investment') {
      extraBadge = `<span class="account-extra-info">Yield: <strong>${acc.rate}%</strong> • Matures: <strong>${acc.maturityDate}</strong></span>`;
    } else {
      extraBadge = `<span class="account-extra-info">Routing Number: <strong>${acc.routingNumber}</strong></span>`;
    }

    card.innerHTML = `
      <div>
        <div class="account-stat-header">
          <span class="account-type-tag ${tagClass}">${acc.type}</span>
          <span class="account-num-mask">•••• ${acc.accountNumber.slice(-4)}</span>
        </div>
        <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">
          ${acc.title}
        </div>
        <div class="account-balance-amount">
          ${acc.currency}${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div>
        ${extraBadge}
      </div>
    `;
    grid.appendChild(card);
  });

  // Also update source balance in Perform Transfer tab
  updateTransferBalancePreview();
}

function updateTransferBalancePreview() {
  const db = window.BankStore.get();
  const checking = db.accounts.find(a => a.type === 'Checking');
  const balSpan = document.getElementById('transferSourceBalance');
  if (checking && balSpan) {
    balSpan.textContent = `$${checking.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function renderCustomerRecentTransactions() {
  const db = window.BankStore.get();
  const tableBody = document.getElementById('overviewRecentTxTable');
  tableBody.innerHTML = '';

  const recent = db.transactions.slice(0, 4);
  recent.forEach(tx => {
    const tr = document.createElement('tr');
    const isDebit = tx.flow === 'debit';
    const amountClass = isDebit ? 'amount-debit' : 'amount-credit';
    const amountSign = isDebit ? '-' : '+';

    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 600;">${tx.id}</td>
      <td style="font-size: 0.82rem; color: var(--text-muted);">${tx.timestamp}</td>
      <td>
        <strong style="display: block;">${isDebit ? tx.recipientName : tx.senderName}</strong>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${tx.remarks || tx.category}</span>
      </td>
      <td><span class="badge" style="background: #f1f5f9;">${tx.type}</span></td>
      <td><span class="badge badge-completed">${tx.status}</span></td>
      <td style="text-align: right;" class="${amountClass}">${amountSign}$${Number(tx.amount).toFixed(2)}</td>
      <td style="text-align: center;">
        <button class="btn btn-secondary btn-sm" onclick="viewTransactionReceipt('${tx.id}')">Receipt</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderCustomerFullTransactions() {
  const db = window.BankStore.get();
  const tableBody = document.getElementById('customerTxFullTable');
  const noDataNotice = document.getElementById('noCustTxNotice');
  const searchQuery = document.getElementById('custTxSearch')?.value.toLowerCase().trim() || '';
  const typeFilter = document.getElementById('custTxTypeFilter')?.value || 'ALL';
  const sortOrder = document.getElementById('custTxSort')?.value || 'newest';

  let list = [...db.transactions];

  // Filtering
  if (searchQuery) {
    list = list.filter(tx => 
      tx.id.toLowerCase().includes(searchQuery) ||
      tx.recipientName.toLowerCase().includes(searchQuery) ||
      tx.senderName.toLowerCase().includes(searchQuery) ||
      (tx.remarks && tx.remarks.toLowerCase().includes(searchQuery))
    );
  }

  if (typeFilter !== 'ALL') {
    if (typeFilter === 'debit' || typeFilter === 'credit') {
      list = list.filter(tx => tx.flow === typeFilter);
    } else {
      list = list.filter(tx => tx.type === typeFilter);
    }
  }

  // Sorting
  if (sortOrder === 'amount-high') {
    list.sort((a, b) => b.amount - a.amount);
  } else if (sortOrder === 'amount-low') {
    list.sort((a, b) => a.amount - b.amount);
  } else if (sortOrder === 'oldest') {
    list.reverse();
  }

  tableBody.innerHTML = '';

  if (list.length === 0) {
    noDataNotice.style.display = 'block';
    return;
  }
  noDataNotice.style.display = 'none';

  list.forEach(tx => {
    const tr = document.createElement('tr');
    const isDebit = tx.flow === 'debit';
    const amountClass = isDebit ? 'amount-debit' : 'amount-credit';
    const amountSign = isDebit ? '-' : '+';

    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 700;">${tx.id}</td>
      <td style="font-size: 0.82rem; color: var(--text-muted);">${tx.timestamp}</td>
      <div>
        <strong style="display: block;">${isDebit ? tx.recipientName : tx.senderName}</strong>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${tx.remarks || tx.category}</span>
      </div>
      <td style="font-size: 0.82rem;">${tx.channel || 'Online Banking'}</td>
      <td><span class="badge" style="background: #e0f2fe; color: #0369a1;">${tx.category}</span></td>
      <td><span class="badge badge-completed">${tx.status}</span></td>
      <td style="text-align: right;" class="${amountClass}">${amountSign}$${Number(tx.amount).toFixed(2)}</td>
      <td style="text-align: center;">
        <button class="btn btn-secondary btn-sm" onclick="viewTransactionReceipt('${tx.id}')">Receipt</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function filterCustomerTransactions() {
  renderCustomerFullTransactions();
}

/**
 * Perform Transactions Workflow
 */
function calculateTransferTotals() {
  const amountInput = document.getElementById('txAmount');
  const amount = parseFloat(amountInput.value) || 0;
  document.getElementById('previewTxAmount').textContent = `$${amount.toFixed(2)}`;
  document.getElementById('previewTxTotalDebit').textContent = `$${amount.toFixed(2)}`;
}

function updateTransferFeeNotice() {
  // Free across all networks in promo
}

function quickFillBeneficiary(name, acc, ifsc) {
  document.getElementById('txRecipientName').value = name;
  document.getElementById('txRecipientAccount').value = acc;
  document.getElementById('txRecipientIfsc').value = ifsc;
  showToast('Beneficiary Selected', `Filled details for ${name}`, 'info');
}

function handleTransferSubmit(event) {
  event.preventDefault();
  const db = window.BankStore.get();

  // Check Maintenance mode
  if (db.systemSettings.maintenanceMode) {
    showToast('Transfer Suspended', 'Core banking system is currently in Maintenance Mode. Non-administrative transfers are locked.', 'error');
    return;
  }

  const recipientAcc = document.getElementById('txRecipientAccount').value.trim();
  const recipientName = document.getElementById('txRecipientName').value.trim();
  const recipientIfsc = document.getElementById('txRecipientIfsc').value.trim();
  const transferType = document.getElementById('txTransferType').value;
  const category = document.getElementById('txCategory').value;
  const remarks = document.getElementById('txRemarks').value.trim() || 'Fund Transfer';
  const amount = parseFloat(document.getElementById('txAmount').value);

  const checking = db.accounts.find(a => a.type === 'Checking');

  if (!checking || checking.balance < amount) {
    showToast('Insufficient Balance', `Your checking balance ($${checking ? checking.balance.toFixed(2) : 0}) is insufficient to complete this transfer.`, 'error');
    return;
  }

  // System Cap Verification
  if (amount > db.systemSettings.perTransactionLimit) {
    showToast('Limit Exceeded', `Transfer exceeds the per-transaction cap of $${db.systemSettings.perTransactionLimit.toLocaleString()}.`, 'error');
    return;
  }

  // Create Transaction
  const newTx = window.BankStore.addTransaction({
    sourceAccount: checking.accountNumber,
    senderName: db.currentUser.name,
    recipientName: recipientName,
    recipientAccount: recipientAcc,
    type: 'Transfer',
    category: category,
    amount: amount,
    flow: 'debit',
    remarks: remarks,
    channel: transferType
  });

  // Reset form
  document.getElementById('transferForm').reset();
  calculateTransferTotals();

  // Success Feedback
  showToast('Transfer Successful!', `Transferred $${amount.toFixed(2)} to ${recipientName}. Ref: ${newTx.id}`, 'success');

  // Re-render UI
  renderCustomerAccounts();
  renderCustomerRecentTransactions();
  renderCustomerFullTransactions();
  renderAdminTransactionsTable();
  renderAdminMetrics();

  // Show Receipt Modal
  viewTransactionReceipt(newTx.id);
}

function viewTransactionReceipt(txId) {
  const db = window.BankStore.get();
  const tx = db.transactions.find(t => t.id === txId);
  if (!tx) return;

  document.getElementById('receiptTxId').textContent = tx.id;
  document.getElementById('receiptTimestamp').textContent = tx.timestamp;
  document.getElementById('receiptChannel').textContent = tx.channel || tx.type;
  document.getElementById('receiptSourceAcc').textContent = tx.sourceAccount || '1029384756';
  document.getElementById('receiptRecipientName').textContent = tx.recipientName;
  document.getElementById('receiptRecipientAcc').textContent = tx.recipientAccount;
  document.getElementById('receiptRemarks').textContent = tx.remarks || tx.category;
  document.getElementById('receiptAmount').textContent = `$${Number(tx.amount).toFixed(2)}`;

  openModal('receiptModal');
}

function printReceiptContent() {
  window.print();
}

function exportCustomerTransactionsCSV() {
  const db = window.BankStore.get();
  let csv = 'Transaction ID,Timestamp,Sender,Recipient,Account,Category,Flow,Amount,Status\n';
  db.transactions.forEach(t => {
    csv += `"${t.id}","${t.timestamp}","${t.senderName}","${t.recipientName}","${t.recipientAccount}","${t.category}","${t.flow}","${t.amount}","${t.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ApexTrust_Statement_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  showToast('Report Exported', 'Downloaded authenticated banking statement CSV.', 'success');
}

/**
 * Virtual Card Controls
 */
function toggleCardNumberVisibility() {
  const display = document.getElementById('maskedCardNumber');
  const cvvDisplay = document.getElementById('cardCvvDisplay');
  isCardNumberRevealed = !isCardNumberRevealed;

  if (isCardNumberRevealed) {
    display.textContent = '4532 9018 7741 8821';
    cvvDisplay.textContent = '342';
  } else {
    display.textContent = '4532 •••• •••• 8821';
    cvvDisplay.textContent = '•••';
  }
}

function toggleCardLock() {
  const badge = document.getElementById('cardStatusBadge');
  const btnText = document.getElementById('cardLockBtnText');
  const cardElem = document.getElementById('virtualCardDisplay');

  if (badge.textContent === 'Active') {
    badge.textContent = 'Locked';
    badge.className = 'badge badge-suspended';
    btnText.textContent = 'Unlock Card';
    cardElem.style.filter = 'grayscale(80%)';
    showToast('Card Locked', 'Your Apex Platinum Debit Card is temporarily frozen.', 'warning');
  } else {
    badge.textContent = 'Active';
    badge.className = 'badge badge-active';
    btnText.textContent = 'Lock Card';
    cardElem.style.filter = 'none';
    showToast('Card Activated', 'Debit card unlocked for worldwide usage.', 'success');
  }
}

/**
 * Banking Services & Calculators
 */
function toggleServiceSubView(view) {
  const loans = document.getElementById('serviceSubViewLoans');
  const inv = document.getElementById('serviceSubViewInvestments');
  const app = document.getElementById('serviceSubViewApplications');

  const btnLoans = document.getElementById('serviceTabBtnLoans');
  const btnInv = document.getElementById('serviceTabBtnInv');
  const btnApp = document.getElementById('serviceTabBtnApp');

  loans.style.display = view === 'loans' ? 'block' : 'none';
  inv.style.display = view === 'investments' ? 'block' : 'none';
  app.style.display = view === 'applications' ? 'block' : 'none';

  btnLoans.className = view === 'loans' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
  btnInv.className = view === 'investments' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
  btnApp.className = view === 'applications' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';

  if (view === 'applications') {
    renderCustomerServicesApplications();
  }
}

function calculateEMI() {
  const amountSlider = document.getElementById('emiAmountRange');
  const tenureSlider = document.getElementById('emiTenureRange');
  const rateSlider = document.getElementById('emiRateRange');

  if (!amountSlider || !tenureSlider || !rateSlider) return;

  const P = parseFloat(amountSlider.value);
  const N = parseInt(tenureSlider.value);
  const annualRate = parseFloat(rateSlider.value);
  const R = annualRate / (12 * 100);

  document.getElementById('emiAmountVal').textContent = `$${P.toLocaleString()}`;
  document.getElementById('emiTenureVal').textContent = `${N} Months (${(N / 12).toFixed(1)} Yrs)`;
  document.getElementById('emiRateVal').textContent = `${annualRate.toFixed(2)}%`;

  // EMI Formula: [P * R * (1+R)^N] / [(1+R)^N - 1]
  const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  const totalPayable = emi * N;
  const totalInterest = totalPayable - P;

  document.getElementById('emiCalculatedMonthly').textContent = `$${emi.toFixed(2)}`;
  document.getElementById('emiTotalInterest').textContent = `$${totalInterest.toFixed(2)}`;
  document.getElementById('emiTotalPayable').textContent = `$${totalPayable.toFixed(2)}`;
}

function openApplyLoanModal(title, rate, maxAmt) {
  const db = window.BankStore.get();
  document.getElementById('loanModalTitle').textContent = `Apply for ${title}`;
  document.getElementById('loanProductType').value = title;
  document.getElementById('loanInterestRate').value = rate;
  document.getElementById('loanApplicantName').value = db.currentUser.name;
  openModal('loanModal');
}

function handleLoanApplicationSubmit(event) {
  event.preventDefault();
  const db = window.BankStore.get();
  const loanType = document.getElementById('loanProductType').value;
  const amount = parseFloat(document.getElementById('loanAmountInput').value);
  const tenure = parseInt(document.getElementById('loanTenureInput').value);
  const income = parseFloat(document.getElementById('loanMonthlyIncome').value);

  const rate = parseFloat(document.getElementById('loanInterestRate').value) / (12 * 100);
  const monthlyEmi = (amount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);

  const newApp = window.BankStore.submitServiceApplication({
    type: loanType,
    applicantName: db.currentUser.name,
    amount: amount,
    tenure: tenure,
    monthlyEmi: Number(monthlyEmi.toFixed(2)),
    status: 'Approved (Pending Signature)'
  });

  closeModal('loanModal');
  showToast('Application Submitted', `Your loan request of $${amount.toLocaleString()} is under review. Ref: ${newApp.id}`, 'success');
  renderCustomerServicesApplications();
  toggleServiceSubView('applications');
}

function openOpenFdModal() {
  openModal('fdModal');
}

function handleFdApplicationSubmit(event) {
  event.preventDefault();
  const db = window.BankStore.get();
  const amount = parseFloat(document.getElementById('fdDepositAmount').value);
  const tenure = parseInt(document.getElementById('fdTenureSelect').value);

  const checking = db.accounts.find(a => a.type === 'Checking');
  if (!checking || checking.balance < amount) {
    showToast('Insufficient Balance', 'You do not have enough funds in your checking account to create this FD.', 'error');
    return;
  }

  // Deduct from checking
  window.BankStore.addTransaction({
    sourceAccount: checking.accountNumber,
    senderName: db.currentUser.name,
    recipientName: 'ApexTrust Term Deposit Portfolio',
    recipientAccount: 'APEX-TERM-DEP',
    type: 'Internal Transfer',
    category: 'Fixed Deposit',
    amount: amount,
    flow: 'debit',
    remarks: `Opened Fixed Deposit for ${tenure} months @ 7.25% p.a.`
  });

  // Calculate maturity roughly @ 7.25%
  const maturityVal = amount * Math.pow(1 + 0.0725 / 12, tenure);

  window.BankStore.submitServiceApplication({
    type: 'Fixed Growth Deposit',
    applicantName: db.currentUser.name,
    amount: amount,
    tenure: tenure,
    maturityValue: Number(maturityVal.toFixed(2)),
    status: 'Active'
  });

  closeModal('fdModal');
  showToast('Fixed Deposit Created!', `Deposited $${amount.toFixed(2)}. Maturity value: $${maturityVal.toFixed(2)}`, 'success');
  renderCustomerAccounts();
  renderCustomerServicesApplications();
  toggleServiceSubView('applications');
}

function openSipModal() {
  showToast('SIP Initiated', 'Automated monthly investment of $100 activated for Apex Bluechip Fund.', 'success');
}

function openPensionModal() {
  showToast('Pension Enrolled', 'Golden Sovereign Pension portfolio linked to your National ID.', 'success');
}

function renderCustomerServicesApplications() {
  const db = window.BankStore.get();
  const table = document.getElementById('appliedServicesTable');
  const countBadge = document.getElementById('activeAppBadgeCount');
  const apps = db.services.appliedApplications || [];

  countBadge.textContent = apps.length;
  table.innerHTML = '';

  if (apps.length === 0) {
    table.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No active loan or investment applications.</td></tr>`;
    return;
  }

  apps.forEach(app => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 700;">${app.id}</td>
      <td><strong>${app.type}</strong></td>
      <td style="font-size: 0.85rem; color: var(--text-muted);">${app.submittedDate}</td>
      <td style="font-weight: 700;">$${Number(app.amount).toLocaleString()}</td>
      <td>${app.tenure} Months</td>
      <td><span class="badge ${app.status.includes('Active') ? 'badge-active' : 'badge-pending'}">${app.status}</span></td>
      <td>
        <span style="font-size: 0.82rem; color: var(--text-muted);">
          ${app.monthlyEmi ? `EMI: $${app.monthlyEmi}/mo` : `Matures: $${app.maturityValue?.toLocaleString() || '-'}`}
        </span>
      </td>
    `;
    table.appendChild(tr);
  });
}

/**
 * Deposit Modal Workflow
 */
function openDepositModal() {
  openModal('depositModal');
}

function handleDepositSubmit(event) {
  event.preventDefault();
  const db = window.BankStore.get();
  const targetType = document.getElementById('depositAccountSelect').value;
  const amount = parseFloat(document.getElementById('depositAmountInput').value);
  const channel = document.getElementById('depositSourceSelect').value;

  const targetAcc = db.accounts.find(a => a.type === targetType);
  if (!targetAcc) return;

  window.BankStore.addTransaction({
    sourceAccount: 'EXTERNAL-CLEARING',
    senderName: 'Direct Deposit Inflow',
    recipientName: db.currentUser.name,
    recipientAccount: targetAcc.accountNumber,
    type: 'Deposit',
    category: 'Deposit Inflow',
    amount: amount,
    flow: 'credit',
    remarks: `Inward deposit via ${channel}`,
    channel: channel
  });

  closeModal('depositModal');
  showToast('Deposit Complete', `Credited $${amount.toFixed(2)} into your ${targetType} account.`, 'success');

  renderCustomerAccounts();
  renderCustomerRecentTransactions();
  renderCustomerFullTransactions();
  renderAdminTransactionsTable();
  renderAdminMetrics();
}

/**
 * Profile Management
 */
function renderCustomerProfile() {
  const db = window.BankStore.get();
  const user = db.currentUser;

  document.getElementById('profileName').value = user.name;
  document.getElementById('profileEmail').value = user.email;
  document.getElementById('profilePhone').value = user.phone || '';
  document.getElementById('profileAddress').value = user.address || '';
  document.getElementById('profileAccountNum').value = user.accountNumber;
  document.getElementById('profileCustomerId').value = user.id;
}

function handleProfileUpdate(event) {
  event.preventDefault();
  const name = document.getElementById('profileName').value.trim();
  const email = document.getElementById('profileEmail').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const address = document.getElementById('profileAddress').value.trim();

  window.BankStore.updateCustomerProfile({
    name, email, phone, address
  });

  updateHeaderUserInfo();
  showToast('Profile Updated', 'Personal contact details and residency records saved successfully.', 'success');
}

function handleSecurityUpdate(event) {
  event.preventDefault();
  const currentPass = document.getElementById('currentPassword').value;
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;

  if (newPass !== confirmPass) {
    showToast('Password Mismatch', 'New password and confirmation password do not match.', 'error');
    return;
  }

  const twoFactor = document.getElementById('twoFactorCheckbox').checked;
  const smsAlerts = document.getElementById('smsAlertsCheckbox').checked;

  window.BankStore.updateCustomerProfile({
    twoFactorEnabled: twoFactor,
    notificationPrefs: { email: true, sms: smsAlerts }
  });

  document.getElementById('securityForm').reset();
  showToast('Security Updated', 'Security credentials, password hash, and 2FA policies successfully applied.', 'success');
}

/**
 * =========================================================================
 * ADMIN WORKFLOWS
 * =========================================================================
 */

function renderAdminMetrics() {
  const db = window.BankStore.get();
  const users = db.users;

  // Calculate total deposits
  const totalCustomerBal = users
    .filter(u => u.role === 'customer')
    .reduce((sum, u) => sum + (u.totalBalance || 0), 0);

  const checkingAcc = db.accounts.find(a => a.type === 'Checking');
  const activeCheckingBal = checkingAcc ? checkingAcc.balance : 0;
  const combinedEstimated = 4850000 + (activeCheckingBal - 14250);

  document.getElementById('metricTotalDeposits').textContent = `$${(combinedEstimated / 1000000).toFixed(2)}M`;
  document.getElementById('metricTotalUsersCount').textContent = users.length + 14274;
}

function renderAdminUsersTable() {
  const db = window.BankStore.get();
  const table = document.getElementById('adminUserTableBody');
  const search = document.getElementById('adminUserSearch')?.value.toLowerCase().trim() || '';
  const roleFilter = document.getElementById('adminUserRoleFilter')?.value || 'ALL';
  const statusFilter = document.getElementById('adminUserStatusFilter')?.value || 'ALL';

  let list = [...db.users];

  if (search) {
    list = list.filter(u => 
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.id.toLowerCase().includes(search)
    );
  }

  if (roleFilter !== 'ALL') {
    list = list.filter(u => u.role === roleFilter);
  }

  if (statusFilter !== 'ALL') {
    list = list.filter(u => u.status === statusFilter);
  }

  table.innerHTML = '';

  list.forEach(user => {
    const tr = document.createElement('tr');
    const roleBadge = user.role === 'admin' ? 'badge-admin' : 'badge-customer';
    const statusBadge = user.status === 'Active' ? 'badge-active' : 'badge-suspended';
    const balanceDisplay = user.totalBalance !== undefined ? `$${Number(user.totalBalance).toLocaleString()}` : 'N/A (Staff)';

    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 700;">${user.id}</td>
      <td>
        <strong>${user.name}</strong>
        <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">${user.phone || 'No phone'}</span>
      </td>
      <td style="font-size: 0.85rem;">${user.email}</td>
      <td><span class="badge ${roleBadge}">${user.role}</span></td>
      <td><span class="badge ${statusBadge}">${user.status}</span></td>
      <td style="font-size: 0.85rem; color: var(--text-muted);">${user.createdDate}</td>
      <td style="font-weight: 600;">${balanceDisplay}</td>
      <td style="text-align: center;">
        <div class="flex items-center justify-center gap-1">
          <button class="btn btn-secondary btn-sm" onclick="openEditUserModal('${user.id}')" title="Edit User">Edit</button>
          <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus('${user.id}')" title="Suspend / Activate">
            ${user.status === 'Active' ? 'Suspend' : 'Activate'}
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteUserRecord('${user.id}')" title="Delete Account">&times;</button>
        </div>
      </td>
    `;
    table.appendChild(tr);
  });
}

function filterAdminUsers() {
  renderAdminUsersTable();
}

function openCreateUserModal() {
  document.getElementById('userModalTitle').textContent = 'Add New Banking User';
  document.getElementById('modalUserId').value = '';
  document.getElementById('userModalForm').reset();
  document.getElementById('modalBalanceGroup').style.display = 'block';
  document.getElementById('modalUserSubmitBtn').textContent = 'Create User Account';
  openModal('userModal');
}

function openEditUserModal(userId) {
  const db = window.BankStore.get();
  const user = db.users.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('userModalTitle').textContent = `Edit User (${user.id})`;
  document.getElementById('modalUserId').value = user.id;
  document.getElementById('modalUserName').value = user.name;
  document.getElementById('modalUserEmail').value = user.email;
  document.getElementById('modalUserPhone').value = user.phone || '';
  document.getElementById('modalUserRole').value = user.role;
  document.getElementById('modalUserStatus').value = user.status;
  document.getElementById('modalBalanceGroup').style.display = 'none';
  document.getElementById('modalUserSubmitBtn').textContent = 'Save Changes';

  openModal('userModal');
}

function handleUserModalSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('modalUserId').value;
  const name = document.getElementById('modalUserName').value.trim();
  const email = document.getElementById('modalUserEmail').value.trim();
  const phone = document.getElementById('modalUserPhone').value.trim();
  const role = document.getElementById('modalUserRole').value;
  const status = document.getElementById('modalUserStatus').value;

  if (id) {
    // Update
    window.BankStore.updateUser(id, { name, email, phone, role, status });
    showToast('User Updated', `Successfully updated profile for ${name}.`, 'success');
  } else {
    // Create
    const balance = parseFloat(document.getElementById('modalUserBalance').value) || 0;
    const newUser = window.BankStore.addUser({
      name, email, phone, role, status, totalBalance: balance
    });
    showToast('User Created', `Successfully onboarded new account for ${name} (ID: ${newUser.id}).`, 'success');
  }

  closeModal('userModal');
  renderAdminUsersTable();
  renderAdminMetrics();
}

function toggleUserStatus(userId) {
  const db = window.BankStore.get();
  const user = db.users.find(u => u.id === userId);
  if (!user) return;

  const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
  window.BankStore.updateUser(userId, { status: nextStatus });
  showToast('Status Updated', `User ${user.name} marked as ${nextStatus}.`, 'info');
  renderAdminUsersTable();
}

function deleteUserRecord(userId) {
  if (confirm(`Are you sure you want to permanently delete user record ${userId}?`)) {
    window.BankStore.deleteUser(userId);
    showToast('User Deleted', `Account ${userId} removed from core database.`, 'success');
    renderAdminUsersTable();
    renderAdminMetrics();
  }
}

/**
 * Admin Transaction Monitoring
 */
function renderAdminTransactionsTable() {
  const db = window.BankStore.get();
  const table = document.getElementById('adminTxTableBody');
  const search = document.getElementById('adminTxSearch')?.value.toLowerCase().trim() || '';
  const channelFilter = document.getElementById('adminTxChannelFilter')?.value || 'ALL';
  const statusFilter = document.getElementById('adminTxStatusFilter')?.value || 'ALL';

  let list = [...db.transactions];

  if (search) {
    list = list.filter(tx => 
      tx.id.toLowerCase().includes(search) ||
      tx.senderName.toLowerCase().includes(search) ||
      tx.recipientName.toLowerCase().includes(search) ||
      (tx.remarks && tx.remarks.toLowerCase().includes(search))
    );
  }

  if (channelFilter !== 'ALL') {
    list = list.filter(tx => tx.channel === channelFilter);
  }

  if (statusFilter !== 'ALL') {
    list = list.filter(tx => tx.status === statusFilter);
  }

  table.innerHTML = '';

  list.forEach(tx => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 700;">${tx.id}</td>
      <td style="font-size: 0.82rem; color: var(--text-muted);">${tx.timestamp}</td>
      <td><strong>${tx.senderName}</strong></td>
      <td>${tx.recipientName}</td>
      <td><span class="badge" style="background: #f1f5f9;">${tx.channel || tx.type}</span></td>
      <td><span class="badge badge-completed">${tx.status}</span></td>
      <td style="text-align: right; font-weight: 700; color: ${tx.flow === 'debit' ? 'var(--danger)' : 'var(--success)'};">
        $${Number(tx.amount).toFixed(2)}
      </td>
      <td style="text-align: center;">
        <button class="btn btn-secondary btn-sm" onclick="viewTransactionReceipt('${tx.id}')">Audit Receipt</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

function filterAdminTransactions() {
  renderAdminTransactionsTable();
}

function generateTransactionAuditReport() {
  const db = window.BankStore.get();
  const totalVolume = db.transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const completedCount = db.transactions.filter(t => t.status === 'Completed').length;

  alert(`====================================================
APEXTRUST CENTRAL TRANSACTION AUDIT REPORT
====================================================
Total Monitored Transactions: ${db.transactions.length}
Total Processed Volume: $${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Execution Success Rate: 100.0% (${completedCount}/${db.transactions.length})
Flagged AML Exceptions: 0
Generated On: ${new Date().toLocaleString()}
Auditor: Aakash Kumar (Central Compliance)
====================================================`);
}

/**
 * Admin System Settings
 */
function loadAdminSystemSettings() {
  const db = window.BankStore.get();
  const s = db.systemSettings;

  document.getElementById('settingBankName').value = s.bankName;
  document.getElementById('settingBankCode').value = s.bankCode;
  document.getElementById('settingCurrency').value = s.currencySymbol;
  document.getElementById('settingDailyLimit').value = s.dailyTransferLimit;
  document.getElementById('settingTxLimit').value = s.perTransactionLimit;
  document.getElementById('settingSavingsRate').value = s.savingsInterestRate;
  document.getElementById('settingLoanRate').value = s.loanBaseInterestRate;
  document.getElementById('settingSystemNotice').value = s.systemNotice;
  document.getElementById('settingMaintenanceMode').checked = !!s.maintenanceMode;
  document.getElementById('settingTwoFactorEnforced').checked = !!s.twoFactorEnforced;

  checkMaintenanceMode();
}

function handleSaveSystemSettings(event) {
  event.preventDefault();
  const newSettings = {
    bankName: document.getElementById('settingBankName').value.trim(),
    bankCode: document.getElementById('settingBankCode').value.trim(),
    currencySymbol: document.getElementById('settingCurrency').value,
    dailyTransferLimit: parseFloat(document.getElementById('settingDailyLimit').value),
    perTransactionLimit: parseFloat(document.getElementById('settingTxLimit').value),
    savingsInterestRate: parseFloat(document.getElementById('settingSavingsRate').value),
    loanBaseInterestRate: parseFloat(document.getElementById('settingLoanRate').value),
    systemNotice: document.getElementById('settingSystemNotice').value.trim(),
    maintenanceMode: document.getElementById('settingMaintenanceMode').checked,
    twoFactorEnforced: document.getElementById('settingTwoFactorEnforced').checked
  };

  window.BankStore.updateSettings(newSettings);
  updateHeaderUserInfo();
  checkMaintenanceMode();
  showToast('Settings Saved', 'System configurations updated and synchronized network-wide.', 'success');
}

function checkMaintenanceMode() {
  const db = window.BankStore.get();
  const alertBox = document.getElementById('maintenanceAlert');
  if (db.systemSettings.maintenanceMode) {
    alertBox.style.display = 'flex';
  } else {
    alertBox.style.display = 'none';
  }
}

function runSecurityAuditDiagnostic() {
  showToast('Diagnostic Started', 'Inspecting encryption handshakes and load balancer clusters...', 'info');
  setTimeout(() => {
    showToast('Audit Passed', 'All 12 microservices passed cryptographic health verification.', 'success');
  }, 1000);
}

function refreshAdminMetrics() {
  renderAdminMetrics();
  initOrUpdateCharts();
  showToast('Telemetry Synchronized', 'Operational metrics updated in real time.', 'info');
}

/**
 * Chart.js Integration
 */
function initOrUpdateCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not yet loaded, rendering fallback.');
    return;
  }

  const db = window.BankStore.get();
  const ctxVolume = document.getElementById('chartTxVolume');
  const ctxDist = document.getElementById('chartAccountDistribution');

  if (!ctxVolume || !ctxDist) return;

  // Chart 1: Volume
  if (chartTxVolumeInstance) {
    chartTxVolumeInstance.destroy();
  }

  chartTxVolumeInstance = new Chart(ctxVolume, {
    type: 'line',
    data: {
      labels: db.operationalMetrics.monthlyChartData.labels,
      datasets: [{
        label: 'Transaction Volume ($M)',
        data: db.operationalMetrics.monthlyChartData.volume,
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: '#f1f5f9' },
          ticks: { callback: val => `$${val}M` }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  // Chart 2: Account Distribution
  if (chartAccountDistInstance) {
    chartAccountDistInstance.destroy();
  }

  chartAccountDistInstance = new Chart(ctxDist, {
    type: 'doughnut',
    data: {
      labels: ['Checking Accounts', 'High-Yield Savings', 'Fixed Deposits & Wealth'],
      datasets: [{
        data: [55, 30, 15],
        backgroundColor: ['#1e3a8a', '#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 11 } }
        }
      },
      cutout: '68%'
    }
  });
}

/**
 * User Persona Login Switcher
 */
function openLoginModal() {
  openModal('loginModal');
}

function loginAsPreset(role, userId) {
  closeModal('loginModal');
  const db = window.BankStore.get();
  const user = db.users.find(u => u.id === userId);
  if (user) {
    db.currentUser = { ...user, accountNumber: '1029384756' };
    window.BankStore.save(db);
  }
  switchRole(role);
}

function resetDatabaseDemo() {
  if (confirm('Reset all transaction records and user accounts to initial demo seed state?')) {
    window.BankStore.resetToDefault();
    initApp();
    showToast('Reset Complete', 'Database has been restored to clean demo state.', 'success');
  }
}

function showTerms() {
  alert('ApexTrust Banking Core Security Notice: Encrypted with 256-bit TLS v1.3. For GUVI Geek Network evaluation.');
}

/**
 * Modal & Toast Helpers
 */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
