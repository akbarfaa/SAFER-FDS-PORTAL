/**
 * Transaction Engine — Data Lookup Tables
 */
import type { PaymentRail, EWalletProvider } from "./types";

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

export const RAIL_WEIGHTS: Record<PaymentRail, number> = {
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

export const FIRST_NAMES = [
  "Andi", "Sari", "Budi", "Maya", "Rizki", "Dewi", "Faisal", "Putri",
  "Aldo", "Indah", "Agus", "Rina", "Dimas", "Lina", "Hendra", "Nita",
  "Yusuf", "Wulan", "Arif", "Ratna", "Bayu", "Siti", "Reza", "Ayu",
  "Taufik", "Mega", "Irfan", "Dian", "Kurnia", "Fitri", "Eko", "Nurul",
  "Wahyu", "Rini", "Surya", "Intan", "Fajar", "Lestari", "Gilang", "Amelia",
];

export const LAST_NAMES = [
  "Prasetyo", "Wulandari", "Hartono", "Kusuma", "Hidayat", "Permata",
  "Ramadhan", "Nugraheni", "Santoso", "Wijaya", "Susanto", "Purnama",
  "Suryadi", "Laksmi", "Setiawan", "Maharani", "Nugroho", "Anggraini",
  "Saputra", "Handayani", "Utomo", "Rahayu", "Firmansyah", "Puspita",
  "Kurniawan", "Safitri", "Wahyudi", "Hapsari", "Pratama", "Damayanti",
];

export const MERCHANTS_RETAIL = [
  "Alfamart Jl. Sudirman", "Indomaret Kebayoran", "Circle K Senopati",
  "Warung Makan Sederhana", "Bakso Pak Kumis", "Kopi Kenangan Sudirman",
  "Starbucks Plaza Indonesia", "McDonald's Sarinah", "KFC Thamrin",
  "J.CO Donuts Grand Indonesia",
];

export const MERCHANTS_ECOMMERCE = [
  "Tokopedia", "Shopee", "Bukalapak", "Lazada", "Blibli",
  "JD.ID", "Zalora", "Sociolla", "Bhinneka", "Orami",
];

export const MERCHANTS_SERVICES = [
  "Grab", "GoFood", "Gojek", "Traveloka", "Tiket.com",
  "PLN Prepaid", "Telkomsel Pulsa", "BPJS Kesehatan", "PGN Gas",
  "Indosat Prepaid",
];

export const MERCHANTS_RISKY = [
  "CryptoXchange ID", "BitTrade Asia", "OnlineBet88", "LuckySlot ID",
  "FastCash Pinjol", "QuickLoan Digital",
];

export const MERCHANTS_CORPORATE = [
  "PT Sumber Makmur Sentosa", "CV Jaya Abadi", "PT Nusantara Logistik",
  "Apotek Kimia Farma", "RS Pondok Indah", "Universitas Indonesia",
  "PT Pertamina (Persero)", "PT Telkom Indonesia", "PT Bank Central Asia",
  "PT Astra International",
];

export const BANKS = [
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

export interface CityEntry {
  name: string;
  province: string;
  weight: number;
  lat: number;
  lng: number;
}

export const CITIES: CityEntry[] = [
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

export const EWALLET_PROVIDERS: EWalletProvider[] = ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"];

export const DEVICE_TYPES = ["Android", "iOS", "Web Browser", "Mobile Web"];
export const DEVICE_BRANDS_ANDROID = ["Samsung", "Xiaomi", "OPPO", "Vivo", "Realme", "Infinix", "POCO"];
export const DEVICE_BRANDS_IOS = ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 12", "iPhone SE"];
