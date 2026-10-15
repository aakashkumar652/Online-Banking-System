package com.apextrust.bank.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Represents a Financial Transaction in the Online Banking System.
 */
public class Transaction {
    private String id;
    private String timestamp;
    private String sourceAccount;
    private String senderName;
    private String recipientName;
    private String recipientAccount;
    private String type; // "Transfer", "Deposit", "Card Purchase", etc.
    private String category;
    private double amount;
    private String flow; // "debit" or "credit"
    private String status; // "Completed", "Pending", "Failed"
    private String remarks;
    private String channel; // "Web Banking", "IMPS", "NEFT", "RTGS"

    public Transaction() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public Transaction(String id, String sourceAccount, String senderName, String recipientName,
                       String recipientAccount, String type, String category, double amount,
                       String flow, String status, String remarks, String channel) {
        this.id = id;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.sourceAccount = sourceAccount;
        this.senderName = senderName;
        this.recipientName = recipientName;
        this.recipientAccount = recipientAccount;
        this.type = type;
        this.category = category;
        this.amount = amount;
        this.flow = flow;
        this.status = status;
        this.remarks = remarks;
        this.channel = channel;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getSourceAccount() { return sourceAccount; }
    public void setSourceAccount(String sourceAccount) { this.sourceAccount = sourceAccount; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientAccount() { return recipientAccount; }
    public void setRecipientAccount(String recipientAccount) { this.recipientAccount = recipientAccount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getFlow() { return flow; }
    public void setFlow(String flow) { this.flow = flow; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    @Override
    public String toString() {
        return String.format("Transaction[%s: %s -> %s, Amount=$%.2f, Status=%s]", id, senderName, recipientName, amount, status);
    }
}
