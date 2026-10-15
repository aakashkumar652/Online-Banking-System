package com.apextrust.bank.dao;

import com.apextrust.bank.model.Account;
import com.apextrust.bank.model.LoanApplication;
import com.apextrust.bank.model.SystemSettings;
import com.apextrust.bank.model.Transaction;
import com.apextrust.bank.model.User;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe Data Access Object providing CRUD operations
 * for Users, Accounts, Transactions, Applications, and Settings.
 */
public class BankDAO {
    private static final BankDAO INSTANCE = new BankDAO();

    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, Account> accounts = new ConcurrentHashMap<>();
    private final List<Transaction> transactions = Collections.synchronizedList(new ArrayList<>());
    private final List<LoanApplication> loanApplications = Collections.synchronizedList(new ArrayList<>());
    private SystemSettings systemSettings = new SystemSettings();

    private BankDAO() {
        seedInitialData();
    }

    public static BankDAO getInstance() {
        return INSTANCE;
    }

    private void seedInitialData() {
        // Seed Users
        User admin = new User("ADMIN-001", "Sarah Connor", "admin.sarah@apextrust.com", "admin", "+1 555-019-2834", "IT HQ Suite 400", "Active", 0);
        User customer1 = new User("CUST-1001", "Aakash Sharma", "aakash.sharma@example.com", "customer", "+91 98765 43210", "42 Tech Park, Bengaluru", "Active", 88170.75);
        User customer2 = new User("CUST-1002", "Elena Rostova", "elena.rostova@techmail.io", "customer", "+1 555-723-9941", "12 Sunset Blvd, Los Angeles", "Active", 32400.50);
        User customer3 = new User("CUST-1003", "David K. Miller", "david.miller@apexclient.com", "customer", "+1 555-482-1102", "7 Wall Street, New York", "Active", 67800.20);

        users.put(admin.getId(), admin);
        users.put(customer1.getId(), customer1);
        users.put(customer2.getId(), customer2);
        users.put(customer3.getId(), customer3);

        // Seed Accounts for customer1
        Account accChecking = new Account("ACC-01", "CUST-1001", "1029384756", "Checking", "Apex Privilege Checking", 14250.75, "$", "Active", 0.0);
        Account accSavings = new Account("ACC-02", "CUST-1001", "1029384799", "Savings", "High-Yield Wealth Growth", 48920.00, "$", "Active", 4.25);
        Account accInvestment = new Account("ACC-03", "CUST-1001", "1029384910", "Investment", "Fixed Growth Deposit", 25000.00, "$", "Active", 7.10);

        accounts.put(accChecking.getAccountNumber(), accChecking);
        accounts.put(accSavings.getAccountNumber(), accSavings);
        accounts.put(accInvestment.getAccountNumber(), accInvestment);

        // Seed Transactions
        transactions.add(new Transaction("TXN-90481", "1029384756", "Aakash Sharma", "Cloud Hosting Inc", "9928172635", "Transfer", "Bills & Utilities", 149.99, "debit", "Completed", "Monthly Cloud Server Hosting", "Web Banking"));
        transactions.add(new Transaction("TXN-90480", "1029384756", "Aakash Sharma", "David K. Miller", "5544332211", "Transfer", "P2P Transfer", 750.00, "debit", "Completed", "Project Consultation Advance", "IMPS Fast Transfer"));
        transactions.add(new Transaction("TXN-90479", "1029384756", "Apex Capital Payroll", "Aakash Sharma", "1029384756", "Deposit", "Salary & Income", 6200.00, "credit", "Completed", "Monthly Remuneration", "ACH Direct Deposit"));

        // Seed Loans
        loanApplications.add(new LoanApplication("APP-701", "Personal Loan", "Aakash Sharma", 15000, 36, 8.99, "Approved (Pending Signature)"));
    }

    // User Operations
    public List<User> getAllUsers() { return new ArrayList<>(users.values()); }
    public Optional<User> getUserById(String id) { return Optional.ofNullable(users.get(id)); }
    public void saveUser(User user) { users.put(user.getId(), user); }
    public boolean deleteUser(String id) { return users.remove(id) != null; }

    // Account Operations
    public Optional<Account> getAccountByNumber(String accNum) { return Optional.ofNullable(accounts.get(accNum)); }
    public List<Account> getAccountsByUserId(String userId) {
        List<Account> list = new ArrayList<>();
        for (Account a : accounts.values()) {
            if (a.getUserId().equals(userId)) list.add(a);
        }
        return list;
    }
    public void saveAccount(Account account) { accounts.put(account.getAccountNumber(), account); }

    // Transaction Operations
    public List<Transaction> getAllTransactions() { return new ArrayList<>(transactions); }
    public void addTransaction(Transaction tx) { transactions.add(0, tx); }

    // Loan Application Operations
    public List<LoanApplication> getAllLoanApplications() { return new ArrayList<>(loanApplications); }
    public void addLoanApplication(LoanApplication app) { loanApplications.add(0, app); }

    // System Settings Operations
    public SystemSettings getSystemSettings() { return systemSettings; }
    public void updateSystemSettings(SystemSettings settings) { this.systemSettings = settings; }
}
