package com.apextrust.bank.model;

/**
 * System Settings Configuration model.
 */
public class SystemSettings {
    private String bankName;
    private String bankCode;
    private String currencySymbol;
    private boolean maintenanceMode;
    private double dailyTransferLimit;
    private double perTransactionLimit;
    private double savingsInterestRate;
    private double loanBaseInterestRate;
    private boolean twoFactorEnforced;
    private String systemNotice;

    public SystemSettings() {
        this.bankName = "ApexTrust Commercial Bank";
        this.bankCode = "APEX-GLOBAL-01";
        this.currencySymbol = "$";
        this.maintenanceMode = false;
        this.dailyTransferLimit = 50000.00;
        this.perTransactionLimit = 15000.00;
        this.savingsInterestRate = 4.25;
        this.loanBaseInterestRate = 8.50;
        this.twoFactorEnforced = true;
        this.systemNotice = "System operational.";
    }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }

    public String getCurrencySymbol() { return currencySymbol; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }

    public boolean isMaintenanceMode() { return maintenanceMode; }
    public void setMaintenanceMode(boolean maintenanceMode) { this.maintenanceMode = maintenanceMode; }

    public double getDailyTransferLimit() { return dailyTransferLimit; }
    public void setDailyTransferLimit(double dailyTransferLimit) { this.dailyTransferLimit = dailyTransferLimit; }

    public double getPerTransactionLimit() { return perTransactionLimit; }
    public void setPerTransactionLimit(double perTransactionLimit) { this.perTransactionLimit = perTransactionLimit; }

    public double getSavingsInterestRate() { return savingsInterestRate; }
    public void setSavingsInterestRate(double savingsInterestRate) { this.savingsInterestRate = savingsInterestRate; }

    public double getLoanBaseInterestRate() { return loanBaseInterestRate; }
    public void setLoanBaseInterestRate(double loanBaseInterestRate) { this.loanBaseInterestRate = loanBaseInterestRate; }

    public boolean isTwoFactorEnforced() { return twoFactorEnforced; }
    public void setTwoFactorEnforced(boolean twoFactorEnforced) { this.twoFactorEnforced = twoFactorEnforced; }

    public String getSystemNotice() { return systemNotice; }
    public void setSystemNotice(String systemNotice) { this.systemNotice = systemNotice; }
}
