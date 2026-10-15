package com.apextrust.bank;

import com.apextrust.bank.model.Account;
import com.apextrust.bank.model.LoanApplication;
import com.apextrust.bank.model.Transaction;
import com.apextrust.bank.model.User;
import com.apextrust.bank.service.BankingService;

import java.util.List;

/**
 * Main Entry Point for ApexTrust Online Banking System (Java Engine).
 * Demonstrates both Administrator and Customer workflows according to GUVI specifications.
 */
public class MainApplication {

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("            APEXTRUST COMMERCIAL BANK - CORE SYSTEM v4.12             ");
        System.out.println("======================================================================\n");

        BankingService bankService = new BankingService();

        // --------------------------------------------------------------------
        // DEMONSTRATION 1: CUSTOMER FUNCTIONALITIES
        // --------------------------------------------------------------------
        System.out.println(">>> 1. CUSTOMER PORTAL DEMONSTRATION");
        System.out.println("Customer User: Aakash Sharma [CUST-1001]\n");

        // Customer Feature 1: Account Management
        System.out.println("[Feature 1: Account Management]");
        String overview = bankService.getAccountOverview("CUST-1001");
        System.out.println(overview);

        // Customer Feature 2: Perform Transactions
        System.out.println("[Feature 2: Perform Transactions]");
        String txConfirmation = bankService.performTransaction(
                "1029384756",
                "Aakash Sharma",
                "David K. Miller",
                "5544332211",
                850.00,
                "Consultancy",
                "IMPS Fast Transfer",
                "Q4 Advisory Advance Settlement"
        );
        System.out.println(txConfirmation + "\n");

        // Customer Feature 3: Access Banking Services
        System.out.println("[Feature 3: Access Banking Services - Loan Application]");
        String loanConfirmation = bankService.applyForLoan(
                "Aakash Sharma",
                "Express Personal Loan",
                25000.00,
                36,
                8.99
        );
        System.out.println(loanConfirmation + "\n");

        // Customer Feature 4: Profile Management
        System.out.println("[Feature 4: Profile Management]");
        String profileConfirmation = bankService.updateProfile(
                "CUST-1001",
                "Aakash Sharma",
                "aakash.sharma@apextrust.com",
                "+91 98765 43210",
                "42 Tech Park Avenue, Cyber City, Bengaluru, 560100"
        );
        System.out.println(profileConfirmation + "\n");

        // --------------------------------------------------------------------
        // DEMONSTRATION 2: ADMINISTRATOR FUNCTIONALITIES
        // --------------------------------------------------------------------
        System.out.println("----------------------------------------------------------------------");
        System.out.println(">>> 2. ADMINISTRATOR CONTROL PANEL DEMONSTRATION");
        System.out.println("Admin User: Sarah Connor [ADMIN-001]\n");

        // Admin Feature 1: User Management
        System.out.println("[Feature 1: User Management]");
        String createUserMsg = bankService.createUser(
                "Vikram Malhotra",
                "vikram.m@fintech.in",
                "customer",
                "+91 99887 76655",
                "18 Marina Drive, Mumbai",
                12500.00
        );
        System.out.println(createUserMsg);

        System.out.println("\nCurrent Registered Users in System:");
        for (User u : bankService.listAllUsers()) {
            System.out.printf("  - %-12s | %-22s | Role: %-9s | Status: %-9s | Balance: $%,.2f\n",
                    u.getId(), u.getName(), u.getRole(), u.getStatus(), u.getTotalBalance());
        }
        System.out.println();

        // Admin Feature 2: Transaction Monitoring
        System.out.println("[Feature 2: Transaction Monitoring & Auditing]");
        String report = bankService.generateTransactionReport();
        System.out.println(report);

        System.out.println("Recent Central Transaction Log:");
        List<Transaction> transactions = bankService.monitorAllTransactions();
        for (int i = 0; i < Math.min(4, transactions.size()); i++) {
            Transaction t = transactions.get(i);
            System.out.printf("  - [%s] %-12s | %-16s -> %-18s | Amount: $%,.2f | Status: %s\n",
                    t.getTimestamp(), t.getId(), t.getSenderName(), t.getRecipientName(), t.getAmount(), t.getStatus());
        }
        System.out.println();

        // Admin Feature 3: System Settings
        System.out.println("[Feature 3: System Settings]");
        String settingsMsg = bankService.updateSystemSettings(
                "ApexTrust Global Bank Inc.",
                60000.00,
                20000.00,
                4.50,
                8.25,
                false
        );
        System.out.println(settingsMsg);
        System.out.printf("Current Bank Name: %s | Max Tx Cap: $%,.2f | Benchmark Loan Rate: %.2f%%\n",
                bankService.getSystemSettings().getBankName(),
                bankService.getSystemSettings().getPerTransactionLimit(),
                bankService.getSystemSettings().getLoanBaseInterestRate());

        System.out.println("\n======================================================================");
        System.out.println("  ONLINE BANKING SYSTEM IS RUNNING AND SYNCHRONIZED. READY FOR WEB!   ");
        System.out.println("  Open 'index.html' in your browser to interact with the visual UI.   ");
        System.out.println("======================================================================");
    }
}
