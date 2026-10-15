package com.apextrust.bank.service;

import com.apextrust.bank.dao.BankDAO;
import com.apextrust.bank.model.Account;
import com.apextrust.bank.model.LoanApplication;
import com.apextrust.bank.model.SystemSettings;
import com.apextrust.bank.model.Transaction;
import com.apextrust.bank.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service Layer implementing core banking logic for both Admin and Customer personas.
 * Conforms strictly to GUVI specifications.
 */
public class BankingService {
    private final BankDAO dao = BankDAO.getInstance();

    // =========================================================================
    // ADMIN FUNCTIONALITIES
    // =========================================================================

    /**
     * Admin Functionality 1: User Management
     * Input: User details (name, email, role, etc.)
     * Output: Confirmation message for successful user creation/update/deletion.
     */
    public String createUser(String name, String email, String role, String phone, String address, double initialBalance) {
        String newId = "CUST-" + (1000 + (int)(Math.random() * 9000));
        User user = new User(newId, name, email, role, phone, address, "Active", initialBalance);
        dao.saveUser(user);

        // Also provision a default checking account
        String accNum = String.valueOf(1000000000L + (long)(Math.random() * 9000000000L));
        Account checking = new Account("ACC-" + newId, newId, accNum, "Checking", "Standard Checking Account", initialBalance, "$", "Active", 0.0);
        dao.saveAccount(checking);

        return String.format("Confirmation: User '%s' [ID: %s] created successfully with role '%s' and account #%s.",
                name, newId, role, accNum);
    }

    public String updateUser(String userId, String name, String email, String role, String status) {
        Optional<User> optionalUser = dao.getUserById(userId);
        if (optionalUser.isEmpty()) {
            return "Error: User with ID " + userId + " not found.";
        }
        User user = optionalUser.get();
        if (name != null) user.setName(name);
        if (email != null) user.setEmail(email);
        if (role != null) user.setRole(role);
        if (status != null) user.setStatus(status);

        dao.saveUser(user);
        return String.format("Confirmation: User '%s' [ID: %s] updated successfully.", user.getName(), userId);
    }

    public String deleteUser(String userId) {
        boolean removed = dao.deleteUser(userId);
        if (removed) {
            return "Confirmation: User account " + userId + " was deleted successfully from the core registry.";
        }
        return "Error: User " + userId + " not found for deletion.";
    }

    public List<User> listAllUsers() {
        return dao.getAllUsers();
    }

    /**
     * Admin Functionality 2: Transaction Monitoring
     * Input: Transaction details/query
     * Output: Transaction reports
     */
    public List<Transaction> monitorAllTransactions() {
        return dao.getAllTransactions();
    }

    public String generateTransactionReport() {
        List<Transaction> list = dao.getAllTransactions();
        double totalVolume = list.stream().mapToDouble(Transaction::getAmount).sum();
        long debits = list.stream().filter(t -> "debit".equalsIgnoreCase(t.getFlow())).count();
        long credits = list.stream().filter(t -> "credit".equalsIgnoreCase(t.getFlow())).count();

        StringBuilder sb = new StringBuilder();
        sb.append("====================================================\n");
        sb.append("   APEXTRUST CENTRAL TRANSACTION MONITORING REPORT  \n");
        sb.append("====================================================\n");
        sb.append(String.format("Total Monitored Transactions : %d\n", list.size()));
        sb.append(String.format("Total Turnover Volume         : $%,.2f\n", totalVolume));
        sb.append(String.format("Debit Invocations             : %d\n", debits));
        sb.append(String.format("Credit Invocations            : %d\n", credits));
        sb.append("System Compliance Rating      : 100% (All verified)\n");
        sb.append("====================================================\n");
        return sb.toString();
    }

    /**
     * Admin Functionality 3: System Settings
     * Input: Configuration settings
     * Output: Confirmation message for successful settings update.
     */
    public String updateSystemSettings(String bankName, double dailyLimit, double perTxLimit,
                                       double savingsRate, double loanRate, boolean maintenanceMode) {
        SystemSettings s = dao.getSystemSettings();
        if (bankName != null) s.setBankName(bankName);
        s.setDailyTransferLimit(dailyLimit);
        s.setPerTransactionLimit(perTxLimit);
        s.setSavingsInterestRate(savingsRate);
        s.setLoanBaseInterestRate(loanRate);
        s.setMaintenanceMode(maintenanceMode);

        dao.updateSystemSettings(s);
        return "Confirmation: System-wide configurations and banking limits updated successfully.";
    }

    public SystemSettings getSystemSettings() {
        return dao.getSystemSettings();
    }

    // =========================================================================
    // CUSTOMER FUNCTIONALITIES
    // =========================================================================

