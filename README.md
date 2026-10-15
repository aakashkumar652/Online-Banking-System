# ApexTrust Online Banking System 🏦

> **Capstone Project Specification**  
> *"The objective is to create an online banking system where customers can manage their accounts, perform transactions, and access banking services, while administrators manage the overall system. Each user type will have a dedicated dashboard to manage their banking activities."*  
> © 2024 GUVI Geek Network Pvt. Ltd. All rights reserved.

---

## 🌟 Executive Summary

**ApexTrust Online Banking System** is an enterprise-grade digital banking platform designed for commercial and retail banking operations. It provides a dual-dashboard architecture:
1. **Customer Dashboard**: Empowers retail clients to manage multi-tier deposit accounts (Checking, Savings, Fixed Deposits), perform instantaneous authenticated fund transfers, calculate and apply for loans/investments, and update security and profile credentials.
2. **Administrator Control Panel**: Equips bank administrators with centralized user lifecycle management (CRUD), real-time transaction monitoring and auditing, global policy and risk parameter configurations, and live operational telemetry charts.

---

## 🏗️ Architecture & Project Structure

The project has been architected with dual delivery models:
1. **Instant Interactive Web Application**: Fully responsive HTML5, modern fintech CSS3, and JavaScript Single Page Application (SPA) with persistent `localStorage` database and Chart.js analytics. Runs instantly in any web browser without server setup.
2. **Enterprise Java Core Engine**: Maven-managed Java architecture (`Java 17`) with Domain Models, DAO abstractions, Service Layer, and relational SQL database schema (`schema.sql` and `data.sql`).

```
Java Project/
├── index.html                      # Main Interactive Web Portal
├── css/
│   └── styles.css                  # Modern Fintech Design System
├── js/
│   ├── data.js                     # Persistence Layer & Initial Seed Database (LocalStorage)
│   └── app.js                      # UI Controller, Routing, Modals, Calculators & Charts
├── pom.xml                         # Maven Configuration for Java Engine
├── src/
│   ├── main/
│   │   ├── java/com/apextrust/bank/
│   │   │   ├── MainApplication.java              # Java Entry Point Demonstrating Workflows
│   │   │   ├── model/
│   │   │   │   ├── User.java                     # User Model (Admin & Customer)
│   │   │   │   ├── Account.java                  # Checking, Savings, Investment Accounts
│   │   │   │   ├── Transaction.java              # Financial Transaction Entity
│   │   │   │   ├── LoanApplication.java          # Loan & Term Deposit Service Model
│   │   │   │   └── SystemSettings.java           # Bank-wide Configuration Parameters
│   │   │   ├── dao/
│   │   │   │   └── BankDAO.java                  # Thread-Safe Data Access Layer
│   │   │   └── service/
│   │   │       └── BankingService.java           # Business Logic for Admin & Customer
│   │   └── resources/
│   │       ├── schema.sql                        # Relational DDL (MySQL / PostgreSQL / H2)
│   │       └── data.sql                          # Production-ready Initial Seed Inserts
└── README.md                       # Project Documentation
```

---

## 👥 User Types & Functionality Matrix

### 1. 🛡️ Administrator Portal

| Module | Input | Output | Core Functionality |
| :--- | :--- | :--- | :--- |
| **User Management** | User details (name, email, role, phone, initial balance, status) | Real-time toast & banner confirmation messages | Full CRUD: Onboard new customers/admins, edit details, toggle active/suspended status, and delete records. |
| **Transaction Monitoring** | Search filters (TXN ID, name, date, payment channel, status) | Central Transaction Audit Report & Printable Receipts | Monitor bank-wide transaction flows, inspect metadata, flag AML limits, and generate audit summaries. |
| **System Settings** | Configuration parameters (bank name, transfer caps, interest rates, maintenance mode, 2FA) | Confirmation alert for synchronized system settings | Adjust daily limits, set benchmark loan and savings interest rates, trigger maintenance mode lock, and enforce 2FA. |
| **Operational Metrics** | System telemetry feed | Dynamic Chart.js visualizations & resource cards | Real-time charts of monthly transaction volume ($ Millions), account portfolio breakdown, 99.98% uptime, and API latency. |

### 2. 👤 Customer Portal

| Module | Input | Output | Core Functionality |
| :--- | :--- | :--- | :--- |
| **Account Management** | Account inquiry | Comprehensive multi-account overview & virtual card | View Checking ($14,250.75), High-Yield Savings ($48,920.00), and Term Deposits ($25,000.00). Toggle virtual debit card lock and mask/unmask card numbers. |
| **Perform Transactions** | Recipient account, name, routing IFSC, amount, channel (IMPS, NEFT, RTGS), remarks | Instant Transaction Confirmation & Printable Receipt Advice | Validate available checking balance, enforce system limits, debit sender, credit recipient, record audit trail, and display official receipt. |
| **Access Banking Services** | Interactive sliders for loan amount, tenure, and APR | Live EMI calculations, loan approvals, and active applications tracker | Apply for Express Personal Loans, Home Mortgages, Open Fixed Term Deposits (FDs), or systematic SIP investments. |
| **Profile Management** | Profile details (name, email, phone, residential address, password) | Confirmation message confirming credential synchronization | Update personal contact info, change password, toggle Two-Factor Authentication (2FA), and set SMS/email alert preferences. |

---

## 🚀 How to Run the Project

### Option A: Open the Interactive Web Application (Zero Setup)
1. Navigate to the project directory:
   `c:\Users\AAKASH\OneDrive\Desktop\Java Project\`
2. Double-click **`index.html`** to open it in **Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, or any modern browser.
3. Use the **Role Switcher** bar at the very top:
   - Click **`Customer Portal`** to experience the customer account overview, perform money transfers, calculate loan EMIs, and view transaction history.
   - Click **`Admin Portal`** to view operational telemetry charts, add/edit/suspend users, monitor all transactions, and adjust system settings.
   - Click **`Reset Demo`** at any time to restore fresh mock database records.

### Option B: Run the Java Engine
1. Ensure Java Development Kit (JDK 17+) is installed.
2. Open a terminal in the project directory:
   ```bash
   cd "c:\Users\AAKASH\OneDrive\Desktop\Java Project"
   ```
3. Compile and execute `MainApplication`:
   ```bash
   # Using standard Java Compiler:
   javac -d bin src/main/java/com/apextrust/bank/model/*.java src/main/java/com/apextrust/bank/dao/*.java src/main/java/com/apextrust/bank/service/*.java src/main/java/com/apextrust/bank/MainApplication.java
   java -cp bin com.apextrust.bank.MainApplication

   # Or using Maven:
   mvn clean compile exec:java -Dexec.mainClass="com.apextrust.bank.MainApplication"
   ```

---

## 📋 Pre-Configured Demo Personas

- **Customer Persona**:
  - Name: **Aakash Sharma**
  - Customer ID: `CUST-1001`
  - Checking Account: `1029384756` (Balance: `$14,250.75`)
  - Savings Account: `1029384799` (Balance: `$48,920.00`)
- **Administrator Persona**:
  - Name: **Sarah Connor**
  - Admin ID: `ADMIN-001`
  - Department: Central IT & Security HQ

---

## 🔒 Security & Compliance Standards
- **Cryptographic Encryption**: 256-bit SSL/TLS protocol simulation.
- **ACID Transaction Guarantees**: Thread-safe debit/credit operations with balance sufficiency checks.
- **Maintenance Guard**: When Maintenance Mode is activated in Admin Settings, customer fund transfers are safely held and prohibited.
- **Audit Logging**: Every transaction and administrative action generates an immutable audit record.
