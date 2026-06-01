import { useSyncExternalStore } from 'react';

type Language = 'id' | 'en';

type Translations = Record<string, string>;
type Dictionary = Record<Language, Translations>;

const dictionary: Dictionary = {
  id: {
    // Navigation
    'nav.monitoring': 'Monitoring',
    'nav.auditQueue': 'Audit Queue',
    'nav.riskSimulator': 'Risk Simulator',
    'nav.fraudGraph': 'Fraud Graph',
    'nav.compliance': 'Compliance',
    'nav.architecture': 'Architecture',
    'nav.businessModel': 'Business Model',
    'nav.operations': 'Operations',
    'nav.governance': 'Governance',
    'nav.platform': 'Platform',
    'nav.home': 'Home',

    // AppShell
    'appShell.engineOnline': 'Mesin Aktif',
    'appShell.lastSync': 'sinkronisasi terakhir',
    'appShell.disclaimerTitle': 'Penafian:',
    'appShell.disclaimerText': 'Seluruh data dalam sistem prototipe FDS SAFER ini (nama nasabah, nomor rekening, nominal transaksi, log perangkat) adalah data sintetis/rekayasa buatan untuk kebutuhan demonstrasi dan simulasi. Tidak menggunakan data riil atau transaksi keuangan asli.',
    'appShell.analystDemo': 'Demo Analis',

    // Dashboard
    'dashboard.title': 'Monitoring Keamanan Real-Time',
    'dashboard.subtitle': 'Mengawasi transaksi digital secara aktif dengan pencegahan proaktif SAFER.',
    'dashboard.systemStatus': 'Status Sistem',
    'dashboard.activeUsers': 'Pengguna Aktif',
    'dashboard.blockedThreats': 'Ancaman Diblokir',
    'dashboard.successRate': 'Tingkat Sukses',
    'dashboard.aiRiskScoring': 'Skoring Risiko AI',
    'dashboard.riskDistribution': 'Distribusi Profil Risiko',
    'dashboard.liveTransactionFeed': 'Arus Transaksi Langsung',
    'dashboard.liveFeedDesc': 'Pemantauan real-time terhadap arus transaksi.',
    'dashboard.col.time': 'Waktu',
    'dashboard.col.txId': 'TX-ID',
    'dashboard.col.sender': 'Pengirim',
    'dashboard.col.receiver': 'Penerima',
    'dashboard.col.amount': 'Nominal (IDR)',
    'dashboard.col.type': 'Tipe',
    'dashboard.col.status': 'Status',
    'dashboard.col.risk': 'Risiko',
    'dashboard.btn.investigate': 'Investigasi',
    'dashboard.filter.severity': 'Tingkat Keparahan',
    'dashboard.filter.rail': 'Jalur (Rail)',
    'dashboard.filter.auditStatus': 'Status Audit',
    'dashboard.filter.all': 'Semua',
    'dashboard.filter.clear': 'Hapus semua filter',
    'dashboard.kpi.total': 'Total Transaksi',
    'dashboard.kpi.flagged': 'Terindikasi Anomali',
    'dashboard.kpi.blocked': 'Nominal Dicegah',
    'dashboard.kpi.pending': 'Menunggu Tinjauan',
    'dashboard.chart.riskDist': 'Distribusi Risiko',
    'dashboard.chart.riskDistSub': 'Dari seluruh transaksi terpantau',
    'dashboard.chart.railDist': 'Anomali per Jalur',
    'dashboard.chart.railDistSub': 'Sesi saat ini',
    'dashboard.empty.title': 'Belum ada transaksi',
    'dashboard.empty.desc': 'Klik Start Stream untuk generate otomatis, atau Generate Batch untuk membuat instan.',
    'dashboard.btn.startStream': 'Mulai Stream',
    'dashboard.btn.pauseStream': 'Jeda Stream',
    'dashboard.btn.genBatch': 'Generate Batch',
    'dashboard.btn.scenario': 'Skenario Fraud',
    
    // Status
    'status.approved': 'Disetujui',
    'status.blocked': 'Diblokir',
    'status.review': 'Ditunda',
    'status.under_investigation': 'Diinvestigasi',
    'risk.low': 'Rendah',
    'risk.medium': 'Sedang',
    'risk.high': 'Tinggi',
    'risk.critical': 'Kritis',

    // Network (Fraud Graph)
    'network.title': 'Fraud Graph Intelligence',
    'network.subtitle': 'Investigasi topologi klaster anomali dan mitigasi sindikat',
    'network.scenarios': 'Skenario Investigasi Aktif',
    'network.scenarioDesc': 'Pilih skenario jaringan di bawah ini untuk merender relasi entitas pada kanvas graf di samping.',
    'network.severity': 'Tingkat Keparahan:',
    'network.nodes': 'Titik Akun',
    'network.edges': 'Relasi Transaksi',
    'network.totalVolume': 'Total Volume',
    'network.btn.investigating': 'Investigasi Jaringan',
    'network.btn.investigate': 'Investigasi Jaringan',
    'network.graphViewer': 'Penampil Relasi Graf',
    'network.graphViewerDesc': 'Pan & zoom untuk mengeksplorasi koneksi. Arahkan kursor ke node/edge untuk detail intelijen.',
    'network.howToRead': 'Cara Membaca Graf',
    'network.help.zoom': 'Gunakan scroll mouse atau cubit layar untuk memperbesar/memperkecil (zoom in/out).',
    'network.help.pan': 'Klik dan tahan ruang kosong, lalu seret untuk menggeser (pan) sudut pandang area.',
    'network.help.inspect': 'Arahkan kursor ke ikon (node) atau garis (edge) untuk melihat analisis intelijen spesifik.',
    'network.status.investigating': 'Diinvestigasi',

    // Scenarios
    'scenario.mule.title': 'Mule Ring Network',
    'scenario.mule.desc': 'Satu sumber memecah dana ke banyak akun sementara (mule), yang semuanya mengirim ke satu merchant kripto akhir (smurfing).',
    'scenario.device.title': 'Device Farm Sharing',
    'scenario.device.desc': 'Banyak akun berbeda dioperasikan bergantian dari satu identitas perangkat keras atau IP address yang sama (akun bayaran).',
    'scenario.slot.title': 'Slot & Judi Online',
    'scenario.slot.desc': 'Pola setoran bolak-balik dalam nominal kecil konstan pada interval cepat antara banyak pengguna dengan satu akun bandar terpusat.',
  },
  en: {
    // Navigation
    'nav.monitoring': 'Monitoring',
    'nav.auditQueue': 'Audit Queue',
    'nav.riskSimulator': 'Risk Simulator',
    'nav.fraudGraph': 'Fraud Graph',
    'nav.compliance': 'Compliance',
    'nav.architecture': 'Architecture',
    'nav.businessModel': 'Business Model',
    'nav.operations': 'Operations',
    'nav.governance': 'Governance',
    'nav.platform': 'Platform',
    'nav.home': 'Home',

    // AppShell
    'appShell.engineOnline': 'Engine Online',
    'appShell.lastSync': 'last sync',
    'appShell.disclaimerTitle': 'Disclaimer:',
    'appShell.disclaimerText': 'All data within the SAFER FDS prototype system (customer names, account numbers, transaction amounts, device logs) is synthetic/mock data for demonstration and simulation purposes. It does not use real data or actual financial transactions.',
    'appShell.analystDemo': 'Analyst Demo',

    // Dashboard
    'dashboard.title': 'Real-Time Security Monitoring',
    'dashboard.subtitle': 'Actively observing digital transactions with SAFER proactive prevention.',
    'dashboard.systemStatus': 'System Status',
    'dashboard.activeUsers': 'Active Users',
    'dashboard.blockedThreats': 'Threats Blocked',
    'dashboard.successRate': 'Success Rate',
    'dashboard.aiRiskScoring': 'AI Risk Scoring',
    'dashboard.riskDistribution': 'Risk Profile Distribution',
    'dashboard.liveTransactionFeed': 'Live Transaction Feed',
    'dashboard.liveFeedDesc': 'Real-time monitoring of transaction streams.',
    'dashboard.col.time': 'Time',
    'dashboard.col.txId': 'TX-ID',
    'dashboard.col.sender': 'Sender',
    'dashboard.col.receiver': 'Receiver',
    'dashboard.col.amount': 'Amount (IDR)',
    'dashboard.col.type': 'Type',
    'dashboard.col.status': 'Status',
    'dashboard.col.risk': 'Risk',
    'dashboard.btn.investigate': 'Investigate',
    'dashboard.filter.severity': 'Severity',
    'dashboard.filter.rail': 'Rail',
    'dashboard.filter.auditStatus': 'Audit Status',
    'dashboard.filter.all': 'All',
    'dashboard.filter.clear': 'Clear all filters',
    'dashboard.kpi.total': 'Total Transactions',
    'dashboard.kpi.flagged': 'Flagged Events',
    'dashboard.kpi.blocked': 'Blocked Amount',
    'dashboard.kpi.pending': 'Pending Review',
    'dashboard.chart.riskDist': 'Risk Distribution',
    'dashboard.chart.riskDistSub': 'Across all monitored transactions',
    'dashboard.chart.railDist': 'Flagged by Rail',
    'dashboard.chart.railDistSub': 'Current session',
    'dashboard.empty.title': 'No transactions yet',
    'dashboard.empty.desc': 'Click Start Stream to auto-generate, or Generate Batch to create instantly.',
    'dashboard.btn.startStream': 'Start Stream',
    'dashboard.btn.pauseStream': 'Pause Stream',
    'dashboard.btn.genBatch': 'Generate Batch',
    'dashboard.btn.scenario': 'Fraud Scenario',
    
    // Status
    'status.approved': 'Approved',
    'status.blocked': 'Blocked',
    'status.review': 'Pending',
    'status.under_investigation': 'Investigating',
    'risk.low': 'Low',
    'risk.medium': 'Medium',
    'risk.high': 'High',
    'risk.critical': 'Critical',

    // Network (Fraud Graph)
    'network.title': 'Fraud Graph Intelligence',
    'network.subtitle': 'Investigate anomalous cluster topologies and mitigate syndicates',
    'network.scenarios': 'Active Investigation Scenarios',
    'network.scenarioDesc': 'Select a network scenario below to render entity relations on the graph canvas.',
    'network.severity': 'Severity:',
    'network.nodes': 'Account Nodes',
    'network.edges': 'Tx Relations',
    'network.totalVolume': 'Total Volume',
    'network.btn.investigating': 'Investigating Network',
    'network.btn.investigate': 'Investigate Network',
    'network.graphViewer': 'Graph Relation Viewer',
    'network.graphViewerDesc': 'Pan & zoom to explore connections. Hover over nodes/edges for intelligence details.',
    'network.howToRead': 'How to Read the Graph',
    'network.help.zoom': 'Use mouse scroll or pinch screen to zoom in/out.',
    'network.help.pan': 'Click and hold empty space, then drag to pan the viewport.',
    'network.help.inspect': 'Hover cursor over icons (nodes) or lines (edges) to view specific intelligence analysis.',
    'network.status.investigating': 'Investigating',

    // Scenarios
    'scenario.mule.title': 'Mule Ring Network',
    'scenario.mule.desc': 'One source splits funds to many temporary accounts (mules), all routing to one final crypto merchant (smurfing).',
    'scenario.device.title': 'Device Farm Sharing',
    'scenario.device.desc': 'Multiple different accounts operated alternately from a single hardware identity or shared IP address (paid accounts).',
    'scenario.slot.title': 'Slot & Online Gambling',
    'scenario.slot.desc': 'Rapid back-and-forth deposit patterns in constant small amounts between many users and a centralized operator account.',
  }
};

class I18nStore {
  private language: Language = 'id';
  private listeners: Set<() => void> = new Set();

  getLanguage = () => this.language;

  setLanguage = (lang: Language) => {
    this.language = lang;
    this.emit();
  };

  toggleLanguage = () => {
    this.language = this.language === 'id' ? 'en' : 'id';
    this.emit();
  };

  t = (key: string): string => {
    return dictionary[this.language][key] || key;
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit = () => {
    this.listeners.forEach((listener) => listener());
  };
}

export const i18nStore = new I18nStore();

export function useTranslation() {
  const language = useSyncExternalStore(i18nStore.subscribe, i18nStore.getLanguage);
  
  return {
    t: i18nStore.t,
    language,
    setLanguage: i18nStore.setLanguage,
    toggleLanguage: i18nStore.toggleLanguage
  };
}