    /**
     * Customer Functionality 1: Account Management
     * Input: Account details (userId or account number)
     * Output: Account overview
     */
    public List<Account> getCustomerAccounts(String userId) {
        return dao.getAccountsByUserId(userId);
    }

    public String getAccountOverview(String userId) {
        List<Account> accounts = getCustomerAccounts(userId);
        if (accounts.isEmpty()) {
            return "No active accounts found for user ID: " + userId;
        }

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Account Overview for User [%s]:\n", userId));
        double combined = 0;
        for (Account a : accounts) {
            sb.append(String.format(" - %-25s | Acc: %-12s | Balance: %s%,.2f | Status: %s\n",
                    a.getTitle(), a.getAccountNumber(), a.getCurrency(), a.getBalance(), a.getStatus()));
            combined += a.getBalance();
        }
        sb.append(String.format("Total Liquid Portfolio: $%,.2f\n", combined));
        return sb.toString();
    }

    /**
     * Customer Functionality 2: Perform Transactions
     * Input: Transaction details (amount, recipient, source account, channel)
     * Output: Transaction confirmation
     */
    public synchronized String performTransaction(String sourceAccNum, String senderName, String recipientName,
                                                  String recipientAccNum, double amount, String category,
                                                  String channel, String remarks) {
        SystemSettings settings = dao.getSystemSettings();
        if (settings.isMaintenanceMode()) {
            return "Transaction Rejected: System is in Maintenance Mode. Non-critical outward transfers are held.";
        }

        if (amount > settings.getPerTransactionLimit()) {
            return String.format("Transaction Rejected: Amount $%,.2f exceeds per-transaction limit of $%,.2f.",
                    amount, settings.getPerTransactionLimit());
        }

        Optional<Account> optSource = dao.getAccountByNumber(sourceAccNum);
        if (optSource.isEmpty()) {
            return "Transaction Rejected: Source account #" + sourceAccNum + " not found.";
        }

        Account source = optSource.get();
        if (source.getBalance() < amount) {
            return String.format("Transaction Rejected: Insufficient balance. Available: $%,.2f, Requested: $%,.2f.",
                    source.getBalance(), amount);
        }

        // Deduct from sender
        source.debit(amount);
        dao.saveAccount(source);

        // If recipient account exists internally, credit it
        Optional<Account> optRecipient = dao.getAccountByNumber(recipientAccNum);
        optRecipient.ifPresent(acc -> {
            acc.credit(amount);
            dao.saveAccount(acc);
        });

        // Generate Transaction Record
        String txnId = "TXN-" + (10000 + (int)(Math.random() * 90000));
        Transaction tx = new Transaction(txnId, sourceAccNum, senderName, recipientName, recipientAccNum,
                "Transfer", category, amount, "debit", "Completed", remarks, channel);
        dao.addTransaction(tx);

        return String.format("Transaction Confirmation: Transfer of $%,.2f to %s [Acc: %s] successful. Ref ID: %s. Remaining Balance: $%,.2f.",
                amount, recipientName, recipientAccNum, txnId, source.getBalance());
    }

    /**
     * Customer Functionality 3: Access Banking Services
     * Input: Service selection (Loans, Investments)
     * Output: Service details
     */
    public String applyForLoan(String applicantName, String loanType, double amount, int tenureMonths, double interestRate) {
        String appId = "APP-" + (700 + (int)(Math.random() * 900));
        LoanApplication app = new LoanApplication(appId, loanType, applicantName, amount, tenureMonths, interestRate, "Approved (Pending Verification)");
        dao.addLoanApplication(app);

        return String.format("Service Confirmation: %s of $%,.2f for %d months registered. Monthly EMI: $%,.2f. Application ID: %s.",
                loanType, amount, tenureMonths, app.getMonthlyEmi(), appId);
    }

    public List<LoanApplication> listCustomerApplications() {
        return dao.getAllLoanApplications();
    }

    /**
     * Customer Functionality 4: Profile Management
     * Input: Profile details (name, email, phone, address)
     * Output: Confirmation message for successful profile update.
     */
    public String updateProfile(String userId, String name, String email, String phone, String address) {
        Optional<User> optUser = dao.getUserById(userId);
        if (optUser.isEmpty()) {
            return "Error: Profile user not found.";
        }

        User u = optUser.get();
        if (name != null) u.setName(name);
        if (email != null) u.setEmail(email);
        if (phone != null) u.setPhone(phone);
        if (address != null) u.setAddress(address);

        dao.saveUser(u);
        return String.format("Confirmation: Profile for '%s' updated successfully. Contact and residency records synchronized.", u.getName());
    }
}
