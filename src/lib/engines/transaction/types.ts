/**
 * Transaction Engine — Types & Interfaces
 */

export type PaymentRail =
  | "QRIS"
  | "BI-FAST"
  | "RTGS"
  | "SKN"
  | "E-Wallet"
  | "Virtual Account"
  | "Kartu Debit"
  | "Kartu Kredit"
  | "Transfer";

export type EWalletProvider = "GoPay" | "OVO" | "DANA" | "ShopeePay" | "LinkAja";

export interface RawTransaction {
  id: string;
  timestamp: Date;

  // Sender info
  senderName: string;
  senderAccount: string;
  senderBank: string;
  senderCity: string;
  senderProvince: string;
  senderLat: number;
  senderLng: number;

  // Receiver / Counterparty info
  receiverName: string;
  receiverAccount: string;
  receiverBank: string;
  receiverCity: string;
  receiverProvince: string;
  receiverLat: number;
  receiverLng: number;

  // Transaction Details
  amount: number;
  rail: PaymentRail;
  ewalletProvider?: EWalletProvider;
  merchant?: string;
  merchantCategory?: string;
  channel: string;

  // Technical & Device Metadata
  deviceType: string;
  deviceBrand: string;
  deviceFingerprint: string;
  ipAddress: string;
  isNewDevice: boolean;
  accountAgeDays: number;

  // Raw Anomalies / Signals
  isVelocityAnomaly: boolean;
  isGeoMismatch: boolean;
  isOffHours: boolean;
  isHighValueForRail: boolean;
  isSuspiciousIp: boolean;
  isRiskyMerchant: boolean;
  isNewAccount: boolean;
  hasFailedAttempts: boolean;
  isDeviceMismatch: boolean;
  isSimSwap: boolean;
  isUnusualBeneficiary: boolean;

  // Calculated Features
  velocityCount: number;
  geoDistanceKm: number;
}
