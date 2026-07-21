/**
 * Transaction Engine — Generator Functions
 */
import type { RawTransaction, PaymentRail, EWalletProvider } from "./types";
import {
  RAIL_WEIGHTS,
  FIRST_NAMES,
  LAST_NAMES,
  MERCHANTS_RETAIL,
  MERCHANTS_ECOMMERCE,
  MERCHANTS_SERVICES,
  MERCHANTS_RISKY,
  MERCHANTS_CORPORATE,
  BANKS,
  CITIES,
  EWALLET_PROVIDERS,
  DEVICE_TYPES,
  DEVICE_BRANDS_ANDROID,
  DEVICE_BRANDS_IOS,
} from "./lookups";

export interface FraudHints {
  isVelocityAnomaly: boolean;
  isGeoMismatch: boolean;
  isOffHours: boolean;
  isNewDevice: boolean;
  isHighValueForRail: boolean;
  isSuspiciousIP: boolean;
  isRiskyMerchant: boolean;
  isNewAccount: boolean;
  hasFailedAttempts: boolean;
  isDeviceMismatch: boolean;
  isSimSwap: boolean;
  isUnusualBeneficiary: boolean;
  velocityCount: number;
  geoDistanceKm: number;
}

let _seed = Date.now();
let _txCounter = 100_000;

