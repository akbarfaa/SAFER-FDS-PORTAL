/**
 * SAFER — Synthetic Transaction Engine
 *
 * Generates realistic Indonesian financial transactions across all major
 * payment rails.  Data patterns (names, merchants, amounts, cities) are
 * designed to closely mimic real transaction data in Indonesia's digital
 * financial ecosystem.
 */

// ─── Lookup Tables ──────────────────────────────────────────────────────────

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

export const PAYMENT_RAILS: PaymentRail[] = [
  "QRIS",
  "BI-FAST",
  "RTGS",
  "SKN",
  "E-Wallet",
  "Virtual Account",
  "Kartu Debit",
  "Kartu Kredit",
  "Transfer",
];

/** Weighted distribution — QRIS & E-Wallet dominate retail volume */
const RAIL_WEIGHTS: Record<PaymentRail, number> = {
  "QRIS": 28,
  "BI-FAST": 18,
  "RTGS": 3,
  "SKN": 5,
  "E-Wallet": 24,
  "Virtual Account": 8,
  "Kartu Debit": 6,
  "Kartu Kredit": 4,
  "Transfer": 4,
};

const FIRST_NAMES = [
  "Andi", "Sari", "Budi", "Maya", "Rizki", "Dewi", "Faisal", "Putri",
  "Aldo", "Indah", "Agus", "Rina", "Dimas", "Lina", "Hendra", "Nita",
  "Yusuf", "Wulan", "Arif", "Ratna", "Bayu", "Siti", "Reza", "Ayu",
  "Taufik", "Mega", "Irfan", "Dian", "Kurnia", "Fitri", "Eko", "Nurul",
  "Wahyu", "Rini", "Surya", "Intan", "Fajar", "Lestari", "Gilang", "Amelia",
];

const LAST_NAMES = [
  "Prasetyo", "Wulandari", "Hartono", "Kusuma", "Hidayat", "Permata",
  "Ramadhan", "Nugraheni", "Santoso", "Wijaya", "Susanto", "Purnama",
  "Suryadi", "Laksmi", "Setiawan", "Maharani", "Nugroho", "Anggraini",
  "Saputra", "Handayani", "Utomo", "Rahayu", "Firmansyah", "Puspita",
  "Kurniawan", "Safitri", "Wahyudi", "Hapsari", "Pratama", "Damayanti",
];

const MERCHANTS_RETAIL = [
  "Alfamart Jl. Sudirman", "Indomaret Kebayoran", "Circle K Senopati",
  "Warung Makan Sederhana", "Bakso Pak Kumis", "Kopi Kenangan Sudirman",
  "Starbucks Plaza Indonesia", "McDonald's Sarinah", "KFC Thamrin",
  "J.CO Donuts Grand Indonesia",
];

const MERCHANTS_ECOMMERCE = [
  "Tokopedia", "Shopee", "Bukalapak", "Lazada", "Blibli",
  "JD.ID", "Zalora", "Sociolla", "Bhinneka", "Orami",
];

const MERCHANTS_SERVICES = [
  "Grab", "GoFood", "Gojek", "Traveloka", "Tiket.com",
  "PLN Prepaid", "Telkomsel Pulsa", "BPJS Kesehatan", "PGN Gas",
  "Indosat Prepaid",
];

const MERCHANTS_RISKY = [
  "CryptoXchange ID", "BitTrade Asia", "OnlineBet88", "LuckySlot ID",
  "FastCash Pinjol", "QuickLoan Digital",
];

const MERCHANTS_CORPORATE = [
  "PT Sumber Makmur Sentosa", "CV Jaya Abadi", "PT Nusantara Logistik",
  "Apotek Kimia Farma", "RS Pondok Indah", "Universitas Indonesia",
  "PT Pertamina (Persero)", "PT Telkom Indonesia", "PT Bank Central Asia",
  "PT Astra International",
];

const BANKS = [
  { code: "BCA", name: "Bank Central Asia", prefix: "0" },
  { code: "BNI", name: "Bank Negara Indonesia", prefix: "0" },
  { code: "BRI", name: "Bank Rakyat Indonesia", prefix: "0" },
  { code: "Mandiri", name: "Bank Mandiri", prefix: "1" },
  { code: "BSI", name: "Bank Syariah Indonesia", prefix: "7" },
  { code: "CIMB", name: "CIMB Niaga", prefix: "0" },
  { code: "Danamon", name: "Bank Danamon", prefix: "0" },
  { code: "Permata", name: "PermataBank", prefix: "0" },
  { code: "BNP", name: "Bank BTPN", prefix: "9" },
  { code: "Mega", name: "Bank Mega", prefix: "0" },
  { code: "OCBC", name: "OCBC NISP", prefix: "0" },
  { code: "Jago", name: "Bank Jago", prefix: "5" },
  { code: "Nobu", name: "Bank Nobu", prefix: "0" },
  { code: "Seabank", name: "SeaBank", prefix: "9" },
];

