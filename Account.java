package com.apextrust.bank.model;

/**
 * Represents a Customer Bank Account (Checking, Savings, Investment).
 */
public class Account {
    private String id;
    private String userId;
    private String accountNumber;
    private String type; // "Checking", "Savings", "Investment"
    private String title;
    private double balance;
    private String currency;
    private String status;
    private double apy;

    public Account() {}

    public Account(String id, String userId, String accountNumber, String type, String title, double balance, String currency, String status, double apy) {
        this.id = id;
        this.userId = userId;
        this.accountNumber = accountNumber;
        this.type = type;
        this.title = title;
        this.balance = balance;
        this.currency = currency;
        this.status = status;
        this.apy = apy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public double getApy() { return apy; }
    public void setApy(double apy) { this.apy = apy; }

    public synchronized void credit(double amount) {
        this.balance += amount;
    }

    public synchronized boolean debit(double amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    @Override
    public String toString() {
        return String.format("Account[Num=%s, Type=%s, Balance=%s%.2f, Status=%s]", accountNumber, type, currency, balance, status);
    }
}