function rand(): number {
  _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickWeighted<T extends { weight: number }>(arr: readonly T[]): T {
  const total = arr.reduce((s, a) => s + a.weight, 0);
  let r = rand() * total;
  for (const item of arr) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return arr[arr.length - 1];
}

function pickRail(): PaymentRail {
  const entries = Object.entries(RAIL_WEIGHTS) as [PaymentRail, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [rail, weight] of entries) {
    r -= weight;
    if (r <= 0) return rail;
  }
  return "QRIS";
}

function randomInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function generateAccountNumber(bank: typeof BANKS[number]): string {
  const len = bank.code === "Mandiri" ? 13 : 10;
  let num = bank.prefix;
  for (let i = num.length; i < len; i++) num += Math.floor(rand() * 10).toString();
  return num;
}

function generateDeviceFingerprint(): string {
  const chars = "0123456789abcdef";
  let fp = "";
  for (let i = 0; i < 16; i++) fp += chars[Math.floor(rand() * chars.length)];
  return fp;
}

function generateIP(): string {
  const prefixes = ["103.84", "114.142", "36.68", "180.244", "110.136", "103.28", "202.134", "112.215"];
  const pfx = pick(prefixes);
  return `${pfx}.${randomInt(1, 254)}.${randomInt(1, 254)}`;
}

function generateDeviceInfo(): { type: string; brand: string; fingerprint: string } {
  const type = pick(DEVICE_TYPES);
  let brand: string;
  if (type === "iOS") {
    brand = pick(DEVICE_BRANDS_IOS);
  } else if (type === "Android") {
    brand = pick(DEVICE_BRANDS_ANDROID);
  } else {
    brand = pick(["Chrome 125", "Safari 18", "Firefox 127", "Edge 125"]);
  }
  return { type, brand, fingerprint: generateDeviceFingerprint() };
}

function generateAmount(rail: PaymentRail): number {
  switch (rail) {
    case "QRIS":
      return rand() < 0.7 ? randomInt(5_000, 500_000) : randomInt(500_000, 5_000_000);
    case "BI-FAST":
      return rand() < 0.6 ? randomInt(100_000, 10_000_000) : randomInt(10_000_000, 250_000_000);
    case "RTGS":
      return randomInt(100_000_000, 2_000_000_000);
    case "SKN":
      return randomInt(1_000_000, 100_000_000);
    case "E-Wallet":
      return rand() < 0.8 ? randomInt(1_000, 500_000) : randomInt(500_000, 2_000_000);
    case "Virtual Account":
      return randomInt(50_000, 50_000_000);
    case "Kartu Debit":
      return randomInt(10_000, 10_000_000);
    case "Kartu Kredit":
      return randomInt(50_000, 50_000_000);
    case "Transfer":
      return randomInt(50_000, 100_000_000);
    default:
      return randomInt(10_000, 10_000_000);
  }
}

function generateMerchant(rail: PaymentRail, isFraudy: boolean): string {
  if (isFraudy && rand() < 0.3) return pick(MERCHANTS_RISKY);

  switch (rail) {
    case "QRIS":
      return rand() < 0.7 ? pick(MERCHANTS_RETAIL) : pick(MERCHANTS_SERVICES);
    case "E-Wallet":
      return rand() < 0.5 ? pick(MERCHANTS_SERVICES) : pick(MERCHANTS_ECOMMERCE);
    case "RTGS":
    case "SKN":
      return pick(MERCHANTS_CORPORATE);
    case "Kartu Kredit":
      return rand() < 0.6 ? pick(MERCHANTS_ECOMMERCE) : pick(MERCHANTS_RETAIL);
    default:
      return pick([...MERCHANTS_RETAIL, ...MERCHANTS_ECOMMERCE, ...MERCHANTS_SERVICES]);
  }
}

const MERCHANT_CATEGORIES: Record<string, string> = {};
MERCHANTS_RETAIL.forEach(m => MERCHANT_CATEGORIES[m] = "Retail");
MERCHANTS_ECOMMERCE.forEach(m => MERCHANT_CATEGORIES[m] = "E-Commerce");
MERCHANTS_SERVICES.forEach(m => MERCHANT_CATEGORIES[m] = "Services");
MERCHANTS_RISKY.forEach(m => MERCHANT_CATEGORIES[m] = m.includes("Crypto") || m.includes("Bit") ? "Crypto" : m.includes("Bet") || m.includes("Slot") ? "Gambling" : "Lending");
MERCHANTS_CORPORATE.forEach(m => MERCHANT_CATEGORIES[m] = "Corporate");

function getMerchantCategory(merchant: string): string {
  return MERCHANT_CATEGORIES[merchant] || "General";
}

function generateSingleTransaction(isFraudy: boolean, forceHighRisk: boolean): any {
  const rail = pickRail();
  const senderCity = pickWeighted(CITIES);
  const receiverCity = pickWeighted(CITIES);
  const senderBank = pick(BANKS);
  const receiverBank = pick(BANKS);
  const device = generateDeviceInfo();
  const now = new Date();

  const timestamp = new Date(now.getTime() - randomInt(0, 60) * 1000);
  let amount = generateAmount(rail);

  const merchant = generateMerchant(rail, isFraudy);
  const merchantCategory = getMerchantCategory(merchant);
  let accountAgeDays = randomInt(30, 3650);

  const hints: FraudHints = {
    isVelocityAnomaly: false,
    isGeoMismatch: false,
    isOffHours: false,
    isNewDevice: false,
    isHighValueForRail: false,
    isSuspiciousIP: false,
    isRiskyMerchant: merchantCategory === "Crypto" || merchantCategory === "Gambling" || merchantCategory === "Lending",
    isNewAccount: false,
    hasFailedAttempts: false,
    isDeviceMismatch: false,
    isSimSwap: false,
    isUnusualBeneficiary: false,
    velocityCount: randomInt(1, 3),
    geoDistanceKm: 0,
  };

  if (isFraudy) {
    const numIndicators = forceHighRisk ? randomInt(3, 6) : randomInt(2, 4);
    const possibleFlags: (keyof FraudHints)[] = [
      "isVelocityAnomaly", "isGeoMismatch", "isOffHours", "isNewDevice",
      "isHighValueForRail", "isSuspiciousIP", "isNewAccount",
      "hasFailedAttempts", "isDeviceMismatch", "isSimSwap", "isUnusualBeneficiary",
    ];

    const shuffled = possibleFlags.sort(() => rand() - 0.5);
    for (let j = 0; j < Math.min(numIndicators, shuffled.length); j++) {
      const flag = shuffled[j];
      (hints as unknown as Record<string, boolean | number>)[flag] = true;
    }

    if (hints.isHighValueForRail) {
      amount = Math.round(amount * (3 + rand() * 7));
    }
    if (hints.isNewAccount) {
      accountAgeDays = randomInt(1, 25);
    }
    if (hints.isVelocityAnomaly) {
      hints.velocityCount = randomInt(8, 25);
    }
    if (hints.isGeoMismatch) {
      const dLat = senderCity.lat - receiverCity.lat;
      const dLng = senderCity.lng - receiverCity.lng;
      hints.geoDistanceKm = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 111);
      if (hints.geoDistanceKm < 200) {
        hints.geoDistanceKm = randomInt(400, 2500);
      }
    }
    if (hints.isOffHours) {
      timestamp.setHours(randomInt(2, 4), randomInt(0, 59));
    }
  }

  const isNewDevice = hints.isNewDevice || rand() < 0.05;
  const txId = `TX-${(++_txCounter).toString().padStart(6, "0")}`;

  return {
    id: txId,
    timestamp,
    senderName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    senderAccount: generateAccountNumber(senderBank),
    senderBank: senderBank.code,
    senderCity: senderCity.name,
    senderProvince: senderCity.province,
    senderLat: senderCity.lat,
    senderLng: senderCity.lng,
    receiverName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    receiverAccount: generateAccountNumber(receiverBank),
    receiverBank: receiverBank.code,
    receiverCity: receiverCity.name,
    receiverProvince: receiverCity.province,
    receiverLat: receiverCity.lat,
    receiverLng: receiverCity.lng,
    amount,
    rail,
    ewalletProvider: rail === "E-Wallet" ? pick(EWALLET_PROVIDERS) : undefined,
    merchant,
    merchantCategory,
    referenceNumber: `REF${Date.now().toString(36).toUpperCase()}${randomInt(100, 999)}`,
    channel: rail === "E-Wallet" ? "Mobile App" : rail === "QRIS" ? "QR Scan" : pick(["Mobile Banking", "Internet Banking", "ATM", "Mobile App"]),
    deviceType: device.type,
    deviceBrand: device.brand,
    deviceFingerprint: device.fingerprint,
    ipAddress: generateIP(),
    isNewDevice,
    accountAgeDays,
    _hints: hints,
  };
}

export function generateTransactionBatch(
  count: number,
  fraudRatio = 0.18,
  forceHighRisk = false,
): RawTransaction[] {
  const txs: RawTransaction[] = [];
  for (let i = 0; i < count; i++) {
    const isFraudy = forceHighRisk || rand() < fraudRatio;
    txs.push(generateSingleTransaction(isFraudy, forceHighRisk));
  }
  return txs;
}

export function createSpecificTransaction(overrides: Partial<RawTransaction>): RawTransaction {
  const base = generateSingleTransaction(true, true);
  return { ...base, ...overrides };
}

export function resetTransactionCounter() {
  _txCounter = 100_000;
}

export function reseed(seed?: number) {
  _seed = seed ?? Date.now();
}