interface CityEntry {
  name: string;
  province: string;
  weight: number;
  lat: number;
  lng: number;
}

const CITIES: CityEntry[] = [
  { name: "Jakarta Pusat", province: "DKI Jakarta", weight: 14, lat: -6.186, lng: 106.834 },
  { name: "Jakarta Selatan", province: "DKI Jakarta", weight: 12, lat: -6.261, lng: 106.810 },
  { name: "Jakarta Barat", province: "DKI Jakarta", weight: 8, lat: -6.168, lng: 106.758 },
  { name: "Jakarta Utara", province: "DKI Jakarta", weight: 5, lat: -6.121, lng: 106.837 },
  { name: "Jakarta Timur", province: "DKI Jakarta", weight: 6, lat: -6.225, lng: 106.900 },
  { name: "Surabaya", province: "Jawa Timur", weight: 10, lat: -7.250, lng: 112.751 },
  { name: "Bandung", province: "Jawa Barat", weight: 7, lat: -6.917, lng: 107.619 },
  { name: "Medan", province: "Sumatera Utara", weight: 6, lat: 3.595, lng: 98.672 },
  { name: "Semarang", province: "Jawa Tengah", weight: 5, lat: -6.966, lng: 110.420 },
  { name: "Makassar", province: "Sulawesi Selatan", weight: 4, lat: -5.147, lng: 119.432 },
  { name: "Denpasar", province: "Bali", weight: 4, lat: -8.650, lng: 115.220 },
  { name: "Tangerang", province: "Banten", weight: 4, lat: -6.178, lng: 106.630 },
  { name: "Bekasi", province: "Jawa Barat", weight: 4, lat: -6.241, lng: 106.992 },
  { name: "Depok", province: "Jawa Barat", weight: 3, lat: -6.402, lng: 106.794 },
  { name: "Bogor", province: "Jawa Barat", weight: 3, lat: -6.597, lng: 106.806 },
  { name: "Yogyakarta", province: "DI Yogyakarta", weight: 3, lat: -7.797, lng: 110.370 },
  { name: "Malang", province: "Jawa Timur", weight: 2, lat: -7.978, lng: 112.630 },
  { name: "Palembang", province: "Sumatera Selatan", weight: 2, lat: -2.976, lng: 104.775 },
  { name: "Balikpapan", province: "Kalimantan Timur", weight: 2, lat: -1.267, lng: 116.829 },
  { name: "Manado", province: "Sulawesi Utara", weight: 1, lat: 1.474, lng: 124.842 },
];

const EWALLET_PROVIDERS: EWalletProvider[] = ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"];

