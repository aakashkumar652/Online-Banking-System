/**
 * Online Banking System - Data Model & Persistence Layer
 * ApexTrust Online Banking System
 * Stores initial seed data and handles LocalStorage synchronization.
 */

const STORAGE_KEY = 'apextrust_banking_db_v2';

// Initial Seed Data
const initialDatabase = {
  currentUser: {
    id: 'CUST-1001',
    name: 'Harshit Malik',
    email: 'harshit.malik@example.com',
    role: 'customer',
    phone: '+91 98765 43210',
    address: '42 Tech Park Avenue, Bengaluru, Karnataka, 560100',
    accountNumber: '1029384756',
    ifsc: 'APEX000452',
    joinDate: '2023-01-15',
    twoFactorEnabled: true,
    notificationPrefs: {
      email: true,
      sms: true,
      promotions: false
    }
  },
  
  accounts: [
    {
      id: 'ACC-01',
      userId: 'CUST-1001',
      accountNumber: '1029384756',
      type: 'Checking',
      title: 'Apex Privilege Checking',
      balance: 14250.75,
      currency: '$',
      status: 'Active',
      routingNumber: '021000021',
      cardDetails: {
        cardNumber: '4532 •••• •••• 8821',
        cardHolder: 'HARSHIT MALIK',
        expiry: '08/28',
        cvv: '342',
        isLocked: false
      }
    },
    {
      id: 'ACC-02',
      userId: 'CUST-1001',
      accountNumber: '1029384799',
      type: 'Savings',
      title: 'High-Yield Wealth Growth',
      balance: 48920.00,
      currency: '$',
      status: 'Active',
      apy: 4.25,
      interestEarnedYTD: 1420.50
    },
    {
      id: 'ACC-03',
      userId: 'CUST-1001',
      accountNumber: '1029384910',
      type: 'Investment',
      title: 'Fixed Growth Deposit',
      balance: 25000.00,
      currency: '$',
      status: 'Active',
      maturityDate: '2027-04-12',
      rate: 7.10
    }
  ],

  users: [
    {
      id: 'ADMIN-001',
      name: 'Aakash Kumar',
      email: 'aakash.kumar@apextrust.com',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      status: 'Active',
      createdDate: '2022-03-10',
      lastLogin: '2026-10-08 09:30 AM',
      department: 'Central IT & Security'
    },
    {
      id: 'CUST-1001',
      name: 'Harshit Malik',
      email: 'harshit.malik@example.com',
      role: 'customer',
      phone: '+91 98765 43210',
      status: 'Active',
      createdDate: '2023-01-15',
      lastLogin: '2026-10-08 09:55 AM',
      totalBalance: 88170.75
    },
    {
      id: 'CUST-1002',
      name: 'Elena Rostova',
      email: 'elena.rostova@techmail.io',
      role: 'customer',
      phone: '+1 (555) 723-9941',
      status: 'Active',
      createdDate: '2023-05-19',
      lastLogin: '2026-10-07 04:12 PM',
      totalBalance: 32400.50
    },
    {
      id: 'CUST-1003',
      name: 'Marcus Vance',
      email: 'm.vance@vancemedia.com',
      role: 'customer',
      phone: '+44 20 7946 0912',
      status: 'Active',
      createdDate: '2023-09-02',
      lastLogin: '2026-10-05 11:20 AM',
      totalBalance: 115000.00
    },
    {
      id: 'CUST-1004',
      name: 'Priya Narayanan',
      email: 'priya.n@consulting.org',
      role: 'customer',
      phone: '+91 94451 22890',
      status: 'Suspended',
      createdDate: '2024-02-11',
      lastLogin: '2026-09-28 01:14 PM',
      totalBalance: 4200.00
    },
    {
      id: 'CUST-1005',
      name: 'David K. Miller',
      email: 'david.miller@apexclient.com',
      role: 'customer',
      phone: '+1 (555) 482-1102',
      status: 'Active',
      createdDate: '2024-06-25',
      lastLogin: '2026-10-08 08:45 AM',
      totalBalance: 67800.20
    }
  ],

  transactions: [
    {
      id: 'TXN-90481',
      timestamp: '2026-10-08 09:42 AM',
      sourceAccount: '1029384756',
      senderName: 'Harshit Malik',
      recipientName: 'Cloud Infrastructure Hosting Inc',
      recipientAccount: '9928172635',
      type: 'Transfer',
      category: 'Bills & Utilities',
      amount: 149.99,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Monthly Cloud Server Hosting',
      channel: 'Web Banking'
    },
    {
      id: 'TXN-90480',
      timestamp: '2026-10-07 02:15 PM',
      sourceAccount: '1029384756',
      senderName: 'Harshit Malik',
      recipientName: 'David K. Miller',
      recipientAccount: '5544332211',
      type: 'Transfer',
      category: 'P2P Transfer',
      amount: 750.00,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Project Consultation Advance',
      channel: 'IMPS Fast Transfer'
    },
    {
      id: 'TXN-90479',
      timestamp: '2026-10-05 11:30 AM',
      sourceAccount: '1029384756',
      senderName: 'Apex Capital Payroll Corp',
      recipientName: 'Harshit Malik',
      recipientAccount: '1029384756',
      type: 'Deposit',
      category: 'Salary & Income',
      amount: 6200.00,
      flow: 'credit',
      status: 'Completed',
      remarks: 'Monthly Tech Consultant Remuneration',
      channel: 'ACH Direct Deposit'
    },
    {
      id: 'TXN-90478',
      timestamp: '2026-10-03 07:18 PM',
      sourceAccount: '1029384756',
      senderName: 'Harshit Malik',
      recipientName: 'Starline Superstore',
      recipientAccount: '7788990011',
      type: 'Card Purchase',
      category: 'Groceries',
      amount: 184.45,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Card swipe at POS #82',
      channel: 'Debit Card'
    },
    {
      id: 'TXN-90477',
      timestamp: '2026-10-01 04:00 PM',
      sourceAccount: '1029384799',
      senderName: 'ApexTrust Core Bank',
      recipientName: 'Harshit Malik',
      recipientAccount: '1029384799',
      type: 'Interest Credit',
      category: 'Interest Earned',
      amount: 173.25,
      flow: 'credit',
      status: 'Completed',
      remarks: 'High-Yield Savings Monthly Interest',
      channel: 'System Automation'
    },
    {
      id: 'TXN-90476',
      timestamp: '2026-09-28 10:12 AM',
      sourceAccount: '1029384756',
      senderName: 'Harshit Malik',
      recipientName: 'Elena Rostova',
      recipientAccount: '8839201944',
      type: 'Transfer',
      category: 'Transfer',
      amount: 1200.00,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Software License Share',
      channel: 'NEFT Transfer'
    },
    {
      id: 'TXN-90475',
      timestamp: '2026-09-25 03:45 PM',
      sourceAccount: '5544332211',
      senderName: 'David K. Miller',
      recipientName: 'Apex Real Estate Holdings',
      recipientAccount: '1100229988',
      type: 'Transfer',
      category: 'Mortgage / Rent',
      amount: 3400.00,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Monthly Apartment Lease',
      channel: 'RTGS High-Value'
    },
    {
      id: 'TXN-90474',
      timestamp: '2026-09-22 01:20 PM',
      sourceAccount: '8839201944',
      senderName: 'Elena Rostova',
      recipientName: 'Crypto Exchange Global',
      recipientAccount: '3344556677',
      type: 'Transfer',
      category: 'Investment',
      amount: 5000.00,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Exchange portfolio fund',
      channel: 'Web Banking'
    },
    {
      id: 'TXN-90473',
      timestamp: '2026-09-20 09:10 AM',
      sourceAccount: '9928374610',
      senderName: 'Marcus Vance',
      recipientName: 'Vance Logistics Ltd',
      recipientAccount: '6655443322',
      type: 'Transfer',
      category: 'Business',
      amount: 18500.00,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Quarterly supply vendor settlement',
      channel: 'Corporate RTGS'
    },
    {
      id: 'TXN-90472',
      timestamp: '2026-09-18 05:30 PM',
      sourceAccount: '1029384756',
      senderName: 'Harshit Malik',
      recipientName: 'Self (Transfer to Savings)',
      recipientAccount: '1029384799',
      type: 'Internal Transfer',
      category: 'Savings',
      amount: 2500.00,
      flow: 'debit',
      status: 'Completed',
      remarks: 'Monthly emergency fund savings',
      channel: 'Web Banking'
    }
  ],

  services: {
    loans: [
      {
        id: 'LN-01',
        title: 'Express Personal Loan',
        tag: 'Instant Approval',
        minAmount: 1000,
        maxAmount: 50000,
        interestRate: 8.99,
        tenureRange: '12 - 60 Months',
        description: 'Collateral-free personal financing with same-day digital disbursement.',
        features: ['Zero prepayment penalty after 12 months', 'Minimal digital paperwork', 'Flexible repayment schedules']
      },
      {
        id: 'LN-02',
        title: 'Apex Prime Home Loan',
        tag: 'Lowest APR',
        minAmount: 25000,
        maxAmount: 1000000,
        interestRate: 6.45,
        tenureRange: '60 - 360 Months',
        description: 'Competitive home financing for purchasing, constructing, or renovating your dream house.',
        features: ['Up to 85% property valuation funding', 'Tax exemption certificates available', 'Free property legal valuation']
      },
      {
        id: 'LN-03',
        title: 'EcoDrive Vehicle Auto Loan',
        tag: 'Special Green Rate',
        minAmount: 5000,
        maxAmount: 150000,
        interestRate: 5.75,
        tenureRange: '12 - 84 Months',
        description: 'Financing for electric and luxury passenger vehicles with discounted green margins.',
        features: ['0.5% concession on EVs', '100% on-road price coverage', 'On-spot dealer tie-up']
      }
    ],

    investments: [
      {
        id: 'INV-01',
        title: 'Fixed Growth Deposit (FD)',
        tag: 'Guaranteed Return',
        returnRate: '7.25% p.a.',
        minInvestment: 500,
        lockIn: '1 - 5 Years',
        description: 'Bank-guaranteed maturity yield with compounding monthly interest payouts.',
        risk: 'Zero Risk (DICGC / FDIC Insured)'
      },
      {
        id: 'INV-02',
        title: 'Apex Global Bluechip Fund',
        tag: 'High Growth',
        returnRate: '14.80% 3Y CAGR',
        minInvestment: 100,
        lockIn: 'Open Ended',
        description: 'Diversified equity basket holding top 50 technology & financial leaders.',
        risk: 'Moderate Risk'
      },
      {
        id: 'INV-03',
        title: 'Retirement Golden Sovereign',
        tag: 'Tax Saver',
        returnRate: '9.10% p.a.',
        minInvestment: 250,
        lockIn: 'Until Age 60',
        description: 'Government backed pension scheme with dual income tax deduction benefits.',
        risk: 'Low Risk'
      }
    ],

    appliedApplications: [
      {
        id: 'APP-702',
        type: 'Personal Loan',
        applicantName: 'Harshit Malik',
        amount: 15000,
        tenure: 36,
        status: 'Under Review',
        submittedDate: '2026-10-06',
        monthlyEmi: 476.92
      },
      {
        id: 'APP-701',
        type: 'Fixed Growth Deposit',
        applicantName: 'Harshit Malik',
        amount: 25000,
        tenure: 24,
        status: 'Active',
        submittedDate: '2025-04-12',
        maturityValue: 28780.00
      }
    ]
  },

  systemSettings: {
    bankName: 'ApexTrust Commercial Bank',
    bankCode: 'APEX-GLOBAL-01',
    currencySymbol: '$',
    maintenanceMode: false,
    dailyTransferLimit: 50000,
    perTransactionLimit: 15000,
    savingsInterestRate: 4.25,
    loanBaseInterestRate: 8.50,
    twoFactorEnforced: true,
    fraudDetectionThreshold: 10000,
    emailAlertsEnabled: true,
    systemNotice: 'System upgraded to CoreBanking v4.12. All services fully operational.'
  },

  operationalMetrics: {
    systemHealth: 99.98,
    activeSessions: 342,
    apiResponseTimeMs: 42,
    monthlyVolumeTotal: 4850000,
    totalAccountsManaged: 14280,
    monthlyChartData: {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      volume: [3.8, 4.1, 4.3, 4.6, 4.9, 5.2], // in Millions
      transactions: [24000, 28000, 31000, 35000, 42000, 46500]
    }
  }
};

