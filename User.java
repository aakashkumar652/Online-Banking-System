package com.apextrust.bank.model;

import java.time.LocalDate;

/**
 * Represents a Banking System User (Customer or Administrator).
 */
public class User {
    private String id;
    private String name;
    private String email;
    private String role; // "admin" or "customer"
    private String phone;
    private String address;
    private String status; // "Active" or "Suspended"
    private LocalDate createdDate;
    private double totalBalance;
    private boolean twoFactorEnabled;

    public User() {}

    public User(String id, String name, String email, String role, String phone, String address, String status, double totalBalance) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.address = address;
        this.status = status;
        this.createdDate = LocalDate.now();
        this.totalBalance = totalBalance;
        this.twoFactorEnabled = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }

    public double getTotalBalance() { return totalBalance; }
    public void setTotalBalance(double totalBalance) { this.totalBalance = totalBalance; }

    public boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }

    @Override
    public String toString() {
        return String.format("User[ID=%s, Name=%s, Role=%s, Status=%s, Balance=$%.2f]", id, name, role, status, totalBalance);
    }
}