const DEVICE_TYPES = ["Android", "iOS", "Web Browser", "Mobile Web"];
const DEVICE_BRANDS_ANDROID = ["Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "Infinix", "POCO"];
const DEVICE_BRANDS_IOS = ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 12", "iPhone SE"];

// ─── Utility Helpers ────────────────────────────────────────────────────────

let _seed = Date.now();

/** Fast seeded PRNG (Mulberry32) for reproducible-ish randomness */
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
  // Indonesian IP ranges (simplified)
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

// ─── Amount Ranges per Rail ─────────────────────────────────────────────────

function generateAmount(rail: PaymentRail): number {
  switch (rail) {
    case "QRIS":
      // Majority small retail, occasional medium
      return rand() < 0.7
        ? randomInt(5_000, 500_000)
        : randomInt(500_000, 5_000_000);
    case "BI-FAST":
      return rand() < 0.6
        ? randomInt(100_000, 10_000_000)
        : randomInt(10_000_000, 250_000_000);
    case "RTGS":
      return randomInt(100_000_000, 2_000_000_000);
    case "SKN":
      return randomInt(1_000_000, 100_000_000);
    case "E-Wallet":
      return rand() < 0.8
        ? randomInt(1_000, 500_000)
        : randomInt(500_000, 2_000_000);
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

// ─── Merchant Selection by Rail ─────────────────────────────────────────────

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

// ─── Full Transaction Generator ─────────────────────────────────────────────

let _txCounter = 100_000;

export interface RawTransaction {
  id: string;
  timestamp: Date;
  // Sender
  senderName: string;
  senderAccount: string;
  senderBank: string;
  senderCity: string;
  senderProvince: string;
  senderLat: number;
  senderLng: number;
  // Receiver
  receiverName: string;
  receiverAccount: string;
  receiverBank: string;
  receiverCity: string;
  receiverProvince: string;
  receiverLat?: number;
  receiverLng?: number;
  // Transaction
  amount: number;
  rail: PaymentRail;
  ewalletProvider?: EWalletProvider;
  merchant: string;
  merchantCategory: string;
  referenceNumber: string;
  channel: string;
  // Device & Network
  deviceType: string;
  deviceBrand: string;
  deviceFingerprint: string;
  ipAddress: string;
  isNewDevice: boolean;
  // Account metadata
  accountAgeDays: number;
  // Fraud signal hints (for scoring engine to consume)
  _hints: FraudHints;
  // Flat indicators mapped from backend
  isVelocityAnomaly?: boolean;
  isGeoMismatch?: boolean;
  isOffHours?: boolean;
  isHighValueForRail?: boolean;
  isSuspiciousIp?: boolean;
  isRiskyMerchant?: boolean;
  isNewAccount?: boolean;
  hasFailedAttempts?: boolean;
  isDeviceMismatch?: boolean;
  isSimSwap?: boolean;
  isUnusualBeneficiary?: boolean;
  velocityCount?: number;
  geoDistanceKm?: number;
}

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

const MERCHANT_CATEGORIES: Record<string, string> = {};
MERCHANTS_RETAIL.forEach(m => MERCHANT_CATEGORIES[m] = "Retail");
MERCHANTS_ECOMMERCE.forEach(m => MERCHANT_CATEGORIES[m] = "E-Commerce");
MERCHANTS_SERVICES.forEach(m => MERCHANT_CATEGORIES[m] = "Services");
MERCHANTS_RISKY.forEach(m => MERCHANT_CATEGORIES[m] = m.includes("Crypto") || m.includes("Bit") ? "Crypto" : m.includes("Bet") || m.includes("Slot") ? "Gambling" : "Lending");
MERCHANTS_CORPORATE.forEach(m => MERCHANT_CATEGORIES[m] = "Corporate");

function getMerchantCategory(merchant: string): string {
  return MERCHANT_CATEGORIES[merchant] || "General";
}

/**
 * Generate a batch of realistic synthetic transactions.
 * @param count  Number of transactions to generate
 * @param fraudRatio  Fraction (0–1) of transactions that should be suspicious (default 0.18)
 * @param forceHighRisk  If true, generate only medium/high/critical transactions
 */
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

/**
 * Generate a specific transaction with overrides (useful for scenario injection)
 */
export function createSpecificTransaction(overrides: Partial<RawTransaction>): RawTransaction {
  const base = generateSingleTransaction(true, true);
  return { ...base, ...overrides };
}

function generateSingleTransaction(isFraudy: boolean, forceHighRisk: boolean): RawTransaction {
  const rail = pickRail();
  const senderCity = pickWeighted(CITIES);
  const receiverCity = pickWeighted(CITIES);
  const senderBank = pick(BANKS);
  const receiverBank = pick(BANKS);
  const device = generateDeviceInfo();
  const now = new Date();

  // Randomize timestamp slightly into the past (0-60 seconds ago)
  const timestamp = new Date(now.getTime() - randomInt(0, 60) * 1000);
  const hour = timestamp.getHours();

  // Amount
  let amount = generateAmount(rail);

  // Merchant
  const merchant = generateMerchant(rail, isFraudy);
  const merchantCategory = getMerchantCategory(merchant);

  // Account age
  let accountAgeDays = randomInt(30, 3650); // 1 month to 10 years

  // Build fraud hints
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
    // Pick 2-5 fraud indicators to inject
    const numIndicators = forceHighRisk ? randomInt(3, 6) : randomInt(2, 4);
    const possibleFlags: (keyof FraudHints)[] = [
      "isVelocityAnomaly", "isGeoMismatch", "isOffHours", "isNewDevice",
      "isHighValueForRail", "isSuspiciousIP", "isNewAccount",
      "hasFailedAttempts", "isDeviceMismatch", "isSimSwap", "isUnusualBeneficiary",
    ];

    // Shuffle and pick
    const shuffled = possibleFlags.sort(() => rand() - 0.5);
    for (let j = 0; j < Math.min(numIndicators, shuffled.length); j++) {
      const flag = shuffled[j];
      (hints as unknown as Record<string, boolean | number>)[flag] = true;
    }

    // Apply side effects of hints
    if (hints.isHighValueForRail) {
      // Inflate amount significantly
      amount = Math.round(amount * (3 + rand() * 7));
    }
    if (hints.isNewAccount) {
      accountAgeDays = randomInt(1, 25);
    }
    if (hints.isVelocityAnomaly) {
      hints.velocityCount = randomInt(8, 25);
    }
    if (hints.isGeoMismatch) {
      // Calculate distance between sender and receiver cities
      const dLat = senderCity.lat - receiverCity.lat;
      const dLng = senderCity.lng - receiverCity.lng;
      hints.geoDistanceKm = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 111);
      if (hints.geoDistanceKm < 200) {
        hints.geoDistanceKm = randomInt(400, 2500); // Force large distance
      }
    }
    if (hints.isOffHours) {
      // Move timestamp to 02:00-05:00
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

/**
 * Reset the transaction counter (useful for demo resets)
 */
export function resetTransactionCounter() {
  _txCounter = 100_000;
}

/**
 * Reseed the PRNG
 */
export function reseed(seed?: number) {
  _seed = seed ?? Date.now();
}