/**
 * Storage Controller with helper methods
 */
class BankStore {
  constructor() {
    this.init();
  }

  init() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      this.save(initialDatabase);
    }
  }

  get() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(initialDatabase));
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return JSON.parse(JSON.stringify(initialDatabase));
    }
  }

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.save(initialDatabase);
    return JSON.parse(JSON.stringify(initialDatabase));
  }

  // --- Transactions ---
  addTransaction(tx) {
    const db = this.get();
    const newTx = {
      id: 'TXN-' + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      status: 'Completed',
      channel: 'Web Banking',
      ...tx
    };

    // Update account balance
    const checkingAcc = db.accounts.find(a => a.type === 'Checking');
    if (checkingAcc && tx.flow === 'debit') {
      checkingAcc.balance = Math.max(0, checkingAcc.balance - Number(tx.amount));
    } else if (checkingAcc && tx.flow === 'credit') {
      checkingAcc.balance += Number(tx.amount);
    }

    db.transactions.unshift(newTx);
    this.save(db);
    return newTx;
  }

  // --- Users ---
  addUser(user) {
    const db = this.get();
    const newUser = {
      id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      status: 'Active',
      totalBalance: 0,
      ...user
    };
    db.users.push(newUser);
    this.save(db);
    return newUser;
  }

  updateUser(id, updatedFields) {
    const db = this.get();
    const index = db.users.findIndex(u => u.id === id);
    if (index !== -1) {
      db.users[index] = { ...db.users[index], ...updatedFields };
      // Also update currentUser if it matches
      if (db.currentUser.id === id) {
        db.currentUser = { ...db.currentUser, ...updatedFields };
      }
      this.save(db);
      return db.users[index];
    }
    return null;
  }

  deleteUser(id) {
    const db = this.get();
    db.users = db.users.filter(u => u.id !== id);
    this.save(db);
    return true;
  }

  // --- Settings ---
  updateSettings(newSettings) {
    const db = this.get();
    db.systemSettings = { ...db.systemSettings, ...newSettings };
    this.save(db);
    return db.systemSettings;
  }

  // --- Services / Loan Applications ---
  submitServiceApplication(application) {
    const db = this.get();
    const newApp = {
      id: 'APP-' + Math.floor(700 + Math.random() * 900),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      ...application
    };
    if (!db.services.appliedApplications) {
      db.services.appliedApplications = [];
    }
    db.services.appliedApplications.unshift(newApp);
    this.save(db);
    return newApp;
  }

  // --- Profile ---
  updateCustomerProfile(profileData) {
    const db = this.get();
    db.currentUser = { ...db.currentUser, ...profileData };
    // sync in users list
    const userIdx = db.users.findIndex(u => u.id === db.currentUser.id);
    if (userIdx !== -1) {
      db.users[userIdx].name = profileData.name || db.users[userIdx].name;
      db.users[userIdx].email = profileData.email || db.users[userIdx].email;
      db.users[userIdx].phone = profileData.phone || db.users[userIdx].phone;
    }
    this.save(db);
    return db.currentUser;
  }
}

// Global instance
window.BankStore = new BankStore();
