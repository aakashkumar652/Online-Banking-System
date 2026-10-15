package com.apextrust.bank.model;

import java.time.LocalDate;

/**
 * Represents a Banking Service Application (Loan, Fixed Deposit).
 */
public class LoanApplication {
    private String id;
    private String type;
    private String applicantName;
    private double amount;
    private int tenureMonths;
    private double monthlyEmi;
    private double interestRate;
    private String status; // "Approved", "Under Review", "Pending Signature"
    private LocalDate applicationDate;

    public LoanApplication() {
        this.applicationDate = LocalDate.now();
    }

    public LoanApplication(String id, String type, String applicantName, double amount, int tenureMonths, double interestRate, String status) {
        this.id = id;
        this.type = type;
        this.applicantName = applicantName;
        this.amount = amount;
        this.tenureMonths = tenureMonths;
        this.interestRate = interestRate;
        this.status = status;
        this.applicationDate = LocalDate.now();
        this.monthlyEmi = calculateEmi(amount, interestRate, tenureMonths);
    }

    public static double calculateEmi(double principal, double annualRate, int tenureMonths) {
        double monthlyRate = annualRate / (12 * 100);
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
               (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public int getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(int tenureMonths) { this.tenureMonths = tenureMonths; }

    public double getMonthlyEmi() { return monthlyEmi; }
    public void setMonthlyEmi(double monthlyEmi) { this.monthlyEmi = monthlyEmi; }

    public double getInterestRate() { return interestRate; }
    public void setInterestRate(double interestRate) { this.interestRate = interestRate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDate applicationDate) { this.applicationDate = applicationDate; }
}
