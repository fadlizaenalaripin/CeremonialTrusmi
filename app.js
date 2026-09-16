/**
 * CEREMONIAL DASHBOARD 2026 - APPLICATION ENGINE
 * Real Data Integration: Sales YTD 2025-2026
 */

// Global App State
const state = {
  activeCategory: 'sales-ytd',
  activeSub: null,
  period: 'ytd2026',
  selectedSalesMonth: 'all', // Default to All Months (YTD Jan–Ags 2026)
  searchQuery: '',
  selectedBranch: 'all',
  activeChartInstances: {},
  isB2BVisible: false
};

// Global Currency & Number Format Helpers
function formatRupiah(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0';
  return 'Rp ' + Math.round(Number(num)).toLocaleString('id-ID');
}
window.formatRupiah = formatRupiah;

function formatRupiahShort(num) {
  if (!num || isNaN(num)) return 'Rp 0';
  const val = Number(num);
  if (Math.abs(val) >= 1000000000) {
    return 'Rp ' + (val / 1000000000).toFixed(2).replace('.', ',') + ' M';
  } else if (Math.abs(val) >= 1000000) {
    return 'Rp ' + (val / 1000000).toFixed(1).replace('.', ',') + ' Jt';
  }
  return 'Rp ' + val.toLocaleString('id-ID');
}
window.formatRupiahShort = formatRupiahShort;

// Subcategory Map Definition
const subcategoriesMap = {
  'kpi-performance': [
    { id: 'kpi-bt', title: 'KPI BT' },
    { id: 'kpi-tkb', title: 'KPI TKB' }
  ],
  'okr': [
    { id: 'okr-bt', title: 'OKR BT' },
    { id: 'okr-tkb', title: 'OKR TKB' },
    { id: 'okr-prodev', title: 'OKR PRODEV' },
    { id: 'okr-produksi', title: 'OKR PRODUKSI' }
  ],
  'complain': [
    { id: 'complain-bt', title: 'Complain BT' },
    { id: 'complain-tkb', title: 'Complain TKB' }
  ],
  'milestone': [
    { id: 'milestone-bt', title: 'Milestone BT' },
    { id: 'milestone-tkb', title: 'Milestone TKB' }
  ],
  'b2b': [
    { id: 'b2b-achievement', title: 'Achievement B2B' },
    { id: 'b2b-comparison', title: 'Perbandingan YoY' },
    { id: 'b2b-complain', title: 'Complain B2B' }
  ]
};

// Category Titles Mapping
const categoryTitles = {
  'sales-ytd': 'Sales YTD',
  'kpi-performance': 'KPI Performance',
  'head-to-head': 'Head to Head',
  'okr': 'OKR',
  'complain': 'Complain',
  'milestone': 'Milestone',
  'b2b': 'B2B'
};

// Real Sales Database Transcribed from User Spreadsheet (2025 & 2026 - Up to August)
const realSalesData = {
  branches: [
    { id: 'cirebon', name: 'Batik Trusmi Cirebon', ytd2026: 44440626864, growth2026: -5.7, janJul2025: 47110091130, total2025: 72290172300, color: '#10B981' },
    { id: 'bali', name: 'The Keranjang Bali', ytd2026: 37663414426, growth2026: -21.1, janJul2025: 47727396264, total2025: 69927082478, color: '#06B6D4' },
    { id: 'ecommerce', name: 'E-Commerce', ytd2026: 4226676060, growth2026: 3.0, janJul2025: 4103027194, total2025: 6163885348, color: '#6366F1' },
    { id: 'b2b', name: 'B2B', ytd2026: 2885932921, growth2026: 100, janJul2025: 1402798530, total2025: 2659742404, color: '#8B5CF6' },
    { id: 'medan', name: 'Batik Trusmi Medan', ytd2026: 1347384832, growth2026: -14.2, janJul2025: 1570222216, total2025: 2374344178, color: '#F59E0B' },
    { id: 'lounge', name: 'Batik Trusmi Lounge', ytd2026: 824715410, growth2026: 21.2, janJul2025: 680545300, total2025: 1125895987, color: '#EC4899' },
    { id: 'jakarta', name: 'Batik Trusmi Jakarta', ytd2026: 907812088, growth2026: -33.1, janJul2025: 1357533790, total2025: 2110907540, color: '#3B82F6' }
  ],

  months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],

  // Special Dedicated B2B Cash In & ACV Database
  b2bData: {
    target2026: [420000000, 480000000, 480000000, 660000000, 480000000, 540000000, 480000000, 420000000, 540000000, 480000000, 600000000, 420000000],
    acv2025: [49396200, 99146399, 437196380, 163115720, 180073085, 169497149, 29836562, 274537035, 167413910, 244770614, 361433600, 483325750],
    cashIn2025: [0, 0, 24081550, 30579350, 131204585, 168881469, 71302062, 44909650, 102057050, 398148054, 216523865, 437298350],
    acv2026: [275430924, 167980600, 399331359, 543332850, 220628800, 260594428, 405962550, 612671410, 0, 0, 0, 0],
    cashIn2026: [300544972, 283399800, 102205868, 268122736, 384872726, 295220915, 154484825, 342621000, 0, 0, 0, 0]
  },

  // Monthly breakdown per branch for 2026 (Jan-Ags)
  sales2026: {
    cirebon: [6145526461, 4363163085, 5280323018, 5259388670, 6992017875, 5858981677, 5310823424, 5230402654, 0, 0, 0, 0],
    bali: [6669186960, 3788194468, 5722558473, 3923308664, 4409772270, 4390443413, 4398635447, 4361314731, 0, 0, 0, 0],
    ecommerce: [374357149, 584738503, 728202121, 628439040, 434439105, 604922791, 468423171, 403154180, 0, 0, 0, 0],
    b2b: [275430924, 167980600, 399331359, 543332850, 220628800, 260594428, 405962550, 612671410, 0, 0, 0, 0],
    medan: [197785628, 109918500, 111007116, 160267604, 153920116, 201251166, 218637868, 194596834, 0, 0, 0, 0],
    lounge: [87211500, 79750000, 102363900, 101189100, 113816500, 106529900, 118491500, 115363010, 0, 0, 0, 0],
    jakarta: [143684463, 133054375, 91292600, 111146300, 147861050, 87493650, 58676450, 134603200, 0, 0, 0, 0]
  },

  // Monthly breakdown per branch for 2025 (Jan-Dec)
  sales2025: {
    cirebon: [7462976160, 5113480134, 2959379928, 7347575806, 7096426537, 6484680660, 5734809635, 4910762270, 5249461021, 6313024955, 5907896734, 7709698460],
    bali: [8018790088, 3878603158, 2896969487, 7864459457, 6395280180, 6602205167, 6751287147, 5319801580, 5178954405, 4588981890, 5089342802, 7342407117],
    ecommerce: [430144548, 399920388, 737934379, 454009248, 531700745, 541584289, 491620580, 516113017, 480114362, 606940106, 511743900, 462059786],
    b2b: [49396200, 99146399, 437196380, 163115720, 180073085, 169497149, 29836562, 274537035, 167413910, 244770614, 361433600, 483325750],
    medan: [190413854, 176978612, 157390172, 179310114, 202410258, 197871616, 251811722, 214035868, 263364118, 212870126, 163510602, 164377116],
    lounge: [78158600, 84679100, 46882700, 97831000, 87194200, 96983100, 99957800, 88858800, 92078300, 117574387, 119876300, 115821700],
    jakarta: [127212825, 201735375, 151581000, 130985350, 228592775, 215991765, 132604900, 168829800, 198756550, 180394150, 240848200, 133374850]
  }
};

// Calculate Total YTD 2026 across all branches (Jan-Ags)
const totalYTD2026 = realSalesData.branches.reduce((sum, b) => sum + b.ytd2026, 0); // 91,683,891,191
const totalJanJul2025 = realSalesData.branches.reduce((sum, b) => sum + b.janJul2025, 0); // 103,951,614,424
const totalYTDGrowth2026 = (((totalYTD2026 - totalJanJul2025) / totalJanJul2025) * 100).toFixed(1);

// Helper to compute branch metrics dynamically by month filter
function getBranchSalesMetrics(branchId, selectedMonth = 'all') {
  const branch = realSalesData.branches.find(b => b.id === branchId);
  const rows2026 = realSalesData.sales2026[branchId] || [];
  const rows2025 = realSalesData.sales2025[branchId] || [];

  if (selectedMonth === 'all') {
    const val2026 = rows2026.slice(0, 8).reduce((sum, v) => sum + v, 0);
    const val2025 = rows2025.slice(0, 8).reduce((sum, v) => sum + v, 0);
    const rawGrowth = val2025 > 0 ? parseFloat((((val2026 - val2025) / val2025) * 100).toFixed(1)) : 0;
    const growth = Math.min(rawGrowth, 100);
    const augustVal = rows2026[7] || 0;
    return {
      name: branch ? branch.name : '',
      color: branch ? branch.color : '#FFF',
      val2026,
      val2025,
      growth,
      periodLabel: 'Sales YTD 2026 (Jan–Ags)',
      activeMonthLabel: 'Realisasi Agustus 2026',
      activeMonthVal: augustVal,
      baselineLabel: 'Baseline 2025 (Jan–Ags)'
    };
  } else {
    const mIdx = parseInt(selectedMonth, 10);
    const val2026 = rows2026[mIdx] || 0;
    const val2025 = rows2025[mIdx] || 0;
    const rawGrowth = val2025 > 0 ? parseFloat((((val2026 - val2025) / val2025) * 100).toFixed(1)) : 0;
    const growth = Math.min(rawGrowth, 100);
    const monthName = realSalesData.months[mIdx];
    return {
      name: branch ? branch.name : '',
      color: branch ? branch.color : '#FFF',
      val2026,
      val2025,
      growth,
      periodLabel: `Sales ${monthName} 2026`,
      activeMonthLabel: `Realisasi ${monthName} 2026`,
      activeMonthVal: val2026,
      baselineLabel: `Baseline ${monthName} 2025`
    };
  }
}

const mockData = {
  kpiPerformance: {
    'kpi-bt': {
      unitName: 'Batik Trusmi (BT)',
      monthsData: {
        '7': {
          unitName: 'Batik Trusmi (BT)',
          monthName: 'Agustus 2026',
          overallScore: 82.0,
          scorecard: [
            { id: 'dept-sales', name: 'Sales / Ops Store', score: 83.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-operational', name: 'Operational', score: 100.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-marketing', name: 'Marketing', score: 42.0, color: '#EF4444', badgeClass: 'status-at-risk', level: 'low' },
            { id: 'dept-b2b', name: 'B2B', score: 95.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-purchasing', name: 'Purchasing', score: 81.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-ecommerce', name: 'E-Commerce (B2C)', score: 87.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-produksi', name: 'Produksi Pabrikasi BT', score: 86.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' }
          ],
          departments: [
            {
              id: 'dept-sales',
              name: '1. SALES / OPS STORE',
              score: 83.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Sales Store Performance',
                  weight: '100%',
                  objectives: [
                    { name: 'Achievement Sales', bobot: '30%', target: 'Rp6.647.215.378', actual: 'Rp5.230.402.654', acv: 79, kpi: '24%', footnote: 'Pendapatan Sales Store BT' },
                    { name: 'Basket Size', bobot: '10%', target: 'Rp500.000', actual: 'Rp455.114', acv: 91, kpi: '9%', footnote: 'Rata-rata Nilai per Transaksi Pelanggan' },
                    { name: 'Transaksi', bobot: '10%', target: '15.827', actual: '11.492', acv: 73, kpi: '7%', footnote: 'Jumlah Transaksi Pelanggan' },
                    { name: 'Hitrate', bobot: '10%', target: '27%', actual: '28%', acv: 100, kpi: '10%', footnote: '% Keberhasilan Transaksi' },
                    { name: 'Retensi Cirebon', bobot: '20%', target: '475', actual: '309', acv: 65, kpi: '13%', footnote: 'Jumlah pelanggan melakukan retensi dari area Cirebon' },
                    { name: 'Retensi Global', bobot: '15%', target: '10%', actual: '18,44%', acv: 100, kpi: '15%', footnote: 'Jumlah Kontribusi Sales Retensi dari Sales Global' },
                    { name: 'Penjualan Deadstock', bobot: '5%', target: 'Rp523.040.265', actual: 'Rp532.875.273', acv: 100, kpi: '5%', footnote: 'Penjualan produk deadstock 10% dari target global' }
                  ]
                }
              ]
            },
            {
              id: 'dept-operational',
              name: '2. OPERATIONAL',
              score: 100.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Cost (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Utilities Cost & Beban Umum', bobot: '50%', target: 'Rp132.944.308', actual: 'Rp104.800.189', acv: 100, kpi: '10,0%' },
                    { name: 'Promotion Cost', bobot: '50%', target: 'Rp132.944.308', actual: 'Rp102.370.088', acv: 100, kpi: '10,0%' }
                  ]
                },
                {
                  name: 'Kasir Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Late Kasir', bobot: '20%', target: '2%', actual: '0,60%', acv: 100, kpi: '4,0%' },
                    { name: 'Selisih Kasir', bobot: '20%', target: 'Rp300.000', actual: 'Rp2.000', acv: 100, kpi: '4,0%' },
                    { name: 'Kelolosan Tag', bobot: '20%', target: '2', actual: '2', acv: 100, kpi: '4,0%' },
                    { name: 'Scale Up Kasir', bobot: '20%', target: '2.288', actual: '2.800', acv: 100, kpi: '4,0%' },
                    { name: 'Complaint Customer', bobot: '20%', target: '0%', actual: '0,00%', acv: 100, kpi: '4,0%' }
                  ]
                },
                {
                  name: 'SPG Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Temuan SPG CCTV', bobot: '50%', target: '15%', actual: '8,0%', acv: 100, kpi: '10,0%' },
                    { name: 'Complaint Customer', bobot: '50%', target: '0%', actual: '0,00%', acv: 100, kpi: '10,0%' }
                  ]
                },
                {
                  name: 'Warehouse Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Identifikasi Produk Rusak', bobot: '30%', target: '100%', actual: '100%', acv: 100, kpi: '6,0%' },
                    { name: 'Replenish Display', bobot: '40%', target: '97%', actual: '100%', acv: 100, kpi: '8,0%' },
                    { name: 'Product Availability', bobot: '30%', target: '100%', actual: '100%', acv: 100, kpi: '6,0%' }
                  ]
                },
                {
                  name: 'VM Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Display Produk', bobot: '40%', target: '95%', actual: '100%', acv: 100, kpi: '8,0%' },
                    { name: 'Leadtime Display', bobot: '30%', target: '95%', actual: '100%', acv: 100, kpi: '6,0%' },
                    { name: 'Temuan Display', bobot: '30%', target: '4', actual: '0', acv: 100, kpi: '6,0%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-marketing',
              name: '3. MARKETING',
              score: 42.0,
              statusClass: 'status-at-risk',
              perspectives: [
                {
                  name: 'Traffic (70%)',
                  weight: '70%',
                  objectives: [
                    { name: 'Traffic Organik', bobot: '50%', target: '63.307', actual: '33.673', acv: 53, kpi: '19%', violation: 'Tidak menunjukkan sikap proaktif dalam menjalankan kegiatan — Evaluasi Kontrak Kerja SPV' },
                    { name: 'Traffic Rombongan', bobot: '30%', target: '15.827', actual: '7.704', acv: 49, kpi: '10%' },
                    { name: 'Sales Rombongan', bobot: '20%', target: 'Rp1.661.804.095', actual: 'Rp452.734.511', acv: 27, kpi: '4%' }
                  ]
                },
                {
                  name: 'Event (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Traffic Event', bobot: '50%', target: '200', actual: '0', acv: 0, kpi: '0%' },
                    { name: 'Sales Event', bobot: '50%', target: 'Rp5.000.000', actual: '0', acv: 0, kpi: '0%' }
                  ]
                },
                {
                  name: 'CRM (10%)',
                  weight: '10%',
                  objectives: [
                    { name: 'Survei Customer', bobot: '50%', target: '300', actual: '302', acv: 100, kpi: '5%' },
                    { name: 'Rating Google Review', bobot: '50%', target: '300', actual: '302', acv: 100, kpi: '5%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-b2b',
              name: '4. B2B',
              score: 95.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Sales (40%)',
                  weight: '40%',
                  objectives: [
                    { name: 'Achievement Sales', bobot: '40%', target: 'Rp420.000.000', actual: 'Rp612.671.410', acv: 100, kpi: '16%' },
                    { name: 'Basket Size', bobot: '20%', target: 'Rp8.750.000', actual: 'Rp14.498.663', acv: 100, kpi: '8%' },
                    { name: 'Transaksi', bobot: '10%', target: '48', actual: '32', acv: 67, kpi: '3%' },
                    { name: 'Retensi', bobot: '30%', target: '14', actual: '17', acv: 100, kpi: '12%' }
                  ]
                },
                {
                  name: 'Operational (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Hot Prospek', bobot: '30%', target: '80', actual: '25', acv: 33, kpi: '2%', violation: 'Tidak proaktif — Evaluasi Kontrak Kerja Staff BD' },
                    { name: 'Follow Up', bobot: '20%', target: '1.440', actual: '1.825', acv: 100, kpi: '4%' },
                    { name: 'Temuan Pelayanan', bobot: '10%', target: '<1%', actual: '0', acv: 100, kpi: '2%' },
                    { name: 'Late Balas Chat', bobot: '20%', target: '<1%', actual: '0', acv: 100, kpi: '4%' },
                    { name: 'Complaint Pelayanan', bobot: '20%', target: '<1%', actual: '0', acv: 100, kpi: '4%' }
                  ]
                },
                {
                  name: 'Marketing (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Database Baru', bobot: '40%', target: '1.440', actual: '1.522', acv: 100, kpi: '8%' },
                    { name: 'Lead Ads', bobot: '50%', target: '300', actual: '302', acv: 100, kpi: '10%' },
                    { name: 'Cost', bobot: '10%', target: 'recap akhir bulan', actual: 'Rp2.215.448', acv: 100, kpi: '2%' }
                  ]
                },
                {
                  name: 'Produk (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Sample Bahan', bobot: '50%', target: '30', actual: '53', acv: 100, kpi: '10%' },
                    { name: 'Complaint Produk', bobot: '50%', target: '<1%', actual: '0', acv: 100, kpi: '10%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-purchasing',
              name: '5. PURCHASING',
              score: 81.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'HPP Position (50%)',
                  weight: '50%',
                  objectives: [
                    { name: 'Jumlah Pengecekan Kode sesuai', bobot: '40%', target: '100%', actual: '75%', acv: 75, kpi: '15%' },
                    { name: 'Jumlah Temuan Pricing diajukan purchasing', bobot: '30%', target: '100%', actual: '75%', acv: 75, kpi: '11%' },
                    { name: 'Improvement Type Payment', bobot: '30%', target: '100%', actual: '100.00%', acv: 100, kpi: '15%' }
                  ]
                },
                {
                  name: 'Safety Stock (25%)',
                  weight: '25%',
                  objectives: [
                    { name: 'Target PO', bobot: '40%', target: '100%', actual: '80%', acv: 80, kpi: '8%' },
                    { name: 'PO vs Receive', bobot: '20%', target: '100%', actual: '95%', acv: 95, kpi: '5%' },
                    { name: 'Stock 0', bobot: '15%', target: '100%', actual: '99%', acv: 99, kpi: '4%' },
                    { name: 'Kualitas Produk', bobot: '20%', target: '95%', actual: '95%', acv: 100, kpi: '5%' },
                    { name: 'Data Base vendor baru', bobot: '5%', target: '100%', actual: '100%', acv: 100, kpi: '1%' }
                  ]
                },
                {
                  name: 'Sales B2B (25%)',
                  weight: '25%',
                  objectives: [
                    { name: 'Revenue Sales', bobot: '50%', target: '100%', actual: '35%', acv: 35, kpi: '4%' },
                    { name: 'Program Retention', bobot: '50%', target: '100%', actual: '100%', acv: 100, kpi: '13%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-ecommerce',
              name: '6. E-COMMERCE (B2C)',
              score: 87.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Sales (40%)',
                  weight: '40%',
                  objectives: [
                    { name: 'Achievement Sales', bobot: '40%', target: 'Rp640.000.000', actual: 'Rp403.154.180', acv: 63, kpi: '10%' },
                    { name: 'Basket Size', bobot: '20%', target: 'Rp200.000', actual: 'Rp177.055', acv: 89, kpi: '7%' },
                    { name: 'Transaksi', bobot: '20%', target: '2.720', actual: '2.277', acv: 84, kpi: '7%' },
                    { name: 'Retensi', bobot: '20%', target: '480', actual: '298', acv: 62, kpi: '5%' }
                  ]
                },
                {
                  name: 'Operational (30%)',
                  weight: '30%',
                  objectives: [
                    { name: 'Follow Up', bobot: '20%', target: '1.080', actual: '1.080', acv: 100, kpi: '6%' },
                    { name: 'Temuan Pelayanan', bobot: '20%', target: '<1%', actual: '0,00%', acv: 100, kpi: '6%' },
                    { name: 'Late Balas Chat', bobot: '20%', target: '<1%', actual: '0,00%', acv: 100, kpi: '6%' },
                    { name: 'Complaint Customer', bobot: '20%', target: '2,00%', actual: '0,18%', acv: 100, kpi: '6%' },
                    { name: 'Ketersediaan Stok Produk', bobot: '20%', target: '95%', actual: '95%', acv: 100, kpi: '6%' }
                  ]
                },
                {
                  name: 'Marketing (30%)',
                  weight: '30%',
                  objectives: [
                    { name: 'Sales Affiliator', bobot: '50%', target: 'Rp131.250.000', actual: 'Rp115.204.967', acv: 88, kpi: '13%' },
                    { name: 'Lead Ads', bobot: '25%', target: '1.823', actual: '2.027', acv: 100, kpi: '8%' },
                    { name: 'Cost Ads', bobot: '25%', target: 'Rp32.000.000', actual: 'Rp33.683.921', acv: 100, kpi: '8%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-produksi',
              name: '7. PRODUKSI PABRIKASI BT',
              score: 86.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Batik Tulis Factory (25%) — Subscore 78%',
                  weight: '25%',
                  objectives: [
                    { name: 'PO Masuk (Kapasitas Pabrik)', bobot: '10%', target: '80%', actual: '60%', acv: 75, kpi: '8%' },
                    { name: 'Realisasi Order', bobot: '20%', target: '80%', actual: '100%', acv: 100, kpi: '20%' },
                    { name: 'Kualitas Produk (FPY)', bobot: '25%', target: '95%', actual: '20%', acv: 21, kpi: '5%' },
                    { name: 'Ketepatan Waktu (OTD)', bobot: '20%', target: '95%', actual: '100%', acv: 100, kpi: '20%' },
                    { name: 'Gross Margin Achievement', bobot: '25%', target: '20%', actual: '20%', acv: 100, kpi: '25%' }
                  ]
                },
                {
                  name: 'Batik Cap Factory (25%) — Subscore 78%',
                  weight: '25%',
                  objectives: [
                    { name: 'PO Masuk (Kapasitas Pabrik)', bobot: '10%', target: '80%', actual: '67,0%', acv: 84, kpi: '8%' },
                    { name: 'Realisasi Order', bobot: '20%', target: '80%', actual: '70,0%', acv: 88, kpi: '18%' },
                    { name: 'Kualitas Produk (FPY)', bobot: '25%', target: '95%', actual: '60,0%', acv: 63, kpi: '17%' },
                    { name: 'Ketepatan Waktu (OTD)', bobot: '20%', target: '95%', actual: '47,0%', acv: 49, kpi: '10%' },
                    { name: 'Gross Margin Achievement', bobot: '25%', target: '20%', actual: '33,0%', acv: 100, kpi: '25%' }
                  ]
                },
                {
                  name: 'Garment Factory (25%) — Subscore 97%',
                  weight: '25%',
                  objectives: [
                    { name: 'PO Masuk (Kapasitas Pabrik)', bobot: '10%', target: '80%', actual: '80%', acv: 100, kpi: '10%' },
                    { name: 'Realisasi Order', bobot: '20%', target: '80%', actual: '78%', acv: 98, kpi: '20%' },
                    { name: 'Kualitas Produk (FPY)', bobot: '25%', target: '95%', actual: '100%', acv: 100, kpi: '25%' },
                    { name: 'Ketepatan Waktu (OTD)', bobot: '20%', target: '95%', actual: '89%', acv: 94, kpi: '19%' },
                    { name: 'Gross Margin Achievement', bobot: '25%', target: '25%', actual: '24%', acv: 97, kpi: '24%' }
                  ]
                },
                {
                  name: 'Handprint Factory (25%) — Subscore 92%',
                  weight: '25%',
                  objectives: [
                    { name: 'PO Masuk (Kapasitas Pabrik)', bobot: '10%', target: '80%', actual: '42,2%', acv: 53, kpi: '5%' },
                    { name: 'Realisasi Order', bobot: '20%', target: '80%', actual: '81,00%', acv: 100, kpi: '20%' },
                    { name: 'Kualitas Produk (FPY)', bobot: '25%', target: '95%', actual: '90,00%', acv: 95, kpi: '24%' },
                    { name: 'Ketepatan Waktu (OTD)', bobot: '20%', target: '95%', actual: '85,23%', acv: 90, kpi: '18%' },
                    { name: 'Gross Margin Achievement', bobot: '25%', target: '20%', actual: '21,13%', acv: 100, kpi: '25%' }
                  ]
                }
              ]
            }
          ],
          redFlags: [
            { deptId: 'dept-produksi', dept: 'Produksi — Batik Tulis', objective: 'Kualitas Produk (FPY)', target: '95%', actual: '20%', acv: 21, detail: 'Kualitas hasil proses pertama batik tulis hanya 20%' },
            { deptId: 'dept-marketing', dept: 'Marketing — Event', objective: 'Traffic & Sales Event', target: '200 / Rp5.000.000', actual: '0', acv: 0, detail: 'Kegiatan event tidak terlaksana (Realisasi 0%)' },
            { deptId: 'dept-marketing', dept: 'Marketing — Traffic', objective: 'Sales Rombongan', target: 'Rp1.661.804.095', actual: 'Rp452.734.511', acv: 27, detail: 'Pencapaian omset rombongan hanya 27%' },
            { deptId: 'dept-b2b', dept: 'B2B — Operational', objective: 'Hot Prospek', target: '80', actual: '25', acv: 33, detail: 'Hanya mencapai 25 dari 80 prospek (Pelanggaran)' },
            { deptId: 'dept-purchasing', dept: 'Purchasing — Sales B2B', objective: 'Revenue Sales', target: '100%', actual: '35%', acv: 35, detail: 'Target omset sales B2B purchasing tercapai 35%' },
            { deptId: 'dept-marketing', dept: 'Marketing — Traffic', objective: 'Traffic Rombongan', target: '15.827', actual: '7.704', acv: 49, detail: 'Jumlah pengunjung rombongan di bawah target' },
            { deptId: 'dept-produksi', dept: 'Produksi — Batik Cap', objective: 'Ketepatan Waktu (OTD)', target: '95%', actual: '47,0%', acv: 49, detail: 'Ketepatan waktu pengiriman batik cap 49%' },
            { deptId: 'dept-marketing', dept: 'Marketing — Traffic', objective: 'Traffic Organik', target: '63.307', actual: '33.673', acv: 53, detail: 'Pengunjung organik store 53% (Pelanggaran)' },
            { deptId: 'dept-produksi', dept: 'Produksi — Handprint', objective: 'PO Masuk', target: '80%', actual: '42,2%', acv: 53, detail: 'Serapan PO masuk pabrik handprint 53%' },
            { deptId: 'dept-ecommerce', dept: 'E-Commerce — Sales', objective: 'Retensi', target: '480', actual: '298', acv: 62, detail: 'Retensi pembeli e-commerce 62%' },
            { deptId: 'dept-ecommerce', dept: 'E-Commerce — Sales', objective: 'Achievement Sales', target: 'Rp640.000.000', actual: 'Rp403.154.180', acv: 63, detail: 'Pencapaian omset E-Commerce 63%' },
            { deptId: 'dept-produksi', dept: 'Produksi — Batik Cap', objective: 'Kualitas Produk (FPY)', target: '95%', actual: '60,0%', acv: 63, detail: 'Kualitas hasil pertama batik cap 63%' },
            { deptId: 'dept-sales', dept: 'Sales — Retensi', objective: 'Retensi Cirebon', target: '475', actual: '309', acv: 65, detail: 'Jumlah pelanggan retensi area Cirebon di bawah target' }
          ],
          violations: [
            { deptId: 'dept-marketing', dept: 'Marketing', indicator: 'Traffic Organik & Rombongan', pelanggaran: 'Tidak menunjukkan sikap proaktif dalam menjalankan kegiatan', sanksi: 'Evaluasi Kontrak Kerja SPV' },
            { deptId: 'dept-b2b', dept: 'B2B', indicator: 'Transaksi & Hot Prospek', pelanggaran: 'Tidak proaktif', sanksi: 'Evaluasi Kontrak Kerja Staff BD' }
          ],
          footnotes: [
            'Laporan real data KPI Head Batik Trusmi (BT) periode Agustus 2026.',
            'Target Hitrate Sales Store 27% tercapai 28% (100% ACV).',
            'B2B melebihi target dengan pencapaian Rp 612.671.410 (100% ACV).'
          ],
          starPerformers: [
            { name: 'Tim Operational BT', role: 'Store Operations & Kasir', award: 'Operational Excellence (100.0%)', unit: 'BT Retail' },
            { name: 'Tim B2B Corporate BT', role: 'B2B Account Executive', award: 'High Revenue Closer (95.0%)', unit: 'BT B2B' },
            { name: 'Tim Produksi BT', role: 'Garment & Handprint Team', award: 'Manufacturing Mastery (86.0%)', unit: 'BT Production' }
          ]
        },
        '6': {
          unitName: 'Batik Trusmi (BT)',
          monthName: 'Juli 2026',
          overallScore: 84.4,
          scorecard: [
            { id: 'dept-sales', name: 'Sales / Ops Store', score: 84.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-operational', name: 'Operational', score: 95.9, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-marketing', name: 'Marketing', score: 64.0, color: '#EF4444', badgeClass: 'status-at-risk', level: 'low' },
            { id: 'dept-b2b', name: 'B2B', score: 92.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-purchasing', name: 'Purchasing', score: 92.53, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-ecommerce', name: 'E-Commerce (B2C)', score: 87.9, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-produksi', name: 'Produksi Pabrikasi BT', score: 75.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' }
          ],
          departments: [
            {
              id: 'dept-sales',
              name: '1. SALES / OPS STORE',
              score: 84.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Sales Store Performance',
                  weight: '100%',
                  objectives: [
                    { name: 'Achievement Sales', bobot: '30%', target: 'Rp6.810.416.378', actual: 'Rp5.310.823.424', acv: 78, kpi: '23%' },
                    { name: 'Basket Size', bobot: '10%', target: 'Rp500.000', actual: 'Rp471.780', acv: 94, kpi: '9%', footnote: 'Target khusus Juli (revisi Pak Andyka)' },
                    { name: 'Transaksi', bobot: '10%', target: '13.621', actual: '11.257', acv: 83, kpi: '8%' },
                    { name: 'Hitrate', bobot: '10%', target: '35%', actual: '26%', acv: 74, kpi: '7%', footnote: 'Target khusus Juli (revisi Pak Andyka)' },
                    { name: 'Retensi Cirebon', bobot: '20%', target: '409', actual: '315', acv: 77, kpi: '15%' },
                    { name: 'Retensi Global', bobot: '15%', target: '10%', actual: '21,41%', acv: 100, kpi: '15%', footnote: '21,41% = 2.410 dari total retensi global (POS)' },
                    { name: 'Penjualan Deadstock', bobot: '10% (efektif 5%)', target: 'Rp531.082.342', actual: 'Rp563.752.280', acv: 100, kpi: '5%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-operational',
              name: '2. OPERATIONAL',
              score: 95.9,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Cost (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Utilities Cost', bobot: '50%', target: 'Rp136.208.328', actual: 'Rp91.774.234', acv: 100, kpi: '10,0%' },
                    { name: 'Promotion Cost', bobot: '50%', target: 'Rp136.208.328', actual: 'Rp111.234.851', acv: 100, kpi: '10,0%' }
                  ]
                },
                {
                  name: 'Kasir Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Late Kasir', bobot: '20%', target: '2%', actual: '0,60%', acv: 100, kpi: '4,0%' },
                    { name: 'Selisih Kasir', bobot: '20%', target: 'Rp300.000', actual: 'Rp10.000', acv: 100, kpi: '4,0%' },
                    { name: 'Kelolosan Tag', bobot: '20%', target: '2', actual: '4', acv: 0, kpi: '0,0%', violation: '3 orang terlibat, sanksi denda Rp25.000/tag (total Rp100.000)' },
                    { name: 'Scale Up Kasir', bobot: '20%', target: '2.251', actual: '2.803', acv: 100, kpi: '4,0%' },
                    { name: 'Complaint Customer', bobot: '20%', target: '0%', actual: '0,00%', acv: 100, kpi: '4,0%' }
                  ]
                },
                {
                  name: 'SPG Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Temuan SPG CCTV', bobot: '50%', target: '15%', actual: '1,0%', acv: 100, kpi: '10,0%' },
                    { name: 'Complaint Customer', bobot: '50%', target: '0%', actual: '0,00%', acv: 100, kpi: '10,0%' }
                  ]
                },
                {
                  name: 'Warehouse Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Identifikasi Produk Rusak', bobot: '30%', target: '95%', actual: '94%', acv: 99, kpi: '5,9%' },
                    { name: 'Replenish Display', bobot: '40%', target: '97%', actual: '100%', acv: 100, kpi: '8,0%' },
                    { name: 'Product Availability', bobot: '30%', target: '100%', actual: '100%', acv: 100, kpi: '6,0%' }
                  ]
                },
                {
                  name: 'VM Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Display Produk', bobot: '40%', target: '95%', actual: '100%', acv: 100, kpi: '8,0%' },
                    { name: 'Leadtime Display', bobot: '30%', target: '95%', actual: '100%', acv: 100, kpi: '6,0%' },
                    { name: 'Temuan Display', bobot: '30%', target: '4', actual: '0', acv: 100, kpi: '6,0%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-marketing',
              name: '3. MARKETING',
              score: 64.0,
              statusClass: 'status-at-risk',
              perspectives: [
                {
                  name: 'Traffic (70%)',
                  weight: '70%',
                  objectives: [
                    { name: 'Traffic Organik', bobot: '50%', target: '64.861', actual: '36.542', acv: 56, kpi: '20%', violation: 'Tidak menunjukkan sikap proaktif — Evaluasi Kontrak SPV' },
                    { name: 'Traffic Rombongan', bobot: '30%', target: '16.215', actual: '6.179', acv: 38, kpi: '8%', violation: 'Tidak menunjukkan sikap proaktif — Evaluasi Kontrak SPV' },
                    { name: 'Sales Rombongan', bobot: '20%', target: 'Rp1.702.604.095', actual: 'Rp727.553.674', acv: 43, kpi: '6%' }
                  ]
                },
                {
                  name: 'Event (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Traffic Event', bobot: '50%', target: '200', actual: '320', acv: 100, kpi: '10%' },
                    { name: 'Sales Event', bobot: '50%', target: 'Rp5.000.000', actual: 'Rp7.882.420', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'CRM (10%)',
                  weight: '10%',
                  objectives: [
                    { name: 'Survei Customer', bobot: '50%', target: '300', actual: '310', acv: 100, kpi: '5%' },
                    { name: 'Rating Google Review', bobot: '50%', target: '300', actual: '302', acv: 100, kpi: '5%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-b2b',
              name: '4. B2B',
              score: 92.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Sales (40%)',
                  weight: '40%',
                  objectives: [
                    { name: 'Achievement Sales', bobot: '40%', target: 'Rp480.000.000', actual: 'Rp405.962.550', acv: 85, kpi: '14%' },
                    { name: 'Basket Size', bobot: '20%', target: 'Rp10.000.000', actual: 'Rp14.498.663', acv: 100, kpi: '8%' },
                    { name: 'Transaksi', bobot: '10%', target: '48', actual: '26', acv: 54, kpi: '2%', violation: 'Tidak proaktif — Evaluasi Kontrak Kerja Staff BD' },
                    { name: 'Retensi', bobot: '30%', target: '14', actual: '17', acv: 100, kpi: '12%' }
                  ]
                },
                {
                  name: 'Operational (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Hot Prospek', bobot: '30%', target: '80', actual: '26', acv: 33, kpi: '2%', violation: 'Tidak proaktif — Evaluasi Kontrak Kerja Staff BD' },
                    { name: 'Follow Up', bobot: '20%', target: '1.440', actual: '1.825', acv: 100, kpi: '4%' },
                    { name: 'Temuan Pelayanan', bobot: '10%', target: '<1%', actual: '0', acv: 100, kpi: '2%' },
                    { name: 'Late Balas Chat', bobot: '20%', target: '<1%', actual: '0', acv: 100, kpi: '4%' },
                    { name: 'Complaint Pelayanan', bobot: '20%', target: '<1%', actual: '0', acv: 100, kpi: '4%' }
                  ]
                },
                {
                  name: 'Marketing (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Database Baru', bobot: '40%', target: '1.440', actual: '2.029', acv: 100, kpi: '8%' },
                    { name: 'Lead Ads', bobot: '50%', target: '200', actual: '302', acv: 100, kpi: '10%' },
                    { name: 'Cost', bobot: '10%', target: 'recap akhir bulan', actual: 'Rp2.235.448', acv: 100, kpi: '2%' }
                  ]
                },
                {
                  name: 'Produk (20%)',
                  weight: '20%',
                  objectives: [
                    { name: 'Sample Bahan', bobot: '50%', target: '30', actual: '37', acv: 100, kpi: '10%' },
                    { name: 'Complaint Produk', bobot: '50%', target: '<1%', actual: '0', acv: 100, kpi: '10%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-purchasing',
              name: '5. PURCHASING',
              score: 92.53,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'HPP Position (50%)',
                  weight: '50%',
                  objectives: [
                    { name: 'Pengecekan Kode', bobot: '40%', target: '100%', actual: '100%', acv: 100, kpi: '20%' },
                    { name: 'Temuan Pricing', bobot: '30%', target: '100%', actual: '100%', acv: 100, kpi: '15%' },
                    { name: 'Improvement Type Payment', bobot: '30%', target: '100%', actual: '92,03%', acv: 92, kpi: '14%' }
                  ]
                },
                {
                  name: 'Safety Stock (25%)',
                  weight: '25%',
                  objectives: [
                    { name: 'Target PO', bobot: '40%', target: '100%', actual: '89%', acv: 89, kpi: '9%' },
                    { name: 'PO vs Receive', bobot: '20%', target: '100%', actual: '98%', acv: 98, kpi: '5%' },
                    { name: 'Stock 0', bobot: '15%', target: '100%', actual: '98%', acv: 98, kpi: '4%' },
                    { name: 'Kualitas Produk', bobot: '20%', target: '95%', actual: '100%', acv: 100, kpi: '5%' },
                    { name: 'Database Vendor Baru', bobot: '5%', target: '100%', actual: '100%', acv: 100, kpi: '1%' }
                  ]
                },
                {
                  name: 'Sales B2B (25%)',
                  weight: '25%',
                  objectives: [
                    { name: 'Revenue Sales', bobot: '50%', target: '100%', actual: '60%', acv: 60, kpi: '8%' },
                    { name: 'Program Retention', bobot: '50%', target: '100%', actual: '100%', acv: 100, kpi: '13%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-ecommerce',
              name: '6. E-COMMERCE (B2C)',
              score: 87.9,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Sales (40%)',
                  weight: '40%',
                  objectives: [
                    { name: 'Achievement Sales', bobot: '40%', target: 'Rp640.000.000', actual: 'Rp468.423.171', acv: 73, kpi: '12%' },
                    { name: 'Basket Size', bobot: '20%', target: 'Rp200.000', actual: 'Rp196.982', acv: 98, kpi: '8%' },
                    { name: 'Transaksi', bobot: '20%', target: '2.720', actual: '2.378', acv: 87, kpi: '7%' },
                    { name: 'Retensi', bobot: '20%', target: '480', actual: '303', acv: 63, kpi: '5%' }
                  ]
                },
                {
                  name: 'Operational (30%)',
                  weight: '30%',
                  objectives: [
                    { name: 'Follow Up', bobot: '20%', target: '1.080', actual: '733', acv: 68, kpi: '4%' },
                    { name: 'Temuan Pelayanan', bobot: '20%', target: '<1%', actual: '0%', acv: 100, kpi: '6%' },
                    { name: 'Late Balas Chat', bobot: '20%', target: '<1%', actual: '0%', acv: 100, kpi: '6%' },
                    { name: 'Complaint Customer', bobot: '20%', target: '2%', actual: '0,17%', acv: 100, kpi: '6%' },
                    { name: 'Ketersediaan Stok', bobot: '20%', target: '95%', actual: '95%', acv: 100, kpi: '6%' }
                  ]
                },
                {
                  name: 'Marketing (30%)',
                  weight: '30%',
                  objectives: [
                    { name: 'Sales Affiliator', bobot: '50%', target: 'Rp131.250.000', actual: 'Rp115.529.778', acv: 88, kpi: '13%' },
                    { name: 'Lead Ads', bobot: '25%', target: '1.823', actual: '1.928', acv: 100, kpi: '8%' },
                    { name: 'Cost Ads', bobot: '25%', target: 'Rp32.000.000', actual: 'Rp32.153.604', acv: 100, kpi: '7%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-produksi',
              name: '7. PRODUKSI PABRIKASI BT',
              score: 75.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Batik Tulis Factory (25%) — Subscore 59%',
                  weight: '25%',
                  objectives: [
                    { name: 'Capacity Absorption Rate', bobot: '25%', target: '100%', actual: '51,0%', acv: 51, kpi: '11%' },
                    { name: 'First Pass Yield (FPY)', bobot: '20%', target: '95%', actual: '19,0%', acv: 20, kpi: '20%' },
                    { name: 'On-Time Delivery (OTD)', bobot: '20%', target: '95%', actual: '100,0%', acv: 100, kpi: '15%' },
                    { name: 'Gross Margin Achievement', bobot: '35%', target: '25%', actual: '74,0%', acv: 100, kpi: '13%' }
                  ]
                },
                {
                  name: 'Batik Cap Factory (25%) — Subscore 73%',
                  weight: '25%',
                  objectives: [
                    { name: 'Capacity Absorption Rate', bobot: '25%', target: '100%', actual: '69,0%', acv: 69, kpi: '15%' },
                    { name: 'First Pass Yield (FPY)', bobot: '20%', target: '95%', actual: '59,0%', acv: 62, kpi: '11%' },
                    { name: 'On-Time Delivery (OTD)', bobot: '20%', target: '95%', actual: '89,0%', acv: 94, kpi: '16%' },
                    { name: 'Gross Margin Achievement', bobot: '35%', target: '25%', actual: '100,0%', acv: 100, kpi: '31%' }
                  ]
                },
                {
                  name: 'Garment Factory (25%) — Subscore 92%',
                  weight: '25%',
                  objectives: [
                    { name: 'Capacity Absorption Rate', bobot: '25%', target: '100%', actual: '77%', acv: 77, kpi: '22%' },
                    { name: 'First Pass Yield (FPY)', bobot: '20%', target: '95%', actual: '100%', acv: 100, kpi: '20%' },
                    { name: 'On-Time Delivery (OTD)', bobot: '20%', target: '95%', actual: '77%', acv: 81, kpi: '18%' },
                    { name: 'Gross Margin Achievement', bobot: '35%', target: '25%', actual: '24%', acv: 96, kpi: '32%' }
                  ]
                },
                {
                  name: 'Handprint Factory (25%) — Subscore 77%',
                  weight: '25%',
                  objectives: [
                    { name: 'Capacity Absorption Rate', bobot: '25%', target: '100%', actual: '51,1%', acv: 51, kpi: '15%' },
                    { name: 'First Pass Yield (FPY)', bobot: '20%', target: '95%', actual: '94,40%', acv: 99, kpi: '25%' },
                    { name: 'On-Time Delivery (OTD)', bobot: '20%', target: '95%', actual: '73,30%', acv: 77, kpi: '12%' },
                    { name: 'Gross Margin Achievement', bobot: '35%', target: '30%', actual: '72,00%', acv: 100, kpi: '25%' }
                  ]
                }
              ]
            }
          ],
          redFlags: [
            { deptId: 'dept-operational', dept: 'Operasional — Kasir', objective: 'Kelolosan Tag', target: '2', actual: '4', acv: 0, detail: '4 kejadian, 3 orang terlibat (PELANGGARAN)' },
            { deptId: 'dept-produksi', dept: 'Produksi — Batik Tulis', objective: 'First Pass Yield (FPY)', target: '95%', actual: '19,0%', acv: 20, detail: 'Kualitas hasil proses pertama sangat rendah (19%)' },
            { deptId: 'dept-b2b', dept: 'B2B — Operational', objective: 'Hot Prospek', target: '80', actual: '26', acv: 33, detail: 'Hanya mencapai 26 dari target 80 prospek (Tidak proaktif)' },
            { deptId: 'dept-marketing', dept: 'Marketing — Traffic', objective: 'Traffic Rombongan', target: '16.215', actual: '6.179', acv: 38, detail: 'Realisasi pengunjung rombongan jauh di bawah target' },
            { deptId: 'dept-marketing', dept: 'Marketing — Traffic', objective: 'Sales Rombongan', target: 'Rp1.702.604.095', actual: 'Rp727.553.674', acv: 43, detail: 'Pencapaian omset rombongan hanya 43%' },
            { deptId: 'dept-produksi', dept: 'Produksi — Batik Tulis', objective: 'Capacity Absorption Rate', target: '100%', actual: '51,0%', acv: 51, detail: 'Serapan kapasitas pabrik batik tulis hanya 51%' },
            { deptId: 'dept-produksi', dept: 'Produksi — Handprint', objective: 'Capacity Absorption Rate', target: '100%', actual: '51,1%', acv: 51, detail: 'Serapan kapasitas pabrik handprint rendah' },
            { deptId: 'dept-b2b', dept: 'B2B — Sales', objective: 'Transaksi', target: '48', actual: '26', acv: 54, detail: 'Jumlah closing transaksi B2B rendah (Tidak proaktif)' },
            { deptId: 'dept-marketing', dept: 'Marketing — Traffic', objective: 'Traffic Organik', target: '64.861', actual: '36.542', acv: 56, detail: 'Pengunjung organik store hanya mencapai 56%' },
            { deptId: 'dept-purchasing', dept: 'Purchasing — Sales B2B', objective: 'Revenue Sales', target: '100%', actual: '60%', acv: 60, detail: 'Target pendapatan sales B2B purchasing tercapai 60%' },
            { deptId: 'dept-produksi', dept: 'Produksi — Batik Cap', objective: 'First Pass Yield (FPY)', target: '95%', actual: '59,0%', acv: 62, detail: 'Kualitas hasil pertama batik cap rendah' },
            { deptId: 'dept-ecommerce', dept: 'E-Commerce — Sales', objective: 'Retensi', target: '480', actual: '303', acv: 63, detail: 'Retensi pembeli ulang e-commerce di bawah target' },
            { deptId: 'dept-ecommerce', dept: 'E-Commerce — Operational', objective: 'Follow Up', target: '1.080', actual: '733', acv: 68, detail: 'Tingkat follow up calon pembeli e-commerce 68%' },
            { deptId: 'dept-produksi', dept: 'Produksi — Batik Cap', objective: 'Capacity Absorption Rate', target: '100%', actual: '69,0%', acv: 69, detail: 'Kapasitas produksi batik cap tercapai 69%' }
          ],
          violations: [
            { deptId: 'dept-operational', dept: 'Operasional — Kasir', indicator: 'Kelolosan Tag', pelanggaran: '4 kejadian, 3 orang terlibat', sanksi: 'Denda Rp25.000/tag (total Rp100.000)' },
            { deptId: 'dept-marketing', dept: 'Marketing', indicator: 'Traffic Organik & Rombongan', pelanggaran: 'Tidak menunjukkan sikap proaktif dalam menjalankan kegiatan', sanksi: 'Evaluasi Kontrak Kerja SPV' },
            { deptId: 'dept-b2b', dept: 'B2B', indicator: 'Transaksi & Hot Prospek', pelanggaran: 'Tidak proaktif', sanksi: 'Evaluasi Kontrak Kerja Staff BD' }
          ],
          footnotes: [
            'Target Basket Size Rp500.000 dan Hitrate 35% adalah target khusus bulan Juli (revisi Pak Andyka).',
            'Retensi Global 21,41% = 2.410 dari total retensi global (POS).',
            'Kelolosan Tag: PELANGGARAN — 3 orang terlibat, sanksi denda Rp25.000/tag (total Rp100.000).'
          ],
          starPerformers: [
            { name: 'Tim Store Operations BT', role: 'Head of Store & Kasir', award: 'Operational Excellence (95.9%)', unit: 'BT Retail' },
            { name: 'Tim Purchasing BT', role: 'Purchasing & HPP Team', award: 'Pricing & HPP Mastery (92.53%)', unit: 'BT Procurement' },
            { name: 'Tim B2B Corporate BT', role: 'B2B Account Executive', award: 'High Revenue Closer (92.0%)', unit: 'BT B2B' }
          ]
        }
      }
    },
    'kpi-tkb': {
      unitName: 'The Keranjang Bali (TKB)',
      monthsData: {
        '7': {
          unitName: 'The Keranjang Bali (TKB)',
          monthName: 'Agustus 2026',
          overallScore: 76.0,

          scorecard: [
            { id: 'dept-global-tkb', name: 'Global (Ops Store)', score: 73.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-ops-tkb', name: 'Operasional TKB', score: 87.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-mkt-tkb', name: 'Marketing TKB', score: 80.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-prod-tkb', name: 'Produksi & Inventory', score: 87.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-ecom-tkb', name: 'E-Commerce TKB', score: 53.0, color: '#EF4444', badgeClass: 'status-at-risk', level: 'low' }
          ],

          departments: [
            {
              id: 'dept-global-tkb',
              name: '1. GLOBAL (OPERASIONAL STORE)',
              score: 73.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Operasional Store (100%)',
                  weight: '100%',
                  objectives: [
                    { name: '1.1 Achievement Revenue', bobot: '30%', target: 'Rp9.215.954.207', actual: 'Rp4.334.220.296', acv: 47, kpi: '14%' },
                    { name: '1.2 Basket Size', bobot: '15%', target: 'Rp530.000', actual: 'Rp415.135', acv: 78, kpi: '12%' },
                    { name: '1.3 Transaksi', bobot: '15%', target: '17.388', actual: '10.409', acv: 60, kpi: '9%' },
                    { name: '1.4 Hitrate', bobot: '25%', target: '40,00%', actual: '49%', acv: 100, kpi: '25%' },
                    { name: '1.5 Retensi Store', bobot: '10%', target: '10,00%', actual: '16%', acv: 100, kpi: '10%' },
                    { name: '1.6 Penjualan Deadstock (5% dari aktual revenue)', bobot: '5%', target: 'Rp92.159.542', actual: 'Rp58.807.016', acv: 64, kpi: '3%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-ops-tkb',
              name: '2. OPERASIONAL',
              score: 87.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Cost (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '1.1 Utilities Cost & Beban Umum (2% dari target revenue)', bobot: '50%', target: 'Rp208.000.000', actual: 'Rp165.636.780', acv: 100, kpi: '10%' },
                    { name: '1.2 Promotion Cost (2% dari target revenue)', bobot: '50%', target: 'Rp270.000.000', actual: 'Rp250.009.427', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'Kasir Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '2.1 Late kasir', bobot: '20%', target: '20%', actual: '25%', acv: 80, kpi: '3%' },
                    { name: '2.2 Selisih Kasir', bobot: '20%', target: '-Rp500.000', actual: 'Rp326.045', acv: 100, kpi: '4%' },
                    { name: '2.3 Kelolosan Tag', bobot: '20%', target: '5', actual: '5', acv: 0, kpi: '0%' },
                    { name: '2.4 Scale Up Kasir (10% dari target transaksi)', bobot: '20%', target: '1.739', actual: '1.076', acv: 62, kpi: '2%' },
                    { name: '2.5 Komplain Konsumen - Pelayanan Kasir', bobot: '20%', target: '2', actual: '0', acv: 100, kpi: '4%' }
                  ]
                },
                {
                  name: 'SPG Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '3.1 Temuan CCTV - SPG Tidak Mewarkan Produk', bobot: '50%', target: '4', actual: '13', acv: 31, kpi: '3%', violation: '13 temuan SPG pasif — Pembinaan & Evaluasi SPV SPG' },
                    { name: '3.2 Komplain Konsumen - Pelayanan PC', bobot: '50%', target: '4', actual: '0', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'Warehouse Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '4.1 Replenish display', bobot: '50%', target: '100%', actual: '100%', acv: 100, kpi: '10%' },
                    { name: '4.2 Product Availability', bobot: '50%', target: '100%', actual: '100%', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'VM Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '5.1 Improve Area Jual', bobot: '40%', target: '4', actual: '10', acv: 100, kpi: '8%' },
                    { name: '5.2 Design Request', bobot: '40%', target: '90', actual: '466', acv: 100, kpi: '8%' },
                    { name: '5.3 Temuan CCTV - Display tidak full (reduce 20%)', bobot: '20%', target: '70', actual: '206', acv: 100, kpi: '4%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-mkt-tkb',
              name: '3. MARKETING',
              score: 80.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Traffic (70%)',
                  weight: '70%',
                  objectives: [
                    { name: '1.1 Traffic Organik', bobot: '50%', target: '23.312', actual: '18.755', acv: 80, kpi: '28%' },
                    { name: '1.2 Traffic Rombongan', bobot: '30%', target: '7.770', actual: '3.215', acv: 41, kpi: '9%' },
                    { name: '1.3 Sales Rombongan', bobot: '20%', target: 'Rp921.595.421', actual: 'Rp1.132.400.899', acv: 100, kpi: '14%' }
                  ]
                },
                {
                  name: 'CRM (30%)',
                  weight: '30%',
                  objectives: [
                    { name: '2.1 Survei Customer', bobot: '50%', target: '200', actual: '190', acv: 95, kpi: '14%' },
                    { name: '2.2 Rating Google Review', bobot: '50%', target: '4,5', actual: '4,8', acv: 100, kpi: '15%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-prod-tkb',
              name: '4. PRODUKSI (PRODEV & INVENTORY)',
              score: 87.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Ketersediaan Stock (50%)',
                  weight: '50%',
                  objectives: [
                    { name: '1.1 SO Mini (akurasi data)', bobot: '60%', target: '100,00%', actual: '73%', acv: 73, kpi: '22%' },
                    { name: '1.2 PO Alarm', bobot: '20%', target: '100,00%', actual: '89%', acv: 89, kpi: '9%' },
                    { name: '1.3 Receive On Time', bobot: '20%', target: '100,00%', actual: '100%', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'HPP (30%)',
                  weight: '30%',
                  objectives: [
                    { name: '2.1 Kontribusi Vendor (rp)', bobot: '30%', target: 'Rp80.000.000', actual: 'Rp60.612.004', acv: 76, kpi: '7%' },
                    { name: '2.2 Standart Margin dan Harga Jual (sku)', bobot: '30%', target: '46,00%', actual: '46,00%', acv: 100, kpi: '9%' },
                    { name: '2.3 Promo', bobot: '15%', target: '10,00', actual: '7', acv: 70, kpi: '3%' },
                    { name: '2.4 Product Priority & Tebus Murah', bobot: '25%', target: '5.000,00', actual: '4.716', acv: 94, kpi: '7%' }
                  ]
                },
                {
                  name: 'Rasio Stock (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '3.1 Stock Product Continue dan Discontinue by price', bobot: '100%', target: '95,00%', actual: '138,50%', acv: 100, kpi: '20%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-ecom-tkb',
              name: '5. E-COMMERCE',
              score: 53.0,
              statusClass: 'status-at-risk',
              perspectives: [
                {
                  name: 'Indikator Pencapaian (100%)',
                  weight: '100%',
                  objectives: [
                    { name: '1.1 Achievement Revenue', bobot: '30%', target: 'Rp160.000.000', actual: 'Rp27.094.435', acv: 17, kpi: '5%' },
                    { name: '1.2 Basket Size', bobot: '30%', target: 'Rp200.000', actual: 'Rp148.042', acv: 74, kpi: '22%' },
                    { name: '1.3 Transaksi', bobot: '20%', target: '800', actual: '235', acv: 29, kpi: '6%' },
                    { name: '1.4 Komplain', bobot: '20%', target: '4', actual: '0', acv: 100, kpi: '20%' }
                  ]
                }
              ]
            }
          ],

          redFlags: [
            { deptId: 'dept-ecom-tkb', dept: 'E-Commerce TKB', objective: 'Achivement Revenue', target: 'Rp160.000.000', actual: 'Rp27.094.435', acv: 17, detail: 'Realisasi revenue E-Commerce TKB hanya 17%' },
            { deptId: 'dept-ops-tkb', dept: 'Operasional TKB — Kasir', objective: 'Kelolosan Tag', target: '5', actual: '5', acv: 0, detail: '5 kejadian kelolosan tag kasir (PELANGGARAN)' },
            { deptId: 'dept-ecom-tkb', dept: 'E-Commerce TKB', objective: 'Transaksi', target: '800', actual: '235', acv: 29, detail: 'Volume transaksi e-commerce 29%' },
            { deptId: 'dept-ops-tkb', dept: 'Operasional TKB — SPG Excellent', objective: 'Temuan CCTV SPG', target: '4', actual: '13', acv: 31, detail: '13 temuan CCTV SPG pasif / tidak menawarkan produk' },
            { deptId: 'dept-mkt-tkb', dept: 'Marketing TKB — Traffic', objective: 'Traffic Rombongan', target: '7.770', actual: '3.215', acv: 41, detail: 'Pengunjung bus/rombongan 41% dari target' },
            { deptId: 'dept-global-tkb', dept: 'Global TKB', objective: 'Achievement Revenue', target: 'Rp9.215.954.207', actual: 'Rp4.334.220.296', acv: 47, detail: 'Capaian omset toko TKB bulan Agustus 47%' },
            { deptId: 'dept-global-tkb', dept: 'Global TKB', objective: 'Transaksi Store', target: '17.388', actual: '10.409', acv: 60, detail: 'Jumlah transaksi toko TKB 60%' },
            { deptId: 'dept-ops-tkb', dept: 'Operasional TKB — Kasir', objective: 'Scale Up Kasir', target: '1.739', actual: '1.076', acv: 62, detail: 'Up-selling kasir 62%' },
            { deptId: 'dept-global-tkb', dept: 'Global TKB', objective: 'Penjualan Deadstock', target: 'Rp92.159.542', actual: 'Rp58.807.016', acv: 64, detail: 'Realisasi penjualan deadstock 64%' }
          ],

          violations: [
            { deptId: 'dept-ops-tkb', dept: 'Operasional — SPG Excellent', indicator: 'Temuan CCTV - SPG Tidak Mewarkan Produk', pelanggaran: '13 temuan CCTV SPG pasif / tidak menawarkan produk', sanksi: 'Pembinaan & Evaluasi SPV SPG' }
          ],

          footnotes: [
            'Laporan real data KPI Head The Keranjang Bali (TKB) periode Agustus 2026.',
            'Deadstock target dihitung 5% dari aktual revenue store.',
            'Temuan CCTV Display tidak full ditargetkan reduce 20% dari temuan bulan sebelumnya.'
          ],

          starPerformers: [
            { name: 'Tim Operational TKB', role: 'Store Operations', award: 'Store Execution Excellence (87.0%)', unit: 'TKB Retail' },
            { name: 'Tim Produksi & Inventory TKB', role: 'Inventory & HPP Manager', award: 'Stock Availability Mastery (87.0%)', unit: 'TKB Procurement' }
          ]
        },
        '6': {
          unitName: 'The Keranjang Bali (TKB)',
          monthName: 'Juli 2026',
          overallScore: 72.0,

          scorecard: [
            { id: 'dept-global-tkb', name: 'Global (Ops Store)', score: 70.0, color: '#F59E0B', badgeClass: 'status-on-track', level: 'medium' },
            { id: 'dept-ops-tkb', name: 'Operasional TKB', score: 85.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-mkt-tkb', name: 'Marketing TKB', score: 67.0, color: '#EF4444', badgeClass: 'status-at-risk', level: 'low' },
            { id: 'dept-prod-tkb', name: 'Produksi & Inventory', score: 90.0, color: '#10B981', badgeClass: 'status-achieved', level: 'high' },
            { id: 'dept-ecom-tkb', name: 'E-Commerce TKB', score: 48.0, color: '#EF4444', badgeClass: 'status-at-risk', level: 'low' }
          ],

          departments: [
            {
              id: 'dept-global-tkb',
              name: '1. GLOBAL (OPERASIONAL STORE)',
              score: 70.0,
              statusClass: 'status-on-track',
              perspectives: [
                {
                  name: 'Operasional Store (100%)',
                  weight: '100%',
                  objectives: [
                    { name: '1.1 Achievement Revenue', bobot: '30%', target: 'Rp11.253.611.079', actual: 'Rp4.372.126.694', acv: 39, kpi: '12%' },
                    { name: '1.2 Basket Size', bobot: '10%', target: 'Rp530.000', actual: 'Rp466.448', acv: 88, kpi: '9%' },
                    { name: '1.3 Transaksi', bobot: '10%', target: '21.233', actual: '9.757', acv: 46, kpi: '5%' },
                    { name: '1.4 Hitrate', bobot: '20%', target: '40,35%', actual: '38%', acv: 94, kpi: '19%' },
                    { name: '1.5 Retensi Store', bobot: '25%', target: '10.00%', actual: '26%', acv: 100, kpi: '25%' },
                    { name: '1.6 Penjualan Deadstock (5% dari aktual revenue)', bobot: '5%', target: 'Rp220.488.614', actual: 'Rp48.821.545', acv: 22, kpi: '1%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-ops-tkb',
              name: '2. OPERASIONAL',
              score: 85.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Cost (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '1.1 Utilities Cost & Beban Umum (2% dari target revenue)', bobot: '50%', target: 'Rp218.608.350', actual: 'Rp258.828.344', acv: 100, kpi: '10%' },
                    { name: '1.2 Promotion Cost (2% dari target revenue)', bobot: '50%', target: 'Rp218.608.350', actual: 'Rp217.910.728', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'Kasir Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '2.1 Late kasir', bobot: '20%', target: '20%', actual: '26%', acv: 76, kpi: '3%' },
                    { name: '2.2 Selisih Kasir', bobot: '20%', target: '-Rp500.000', actual: 'Rp128.658', acv: 100, kpi: '4%' },
                    { name: '2.3 Kelolosan Tag', bobot: '20%', target: '2', actual: '1', acv: 50, kpi: '2%' },
                    { name: '2.4 Scale Up Kasir (10% dari target transaksi)', bobot: '20%', target: '1.883', actual: '1.155', acv: 61, kpi: '2%' },
                    { name: '2.5 Komplain Konsumen - Pelayanan Kasir', bobot: '20%', target: '4', actual: '0', acv: 100, kpi: '4%' }
                  ]
                },
                {
                  name: 'SPG Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '3.1 Temuan CCTV - SPG Tidak Mewarkan Produk', bobot: '50%', target: '4', actual: '18', acv: 0, kpi: '0%', violation: '18 temuan SPG pasif — Pembinaan & Evaluasi SPV SPG' },
                    { name: '3.2 Komplain Konsumen - Pelayanan PC', bobot: '50%', target: '4', actual: '0', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'Warehouse Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '4.1 Replenish display', bobot: '50%', target: '100%', actual: '100%', acv: 100, kpi: '10%' },
                    { name: '4.2 Product Availability', bobot: '50%', target: '100%', actual: '100%', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'VM Excellent (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '5.1 Improve Area Jual', bobot: '40%', target: '4', actual: '13', acv: 100, kpi: '8%' },
                    { name: '5.2 Design Request', bobot: '40%', target: '90', actual: '86', acv: 96, kpi: '8%' },
                    { name: '5.3 Temuan CCTV - Display tidak full (reduce 20%)', bobot: '20%', target: '116', actual: '93', acv: 100, kpi: '4%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-mkt-tkb',
              name: '3. MARKETING',
              score: 67.0,
              statusClass: 'status-at-risk',
              perspectives: [
                {
                  name: 'Traffic (70%)',
                  weight: '70%',
                  objectives: [
                    { name: '1.1 Traffic Organik', bobot: '50%', target: '40.000', actual: '21.482', acv: 54, kpi: '19%' },
                    { name: '1.2 Traffic Rombongan', bobot: '30%', target: '10.002', actual: '2.958', acv: 30, kpi: '6%' },
                    { name: '1.3 Sales Rombongan', bobot: '20%', target: 'Rp1.098.537.182', actual: 'Rp976.621.959', acv: 89, kpi: '12%' }
                  ]
                },
                {
                  name: 'CRM (30%)',
                  weight: '30%',
                  objectives: [
                    { name: '2.1 Survei Customer', bobot: '50%', target: '200', actual: '260', acv: 100, kpi: '15%' },
                    { name: '2.2 Rating Google Review', bobot: '50%', target: '4,5', actual: '4,8', acv: 100, kpi: '15%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-prod-tkb',
              name: '4. PRODUKSI (PRODEV & INVENTORY)',
              score: 90.0,
              statusClass: 'status-achieved',
              perspectives: [
                {
                  name: 'Ketersediaan Stock (50%)',
                  weight: '50%',
                  objectives: [
                    { name: '1.1 SO Mini (akurasi data)', bobot: '60%', target: '100,00%', actual: '100%', acv: 100, kpi: '30%' },
                    { name: '1.2 PO Alarm', bobot: '20%', target: '100,00%', actual: '89%', acv: 89, kpi: '9%' },
                    { name: '1.3 Receive On Time', bobot: '20%', target: '100,00%', actual: '100%', acv: 100, kpi: '10%' }
                  ]
                },
                {
                  name: 'HPP (30%)',
                  weight: '30%',
                  objectives: [
                    { name: '2.1 Kontribusi Vendor (rp)', bobot: '30%', target: 'Rp82.800.658', actual: 'Rp60.261.201', acv: 73, kpi: '7%' },
                    { name: '2.2 Standart Margin dan Harga Jual (sku)', bobot: '30%', target: '46,00%', actual: '45,40%', acv: 99, kpi: '9%' },
                    { name: '2.3 Promo', bobot: '15%', target: '10,00', actual: '74,6', acv: 100, kpi: '5%' },
                    { name: '2.4 Product Priority & Tebus Murah', bobot: '25%', target: '7.324,00', actual: '1.450', acv: 20, kpi: '1%' }
                  ]
                },
                {
                  name: 'Rasio Stock (20%)',
                  weight: '20%',
                  objectives: [
                    { name: '3.1 Stock Product Continue dan Discontinue by price', bobot: '100%', target: '95,00%', actual: '140,75%', acv: 100, kpi: '20%' }
                  ]
                }
              ]
            },
            {
              id: 'dept-ecom-tkb',
              name: '5. E-COMMERCE',
              score: 48.0,
              statusClass: 'status-at-risk',
              perspectives: [
                {
                  name: 'Indikator Pencapaian (100%)',
                  weight: '100%',
                  objectives: [
                    { name: '1.1 Achivement Revenue', bobot: '30%', target: 'Rp160.000.000', actual: 'Rp26.508.753', acv: 17, kpi: '5%' },
                    { name: '1.2 Basket Size', bobot: '30%', target: 'Rp200.000', actual: 'Rp98.223', acv: 49, kpi: '15%' },
                    { name: '1.3 Transaksi', bobot: '20%', target: '800', actual: '344', acv: 43, kpi: '9%' },
                    { name: '1.4 Komplain', bobot: '20%', target: '4', actual: '0', acv: 100, kpi: '20%' }
                  ]
                }
              ]
            }
          ],

          redFlags: [
            { deptId: 'dept-ecom-tkb', dept: 'E-Commerce TKB', objective: 'Achivement Revenue', target: 'Rp160.000.000', actual: 'Rp26.508.753', acv: 17, detail: 'Realisasi revenue E-Commerce TKB hanya 17%' },
            { deptId: 'dept-prod-tkb', dept: 'Produksi TKB — HPP', objective: 'Product Priority & Tebus Murah', target: '7.324', actual: '1.450', acv: 20, detail: 'Penjualan produk priority & tebus murah 20%' },
            { deptId: 'dept-global-tkb', dept: 'Global TKB', objective: 'Penjualan Deadstock', target: 'Rp220.488.614', actual: 'Rp48.821.545', acv: 22, detail: 'Realisasi penjualan deadstock 22%' },
            { deptId: 'dept-mkt-tkb', dept: 'Marketing TKB — Traffic', objective: 'Traffic Rombongan', target: '10.002', actual: '2.958', acv: 30, detail: 'Bus/rombongan wisatawan 30% dari target' },
            { deptId: 'dept-global-tkb', dept: 'Global TKB', objective: 'Achievement Revenue', target: 'Rp11.253.611.079', actual: 'Rp4.372.126.694', acv: 39, detail: 'Capaian omset toko TKB bulan Juli 39%' },
            { deptId: 'dept-ecom-tkb', dept: 'E-Commerce TKB', objective: 'Transaksi', target: '800', actual: '344', acv: 43, detail: 'Volume transaksi e-commerce 43%' },
            { deptId: 'dept-global-tkb', dept: 'Global TKB', objective: 'Transaksi Store', target: '21.233', actual: '9.757', acv: 46, detail: 'Jumlah transaksi toko TKB 46%' },
            { deptId: 'dept-ecom-tkb', dept: 'E-Commerce TKB', objective: 'Basket Size', target: 'Rp200.000', actual: 'Rp98.223', acv: 49, detail: 'Rata-rata belanja e-commerce 49%' },
            { deptId: 'dept-ops-tkb', dept: 'Operasional TKB — Kasir', objective: 'Kelolosan Tag', target: '2', actual: '1', acv: 50, detail: 'Terjadi 1 kelolosan tag kasir' },
            { deptId: 'dept-mkt-tkb', dept: 'Marketing TKB — Traffic', objective: 'Traffic Organik', target: '40.000', actual: '21.482', acv: 54, detail: 'Pengunjung organik store 54%' },
            { deptId: 'dept-ops-tkb', dept: 'Operasional TKB — Kasir', objective: 'Scale Up Kasir', target: '1.883', actual: '1.155', acv: 61, detail: 'Up-selling kasir 61%' }
          ],

          violations: [
            { deptId: 'dept-ops-tkb', dept: 'Operasional — SPG Excellent', indicator: 'Temuan CCTV - SPG Tidak Mewarkan Produk', pelanggaran: '18 temuan CCTV SPG pasif / tidak menawarkan produk', sanksi: 'Pembinaan & Evaluasi SPV SPG' }
          ],

          footnotes: [
            'Laporan real data KPI Head The Keranjang Bali (TKB) periode Juli 2026.',
            'Deadstock target dihitung 5% dari aktual revenue store.',
            'Temuan CCTV Display tidak full ditargetkan reduce 20% dari temuan bulan sebelumnya.'
          ],

          starPerformers: [
            { name: 'Tim Produksi & Inventory TKB', role: 'Inventory & HPP Manager', award: 'Stock Availability Excellence (90.0%)', unit: 'TKB Procurement' },
            { name: 'Tim Operational TKB', role: 'Store Operations', award: 'Store Execution Mastery (85.0%)', unit: 'TKB Retail' }
          ]
        }
      }
    },
  },

  headToHead: {
    monthsData: {
      '7': {
        monthName: 'Agustus 2026',
        summary: {
          btScore: '78.69%',
          tkbScore: '47.03%',
          vsActual: { btWins: 13, tkbWins: 1, draws: 0 },
          vsTarget: { btWins: 9, tkbWins: 1, draws: 4 }
        },
        categoryScores: [
          { category: 'Revenue', btScore: 78.69, tkbScore: 47.03 },
          { category: 'Operational', btScore: 89.99, tkbScore: 78.30 },
          { category: 'Marketing', btScore: 58.63, tkbScore: 69.71 },
          { category: 'Ecommerce', btScore: 51.03, tkbScore: 22.28 }
        ],
        items: [
          // REVENUE
          { cat: 'Revenue', point: 'Sales', bobot: '100%', btTarget: 'Rp 6.647.215.378', btAct: 'Rp 5.230.402.654', btAcv: '79%', btScore: '78.69%', tkbTarget: 'Rp 9.215.954.207', tkbAct: 'Rp 4.334.220.296', tkbAcv: '47.03%', tkbScore: '47.03%', vsAct: 'BT', vsTgt: 'BT' },
          // OPERATIONAL
          { cat: 'Operational', point: 'Transaksi', bobot: '30%', btTarget: '15.827', btAct: '11.492', btAcv: '73%', btScore: '21.78%', tkbTarget: '17.388', tkbAct: '10.409', tkbAcv: '59.86%', tkbScore: '17.96%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Operational', point: 'Basket Size', bobot: '20%', btTarget: 'Rp 500.000', btAct: 'Rp 455.114', btAcv: '91%', btScore: '18.21%', tkbTarget: 'Rp 530.000', tkbAct: 'Rp 415.135', tkbAcv: '78.33%', tkbScore: '15.67%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Operational', point: 'Hitrate', bobot: '15%', btTarget: '27%', btAct: '28.00%', btAcv: '100%', btScore: '15.00%', tkbTarget: '40.00%', tkbAct: '48.57%', tkbAcv: '100.00%', tkbScore: '15.00%', vsAct: 'TKB', vsTgt: 'TKB' },
          { cat: 'Operational', point: 'Deadstock', bobot: '10%', btTarget: 'Rp 523.040.265', btAct: 'Rp 532.875.273', btAcv: '100%', btScore: '10.00%', tkbTarget: 'Rp 92.159.542', tkbAct: 'Rp 58.807.016', tkbAcv: '63.81%', tkbScore: '6.38%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Operational', point: 'Selisih Kasir', bobot: '10%', btTarget: 'Rp 300.000', btAct: 'Rp 2.000', btAcv: '100%', btScore: '10.00%', tkbTarget: '-Rp 500.000', tkbAct: 'Rp 326.045', tkbAcv: '100%', tkbScore: '10.00%', vsAct: 'BT', vsTgt: 'DRAW' },
          { cat: 'Operational', point: 'Replenish display', bobot: '5%', btTarget: '97%', btAct: '100%', btAcv: '100%', btScore: '5.00%', tkbTarget: '100%', tkbAct: '100%', tkbAcv: '100.00%', tkbScore: '5.00%', vsAct: 'DRAW', vsTgt: 'DRAW' },
          { cat: 'Operational', point: 'Kelolosan tag', bobot: '5%', btTarget: '2', btAct: '2', btAcv: '100%', btScore: '5.00%', tkbTarget: '5', tkbAct: '5', tkbAcv: '100.00%', tkbScore: '5.00%', vsAct: 'BT', vsTgt: 'DRAW' },
          { cat: 'Operational', point: 'Scale Up Produk Kasir', bobot: '5%', btTarget: '2.288', btAct: '2.800', btAcv: '100%', btScore: '5.00%', tkbTarget: '1.739', tkbAct: '1.076', tkbAcv: '61.87%', tkbScore: '3.09%', vsAct: 'BT', vsTgt: 'BT' },
          // MARKETING
          { cat: 'Marketing', point: 'Traffic Organik', bobot: '50%', btTarget: '63.307', btAct: '33.673', btAcv: '53%', btScore: '26.60%', tkbTarget: '23.312', tkbAct: '18.755', tkbAcv: '80.45%', tkbScore: '40.23%', vsAct: 'BT', vsTgt: 'TKB' },
          { cat: 'Marketing', point: 'Traffic Rombongan', bobot: '35%', btTarget: '15.827', btAct: '7.704', btAcv: '49%', btScore: '17.04%', tkbTarget: '7.770', tkbAct: '3.215', tkbAcv: '41.38%', tkbScore: '14.48%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Marketing', point: 'Rating Google Review', bobot: '15%', btTarget: '175', btAct: '301', btAcv: '100%', btScore: '15.00%', tkbTarget: '5', tkbAct: '48', tkbAcv: '100.00%', tkbScore: '15.00%', vsAct: 'BT', vsTgt: 'DRAW' },
          // ECOMMERCE
          { cat: 'Ecommerce', point: 'Sales', bobot: '40%', btTarget: 'Rp 640.000.000', btAct: 'Rp 403.154.180', btAcv: '63%', btScore: '25.20%', tkbTarget: 'Rp 160.000.000', tkbAct: 'Rp 27.094.435', tkbAcv: '16.93%', tkbScore: '6.77%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Ecommerce', point: 'Transaksi', bobot: '15%', btTarget: '2.720', btAct: '2.277', btAcv: '84%', btScore: '12.56%', tkbTarget: '800', tkbAct: '235', tkbAcv: '29.38%', tkbScore: '4.41%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Ecommerce', point: 'Basket Size', bobot: '15%', btTarget: 'Rp 200.000', btAct: 'Rp 177.055', btAcv: '89%', btScore: '13.28%', tkbTarget: 'Rp 200.000', tkbAct: 'Rp 148.042', tkbAcv: '74.02%', tkbScore: '11.10%', vsAct: 'BT', vsTgt: 'BT' }
        ]
      },
      '6': {
        monthName: 'Juli 2026',
        summary: {
          btScore: '77.98%',
          tkbScore: '38.85%',
          vsActual: { btWins: 12, tkbWins: 2, draws: 0 },
          vsTarget: { btWins: 10, tkbWins: 1, draws: 4 }
        },
        categoryScores: [
          { category: 'Revenue', btScore: 77.98, tkbScore: 38.85 },
          { category: 'Operational', btScore: 89.81, tkbScore: 70.70 },
          { category: 'Marketing', btScore: 56.51, tkbScore: 52.20 },
          { category: 'Ecommerce', btScore: 57.16, tkbScore: 20.44 }
        ],
        items: [
          // REVENUE
          { cat: 'Revenue', point: 'Sales', bobot: '100%', btTarget: 'Rp 6,81 M', btAct: 'Rp 5,31 M', btAcv: '78%', btScore: '77.98%', tkbTarget: 'Rp 11,25 M', tkbAct: 'Rp 4,37 M', tkbAcv: '38.85%', tkbScore: '38.85%', vsAct: 'BT', vsTgt: 'BT' },
          // OPERATIONAL
          { cat: 'Operational', point: 'Transaksi', bobot: '30%', btTarget: '13.621', btAct: '11.257', btAcv: '83%', btScore: '24.79%', tkbTarget: '21.233', tkbAct: '9.757', tkbAcv: '45.95%', tkbScore: '13.79%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Operational', point: 'Basket Size', bobot: '20%', btTarget: 'Rp 500.000', btAct: 'Rp 471.780', btAcv: '94%', btScore: '18.87%', tkbTarget: 'Rp 530.000', tkbAct: 'Rp 466.448', tkbAcv: '88.01%', tkbScore: '17.60%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Operational', point: 'Hitrate', bobot: '15%', btTarget: '35%', btAct: '26.00%', btAcv: '74%', btScore: '11.14%', tkbTarget: '40.35%', tkbAct: '27.74%', tkbAcv: '93.53%', tkbScore: '14.03%', vsAct: 'TKB', vsTgt: 'TKB' },
          { cat: 'Operational', point: 'Deadstock', bobot: '10%', btTarget: 'Rp 531,08 Jt', btAct: 'Rp 563,75 Jt', btAcv: '100%', btScore: '10.00%', tkbTarget: 'Rp 220,48 Jt', tkbAct: 'Rp 48,82 Jt', tkbAcv: '22.14%', tkbScore: '2.21%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Operational', point: 'Selisih Kasir', bobot: '10%', btTarget: 'Rp 300.000', btAct: 'Rp 10.000', btAcv: '100%', btScore: '10.00%', tkbTarget: '-Rp 500.000', tkbAct: 'Rp 128.658', tkbAcv: '100%', tkbScore: '10.00%', vsAct: 'BT', vsTgt: 'DRAW' },
          { cat: 'Operational', point: 'Replenish display', bobot: '5%', btTarget: '97%', btAct: '100%', btAcv: '100%', btScore: '5.00%', tkbTarget: '100%', tkbAct: '100%', tkbAcv: '100%', tkbScore: '5.00%', vsAct: 'DRAW', vsTgt: 'DRAW' },
          { cat: 'Operational', point: 'Kelolosan tag', bobot: '5%', btTarget: '2', btAct: '4', btAcv: '100%', btScore: '5.00%', tkbTarget: '2', tkbAct: '1', tkbAcv: '100%', tkbScore: '5.00%', vsAct: 'TKB', vsTgt: 'DRAW' },
          { cat: 'Operational', point: 'Scale Up Produk Kasir', bobot: '5%', btTarget: '2.251', btAct: '2.803', btAcv: '100%', btScore: '5.00%', tkbTarget: '1.883', tkbAct: '1.155', tkbAcv: '61.34%', tkbScore: '3.07%', vsAct: 'BT', vsTgt: 'BT' },
          // MARKETING
          { cat: 'Marketing', point: 'Traffic Organik', bobot: '50%', btTarget: '64.861', btAct: '36.542', btAcv: '56%', btScore: '28.17%', tkbTarget: '40.000', tkbAct: '21.482', tkbAcv: '53.71%', tkbScore: '26.85%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Marketing', point: 'Traffic Rombongan', bobot: '35%', btTarget: '16.215', btAct: '6.179', btAcv: '38%', btScore: '13.34%', tkbTarget: '10.002', tkbAct: '2.958', tkbAcv: '29.57%', tkbScore: '10.35%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Marketing', point: 'Rating Google Review', bobot: '15%', btTarget: '175', btAct: '301', btAcv: '100%', btScore: '15.00%', tkbTarget: '5', tkbAct: '48', tkbAcv: '100%', tkbScore: '15.00%', vsAct: 'BT', vsTgt: 'DRAW' },
          // ECOMMERCE
          { cat: 'Ecommerce', point: 'Sales', bobot: '40%', btTarget: 'Rp 640,0 Jt', btAct: 'Rp 468,4 Jt', btAcv: '73%', btScore: '29.28%', tkbTarget: 'Rp 160,0 Jt', tkbAct: 'Rp 26,5 Jt', tkbAcv: '16.57%', tkbScore: '6.63%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Ecommerce', point: 'Transaksi', bobot: '15%', btTarget: '2.720', btAct: '2.378', btAcv: '87%', btScore: '13.11%', tkbTarget: '800', tkbAct: '344', tkbAcv: '43.00%', tkbScore: '6.45%', vsAct: 'BT', vsTgt: 'BT' },
          { cat: 'Ecommerce', point: 'Basket Size', bobot: '15%', btTarget: 'Rp 200.000', btAct: 'Rp 196.982', btAcv: '98%', btScore: '14.77%', tkbTarget: 'Rp 200.000', tkbAct: 'Rp 98.223', tkbAcv: '49.11%', tkbScore: '7.37%', vsAct: 'BT', vsTgt: 'BT' }
        ]
      }
    }
  },

  okr: {
    'okr-bt': [
      {
        id: 'BT-OKR-01',
        title: 'Ekspansi Flagship Gallery & Digital Omnichannel BT',
        unit: 'Batik Trusmi',
        status: 'On Track',
        progress: 88,
        owner: 'Rian H.',
        avatar: 'RH',
        keyResults: [
          { title: 'Pembukaan 2 Flagship Store Baru di Jakarta & Bali', current: '2 Stores', target: '2 Stores', percent: 100 },
          { title: 'Peningkatan Sales Digital Website & E-commerce sebesar 35%', current: '+31%', target: '+35%', percent: 88 },
          { title: 'Akuisisi 15.000 VIP Member Batik Heritage', current: '13.200 Member', target: '15.000 Member', percent: 88 }
        ]
      },
      {
        id: 'BT-OKR-02',
        title: 'Digitalisasi Craftsmanship & Autentikasi QR Certificate',
        unit: 'Batik Trusmi',
        status: 'Achieved',
        progress: 100,
        owner: 'Dewi K.',
        avatar: 'DK',
        keyResults: [
          { title: 'Implementasi 100% Seri Batik Tulis Premium berpita sertifikat QR', current: '100%', target: '100%', percent: 100 },
          { title: 'Reduksi Klaim Autentisitas hingga 0%', current: '0 Case', target: '0 Case', percent: 100 }
        ]
      }
    ],

    'okr-tkb': [
      {
        id: 'TKB-OKR-01',
        title: 'Optimalisasi Operasional & Kecepatan Logistics TKB',
        unit: 'TKB Logistics',
        status: 'On Track',
        progress: 92,
        owner: 'Hendra S.',
        avatar: 'HS',
        keyResults: [
          { title: 'On-Time Delivery Rate mencapai minimum 98.5%', current: '98.8%', target: '98.5%', percent: 100 },
          { title: 'Pengurangan Biaya Operasional Armada per-KM sebesar 12%', current: '10.5%', target: '12%', percent: 87.5 }
        ]
      }
    ],

    'okr-prodev': [],

    'okr-produksi': [],

  },

  complain: {
    monthsData: {
      '7': {
        monthName: 'Agustus 2026',
        'complain-bt': {
          summary: { total: 6, offline: 2, online: 4, googleReview: 0 },
          offlineTickets: [
            { category: 'Produk', stand: 'Stand 1', issue: 'Baju Rapuh', solusi: 'Pergantian produk baru ke customer', total: 1 },
            { category: 'B2B Corporate (Sanqua)', stand: 'Garment / B2B', issue: 'Seragam Sanqua: Ritsleting tidak terjahit ke bahan & jahitan dalam tidak rapi (Bukti Video)', solusi: 'Follow up oleh Bu Era BT Permeisari, penarikan & re-stitching prioritas', total: 1 }
          ],
          onlineStar1Tickets: [
            { product: 'BATIK TRUSMI Hem Batik Murah Batik Pria Kemeja Lengan Pendek Atasan Pria Batik Seragaman Motif Bunga Matahari', issue: '(Kualitas Barang): Kualitas buruk, Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Baju Batik Hem Pria Kemeja Pria Lengan Pendek Batik Mega Mendung Kombinasi Beras Tumpah Murah Seragaman', issue: '(Kualitas Barang): Kain tipis seperti saringan, baru dipakai sekali sudah robek dibagian ketiak dua2 nya.. Baru kali ini beli baju sekali pakai.. Menurut saya dengan harga 50 rb masi kemahalan dengan kualitas seperti ini, cukup sekali beli di sini, kecewa sangat', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Hem Batik Pria Kemeja Lengan Pendek Batik Liris ULR Biru BUL', issue: 'Miss Informasi: Ukuran batik xl namun kekecilan', solusi: 'Permintaan Maaf', total: 1 }
          ],
          onlineStar2Tickets: [
            { product: 'BATIK TRUSMI Atasan Wanita Blouse Batik Kerja Motif Liris ULR Biru BUL', issue: '(Kualitas Barang): bahan sangat tipis tanpa furing, bahan cepat kusut, khawatir sekali cuci langsung sobek', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI BELI 3 LEBIH MURAH Sabun Lerak Sabun Cuci Batik', issue: '(Miss Informasi): Produk Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 }
          ]
        },
        'complain-tkb': {
          summary: { total: 0, offline: 0, online: 0, googleReview: 0 },
          googleTickets: [
            { source: 'Google Review', category: 'Pelayanan', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 },
            { source: 'Google Review', category: 'Produk', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 },
            { source: 'Google Review', category: 'Area', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 }
          ]
        }
      },
      '6': {
        monthName: 'Juli 2026',
        'complain-bt': {
          summary: { total: 9, offline: 0, online: 9, googleReview: 0 },
          offlineTickets: [],
          onlineStar1Tickets: [
            { product: 'BATIK TRUSMI Bahan Kain Panjang Batik Tulis Mega Mendung Premium', issue: 'Warna:warna pinknya pucat sekali', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Longdress Pakaian Santai Wanita Daster Batik Jumbo Untuk Wanita Busui Friendly', issue: 'Gak sesuai pesanan😢', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Denim Life Series Kemeja Wanita Denim Kombinasi Batik', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Baju Batik Hem Pria Kemeja Pria Lengan Pendek Batik Mega Mendung Kombinasi Beras Tumpah Murah Seragaman', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Atasan Wanita Blouse Outer Batik Mega Mendung Linzhi', issue: 'pengiriman lama', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Atasan Wanita Blouse Batik Motif Mega Mendung Bumi Obi Mop Biru', issue: 'packaging kurang safety', solusi: 'Permintaan Maaf', total: 1 }
          ],
          onlineStar2Tickets: [
            { product: 'BATIK TRUSMI Kain Pantai Batik Bahan Rayon Batik Cap Motif Mega Mendung Caplis Ckt HL', issue: 'produk tidak sesuai etalase', solusi: 'Pemberian Gift', total: 1 },
            { product: 'BATIK TRUSMI Hem Batik Murah Batik Pria Kemeja Lengan Pendek Atasan Pria Batik Seragaman Motif Bunga Matahari', issue: 'kualitas produk buruk', solusi: 'Permintaan Maaf', total: 1 },
            { product: 'BATIK TRUSMI Outer Batik Wanita Motif Abstrak Kombinasi Alma Coklat', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 }
          ]
        },
        'complain-tkb': {
          summary: { total: 0, offline: 0, online: 0, googleReview: 0 },
          googleTickets: [
            { source: 'Google Review', category: 'Pelayanan', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 },
            { source: 'Google Review', category: 'Produk', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 },
            { source: 'Google Review', category: 'Area', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 }
          ]
        }
      }
    }
  },

  milestone: {
    monthsData: {
      '7': {
        monthName: 'Agustus 2026',
        futureGoals2027: ['Jahit Express 2 Jam', 'Smart Factory 20'],
        'milestone-bt': [
          { id: 1, year: '2026', title: 'Launching Batik Kantoran', status: 'Berjalan', tag: 'Operational', desc: 'Inisiatif peluncuran lini Batik Kantoran untuk segmen korporat & instansi.', markerDone: true },
          { id: 2, year: '2026', title: 'Premium Store Jakarta', status: 'Progress', tag: 'Expansion', desc: 'Pengembangan & persiapan pembukaan galeri Premium Store di Jakarta.', markerDone: false },
          { id: 3, year: '2026', title: 'Premium Store Cirebon', status: 'Progress', tag: 'Expansion', desc: 'Pengembangan & persediaan fasilitas Premium Store di Cirebon.', markerDone: false },
          { id: 4, year: '2026', title: 'Scale Up B2B', status: 'Progress', tag: 'Growth', desc: 'Skalasi ekosistem penjualan & penetrasi pasar Business-to-Business (B2B).', markerDone: false },
          { id: 5, year: '2026', title: 'Handprint Factory', status: 'Berjalan', tag: 'Production', desc: 'Operasional penuh fasilitas produksi cetak batik tulis/tangan (Handprint).', markerDone: true },
          { id: 6, year: '2026', title: 'Garment', status: 'Berjalan', tag: 'Production', desc: 'Operasional manufaktur & penjahitan unit konveksi/garment.', markerDone: true },
          { id: 7, year: '2026', title: 'Laboratory Matching Color', status: 'Berjalan', tag: 'R&D Quality', desc: 'Fasilitas laboratorium formulasi pencelupan & pencocokan warna presisi.', markerDone: true },
          { id: 8, year: '2026', title: 'Weighing System', status: 'Berjalan', tag: 'System', desc: 'Digitalisasi & otomatisasi sistem penimbangan bahan baku produksi.', markerDone: true },
          { id: 9, year: '2026', title: 'Digital Printing', status: 'Progress', tag: 'Technology', desc: 'Implementasi dan instalasi teknologi modern Digital Printing tekstil.', markerDone: false }
        ],
        'milestone-tkb': [
          { id: 1, year: '2026', title: 'Rebranding Experience Lt 4 : Family & Kids', status: 'Progress', tag: 'Rebranding Lt 4', desc: 'Pengembangan konsep zona belanja & hiburan interaktif Family & Kids di Lantai 4.', markerDone: false },
          { id: 2, year: '2026', title: 'Rebranding Experience Lt 3 : Glow In The Dark & Solar Activ', status: 'Progress', tag: 'Rebranding Lt 3', desc: 'Instalasi arena pengalaman sensorial Glow In The Dark & Solar Activity di Lantai 3.', markerDone: false },
          { id: 3, year: '2026', title: 'Rebranding Experience Lt 2 : Canggu - La brissa', status: 'Hold', tag: 'Rebranding Lt 2', desc: 'Penundaan sementara (Hold) penataan area thematic Canggu - La Brissa di Lantai 2.', markerDone: false },
          { id: 4, year: '2026', title: 'Rebranding Experience Lt 1 : Local Bali - Denpasar', status: 'Berjalan', tag: 'Rebranding Lt 1', desc: 'Operasional & penataan zona budaya lokal khas Bali - Denpasar di Lantai 1.', markerDone: true }
        ]
      },
      '6': {
        monthName: 'Juli 2026',
        futureGoals2027: ['Jahit Express 2 Jam', 'Smart Factory 20'],
        'milestone-bt': [
          { id: 1, year: '2026', title: 'Launching Batik Kantoran', status: 'Berjalan', tag: 'Operational', desc: 'Inisiatif peluncuran lini Batik Kantoran untuk segmen korporat & instansi.', markerDone: true },
          { id: 2, year: '2026', title: 'Premium Store Jakarta', status: 'Progress', tag: 'Expansion', desc: 'Pengembangan & persiapan pembukaan galeri Premium Store di Jakarta.', markerDone: false },
          { id: 3, year: '2026', title: 'Premium Store Cirebon', status: 'Progress', tag: 'Expansion', desc: 'Pengembangan & persediaan fasilitas Premium Store di Cirebon.', markerDone: false },
          { id: 4, year: '2026', title: 'Scale Up B2B', status: 'Progress', tag: 'Growth', desc: 'Skalasi ekosistem penjualan & penetrasi pasar Business-to-Business (B2B).', markerDone: false },
          { id: 5, year: '2026', title: 'Handprint Factory', status: 'Berjalan', tag: 'Production', desc: 'Operasional penuh fasilitas produksi cetak batik tulis/tangan (Handprint).', markerDone: true },
          { id: 6, year: '2026', title: 'Garment', status: 'Berjalan', tag: 'Production', desc: 'Operasional manufaktur & penjahitan unit konveksi/garment.', markerDone: true },
          { id: 7, year: '2026', title: 'Laboratory Matching Color', status: 'Berjalan', tag: 'R&D Quality', desc: 'Fasilitas laboratorium formulasi pencelupan & pencocokan warna presisi.', markerDone: true },
          { id: 8, year: '2026', title: 'Weighing System', status: 'Berjalan', tag: 'System', desc: 'Digitalisasi & otomatisasi sistem penimbangan bahan baku produksi.', markerDone: true },
          { id: 9, year: '2026', title: 'Digital Printing', status: 'Progress', tag: 'Technology', desc: 'Implementasi dan instalasi teknologi modern Digital Printing tekstil.', markerDone: false }
        ],
        'milestone-tkb': [
          { id: 1, year: '2026', title: 'Rebranding Experience Lt 4 : Family & Kids', status: 'Progress', tag: 'Rebranding Lt 4', desc: 'Pengembangan konsep zona belanja & hiburan interaktif Family & Kids di Lantai 4.', markerDone: false },
          { id: 2, year: '2026', title: 'Rebranding Experience Lt 3 : Glow In The Dark & Solar Activ', status: 'Progress', tag: 'Rebranding Lt 3', desc: 'Instalasi arena pengalaman sensorial Glow In The Dark & Solar Activity di Lantai 3.', markerDone: false },
          { id: 3, year: '2026', title: 'Rebranding Experience Lt 2 : Canggu - La brissa', status: 'Hold', tag: 'Rebranding Lt 2', desc: 'Penundaan sementara (Hold) penataan area thematic Canggu - La Brissa di Lantai 2.', markerDone: false },
          { id: 4, year: '2026', title: 'Rebranding Experience Lt 1 : Local Bali - Denpasar', status: 'Berjalan', tag: 'Rebranding Lt 1', desc: 'Operasional & penataan zona budaya lokal khas Bali - Denpasar di Lantai 1.', markerDone: true }
        ]
      }
    }
  }
};

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  initLucide();
  bindNavigationEvents();
  bindMobileNavEvents();
  bindHeaderControls();
  bindModalEvents();
  renderCurrentView();
});

function bindMobileNavEvents() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const sidebar = document.querySelector('.sidebar-nav');
  const overlay = document.getElementById('sidebarOverlay');
  const icon = document.getElementById('hamburgerIcon');

  function closeMobileNav() {
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (icon) {
      icon.setAttribute('data-lucide', 'menu');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function openMobileNav() {
    if (sidebar) sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (icon) {
      icon.setAttribute('data-lucide', 'x');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar && sidebar.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileNav);
  }

  document.querySelectorAll('.nav-link, .sub-link').forEach(el => {
    el.addEventListener('click', () => {
      const parentItem = el.closest('.nav-item');
      if (!parentItem || !parentItem.classList.contains('has-sub') || el.classList.contains('sub-link')) {
        closeMobileNav();
      }
    });
  });
}

function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initClock() {
  const clockEl = document.getElementById('clockTime');
  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false });
    if (clockEl) clockEl.textContent = timeStr;
  }
  update();
  setInterval(update, 1000);
}

function bindNavigationEvents() {
  const navLinks = document.querySelectorAll('.nav-link');
  const subLinks = document.querySelectorAll('.sub-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const category = link.getAttribute('data-category');
      const parentItem = link.closest('.nav-item');

      if (parentItem && parentItem.classList.contains('has-sub')) {
        const isOpen = parentItem.classList.contains('open');
        document.querySelectorAll('.nav-item.has-sub').forEach(item => item.classList.remove('open'));
        
        if (!isOpen) {
          parentItem.classList.add('open');
        }

        const subList = subcategoriesMap[category];
        if (subList && subList.length > 0) {
          state.activeCategory = category;
          state.activeSub = subList[0].id;
        }
      } else {
        document.querySelectorAll('.nav-item.has-sub').forEach(item => item.classList.remove('open'));
        state.activeCategory = category;
        state.activeSub = null;
      }

      updateActiveNavUI();
      renderCurrentView();
    });
  });

  subLinks.forEach(sub => {
    sub.addEventListener('click', (e) => {
      e.stopPropagation();
      const category = sub.getAttribute('data-category');
      const subId = sub.getAttribute('data-sub');

      state.activeCategory = category;
      state.activeSub = subId;

      updateActiveNavUI();
      renderCurrentView();
    });
  });
}

function updateActiveNavUI() {
  document.querySelectorAll('.nav-link').forEach(btn => {
    const cat = btn.getAttribute('data-category');
    if (cat === state.activeCategory) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  document.querySelectorAll('.sub-link').forEach(btn => {
    const sub = btn.getAttribute('data-sub');
    if (sub === state.activeSub) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

function bindHeaderControls() {
  const celebrateBtn = document.getElementById('btnCelebrate');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      triggerConfettiCelebration();
    });
  }

  const periodSelect = document.getElementById('periodSelect');
  if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
      state.period = e.target.value;
      if (e.target.value === 'agustus_2026') {
        state.selectedSalesMonth = '7';
      } else if (e.target.value === 'juli_2026') {
        state.selectedSalesMonth = '6';
      } else if (e.target.value === 'ytd2026') {
        state.selectedSalesMonth = 'all';
      }
      renderCurrentView();
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderCurrentView();
    });
  }

    const btnRefresh = document.getElementById('btnRefreshData');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        btnRefresh.style.transform = 'none';
        renderCurrentView();
      }, 500);
    });
  }
}

// --------------------------------------------------------------------------
// THEME MANAGEMENT (Dark & Light Mode Feature)
// --------------------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('ceremonial_theme') || 'dark';
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('ceremonial_theme', newTheme);
      renderCurrentView();
    });
  }
}

function applyTheme(theme) {
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  const toggleBtn = document.getElementById('themeToggleBtn');

  if (theme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    if (icon) icon.setAttribute('data-lucide', 'moon');
    if (text) text.textContent = 'Dark';
    if (toggleBtn) toggleBtn.setAttribute('title', 'Ganti ke Mode Gelap');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    if (icon) icon.setAttribute('data-lucide', 'sun');
    if (text) text.textContent = 'Light';
    if (toggleBtn) toggleBtn.setAttribute('title', 'Ganti ke Mode Terang');
  }
  initLucide();
}

function triggerConfettiCelebration() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899']
    });
  }
}

function bindModalEvents() {
  const modal = document.getElementById('detailModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const actionClose = document.getElementById('modalActionClose');
  const actionCelebrate = document.getElementById('modalActionCelebrate');

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (actionClose) actionClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (actionCelebrate) {
    actionCelebrate.addEventListener('click', () => {
      triggerConfettiCelebration();
      closeModal();
    });
  }
}

function openModal(title, bodyHtml) {
  const modal = document.getElementById('detailModal');
  const modalHeader = document.getElementById('modalHeader');
  const modalBody = document.getElementById('modalBody');

  if (modalHeader) modalHeader.innerHTML = `<h3>${title}</h3>`;
  if (modalBody) modalBody.innerHTML = bodyHtml;
  if (modal) modal.classList.add('active');
  initLucide();
}

function clearActiveCharts() {
  Object.keys(state.activeChartInstances).forEach(key => {
    if (state.activeChartInstances[key]) {
      state.activeChartInstances[key].destroy();
    }
  });
  state.activeChartInstances = {};
}

function renderCurrentView() {
  clearActiveCharts();
  
  const titleEl = document.getElementById('currentCategoryTitle');
  const dividerEl = document.getElementById('pathDivider');
  const subTitleEl = document.getElementById('currentSubTitle');
  const pillsBar = document.getElementById('subPillsBar');
  const container = document.getElementById('dynamicContent');

  const catTitle = categoryTitles[state.activeCategory] || 'Dashboard';
  titleEl.textContent = catTitle;

  const subList = subcategoriesMap[state.activeCategory];
  if (subList && subList.length > 0) {
    dividerEl.style.display = 'inline-block';
    subTitleEl.style.display = 'inline-block';
    
    const currentSubObj = subList.find(s => s.id === state.activeSub) || subList[0];
    state.activeSub = currentSubObj.id;
    subTitleEl.textContent = currentSubObj.title;

    pillsBar.style.display = 'flex';
    pillsBar.innerHTML = subList.map(sub => `
      <button class="pill-btn ${sub.id === state.activeSub ? 'active' : ''}" onclick="selectSubCategory('${sub.id}')">
        ${sub.title}
      </button>
    `).join('');
  } else {
    dividerEl.style.display = 'none';
    subTitleEl.style.display = 'none';
    pillsBar.style.display = 'none';
  }

  let contentHtml = '';
  switch (state.activeCategory) {
    case 'sales-ytd':
      contentHtml = renderSalesYTD();
      break;
    case 'kpi-performance':
      contentHtml = renderKPIPerformance();
      break;
    case 'head-to-head':
      contentHtml = renderHeadToHead();
      break;
    case 'okr':
      if (state.activeSub === 'okr-tkb') {
        contentHtml = renderTKBOKRView();
      } else if (state.activeSub === 'okr-prodev') {
        contentHtml = renderProdevOKRView();
      } else if (state.activeSub === 'okr-produksi') {
        contentHtml = renderProduksiOKRView();
      } else {
        contentHtml = renderOKRView();
      }
      break;
    case 'complain':
      contentHtml = renderComplainView();
      break;
    case 'milestone':
      contentHtml = renderMilestoneView();
      break;
    case 'b2b':
      contentHtml = renderB2BView();
      break;
    default:
      contentHtml = renderSalesYTD();
  }

  container.innerHTML = `<div class="view-animated">${contentHtml}</div>`;
  initLucide();

  if (state.activeCategory === 'sales-ytd') {
    initSalesCharts();
  } else if (state.activeCategory === 'kpi-performance') {
    initKPIChart();
  } else if (state.activeCategory === 'head-to-head') {
    initH2HChart();
  } else if (state.activeCategory === 'complain') {
    initComplainChart();
  } else if (state.activeCategory === 'b2b') {
    initB2BCharts();
  }
}

window.selectSubCategory = function(subId) {
  state.activeSub = subId;
  updateActiveNavUI();
  renderCurrentView();
};

// --------------------------------------------------------------------------
// VIEW 1: SALES YTD (Strictly 2025 vs 2026 Comparison with Dynamic Month Filtering)
// --------------------------------------------------------------------------
function renderSalesYTD() {
  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');
  const formatRupiahShort = (num) => {
    if (num >= 1000000000) return 'Rp ' + (num / 1000000000).toFixed(2).replace('.', ',') + ' M';
    if (num >= 1000000) return 'Rp ' + (num / 1000000).toFixed(2).replace('.', ',') + ' Jt';
    return 'Rp ' + num;
  };

  const selectedBranchId = state.selectedBranch || 'all';
  const selMonth = state.selectedSalesMonth || 'all';

  const branchesWithShare = realSalesData.branches.map(b => {
    const metrics = getBranchSalesMetrics(b.id, selMonth);
    const share = ((b.ytd2026 / totalYTD2026) * 100).toFixed(1);
    return { ...b, ...metrics, share };
  });

  const branches = branchesWithShare.filter(b =>
    !state.searchQuery || b.name.toLowerCase().includes(state.searchQuery)
  );

  const selectedBranchObj = selectedBranchId === 'all'
    ? null
    : realSalesData.branches.find(b => b.id === selectedBranchId);

  // Determine current active filter label
  let filterTitle = 'YTD 2026 (Januari – Agustus)';
  if (selMonth !== 'all') {
    const mIdx = parseInt(selMonth, 10);
    filterTitle = `Bulan ${realSalesData.months[mIdx]} 2026`;
  }

  return `
    <!-- Top Filter Controls Bar: Divisi/Channel Filter & Month/Period Filter -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px; background:var(--bg-card); padding:14px 18px; border-radius:12px; border:1px solid var(--border-color); box-shadow:var(--shadow-sm);">
      <div style="font-size:0.98rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
        <i data-lucide="filter" style="color:var(--accent-gold); width:18px; height:18px;"></i>
        <span>Filter Tampilan Sales YTD: <strong style="color:var(--accent-gold);">${filterTitle}</strong></span>
      </div>

      <div style="display:flex; align-items:center; flex-wrap:wrap; gap:12px;">
        <!-- Filter Bulan Selector -->
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.82rem; color:var(--text-secondary); font-weight:700;">
            <i data-lucide="calendar" style="width:13px; height:13px; display:inline;"></i> Bulan:
          </span>
          <select id="salesMonthFilter" class="pill-btn" style="background:#111827; color:#FFF; font-weight:700; border:1px solid var(--border-highlight); outline:none; padding:7px 14px; border-radius:6px; cursor:pointer;" onchange="window.updateSalesMonthFilter(this.value)">
            <option value="7" ${selMonth === '7' || selMonth === 7 ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
            <option value="6" ${selMonth === '6' || selMonth === 6 ? 'selected' : ''}>Juli 2026 (History 📜)</option>
            <option value="all" ${selMonth === 'all' ? 'selected' : ''}>Semua Bulan (YTD Jan–Ags 2026)</option>
          </select>
        </div>

        <!-- Filter Divisi Selector -->
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.82rem; color:var(--text-secondary); font-weight:700;">
            <i data-lucide="store" style="width:13px; height:13px; display:inline;"></i> Divisi:
          </span>
          <select id="branchChartFilter" class="pill-btn" style="background:#111827; color:#FFF; font-weight:700; border:1px solid var(--accent-sales); outline:none; padding:7px 14px; border-radius:6px; cursor:pointer;" onchange="window.updateBranchChartFilter(this.value)">
            <option value="all" ${state.selectedBranch === 'all' ? 'selected' : ''}>Semua Outlet (Konsolidasi)</option>
            ${realSalesData.branches.map(b => `
              <option value="${b.id}" ${state.selectedBranch === b.id ? 'selected' : ''}>
                ${b.name}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- 7 Kartu Scorecard Masing-Masing Divisi (Enlarged 74px Donut Ring, Dynamic Month & Baseline) -->
    <div style="margin-bottom:24px;">
      <div style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <i data-lucide="layout-grid" style="color:var(--accent-gold);"></i>
        <span>Scorecard Sales Per Divisi / Channel (${filterTitle})</span>
      </div>

      <div class="sales-scorecard-grid">
        ${branchesWithShare.map(b => {
          const isSelected = selectedBranchId === b.id;
          const isPositive = b.growth >= 0;
          const growthColor = isPositive ? '#059669' : '#E11D48';
          const growthText = (isPositive ? '+' : '') + b.growth + '%';
          const absGrowth = Math.min(Math.abs(b.growth), 100);

          return `
            <div onclick="window.updateBranchChartFilter('${b.id}')"
                 style="background:${isSelected ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-card)'};
                        border: 2px solid ${isSelected ? 'var(--accent-gold)' : b.color + '60'};
                        box-shadow: ${isSelected ? '0 0 16px rgba(245, 158, 11, 0.25)' : 'var(--shadow-sm)'};
                        border-radius: var(--radius-md); padding: 12px 12px; cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden;"
                 title="Klik untuk filter grafik divisi ${b.name}">
              
              <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: ${b.color};"></div>
              
              <!-- Header: Nama Divisi + Circular Donut Chart Visual untuk Growth % -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 6px;">
                <div style="min-width: 0; flex: 1;">
                  <span style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary); line-height: 1.2; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.name}">${b.name}</span>
                  <span style="font-size: 0.7rem; color: var(--text-secondary); font-weight: 600; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${b.periodLabel}</span>
                </div>

                <!-- Balanced Circular Donut Chart Visual (56px x 56px) -->
                <div style="position: relative; width: 56px; height: 56px; flex-shrink: 0;" title="Growth YoY: ${growthText}">
                  <svg width="56" height="56" viewBox="0 0 74 74" style="transform: rotate(-90deg); filter: drop-shadow(0 0 4px ${growthColor}40);">
                    <circle cx="37" cy="37" r="28" fill="none" stroke="#E2E8F0" stroke-width="5.5" />
                    <circle cx="37" cy="37" r="28" fill="none" stroke="${growthColor}" stroke-width="5.5"
                            stroke-dasharray="175.93"
                            stroke-dashoffset="${(175.93 * (1 - Math.max(absGrowth, 15) / 100)).toFixed(2)}"
                            stroke-linecap="round" />
                  </svg>
                  <div style="position: absolute; top: 0; left: 0; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: ${growthText.length >= 7 ? '0.62rem' : (growthText.length >= 6 ? '0.68rem' : '0.74rem')}; font-weight: 800; color: ${growthColor}; font-family: monospace; white-space: nowrap; letter-spacing: -0.5px; line-height: 1;">
                    ${growthText}
                  </div>
                </div>
              </div>

              <!-- Angka Total Sales Real 2026 Berdasarkan Filter -->
              <div style="font-size: 1.18rem; font-weight: 800; color: ${b.color}; font-family: monospace; margin-bottom: 8px; letter-spacing: -0.4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${formatRupiah(b.val2026)}">
                ${formatRupiah(b.val2026)}
              </div>

              <!-- Realisasi Bulan Aktif (Tanpa Overflow) -->
              <div class="scorecard-mini-box">
                <div class="scorecard-mini-header">
                  <span class="scorecard-mini-label">
                    <i data-lucide="check-circle-2" style="width:11px; height:11px; flex-shrink:0;"></i>
                    <span>${b.activeMonthLabel}</span>
                  </span>
                </div>
                <div class="scorecard-mini-value">
                  ${formatRupiah(b.activeMonthVal)}
                </div>
              </div>

              <!-- Baseline Sales 2025 (Tanpa Bentrok Badge) -->
              <div class="scorecard-baseline-row">
                <div class="scorecard-baseline-header">
                  <span class="scorecard-baseline-label">Baseline 2025</span>
                  <span class="scorecard-baseline-badge">
                    <i data-lucide="calendar" style="width: 10px; height: 10px; display: inline;"></i>
                    <span>${selMonth === 'all' ? 'Jan–Ags' : realSalesData.months[parseInt(selMonth, 10)]}</span>
                  </span>
                </div>
                <div class="scorecard-baseline-value">
                  ${formatRupiah(b.val2025)}
                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Charts Section: Full Width Monthly Sales Trend Chart -->
    <div class="chart-card" style="margin-bottom: 24px; width: 100%;">
      <div class="chart-card-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div class="chart-card-title">
          <i data-lucide="line-chart" style="color: var(--accent-sales);"></i>
          <span>Grafik Realisasi Sales Bulanan (${selectedBranchObj ? selectedBranchObj.name : 'Konsolidasi Semua Outlet'})</span>
        </div>
      </div>
      <div class="chart-scroll-wrapper">
        <div class="chart-wrapper" style="height: 350px; position: relative;">
          <canvas id="realSalesTrendChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Real Sales Matrix Table per Branch (2026 vs 2025) -->
    <div class="table-card">
      <div class="chart-card-header">
        <div class="chart-card-title">
          <i data-lucide="table" style="color: var(--accent-gold);"></i>
          <span>Ringkasan Realisasi Sales ${filterTitle} & Perbandingan VS Baseline 2025 Per Branch</span>
        </div>
      </div>
      <table class="custom-table">
        <thead>
          <tr>
            <th>Cabang / Channel</th>
            <th>Baseline 2025 (${selMonth === 'all' ? 'Jan–Ags' : realSalesData.months[parseInt(selMonth, 10)]})</th>
            <th>Realisasi 2026 (${selMonth === 'all' ? 'Jan–Ags' : realSalesData.months[parseInt(selMonth, 10)]})</th>
            <th>Growth VS 2025</th>
            <th>Realisasi 2025 (Full Year)</th>
            <th>Detail Data</th>
          </tr>
        </thead>
        <tbody>
          ${branches.map(b => {
            const isHighlighted = state.selectedBranch === b.id;
            return `
              <tr style="${isHighlighted ? 'background:rgba(245, 158, 11, 0.15); border-left:4px solid var(--accent-gold);' : ''}">
                <td><strong>${b.name}</strong></td>
                <td>${formatRupiah(b.val2025)}</td>
                <td style="color:var(--accent-sales); font-weight:700;">${formatRupiah(b.val2026)}</td>
                <td>
                  <span class="status-pill ${b.growth >= 0 ? 'status-on-track' : 'status-at-risk'}">
                    ${b.growth >= 0 ? '+' : ''}${b.growth}%
                  </span>
                </td>
                <td>${formatRupiah(b.total2025)}</td>
                <td>
                  <button class="pill-btn" onclick="showBranchSalesModal('${b.id}')">
                    Breakdown
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Detailed Monthly Breakdown Table 2026 vs 2025 (Jan-Ags) -->
    <div class="table-card">
      <div class="chart-card-header">
        <div class="chart-card-title">
          <i data-lucide="calendar" style="color: var(--accent-okr);"></i>
          <span>Tabel Realisasi Sales Bulanan 2026 (Januari - Agustus)</span>
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Bulan</th>
              ${realSalesData.branches.map(b => `<th style="text-align:right;">${b.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${[0,1,2,3,4,5,6,7].map(mIdx => {
              const monthName = realSalesData.months[mIdx];
              const isAgustusNew = (mIdx === 7);
              const isJuliHistory = (mIdx === 6);
              const isSelectedMonth = selMonth !== 'all' && parseInt(selMonth, 10) === mIdx;

              let rowStyle = '';
              if (isSelectedMonth) {
                rowStyle = 'background: rgba(245, 158, 11, 0.22); border-left: 4px solid var(--accent-gold); font-weight: 700;';
              } else if (isAgustusNew) {
                rowStyle = 'background: rgba(16, 185, 129, 0.15); border-left: 4px solid #10B981; font-weight: 700;';
              } else if (isJuliHistory) {
                rowStyle = 'background: rgba(6, 182, 212, 0.12); border-left: 4px solid #06B6D4; font-weight: 600;';
              }

              return `
                <tr style="${rowStyle}">
                  <td>
                    ${isAgustusNew 
                      ? `<strong style="color: #10B981; display: inline-flex; align-items: center; gap: 6px;"><i data-lucide="sparkles" style="width:16px; height:16px; color:#10B981;"></i> Agustus 2026 (Data Baru ✨)</strong>`
                      : (isJuliHistory 
                          ? `<strong style="color: #06B6D4; display: inline-flex; align-items: center; gap: 6px;"><i data-lucide="history" style="width:16px; height:16px; color:#06B6D4;"></i> Juli 2026 (History 📜)</strong>`
                          : `<strong>${monthName}</strong>`)
                    }
                  </td>
                  ${realSalesData.branches.map(b => {
                    const val = realSalesData.sales2026[b.id][mIdx];
                    return `<td style="text-align:right; ${isAgustusNew ? 'color: #10B981; font-weight: 800;' : (isJuliHistory ? 'color: #06B6D4;' : '')}">${formatRupiah(val)}</td>`;
                  }).join('')}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dedicated B2B Performance & Cash In Analysis Table -->
    <div class="table-card" style="margin-top:24px; border: 1px solid rgba(79, 70, 229, 0.25);">
      <div class="chart-card-header" style="background: rgba(79, 70, 229, 0.08); padding: 14px 18px; border-bottom: 1px solid rgba(79, 70, 229, 0.2); display:flex; justify-content:space-between; align-items:center;">
        <div class="chart-card-title">
          <i data-lucide="badge-dollar-sign" style="color: #818CF8; width: 22px; height: 22px;"></i>
          <span style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">Detail Laporan B2B YTD: ACV Sales & Cash In (2025 vs 2026)</span>
        </div>
        <span class="status-pill status-achieved" style="font-size: 0.78rem; background: rgba(79, 70, 229, 0.15); color: #A5B4FC; border: 1px solid #6366F1;">
          <i data-lucide="trending-up" style="width:13px; height:13px; display:inline;"></i> +105.7% YoY Growth ACV
        </span>
      </div>

      <!-- B2B KPI Executive Scorecard Bar -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; padding: 16px; background: var(--control-bg); border-bottom: 1px solid var(--border-color);">
        <div style="background: var(--bg-card); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color); border-left: 4px solid #818CF8;">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; display: block;">TARGET SALES B2B 2026 (JAN-AGS)</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); font-family: monospace;">Rp 3.960.000.000</span>
        </div>
        <div style="background: var(--bg-card); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color); border-left: 4px solid #10B981;">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; display: block;">REALISASI ACV SALES 2026</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: #10B981; font-family: monospace;">Rp 2.885.932.921</span>
          <span style="font-size: 0.7rem; color: #34D399; font-weight: 700; display: block;">(72.9% Achv | +105.7% YoY)</span>
        </div>
        <div style="background: var(--bg-card); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color); border-left: 4px solid #06B6D4;">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; display: block;">REALISASI CASH IN 2026</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: #06B6D4; font-family: monospace;">Rp 2.131.472.842</span>
          <span style="font-size: 0.7rem; color: #38BDF8; font-weight: 700; display: block;">(53.8% Achv | +352.6% YoY)</span>
        </div>
        <div style="background: var(--bg-card); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color); border-left: 4px solid var(--accent-gold);">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; display: block;">BASELINE CASH IN 2025 (JAN-AGS)</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: var(--accent-gold); font-family: monospace;">Rp 470.958.666</span>
          <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600; display: block;">(Full Year 2025: Rp 1,62 M)</span>
        </div>
      </div>

      <div style="overflow-x:auto;">
        <table class="custom-table" style="font-size: 0.82rem;">
          <thead>
            <tr style="background: var(--control-bg); color: var(--text-primary);">
              <th>BULAN</th>
              <th style="text-align:right;">TARGET 2026</th>
              <th style="text-align:right;">2025 ACV SALES</th>
              <th style="text-align:right;">2025 CASH IN</th>
              <th style="text-align:right; color:#10B981;">2026 ACV SALES</th>
              <th style="text-align:right; color:#06B6D4;">2026 CASH IN</th>
              <th style="text-align:center;">ACHIEVEMENT ACV %</th>
              <th style="text-align:center;">ACHIEVEMENT CASH IN %</th>
              <th style="text-align:center;">GROWTH YOY ACV</th>
            </tr>
          </thead>
          <tbody>
            ${[0,1,2,3,4,5,6,7,8,9,10,11].map(mIdx => {
              const monthName = realSalesData.months[mIdx];
              const target = realSalesData.b2bData.target2026[mIdx];
              const acv25 = realSalesData.b2bData.acv25 ? realSalesData.b2bData.acv25[mIdx] : realSalesData.b2bData.acv2025[mIdx];
              const cash25 = realSalesData.b2bData.cashIn2025[mIdx];
              const acv26 = realSalesData.b2bData.acv26 ? realSalesData.b2bData.acv26[mIdx] : realSalesData.b2bData.acv2026[mIdx];
              const cash26 = realSalesData.b2bData.cashIn2026[mIdx];

              const isAgustus = (mIdx === 7);
              const isJuli = (mIdx === 6);
              const isFuture = (mIdx >= 8);

              const achvAcv = acv26 > 0 ? ((acv26 / target) * 100).toFixed(2) + '%' : '0.00%';
              const achvCash = cash26 > 0 ? ((cash26 / target) * 100).toFixed(2) + '%' : '0.00%';
              
              let growthYoYStr = '-100.00%';
              if (acv26 > 0 && acv25 > 0) {
                const g = (((acv26 - acv25) / acv25) * 100).toFixed(2);
                growthYoYStr = (g >= 0 ? '+' : '') + g + '%';
              } else if (acv26 > 0 && acv25 === 0) {
                growthYoYStr = '+100.00%';
              }

              let b2bRowStyle = '';
              if (isAgustus) b2bRowStyle = 'background: rgba(16, 185, 129, 0.12); border-left: 4px solid #10B981; font-weight: 700;';
              else if (isJuli) b2bRowStyle = 'background: rgba(6, 182, 212, 0.12); border-left: 4px solid #06B6D4; font-weight: 600;';
              else if (isFuture) b2bRowStyle = 'opacity: 0.55;';

              return `
                <tr style="${b2bRowStyle}">
                  <td>
                    ${isAgustus 
                      ? `<strong style="color: #10B981; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="sparkles" style="width:14px; height:14px; color:#10B981;"></i> AGUSTUS</strong>`
                      : (isJuli 
                          ? `<strong style="color: #06B6D4; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="history" style="width:14px; height:14px; color:#06B6D4;"></i> JULI</strong>`
                          : `<strong>${monthName.toUpperCase()}</strong>`)
                    }
                  </td>
                  <td style="text-align:right;">${formatRupiah(target)}</td>
                  <td style="text-align:right;">${acv25 > 0 ? formatRupiah(acv25) : '-'}</td>
                  <td style="text-align:right;">${cash25 > 0 ? formatRupiah(cash25) : '-'}</td>
                  <td style="text-align:right; color:#10B981; font-weight:${acv26 > 0 ? '700' : '400'};">${acv26 > 0 ? formatRupiah(acv26) : '-'}</td>
                  <td style="text-align:right; color:#06B6D4; font-weight:${cash26 > 0 ? '700' : '400'};">${cash26 > 0 ? formatRupiah(cash26) : '-'}</td>
                  <td style="text-align:center;">
                    <span class="status-pill ${parseFloat(achvAcv) >= 70 ? 'status-achieved' : (parseFloat(achvAcv) >= 50 ? 'status-on-track' : 'status-at-risk')}">
                      ${achvAcv}
                    </span>
                  </td>
                  <td style="text-align:center;">
                    <span class="status-pill ${parseFloat(achvCash) >= 70 ? 'status-achieved' : (parseFloat(achvCash) >= 50 ? 'status-on-track' : 'status-at-risk')}">
                      ${achvCash}
                    </span>
                  </td>
                  <td style="text-align:center;">
                    <span class="status-pill ${growthYoYStr.startsWith('+') ? 'status-achieved' : 'status-at-risk'}">
                      ${growthYoYStr}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}

            <!-- TOTAL YTD (JAN-AGS) SUMMARY ROW -->
            <tr style="background: rgba(79, 70, 229, 0.18); font-weight: 800; border-top: 2px solid #818CF8;">
              <td style="color: var(--text-primary);">TOTAL YTD (JAN-AGS)</td>
              <td style="text-align:right; color:var(--text-primary);">Rp 3.960.000.000</td>
              <td style="text-align:right; color:var(--text-primary);">Rp 1.402.798.530</td>
              <td style="text-align:right; color:var(--text-primary);">Rp 470.958.666</td>
              <td style="text-align:right; color:#10B981;">Rp 2.885.932.921</td>
              <td style="text-align:right; color:#06B6D4;">Rp 2.131.472.842</td>
              <td style="text-align:center; color:#10B981;">72.88%</td>
              <td style="text-align:center; color:#06B6D4;">53.83%</td>
              <td style="text-align:center; color:#10B981;">+105.73%</td>
            </tr>

            <!-- TOTAL FULL YEAR 2025 BASELINE ROW -->
            <tr style="background: rgba(255, 255, 255, 0.04); font-weight: 700;">
              <td style="color: var(--text-secondary);">TOTAL FULL YEAR 2025</td>
              <td style="text-align:right;">-</td>
              <td style="text-align:right;">Rp 2.659.742.404</td>
              <td style="text-align:right;">Rp 1.624.985.985</td>
              <td style="text-align:right;">-</td>
              <td style="text-align:right;">-</td>
              <td style="text-align:center;">-</td>
              <td style="text-align:center;">-</td>
              <td style="text-align:center;">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Global Filter Handler Functions
window.updateSalesMonthFilter = function(val) {
  state.selectedSalesMonth = val;
  if (val === '7') state.period = 'agustus_2026';
  else if (val === '6') state.period = 'juli_2026';
  else if (val === 'all') state.period = 'ytd2026';
  
  // Sync main header period selector if present
  const periodSelect = document.getElementById('periodSelect');
  if (periodSelect) periodSelect.value = state.period;

  renderCurrentView();
};

window.updateBranchChartFilter = function(branchId) {
  state.selectedBranch = branchId;
  renderCurrentView();
};

function initSalesCharts() {
  const trendCtx = document.getElementById('realSalesTrendChart');

  if (trendCtx) {
    if (state.activeChartInstances.realSalesTrend) {
      state.activeChartInstances.realSalesTrend.destroy();
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags'];
    let raw2026 = [];
    let raw2025 = [];

    if (state.selectedBranch === 'all') {
      raw2026 = months.map((_, i) => realSalesData.branches.reduce((sum, b) => sum + realSalesData.sales2026[b.id][i], 0));
      raw2025 = months.map((_, i) => realSalesData.branches.reduce((sum, b) => sum + realSalesData.sales2025[b.id][i], 0));
    } else {
      const bId = state.selectedBranch;
      raw2026 = months.map((_, i) => realSalesData.sales2026[bId][i]);
      raw2025 = months.map((_, i) => realSalesData.sales2025[bId][i]);
    }

    const data2026InM = raw2026.map(val => val / 1000000000);
    const data2025InM = raw2025.map(val => val / 1000000000);

    const selMIdx = state.selectedSalesMonth === 'all' ? -1 : parseInt(state.selectedSalesMonth, 10);

    const bg2026 = months.map((_, i) => i === selMIdx ? 'rgba(245, 158, 11, 0.95)' : (i === 7 ? 'rgba(16, 185, 129, 0.95)' : 'rgba(16, 185, 129, 0.8)'));
    const border2026 = months.map((_, i) => i === selMIdx ? '#F59E0B' : '#10B981');

    const barValueLabelsPlugin = {
      id: 'barValueLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const isSmallScreen = chart.width < 500 || window.innerWidth < 600;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          if (dataset.type === 'bar') {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((bar, index) => {
              const rawVal = dataset.rawValues[index];
              const rawVal2025 = chart.data.datasets[1]?.rawValues[index];
              if (!rawVal || rawVal === 0) return;
              
              let formattedNominal = '';
              if (rawVal >= 1000000000) {
                formattedNominal = (isSmallScreen ? '' : 'Rp ') + (rawVal / 1000000000).toFixed(1).replace('.', ',') + 'M';
              } else if (rawVal >= 1000000) {
                formattedNominal = (isSmallScreen ? '' : 'Rp ') + (rawVal / 1000000).toFixed(0).replace('.', ',') + 'Jt';
              } else {
                formattedNominal = '' + rawVal;
              }

              let growthStr = '';
              if (rawVal2025 && rawVal2025 > 0) {
                const g = (((rawVal - rawVal2025) / rawVal2025) * 100).toFixed(1);
                growthStr = (g >= 0 ? '+' : '') + g + '%';
              }

              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              const barHeight = Math.abs(bar.base - bar.y);
              const centerY = barHeight > 45 ? (bar.y + bar.base) / 2 : bar.y - 16;
              const fontSize = isSmallScreen ? 9 : 11;
              const subFontSize = isSmallScreen ? 8 : 10;

              // Draw nominal text inside/above bar
              ctx.fillStyle = '#FFFFFF';
              ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
              ctx.fillText(formattedNominal, bar.x, centerY - (growthStr ? 5 : 0));

              // Draw growth % text inside/above bar
              if (growthStr) {
                const isPositive = growthStr.startsWith('+');
                ctx.fillStyle = isPositive ? '#A7F3D0' : '#FCA5A5';
                ctx.font = `bold ${subFontSize}px "Plus Jakarta Sans", sans-serif`;
                ctx.fillText(growthStr, bar.x, centerY + (isSmallScreen ? 6 : 8));
              }
              
              ctx.restore();
            });
          }
        });
      }
    };

    state.activeChartInstances.realSalesTrend = new Chart(trendCtx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            type: 'bar',
            label: '2026 Sales',
            data: data2026InM,
            rawValues: raw2026,
            backgroundColor: bg2026,
            borderColor: border2026,
            borderWidth: 1.5,
            borderRadius: 6,
            order: 2
          },
          {
            type: 'line',
            label: '2025 Trendline',
            data: data2025InM,
            rawValues: raw2025,
            borderColor: '#06B6D4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderDash: [4, 4],
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: '#06B6D4',
            fill: false,
            tension: 0.35,
            order: 1
          }
        ]
      },
      plugins: [barValueLabelsPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#9CA3AF' } },
          tooltip: {
            callbacks: {
              label: function(context) {
                const rawVal = context.dataset.rawValues[context.dataIndex];
                const fullRupiah = 'Rp ' + Number(rawVal).toLocaleString('id-ID');

                if (context.dataset.type === 'line' || context.datasetIndex === 1) {
                  return ' ' + context.dataset.label + ': ' + fullRupiah;
                }

                let text = ' ' + context.dataset.label + ': ' + fullRupiah;
                const val2025 = context.chart.data.datasets[1].rawValues[context.dataIndex];
                if (val2025 > 0) {
                  const g = (((rawVal - val2025) / val2025) * 100).toFixed(1);
                  const sign = g >= 0 ? '+' : '';
                  text += ` (${sign}${g}% YoY)`;
                }
                return text;
              }
            }
          }
        },
        scales: {
          x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: {
            ticks: {
              color: '#9CA3AF',
              callback: function(value) {
                if (value >= 1) return 'Rp ' + value.toFixed(1) + ' M';
                if (value > 0) return 'Rp ' + (value * 1000).toFixed(0) + ' Jt';
                return 'Rp 0';
              }
            },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        }
      }
    });
  }
}

window.showBranchSalesModal = function(branchId) {
  const branch = realSalesData.branches.find(b => b.id === branchId);
  if (!branch) return;
  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

  const rows2026 = realSalesData.sales2026[branchId];
  const rows2025 = realSalesData.sales2025[branchId];

  let tableHtml = `
    <table class="custom-table" style="font-size:0.85rem;">
      <thead>
        <tr>
          <th>Bulan</th>
          <th>2026 (Rp)</th>
          <th>2025 (Rp)</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < 12; i++) {
    tableHtml += `
      <tr style="${i === 7 ? 'background:rgba(16,185,129,0.15); font-weight:700;' : (i === 6 ? 'background:rgba(6,182,212,0.1);' : '')}">
        <td><strong>${realSalesData.months[i]}</strong> ${i === 7 ? '✨' : (i === 6 ? '📜' : '')}</td>
        <td style="color:var(--accent-sales);">${i <= 7 ? formatRupiah(rows2026[i]) : '-'}</td>
        <td>${formatRupiah(rows2025[i])}</td>
      </tr>
    `;
  }

  tableHtml += `</tbody></table>`;

  openModal(
    `Detail Realisasi Sales: ${branch.name}`,
    `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p><strong>YTD 2026 (Jan–Ags):</strong> <span style="color:var(--accent-sales); font-weight:800; font-size:1.1rem;">${formatRupiah(branch.ytd2026)}</span> (Growth vs 2025: ${branch.growth2026}%)</p>
        <p><strong>Total Realisasi 2025 (Full Year):</strong> ${formatRupiah(branch.total2025)}</p>
        ${tableHtml}
      </div>
    `
  );
};

// Helper function to render Unit Logo (Batik Trusmi or The Keranjang Bali)
function getUnitLogoHtml(subId, height = 30) {
  const isTkb = subId && (subId.toLowerCase().includes('tkb'));
  if (isTkb) {
    return `<img src="asset/keranjang bali.png" alt="The Keranjang Bali" style="height:${height}px; width:auto; object-fit:contain; vertical-align:middle; filter:drop-shadow(0 0 6px rgba(6,182,212,0.4));" />`;
  }
  return `<img src="asset/bt trusmi logo.webp" alt="BT Batik Trusmi" style="height:${height}px; width:auto; object-fit:contain; vertical-align:middle; filter:drop-shadow(0 0 6px rgba(245,158,11,0.4));" />`;
}

function getAcvPillHtml(acvVal) {
  const num = parseFloat(acvVal);
  if (isNaN(num)) return `<span class="status-pill status-at-risk">-</span>`;
  let bg, color, border;
  if (num < 50) {
    // Merah (< 50%)
    bg = 'rgba(239, 68, 68, 0.2)';
    color = '#FCA5A5';
    border = '1px solid rgba(239, 68, 68, 0.5)';
  } else if (num < 70) {
    // Kuning (50% - 70%)
    bg = 'rgba(245, 158, 11, 0.2)';
    color = '#FDE047';
    border = '1px solid rgba(245, 158, 11, 0.5)';
  } else {
    // Hijau (70% - 100%+)
    bg = 'rgba(16, 185, 129, 0.2)';
    color = '#6EE7B7';
    border = '1px solid rgba(16, 185, 129, 0.5)';
  }
  return `<span class="status-pill" style="background:${bg}; color:${color}; border:${border}; font-weight:800; font-size:0.78rem; padding:3px 10px; border-radius:12px; display:inline-block; text-align:center; min-width:48px;">${num}%</span>`;
}

function renderKPIPerformance() {
  const subId = state.activeSub || 'kpi-bt';
  const rawUnitData = mockData.kpiPerformance[subId] || mockData.kpiPerformance['kpi-bt'];

  // Resolve month data if available
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7'; // '7' = Ags 2026 (default), '6' = Jul 2026 (history)
  const unitData = rawUnitData.monthsData ? (rawUnitData.monthsData[currentMonthKey] || rawUnitData.monthsData['7']) : rawUnitData;
  const monthTitle = unitData.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');

  // Handle department filter state
  const selectedDeptFilter = state.kpiDeptFilter || 'all';

  if (!unitData.scorecard) {
    return `
      <div class="metrics-grid">
        <div class="metric-card" style="grid-column: span 2;">
          <div class="metric-card-header">
            <span class="metric-title">Overall Score KPI: ${unitData.unitName}</span>
            <div class="metric-icon-box kpi-theme"><i data-lucide="crown"></i></div>
          </div>
          <div style="display:flex; align-items:center; gap:24px;">
            <div class="metric-value" style="font-size:3rem; color:var(--accent-kpi); margin:0;">${unitData.overallScore}%</div>
            <div>
              <div class="status-pill status-achieved" style="font-size:0.85rem; padding:6px 14px;">PERFORMA SANGAT UNGGUL</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  const filteredDepartments = unitData.departments.filter(dept => {
    if (selectedDeptFilter !== 'all' && dept.id !== selectedDeptFilter) return false;
    if (state.searchQuery && !dept.name.toLowerCase().includes(state.searchQuery)) return false;
    return true;
  });

  // Filter Red Flags based on selected department ID
  const filteredRedFlags = unitData.redFlags.filter(rf => {
    if (selectedDeptFilter === 'all') return true;
    return rf.deptId === selectedDeptFilter;
  });

  // Filter Violations based on selected department ID
  const filteredViolations = unitData.violations.filter(v => {
    if (selectedDeptFilter === 'all') return true;
    return v.deptId === selectedDeptFilter;
  });

  return `
    <!-- TOP HEADER SCORECARD (7 Kartu Departemen Interaktif) -->
    <div style="margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:10px; margin:0;">
            ${getUnitLogoHtml(subId, 32)}
            <span>Header Scorecard KPI ${monthTitle} — ${unitData.unitName}</span>
          </h2>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:4px;">
            Skor Terbobot Konsolidasi Overall: <strong style="color:var(--accent-gold); font-size:1.05rem;">${unitData.overallScore}%</strong>
          </p>
        </div>

        <!-- Filter Interaktif Dropdown & Reset -->
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="font-size:0.85rem; color:var(--text-secondary); font-weight:700;"><i data-lucide="calendar" style="width:14px; height:14px; display:inline;"></i> Filter Bulan:</span>
          <select class="chart-filter" id="kpiMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" style="background:var(--bg-card); border:1px solid var(--accent-gold); color:var(--text-primary); padding:8px 14px; border-radius:var(--radius-sm); font-size:0.85rem; font-weight:700; cursor:pointer;">
            <option value="7" ${state.selectedSalesMonth === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
            <option value="6" ${state.selectedSalesMonth === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
          </select>

          <span style="font-size:0.85rem; color:var(--text-secondary); font-weight:700; margin-left:6px;"><i data-lucide="filter" style="width:14px; height:14px; display:inline;"></i> Departemen:</span>
          <select class="chart-filter" id="kpiDeptSelect" onchange="window.handleKPIDeptFilterChange(this.value)" style="background:var(--bg-card); border:1px solid var(--accent-gold); color:var(--text-primary); padding:8px 14px; border-radius:var(--radius-sm); font-size:0.85rem; font-weight:700; cursor:pointer;">
            <option value="all" ${selectedDeptFilter === 'all' ? 'selected' : ''}>Semua Departemen (7)</option>
            ${unitData.departments.map(d => `<option value="${d.id}" ${selectedDeptFilter === d.id ? 'selected' : ''}>${d.name} (${d.score}%)</option>`).join('')}
          </select>
          ${selectedDeptFilter !== 'all' ? `
            <button onclick="window.handleKPIDeptFilterChange('all')" class="btn-ceremony" style="padding:6px 12px; font-size:0.78rem;">
              <i data-lucide="rotate-ccw" style="width:12px; height:12px;"></i> Tampilkan Semua
            </button>
          ` : ''}
        </div>
      </div>

      <!-- 7 Kartu Ringkas Header Scorecard (Klik Kartu untuk Filter Langsung) -->
      <div class="kpi-scorecard-grid">
        ${unitData.scorecard.map((c) => {
          const isSelected = selectedDeptFilter === c.id;
          return `
            <div onclick="window.handleKPIDeptFilterChange('${c.id}')"
                 style="background:${isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-card)'}; 
                        border:2px solid ${isSelected ? 'var(--accent-gold)' : c.color + '50'}; 
                        box-shadow: ${isSelected ? '0 0 12px rgba(245, 158, 11, 0.3)' : 'var(--shadow-sm)'};
                        border-radius:var(--radius-md); padding:10px 12px; cursor:pointer; transition:all 0.2s ease; position:relative; overflow:hidden;"
                 title="Klik untuk filter departemen ${c.name}">
              <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:${c.color};"></div>
              <div style="font-size:0.72rem; color:${isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)'}; font-weight:700; margin-bottom:6px; line-height:1.2; display:flex; justify-content:space-between; align-items:center;">
                <span>${c.name}</span>
                ${isSelected ? '<i data-lucide="check-circle-2" style="width:12px; height:12px; color:var(--accent-gold);"></i>' : ''}
              </div>
              <div style="display:flex; align-items:baseline; justify-content:space-between;">
                <span style="font-size:1.4rem; font-weight:800; color:${c.color}; font-family:monospace;">${c.score}%</span>
                <span class="status-pill ${c.badgeClass}" style="font-size:0.6rem; padding:1px 6px;">
                  ${c.level === 'high' ? 'Hijau' : (c.level === 'medium' ? 'Kuning' : 'Merah')}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- RED FLAG PANEL & TRACKER (Layout Kompak 2 Kolom Jika 'All', atau Full Per Departemen) -->
    <div class="red-flag-grid">
      
      <!-- RED FLAG PANEL (%ACV < 70%) -->
      ${filteredRedFlags.length > 0 ? `
        <div class="table-card" style="border:1px solid rgba(225, 29, 72, 0.3); background:rgba(225, 29, 72, 0.04); padding:16px;">
          <div class="chart-card-header" style="border-bottom:1px solid rgba(225, 29, 72, 0.2); padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <div class="chart-card-title" style="color:#E11D48; font-weight:800; font-size:0.95rem;">
              <i data-lucide="alert-triangle" style="color:#E11D48;"></i>
              <span>Red Flag Panel (%ACV < 70%)</span>
              <span style="background:rgba(225, 29, 72, 0.15); color:#BE123C; font-size:0.7rem; padding:2px 6px; border-radius:10px; font-weight:800;">
                ${filteredRedFlags.length} Kritis
              </span>
            </div>
          </div>
          <div style="max-height:280px; overflow-y:auto;">
            <table class="custom-table" style="font-size:0.8rem;">
              <thead>
                <tr>
                  <th>Dept / Objective</th>
                  <th style="text-align:right;">Target</th>
                  <th style="text-align:right;">Actual</th>
                  <th style="text-align:center;">%ACV</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRedFlags.map(rf => `
                  <tr>
                    <td>
                      <strong style="color:var(--text-primary); display:block;">${rf.objective}</strong>
                      <span style="font-size:0.72rem; color:var(--text-secondary);">${rf.dept}</span>
                    </td>
                    <td style="text-align:right; font-family:monospace; color:var(--text-secondary);">${rf.target || '-'}</td>
                    <td style="text-align:right; font-family:monospace; color:#E11D48; font-weight:700;">${rf.actual}</td>
                    <td style="text-align:center;">
                      ${getAcvPillHtml(rf.acv)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- TRACKER PELANGGARAN & SANKSIS -->
      ${filteredViolations.length > 0 ? `
        <div class="table-card" style="border:1px solid rgba(217, 119, 6, 0.3); background:rgba(217, 119, 6, 0.04); padding:16px;">
          <div class="chart-card-header" style="border-bottom:1px solid rgba(217, 119, 6, 0.2); padding-bottom:10px; margin-bottom:10px;">
            <div class="chart-card-title" style="color:var(--accent-gold); font-weight:800; font-size:0.95rem;">
              <i data-lucide="shield-alert" style="color:var(--accent-gold);"></i>
              <span>Tracker Pelanggaran & Sanksi Ops</span>
            </div>
          </div>
          <div style="max-height:280px; overflow-y:auto;">
            <table class="custom-table" style="font-size:0.8rem;">
              <thead>
                <tr>
                  <th>Indikator & Dept</th>
                  <th>Pelanggaran & Sanksi</th>
                </tr>
              </thead>
              <tbody>
                ${filteredViolations.map(v => `
                  <tr>
                    <td>
                      <strong style="color:var(--accent-gold); display:block;">${v.indicator}</strong>
                      <span style="font-size:0.72rem; color:var(--text-secondary);">${v.dept}</span>
                    </td>
                    <td>
                      <div style="color:#B91C1C; font-size:0.75rem; margin-bottom:2px; font-weight:600;">${v.pelanggaran}</div>
                      <span class="status-pill status-at-risk" style="font-size:0.68rem;">${v.sanksi}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

    </div>

    <!-- BREAKDOWN DEPARTEMEN TERFILTER -->
    <div style="margin-bottom:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0; display:flex; align-items:center; gap:8px;">
          <i data-lucide="layers" style="color:var(--accent-kpi);"></i>
          Rincian Scorecard Departemen (${filteredDepartments.length} Departemen Tampil)
        </h3>
      </div>

      ${filteredDepartments.map(dept => `
        <div class="table-card" style="margin-bottom:20px; border-left:4px solid var(--accent-kpi);">
          <div class="chart-card-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">
            <div class="chart-card-title">
              <span style="font-size:1.05rem; font-weight:800; color:var(--text-primary);">${dept.name}</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="status-pill ${dept.statusClass}" style="font-size:0.85rem; font-weight:800; padding:4px 12px;">
                Score KPI: ${dept.score}%
              </span>
            </div>
          </div>

          ${dept.perspectives.map(p => `
            <div style="margin-bottom:16px;">
              <div style="background:rgba(255, 255, 255, 0.04); padding:6px 12px; border-radius:6px; border-left:3px solid var(--accent-kpi); margin-bottom:8px; font-weight:700; font-size:0.85rem; color:var(--text-primary); display:flex; justify-content:space-between; border: 1px solid var(--border-color);">
                <span>${p.name}</span>
                <span style="color:var(--text-secondary); font-size:0.78rem;">Bobot: ${p.weight}</span>
              </div>
              <div style="overflow-x:auto;">
                <table class="custom-table" style="font-size:0.82rem;">
                  <thead>
                    <tr>
                      <th>Objective</th>
                      <th style="text-align:center; width:70px;">Bobot</th>
                      <th style="text-align:right;">Target</th>
                      <th style="text-align:right;">Actual</th>
                      <th style="text-align:center; width:80px;">%ACV</th>
                      <th style="text-align:center; width:80px;">%KPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${p.objectives.map(obj => `
                      <tr>
                        <td>
                          <strong style="color:#FFF;">${obj.name}</strong>
                          ${obj.violation ? `<div style="font-size:0.72rem; color:#EF4444; margin-top:2px;"><i data-lucide="alert-circle" style="width:11px; height:11px; display:inline;"></i> <strong>PELANGGARAN:</strong> ${obj.violation}</div>` : ''}
                          ${obj.footnote ? `<div style="font-size:0.72rem; color:#06B6D4; margin-top:2px;"><i data-lucide="info" style="width:11px; height:11px; display:inline;"></i> ${obj.footnote}</div>` : ''}
                        </td>
                        <td style="text-align:center; font-family:monospace;">${obj.bobot}</td>
                        <td style="text-align:right; font-family:monospace;">${obj.target}</td>
                        <td style="text-align:right; font-family:monospace; color:var(--accent-sales); font-weight:700;">${obj.actual}</td>
                        <td style="text-align:center;">
                          ${getAcvPillHtml(obj.acv)}
                        </td>
                        <td style="text-align:center; font-weight:700; color:var(--accent-gold);">${obj.kpi}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

// Handler function for filter change
window.handleKPIDeptFilterChange = function(value) {
  state.kpiDeptFilter = value;
  renderCurrentView();
  const contentArea = document.querySelector('.main-content') || document.querySelector('.content-body');
  if (contentArea) {
    contentArea.scrollTop = 0;
  }
};

function initKPIChart() {
  const radarCtx = document.getElementById('kpiRadarChart');
  const subId = state.activeSub || 'kpi-bt';
  const rawUnitData = mockData.kpiPerformance[subId] || mockData.kpiPerformance['kpi-bt'];
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const unitData = rawUnitData.monthsData ? (rawUnitData.monthsData[currentMonthKey] || rawUnitData.monthsData['7']) : rawUnitData;

  if (radarCtx) {
    state.activeChartInstances.kpiRadar = new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: unitData.departments.map(d => d.name),
        datasets: [
          {
            label: 'Actual Score (%)',
            data: unitData.departments.map(d => d.score),
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.25)',
            borderWidth: 2,
            pointBackgroundColor: '#8B5CF6'
          },
          {
            label: 'Target Minimum (%)',
            data: unitData.departments.map(d => d.target),
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderDash: [4, 4],
            borderWidth: 1,
            pointBackgroundColor: '#FFF'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#9CA3AF' } } },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#9CA3AF', font: { size: 11 } },
            ticks: { display: false }
          }
        }
      }
    });
  }
}

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// VIEW 3: HEAD TO HEAD (Strictly Real Data: BT vs TKB)
// --------------------------------------------------------------------------
function renderHeadToHead() {
  const rawH2H = mockData.headToHead;
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const h2h = rawH2H.monthsData ? (rawH2H.monthsData[currentMonthKey] || rawH2H.monthsData['7']) : rawH2H;
  const s = h2h.summary;
  const monthTitle = h2h.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');

  const selectedCat = state.h2hCategoryFilter || 'all';

  // Filter items based on selected category dropdown
  const filteredItems = h2h.items.filter(item => {
    if (selectedCat === 'all') return true;
    return item.cat.toLowerCase() === selectedCat.toLowerCase();
  });

  return `
    <!-- Top Executive Leaderboard Card -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); box-shadow:var(--shadow-sm); border-radius:var(--radius-md); padding:20px; margin-bottom:24px; position:relative; overflow:hidden;">
      <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, #059669, #D97706, #0284C7);"></div>
      
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
        <!-- Left: BT Status -->
        <div style="flex:1; min-width:260px; display:flex; align-items:center; gap:16px; background:rgba(5, 150, 105, 0.08); padding:16px; border-radius:var(--radius-sm); border:1px solid rgba(5, 150, 105, 0.25);">
          <div style="width:52px; height:52px; border-radius:50%; background:#059669; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:1.5rem; box-shadow:0 4px 12px rgba(5, 150, 105, 0.3); flex-shrink:0;">
            <i data-lucide="crown"></i>
          </div>
          <div>
            <span style="font-size:0.78rem; color:#047857; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; display:block;">Pemenang H2H (VS Actual & Target)</span>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:2px 0;">Batik Trusmi (BT)</h3>
            <div style="display:flex; gap:10px; margin-top:4px; font-size:0.8rem; font-weight:700;">
              <span style="color:#059669;">VS Actual: <strong>${s.vsActual.btWins} WIN</strong></span>
              <span style="color:var(--accent-gold);">• VS Target: <strong>${s.vsTarget.btWins} WIN</strong></span>
            </div>
          </div>
        </div>

        <!-- Center: VS Badge & Month Filter -->
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
          <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg, #DB2777, #7C3AED); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.2rem; color:#FFF; box-shadow:0 4px 14px rgba(219,39,119,0.35);">
            VS
          </div>
          <span style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px; font-weight:700;">H2H ${monthTitle}</span>
          <div style="margin-top:6px;">
            <select class="chart-filter" id="h2hMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" style="background:var(--bg-card); border:1px solid var(--accent-gold); color:var(--text-primary); padding:5px 12px; border-radius:var(--radius-sm); font-size:0.8rem; font-weight:700; cursor:pointer;">
              <option value="7" ${state.selectedSalesMonth === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
              <option value="6" ${state.selectedSalesMonth === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
            </select>
          </div>
          <button class="btn-ceremony" onclick="triggerConfettiCelebration()" style="padding:4px 12px; font-size:0.72rem; margin-top:6px;">
            <i data-lucide="sparkles" style="width:12px; height:12px;"></i> Selebrasi BT
          </button>
        </div>

        <!-- Right: TKB Status -->
        <div style="flex:1; min-width:260px; display:flex; align-items:center; gap:16px; background:rgba(2, 132, 199, 0.08); padding:16px; border-radius:var(--radius-sm); border:1px solid rgba(2, 132, 199, 0.25);">
          <div style="width:52px; height:52px; border-radius:50%; background:#0284C7; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:1.5rem; box-shadow:0 4px 12px rgba(2, 132, 199, 0.3); flex-shrink:0;">
            <i data-lucide="store"></i>
          </div>
          <div>
            <span style="font-size:0.78rem; color:#0369A1; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; display:block;">Runner-Up H2H</span>
            <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:2px 0;">The Keranjang Bali (TKB)</h3>
            <div style="display:flex; gap:10px; margin-top:4px; font-size:0.8rem; font-weight:700;">
              <span style="color:#E11D48;">VS Actual: <strong>${s.vsActual.tkbWins} WIN</strong></span>
              <span style="color:var(--text-secondary);">• VS Target: <strong>${s.vsTarget.tkbWins} WIN / 4 DRAW</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grafik Visual Bar Chart (FULL WIDTH 100% Dengan Persentase Angka di Setiap Batang Bar) -->
    <div class="chart-card" style="margin-bottom:24px; width:100%;">
      <div class="chart-card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div class="chart-card-title">
          <i data-lucide="bar-chart-3" style="color:var(--accent-gold);"></i>
          <span>Perbandingan Total Skor KPI (%) Per Kategori (${monthTitle})</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary); font-weight:600;">
          <span style="display:inline-block; width:10px; height:10px; background:#059669; border-radius:2px; margin-right:4px;"></span> BT
          <span style="display:inline-block; width:10px; height:10px; background:#0284C7; border-radius:2px; margin-left:10px; margin-right:4px;"></span> TKB
        </div>
      </div>
      <div class="chart-wrapper" style="height:320px;">
        <canvas id="h2hBarChart"></canvas>
      </div>
    </div>

    <!-- Matriks Perbandingan Detail (Dengan Dropdown Filter Kategori & Tampilan Sangat Rapi) -->
    <div class="table-card" style="border:1px solid rgba(217, 119, 6, 0.25);">
      
      <!-- Filter Dropdown & Quick Pills -->
      <div class="chart-card-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; border-bottom:1px solid var(--border-color); padding-bottom:14px; margin-bottom:16px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:800; color:var(--text-primary); margin:0; display:flex; align-items:center; gap:8px;">
            <i data-lucide="filter" style="color:var(--accent-gold); width:18px; height:18px;"></i>
            Matriks Perbandingan H2H ${monthTitle}
          </h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">Filter berdasarkan kategori untuk membaca data lebih fokus dan mudah</p>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="font-size:0.82rem; color:var(--text-secondary); font-weight:700;">Filter Kategori:</span>
          
          <select id="h2hCatSelect" onchange="window.handleH2HCatFilterChange(this.value)" 
                  style="background:var(--bg-card); border:2px solid var(--accent-gold); color:var(--text-primary); padding:8px 14px; border-radius:var(--radius-sm); font-size:0.85rem; font-weight:800; cursor:pointer;">
            <option value="all" ${selectedCat === 'all' ? 'selected' : ''}>Semua Kategori (${filteredItems.length} Indikator)</option>
            ${h2h.categoryScores.map(c => `<option value="${c.category}" ${selectedCat === c.category ? 'selected' : ''}>${c.category} (BT ${c.btScore}% vs TKB ${c.tkbScore}%)</option>`).join('')}
          </select>

          <!-- Quick Category Pill Buttons -->
          <div style="display:flex; gap:6px;">
            <button onclick="window.handleH2HCatFilterChange('all')" class="status-pill ${selectedCat === 'all' ? 'status-achieved' : 'status-in-progress'}" style="cursor:pointer; padding:6px 10px; font-size:0.75rem;">Semua</button>
            <button onclick="window.handleH2HCatFilterChange('Revenue')" class="status-pill ${selectedCat === 'Revenue' ? 'status-achieved' : 'status-in-progress'}" style="cursor:pointer; padding:6px 10px; font-size:0.75rem;">Revenue</button>
            <button onclick="window.handleH2HCatFilterChange('Operational')" class="status-pill ${selectedCat === 'Operational' ? 'status-achieved' : 'status-in-progress'}" style="cursor:pointer; padding:6px 10px; font-size:0.75rem;">Operational</button>
            <button onclick="window.handleH2HCatFilterChange('Marketing')" class="status-pill ${selectedCat === 'Marketing' ? 'status-achieved' : 'status-in-progress'}" style="cursor:pointer; padding:6px 10px; font-size:0.75rem;">Marketing</button>
            <button onclick="window.handleH2HCatFilterChange('Ecommerce')" class="status-pill ${selectedCat === 'Ecommerce' ? 'status-achieved' : 'status-in-progress'}" style="cursor:pointer; padding:6px 10px; font-size:0.75rem;">Ecommerce</button>
          </div>
        </div>
      </div>

      <div style="overflow-x:auto;">
        <table class="custom-table" style="font-size:0.82rem; border-collapse:separate; border-spacing:0 4px;">
          <thead>
            <tr style="background:#111827;">
              <th rowspan="2" style="vertical-align:middle; text-align:left; border-radius:6px 0 0 6px;">Kategori</th>
              <th rowspan="2" style="vertical-align:middle; text-align:left;">Point Check</th>
              <th rowspan="2" style="vertical-align:middle; text-align:center;">Bobot</th>
              <th colspan="4" style="text-align:center; background:rgba(5, 150, 105, 0.15); color:#10B981; font-weight:800; border-bottom:1px solid rgba(5, 150, 105, 0.35);">Batik Trusmi (BT)</th>
              <th colspan="4" style="text-align:center; background:rgba(2, 132, 199, 0.15); color:#06B6D4; font-weight:800; border-bottom:1px solid rgba(2, 132, 199, 0.35);">The Keranjang Bali (TKB)</th>
              <th colspan="2" style="text-align:center; background:rgba(217, 119, 6, 0.15); color:var(--accent-gold); font-weight:800; border-bottom:1px solid rgba(217, 119, 6, 0.35); border-radius:0 6px 6px 0;">Pemenang H2H</th>
            </tr>
            <tr style="background:#0F172A;">
              <!-- BT Headers -->
              <th style="text-align:right; color:var(--text-secondary); background:rgba(5, 150, 105, 0.08);">Target</th>
              <th style="text-align:right; color:#10B981; background:rgba(5, 150, 105, 0.08);">Actual</th>
              <th style="text-align:center; color:#10B981; background:rgba(5, 150, 105, 0.08);">%ACV</th>
              <th style="text-align:center; color:var(--accent-gold); background:rgba(5, 150, 105, 0.08);">Score</th>
              <!-- TKB Headers -->
              <th style="text-align:right; color:var(--text-secondary); background:rgba(2, 132, 199, 0.08);">Target</th>
              <th style="text-align:right; color:#06B6D4; background:rgba(2, 132, 199, 0.08);">Actual</th>
              <th style="text-align:center; color:#06B6D4; background:rgba(2, 132, 199, 0.08);">%ACV</th>
              <th style="text-align:center; color:#06B6D4; background:rgba(2, 132, 199, 0.08);">Score</th>
              <!-- VS Headers -->
              <th style="text-align:center; background:rgba(217, 119, 6, 0.08); color:var(--accent-gold);">VS Actual</th>
              <th style="text-align:center; background:rgba(217, 119, 6, 0.08); color:var(--accent-gold);">VS Target</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.map((item, idx) => {
              const isFirstInCat = idx === 0 || filteredItems[idx - 1].cat !== item.cat;
              const catItemsCount = filteredItems.filter(i => i.cat === item.cat).length;
              const catObj = h2h.categoryScores.find(c => c.category === item.cat);

              const vsActBadge = item.vsAct === 'BT' 
                ? '<span style="display:inline-block; background:rgba(5, 150, 105, 0.15); color:#059669; border:1px solid rgba(5, 150, 105, 0.4); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">BT WIN</span>'
                : (item.vsAct === 'TKB' 
                    ? '<span style="display:inline-block; background:rgba(217, 119, 6, 0.15); color:#D97706; border:1px solid rgba(217, 119, 6, 0.4); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">TKB WIN</span>'
                    : '<span style="display:inline-block; background:rgba(37, 99, 235, 0.15); color:#2563EB; border:1px solid rgba(37, 99, 235, 0.4); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">DRAW</span>');

              const vsTgtBadge = item.vsTgt === 'BT' 
                ? '<span style="display:inline-block; background:rgba(5, 150, 105, 0.15); color:#059669; border:1px solid rgba(5, 150, 105, 0.4); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">BT WIN</span>'
                : (item.vsTgt === 'TKB' 
                    ? '<span style="display:inline-block; background:rgba(217, 119, 6, 0.15); color:#D97706; border:1px solid rgba(217, 119, 6, 0.4); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">TKB WIN</span>'
                    : '<span style="display:inline-block; background:rgba(37, 99, 235, 0.15); color:#2563EB; border:1px solid rgba(37, 99, 235, 0.4); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">DRAW</span>');

              return `
                <tr style="background:var(--bg-card); transition:all 0.15s ease;">
                  ${isFirstInCat ? `
                    <td rowspan="${catItemsCount}" style="vertical-align:middle; font-weight:800; color:var(--text-primary); background:rgba(217, 119, 6, 0.04); border-right:1px solid rgba(217, 119, 6, 0.2); padding:12px;">
                      <div style="font-size:0.95rem; color:var(--text-primary);">${item.cat}</div>
                      <div style="font-size:0.75rem; color:var(--accent-gold); margin-top:6px; font-weight:700; line-height:1.4;">
                        <span style="color:#059669;">BT: ${catObj ? catObj.btScore : ''}%</span><br>
                        <span style="color:#0284C7;">TKB: ${catObj ? catObj.tkbScore : ''}%</span>
                      </div>
                    </td>
                  ` : ''}
                  <td style="padding:10px 12px;"><strong style="color:var(--text-primary); font-size:0.85rem;">${item.point}</strong></td>
                  <td style="text-align:center; font-family:monospace; color:var(--text-secondary);">${item.bobot}</td>
                  <!-- BT Values -->
                  <td style="text-align:right; font-family:monospace; color:var(--text-secondary);">${item.btTarget}</td>
                  <td style="text-align:right; font-family:monospace; color:#059669; font-weight:800;">${item.btAct}</td>
                  <td style="text-align:center; font-weight:800; color:#047857;">${item.btAcv}</td>
                  <td style="text-align:center; font-family:monospace; color:var(--accent-gold); font-weight:800;">${item.btScore}</td>
                  <!-- TKB Values -->
                  <td style="text-align:right; font-family:monospace; color:var(--text-secondary);">${item.tkbTarget}</td>
                  <td style="text-align:right; font-family:monospace; color:#0284C7; font-weight:800;">${item.tkbAct}</td>
                  <td style="text-align:center; font-weight:800; color:#0369A1;">${item.tkbAcv}</td>
                  <td style="text-align:center; font-family:monospace; color:#0284C7; font-weight:800;">${item.tkbScore}</td>
                  <!-- Winners -->
                  <td style="text-align:center; padding:8px;">${vsActBadge}</td>
                  <td style="text-align:center; padding:8px;">${vsTgtBadge}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Handler function for category filter dropdown
window.handleH2HCatFilterChange = function(category) {
  state.h2hCategoryFilter = category;
  renderCurrentView();
};

function initH2HChart() {
  const barCtx = document.getElementById('h2hBarChart');
  const rawH2H = mockData.headToHead;
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const h2h = rawH2H.monthsData ? (rawH2H.monthsData[currentMonthKey] || rawH2H.monthsData['7']) : rawH2H;

  // 1. Grouped Bar Chart (% Score Per Kategori Full Width dengan Label Angka Langsung di Atas Batang Bar)
  if (barCtx) {
    state.activeChartInstances.h2hBar = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: h2h.categoryScores.map(c => c.category),
        datasets: [
          {
            label: 'Batik Trusmi (BT) Score %',
            data: h2h.categoryScores.map(c => c.btScore),
            backgroundColor: 'rgba(16, 185, 129, 0.88)',
            borderColor: '#10B981',
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          },
          {
            label: 'The Keranjang Bali (TKB) Score %',
            data: h2h.categoryScores.map(c => c.tkbScore),
            backgroundColor: 'rgba(6, 182, 212, 0.88)',
            borderColor: '#06B6D4',
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top', 
            labels: { color: '#9CA3AF', font: { size: 12, weight: 'bold' }, padding: 16 } 
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.raw}%`;
              }
            }
          }
        },
        scales: {
          x: { ticks: { color: '#FFF', font: { size: 12, weight: 'bold' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: {
            max: 110,
            ticks: {
              color: '#9CA3AF',
              callback: function(v) { return v + '%'; }
            },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        }
      },
      plugins: [{
        id: 'barLabels',
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const val = dataset.data[index];
              if (val !== undefined && val !== null) {
                ctx.save();
                ctx.fillStyle = i === 0 ? '#10B981' : '#06B6D4';
                ctx.font = 'bold 12px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(val + '%', bar.x, bar.y - 4);
                ctx.restore();
              }
            });
          });
        }
      }]
    });
  }
}

// --------------------------------------------------------------------------
// OKR REAL DATASET — BT (Premium Cirebon & Premium Jakarta ONLY)
// --------------------------------------------------------------------------
const okrRealData = {
  monthsData: {
    '7': {
      monthName: 'Agustus 2026',
      projects: [
        {
          id: 'jakarta',
          name: 'Premium Jakarta',
          objectives: [
            {
              id: '1.0',
              name: '1. Infra (Due: 30 September 2026)',
              targetOutput: '100% Store Premium Jakarta sudah bisa beroperasi',
              targetOutcome: 'Peningkatan Traffic',
              budget: null,
              krs: [
                { code: '1.1', title: 'Interior Fixtures (lemari, lighting, rak)', urgency: 'Middle', output: 'Ready digunakan', actual: 'Progress ±90%, furniture mayoritas selesai, pintu kaca selesai, sisa cermin/km/pintu gudang', deadline: '30 Sep 2026', status: 'Done', link: '📄 Photo Fixtures' },
                { code: '1.2', title: 'Sofa & Table', urgency: 'Middle', output: 'Ready digunakan', actual: 'Main sofa vendor Dimitri, bench Agra, estimasi selesai 11 Agu 2026', deadline: '30 Sep 2026', status: 'Done', link: '🔗 PO Dimitri & Agra' },
                { code: '1.3', title: 'Vendor Laser Cutting', urgency: 'High', output: 'Dealing Vendor', actual: '3 Vendor Estimasi Harga', deadline: '30 Sep 2026', status: 'Progres', link: '📄 Comparison Vendor' },
                { code: '1.4', title: 'Pekerjaan Lasercut dan Logo', urgency: 'High', output: 'Selesai', actual: 'Estimasi 20 hari kerja selesai 20 Sep 2026, terpasang lasercut & lampu, finishing & logo MOMEN', deadline: '30 Sep 2026', status: 'On Progress', link: '📄 Draft Lasercut' },
                { code: '1.5', title: 'Pembongkaran Fasade & Pagar', urgency: 'High', output: 'Selesai', actual: 'Estimasi cost, sudah berjalan', deadline: '30 Sep 2026', status: 'Progres', link: '📄 Fasade Spec' }
              ]
            },
            {
              id: '2.0',
              name: '2. Experience (Due: 31 Agustus 2026)',
              targetOutput: 'Ambience & Display Mahal Approved',
              targetOutcome: 'Peningkatan Traffic & Retensi Store',
              budget: null,
              krs: [
                { code: '2.1', title: 'Pengadaan Speaker', urgency: 'Middle', output: '7 titik', actual: 'Sudah terpasang 7 titik', deadline: '31 Agu 2026', status: 'Done', link: '📄 Resi Pengiriman' },
                { code: '2.2', title: 'Pemilihan Ambience Lighting', urgency: 'Middle', output: 'All Rak', actual: 'Done Eksekusi oleh Vendor', deadline: '31 Agu 2026', status: 'Done', link: '📄 Layout Lighting' },
                { code: '2.3', title: 'Pemilihan Wangi (ambience perfume)', urgency: 'Middle', output: 'Approved', actual: 'Progress Pemilihan', deadline: '31 Agu 2026', status: 'Progres', link: '📄 Sample Parfume' },
                { code: '2.4', title: 'Experience Display (produk terlihat mahal)', urgency: 'Middle', output: 'Approved', actual: 'Konsep disetujui & selesai dieksekusi, wall figura, story figura, experience kerah, penataan aksesoris lemari', deadline: '31 Agu 2026', status: 'Done', link: '📄 Concept Display' },
                { code: '2.5', title: 'Experience Display pada dinding', urgency: 'Middle', output: 'Approved', actual: 'Frame foto, potongan kain pola, gulungan bahan, aksesoris topeng', deadline: '31 Agu 2026', status: 'Done', link: '📄 Visual Quotes' }
              ]
            },
            {
              id: '3.0',
              name: '3. SDM (Due: 31 Juli 2026)',
              targetOutput: 'SOP Baku beserta implementasi',
              targetOutcome: 'Ketersediaan kuantitas & kualitas SDM',
              budget: null,
              krs: [
                { code: '3.1', title: 'Design Produk Seragam SPG', urgency: 'Middle', output: 'Design Approve', actual: 'Done Design (revisi)', deadline: '31 Jul 2026', status: 'Revisi', link: '📄 Draft Seragam' },
                { code: '3.2', title: 'Pencarian Head Pengalaman', urgency: 'High', output: 'Ready SDM', actual: 'Progress Pencarian', deadline: '31 Jul 2026', status: 'Progres', link: '🔗 List Candidate' },
                { code: '3.3', title: 'Pencarian SDM Penjahit', urgency: 'High', output: 'Ready SDM', actual: 'Progress Pencarian', deadline: '31 Jul 2026', status: 'Progres', link: '📄 Status Penjahit' },
                { code: '3.4', title: '60% SDM baru', urgency: 'Low', output: '—', actual: 'Belum terdapat data jumlah kebutuhan SDM, jumlah existing, dan realisasi rekrutmen', deadline: '31 Jul 2026', status: 'Belum Mulai', link: '📄 Plan HR' },
                { code: '3.5', title: 'SOP cara ngomong ke customer', urgency: 'Low', output: 'SOP Tersedia', actual: 'Done Sudah Dibuat (namun Feedback pak Ibnu untuk mencari Manager yg berpengalaman)', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Communication' },
                { code: '3.6', title: 'SOP cara ngomong menarik desire', urgency: 'Low', output: 'SOP Tersedia', actual: 'Done Sudah Dibuat (namun Feedback pak Ibnu untuk mencari Manager yg berpengalaman)', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Upselling' },
                { code: '3.7', title: 'SOP Penyajian minum', urgency: 'Low', output: 'SOP Tersedia', actual: 'Done Sudah Dibuat (namun Feedback pak Ibnu untuk mencari Manager yg berpengalaman)', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Hospitality' },
                { code: '3.8', title: 'Cara Grooming', urgency: 'Low', output: 'SOP Tersedia', actual: 'Done Sudah Dibuat (namun Feedback pak Ibnu untuk mencari Manager yg berpengalaman)', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Grooming' }
              ]
            },
            {
              id: '4.0',
              name: '4. Marketing (Due: 31 Juli 2026)',
              targetOutput: 'Konsep Deck & Campaign',
              targetOutcome: 'Tetap ada marketing sebelum launching',
              budget: null,
              krs: [
                { code: '4.1', title: 'Konsep Experience', urgency: 'High', output: 'Konsep Deck', actual: 'Done Konsep Deck', deadline: '31 Jul 2026', status: 'Done', link: '📄 Deck Exp' },
                { code: '4.2', title: 'Konsep Campaign', urgency: 'Middle', output: 'Konsep Deck', actual: 'Done', deadline: '31 Jul 2026', status: 'Done', link: '📄 Deck Campaign' },
                { code: '4.3', title: 'Konsep Per Produk (per Section)', urgency: 'Middle', output: 'Konsep Deck', actual: 'sudah present progress revisi & feedback', deadline: '31 Jul 2026', status: 'Done', link: '📄 Deck Product' },
                { code: '4.4', title: 'Logo Megah Batik', urgency: 'Middle', output: 'Approve Design', actual: 'Revisi Nama & Logo (mundur karena keputusan owner)', deadline: '31 Jul 2026', status: 'Done', link: '📄 Final Logo MOMEN' },
                { code: '4.5', title: 'Optimasi Instagram', urgency: 'Middle', output: 'Akun Instagram Tersedia', actual: 'Instagram yg lama sudah ada namun ke lock. Solusi: Membuat instagram baru', deadline: '31 Jul 2026', status: 'Done', link: '🔗 Account Wolter' }
              ]
            },
            {
              id: '5.0',
              name: '5. Produk (Due: 31 Sept 2026)',
              targetOutput: 'Kapasitas display 1.052 pcs dengan 15% new produk (155 pcs)',
              targetOutcome: 'Provide kebutuhan store untuk tingkatkan Sales Store',
              budget: null,
              krs: [
                { code: '5.1', title: 'Percepatan Pemenuhan Beli Produk', urgency: 'High', output: '100 pcs', actual: 'Progress', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Target Buy' },
                { code: '5.2', title: 'Design Motif Kain', urgency: 'High', output: '50 design', actual: '1. Menentukan arahan motif eksklusif 2. Menyetujui 30 looks sebelum masuk produksi', deadline: '31 Sep 2026', status: 'Progres', link: '📄 30 Looks Design' },
                { code: '5.3', title: 'Produksi Kain Pola Exclusive 1–5 Juta', urgency: 'Middle', output: '5 pcs', actual: '1. Menentukan vendor kain pola 2. Menyetujui kualitas kain sebelum distribusi ke store', deadline: '31 Sep 2026', status: 'Progres', link: '📄 PO Superfine' },
                { code: '5.4', title: 'Produksi Kain Pola Exclusive 5–10 Juta', urgency: 'Middle', output: '10 pcs', actual: '1. Menentukan vendor kain pola 2. Menyetujui kualitas kain sebelum distribusi ke store', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Vendor' },
                { code: '5.5', title: 'Produksi Kain Baron Exclusive 5–10 Juta', urgency: 'Middle', output: '30 pcs', actual: '1. Menentukan vendor kain Baron 2. Menyetujui kualitas hasil produksi', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Baron' },
                { code: '5.6', title: 'Produksi Kain Sutra Exclusive 5–10 Juta', urgency: 'Middle', output: '10 pcs', actual: '1. Menyetujui kualitas hasil produksi', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Sutra 5M' },
                { code: '5.7', title: 'Produksi Kain Sutra Exclusive 10–20 Juta', urgency: 'Middle', output: '5 pcs', actual: '1. Menentukan vendor kain Sutra 2. Menyetujui kualitas & tekstur kain hasil produksi', deadline: '31 Sep 2026', status: 'Belum Mulai', link: '📄 Status Sutra 10M' },
                { code: '5.8', title: 'Produksi Kain Katun (New) 1–5 Juta', urgency: 'Middle', output: '30 pcs', actual: '1. Menyetujui vendor kemeja katun 2. Menyetujui kualitas jahitan & finishing', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Katun' },
                { code: '5.9', title: 'Produksi Hem Katun', urgency: 'Middle', output: '30 pcs', actual: '1. Menyetujui vendor produksi hem katun 2. Menyetujui kualitas jahitan & finishing', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Hem' },
                { code: '5.10', title: 'Perhitungan Harga HPP', urgency: 'Low', output: '1 Dokumen', actual: 'Dokumen perhitungan HPP selesai', deadline: '31 Sep 2026', status: 'Done', link: '📄 HPP Document' },
                { code: '5.11', title: 'Produk dengan Story Khusus 10–20 Juta', urgency: '—', output: '5 Produk', actual: '1. Menentukan narasi/story untuk masing-masing produk 2. Menyetujui konsep story & presentasi produk ke tim marketing', deadline: '31 Sep 2026', status: 'Belum Mulai', link: '📄 Story Deck' }
              ]
            }
          ]
        }
      ]
    },
    '6': {
      monthName: 'Juli 2026',
      projects: [
        {
          id: 'tkb',
          name: 'The Keranjang Bali (TKB)',
          objectives: [
            {
              id: 'TKB-1.0',
              name: 'Goal 1: Brand Positioning — Target 100% Ontime',
              targetOutput: 'Re-positioning brand image TKB',
              targetOutcome: 'Penyesuaian persepsi & kenaikan brand awareness',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-1.1', title: 'Brand Positioning concept', output: 'Disetujui', deadline: '7 Jun 2026', status: 'Done', isTKB: true, link: '📄 Concept Deck',
                  weeklyLogs: [
                    { week: 'W1', date: '17 Mei 2026', note: 'Penyusunan draft awal', feedback: 'Internal Discussion' },
                    { week: 'W2', date: '24 Mei 2026', note: 'Review tim marketing', feedback: 'Revision Concept' },
                    { week: 'W3', date: '31 Mei 2026', note: 'Final deck diserahkan', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W4', date: '07 Jun 2026', note: 'Approval final', feedback: 'Approved Pak Ibnu' }
                  ]
                },
                { 
                  code: 'TKB-1.2', title: 'RAB Brand Positioning', output: 'RAB Final', actual: 'Need Feedback Pak Ibnu; ratecard Reza Arap dinilai terlalu tinggi; rencana skema revenue share 10%/bln, komisi 10%, fee produk kolaborasi 10%', deadline: '30 Jul 2026', status: 'Progress', isTKB: true, link: '📄 Draft RAB TKB',
                  weeklyLogs: [
                    { week: 'W1', date: '07 Jul 2026', note: 'Submit RAB awal ke Pak Ibnu', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W2', date: '14 Jul 2026', note: 'Evaluasi ratecard Reza Arap', feedback: 'Ratecard terlalu tinggi' },
                    { week: 'W3', date: '21 Jul 2026', note: 'Penyusunan skema alternatif 10% revshare', feedback: 'Revision Submitted' },
                    { week: 'W4', date: '28 Jul 2026', note: 'Negosiasi ulang vendor & BA Raditya Dika', feedback: 'In Review Pak Angga' }
                  ]
                },
                { 
                  code: 'TKB-1.3', title: 'Skema kerjasama brand ambassador', output: 'Skema disetujui', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '📄 Draft Skema BA' 
                },
                { 
                  code: 'TKB-1.4', title: 'Dealing Brand Ambassador', output: 'Dealing BA', actual: 'Menunggu meeting Reza Arap; opsi baru (Raditya Dika, Vindes); meeting tim Raditya Dika selesai, ratecard masuk, tunggu feedback Pak Ibnu', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '🔗 Ratecard Raditya Dika',
                  weeklyLogs: [
                    { week: 'W1', date: '07 Jul 2026', note: 'Contact agen Reza Arap', feedback: 'Waiting Schedule' },
                    { week: 'W2', date: '14 Jul 2026', note: 'Search alternatif (Raditya Dika, Vindes)', feedback: 'Approved Search' },
                    { week: 'W3', date: '21 Jul 2026', note: 'Meeting tim Raditya Dika', feedback: 'Ratecard Received' },
                    { week: 'W4', date: '28 Jul 2026', note: 'Approved Pak Ibnu', feedback: 'Approved Pak Ibnu' }
                  ]
                },
                { 
                  code: 'TKB-1.5', title: 'Relaunching Store', output: 'Event Launching', deadline: '30 Okt 2026', status: 'Belum Mulai', isTKB: true, link: '📄 Deck Event' 
                }
              ]
            },
            {
              id: 'TKB-2.1',
              name: 'Goal 2: Operasional — Relayout Area Lantai 3 (Family & Anak)',
              targetOutput: 'Redesign & Relayout Lantai 3',
              targetOutcome: 'Peningkatan experience pengunjung keluarga',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-2.1.1', title: 'Reconcept dan Design Lantai 3', output: 'Model Design L3', actual: 'Revisi — meeting feedback Pak Ibnu & Pak Angga, update revisi & benchmark konsep', deadline: '15 Jul 2026', status: 'Progress', isTKB: true, link: '📄 Design L3' 
                },
                { 
                  code: 'TKB-2.1.2', title: 'RAB Reconcept & Design Lantai 3', output: 'RAB L3', actual: 'Approved Pak Ibnu, Need Feedback Pak Ibnu — Masih ada revisi detailing konsep experience tetapi keterlambatan ada di pihak Dayen; RAB masih ada penyesuaian karena masih pitching vendor', deadline: '30 Jun 2026', status: 'Progress Overdue', isTKB: true, link: '📄 RAB L3',
                  penaltyAmount: 'Rp200.000',
                  weeklyLogs: [
                    { week: 'W1', date: '07 Jun 2026', note: 'Pitching 3 vendor lokal', feedback: 'Vendor Comparison' },
                    { week: 'W2', date: '14 Jun 2026', note: 'Penyesuaian item material', feedback: 'Need Revision' },
                    { week: 'W3', date: '21 Jun 2026', note: 'Negosiasi harga vendor', feedback: 'In Progress' },
                    { week: 'W4', date: '30 Jun 2026', note: 'Lewat due date - belum final', feedback: '🔴 Overdue (Kena Denda Rp200rb)' }
                  ]
                },
                { 
                  code: 'TKB-2.1.3', title: 'Approaching & Dealing Vendor', output: 'Dealing Vendor', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '🔗 Contract Vendor' 
                },
                { 
                  code: 'TKB-2.1.4', title: 'Timeline Reconcept & Design Lantai 3', output: 'Timeline Final', actual: 'Approved Pak Ibnu, Need Feedback Pak Ibnu — Pakai opsi 2 pararel menunggu concept dayen yang masih revisi', deadline: '30 Jun 2026', status: 'Not Started Overdue', isTKB: true, link: '📄 Timeline L3',
                  penaltyAmount: 'Rp200.000'
                },
                { 
                  code: 'TKB-2.1.5', title: 'Relayout floor Lantai 3', output: 'Konstruksi Selesai', deadline: '30 Nov 2026', status: 'Belum Mulai', isTKB: true, link: '📄 WO Floor' 
                }
              ]
            },
            {
              id: 'TKB-2.2',
              name: 'Goal 2: Operasional — Relayout Area Lantai 2 (Premium & Kolaborasi)',
              targetOutput: 'Redesign & Relayout Lantai 2',
              targetOutcome: 'Peningkatan pencapaian sales produk premium',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-2.2.1', title: 'Reconcept dan Design Lantai 2', output: 'Design Approved', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '📄 Concept L2' 
                },
                { 
                  code: 'TKB-2.2.2', title: 'RAB Reconcept & Design Lantai 2', output: 'RAB Approved', actual: 'Need Feedback Pak Angga; update RAB masih ada penyesuaian (masih pitching vendor)', deadline: '31 Jul 2026', status: 'Progress', isTKB: true, link: '📄 RAB L2' 
                },
                { 
                  code: 'TKB-2.2.3', title: 'Approaching & Dealing Vendor', output: 'Dealing Vendor', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '🔗 Vendor List' 
                },
                { 
                  code: 'TKB-2.2.4', title: 'Timeline Reconcept & Design Lantai 2', output: 'Timeline Approved', actual: 'Need Feedback Pak Angga', deadline: '30 Jul 2026', status: 'Belum Mulai', isTKB: true, link: '📄 Draft Schedule' 
                },
                { 
                  code: 'TKB-2.2.5', title: 'Relayout floor Lantai 2', output: 'Selesai', deadline: '30 Nov 2026', status: 'Belum Mulai', isTKB: true, link: '📄 WO Floor L2' 
                }
              ]
            },
            {
              id: 'TKB-2.3',
              name: 'Goal 2: Operasional — Peningkatan Basket Size & Traffic Rasio',
              targetOutput: 'Basket Size Rp530.000 & Rasio Traffic ke Transaksi 4000%',
              targetOutcome: 'Peningkatan revenue per pengunjung store',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-2.3.1', title: 'Mapping MPP Kasir PKWT Tidak DW', output: 'Mapping Selesai', actual: 'Eskalasi Pak Angga ke Bu Muni (10 Jul 2026); pengajuan BUSPRO TKB ke IT & Inovasi', deadline: '12 Jul 2026', status: 'Done', isTKB: true, link: '📄 Eskalasi Bu Muni' 
                },
                { 
                  code: 'TKB-2.3.2', title: 'Timeline Training PC & Kasir', output: 'Jadwal Training', actual: 'Need Feedback Pak Angga', deadline: '18 Jul 2026', status: 'Done', isTKB: true, link: '📄 Modul Training' 
                },
                { 
                  code: 'TKB-2.3.3', title: 'Indikator keberhasilan training Kasir & PC', output: 'Matrix KPI Training', actual: 'Need Feedback Pak Angga', deadline: '18 Jul 2026', status: 'Done', isTKB: true, link: '📄 Matrix Indikator' 
                },
                { 
                  code: 'TKB-2.3.4', title: 'Membuat framework OPS Semester 2 2026', output: 'Framework OPS S2', actual: 'Need Feedback Pak Angga', deadline: '12 Jul 2026', status: 'Done', isTKB: true, link: '📄 Framework Deck' 
                },
                { 
                  code: 'TKB-2.3.5', title: 'Menyusun strategi sumber traffic baru', output: 'Pemetaan Institusi/Hotel', actual: 'Revisi — feedback Pak Angga: kurang detail; aktivasi pemetaan hotel disetujui', deadline: '31 Jul 2026', status: 'Done', isTKB: true, link: '📄 Map Hotel Approved' 
                },
                { 
                  code: 'TKB-2.3.6', title: 'Solved problem & Aktivasi Traffic', output: 'Weekly Activation Plan', actual: 'Revisi — campaign 17 Agu "Sekeranjang Kemerdekaan", campaign nongkrong Bali; submit meeting Pak Ibnu', deadline: '31 Jul 2026', status: 'Done', isTKB: true, link: '📄 Jadwal Campaign' 
                }
              ]
            },
            {
              id: 'TKB-3.0',
              name: 'Goal 3: SDM Operation — Target 100% Ontime',
              targetOutput: 'Pemenuhan SDM Operation Berkualitas',
              targetOutcome: 'Penurunan turnover & peningkatan SLA pelayanan',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-3.1', title: 'Reach out kandidat', output: 'List Kandidat', actual: 'Approved Pak Angga', deadline: '20 Jun 2026', status: 'Done', isTKB: true, link: '📄 Candidate List' },
                { code: 'TKB-3.2', title: 'Approaching kandidat', output: 'Interviews Scheduled', actual: 'Approved Pak Angga', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '📄 Schedule App' },
                { code: 'TKB-3.3', title: 'Interview kandidat', output: 'User Interview Selesai', actual: 'Kandidat: Rinaldy Sudirman, Hari Gusti Putra, Jusac Rabin — Approved Pak Angga', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '📄 Result Interview' },
                { code: 'TKB-3.4', title: 'Offering salary', output: 'Offering Letter Sent', actual: '90–100% gagal offering karena penawaran salary tidak masuk (monitoring Anggi Pangesti)', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '📄 Monitoring Anggi' },
                { 
                  code: 'TKB-3.5', title: 'Join (Onboarding SDM)', output: 'SDM Masuk Kerja', actual: '100% gagal offering karena penawaran salary tidak masuk', deadline: '30 Jul 2026', status: 'Overdue', isTKB: true, link: '📄 HR Escalation',
                  penaltyAmount: 'Rp200.000'
                }
              ]
            },
            {
              id: 'TKB-4.0',
              name: 'Goal 4: PRODUK — Pengembangan Produk Makanan (Target 100% Ontime)',
              targetOutput: 'Produk Makanan Unik khas Jepang & Bali',
              targetOutcome: 'Penambahan varian fast-moving retail',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-4.1', title: 'Riset Pasar Makanan', output: 'Laporan Riset', deadline: '7 Jun 2026', status: 'Done', isTKB: true, link: '📄 Laporan Riset' },
                { code: 'TKB-4.2', title: 'Reach out produk makanan unik Jepang', output: 'Contact Vendor', deadline: '14 Jun 2026', status: 'Done', isTKB: true, link: '🔗 Vendor List JP' },
                { code: 'TKB-4.3', title: 'Approaching Vendor Makanan', output: 'Diskusi Produk', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '📄 Minutes of Meeting' },
                { code: 'TKB-4.4', title: 'Sampling Product Makanan', output: 'Sample Approved', deadline: '7 Jul 2026', status: 'Done', isTKB: true, link: '📄 Sample Review' },
                { 
                  code: 'TKB-4.5', title: 'Dealing Vendor Makanan', output: 'Kontrak PKS', actual: 'Belum selesainya kesepakatan margin dengan supplier', deadline: '31 Jul 2026', status: 'Overdue', isTKB: true, link: '📄 Draft PKS',
                  penaltyAmount: 'Rp200.000'
                }
              ]
            }
          ]
        }
      ]
    }
  }
};

// --------------------------------------------------------------------------
// OKR TKB DATASET — The Keranjang Bali (TERPISAH dari BT)
// --------------------------------------------------------------------------
const tkbOKRData = {
  monthsData: {
    '7': {
      monthName: 'Agustus 2026',
      projects: [
        {
          id: 'tkb',
          name: 'The Keranjang Bali (TKB)',
          objectives: [
            {
              id: 'TKB-1.0',
              name: 'Goal 1: BRAND IDENTITY — Brand Positioning',
              targetOutput: 'Re-positioning brand image TKB',
              targetOutcome: 'Penyesuaian persepsi & kenaikan brand awareness',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-1.1', title: 'Brand Positioning concept', output: 'Disetujui', deadline: '7 Jun 2026', status: 'Selesai', isTKB: true, link: '📄 Concept Deck',
                  weeklyLogs: [
                    { week: 'W1', status: 'Selesai', note: 'Penyusunan draft awal', feedback: 'Internal Discussion' },
                    { week: 'W2', status: 'Selesai', note: 'Review tim marketing', feedback: 'Revision Concept' },
                    { week: 'W3', status: 'Selesai', note: 'Final deck diserahkan', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W4', status: 'Selesai', note: 'Approval final', feedback: 'Approved Pak Ibnu' }
                  ]
                },
                { 
                  code: 'TKB-1.2', title: 'RAB Brand Positioning', output: 'RAB Final', actual: 'Need Feedback Pak Angga; Meeting dealing BA Raditya Dika https://us06web.zoom.us/rec/share/... Passcode m96mgW5; 2026.08. W4 Pengajuan Ratecard & SOW BA TKB (Raditya Dika)', deadline: '30 Jul 2026', status: 'Progress Overdue', isTKB: true, link: '📄 Draft RAB TKB',
                  penaltyAmount: 'Rp200.000',
                  weeklyLogs: [
                    { week: 'W1', note: 'Submit RAB awal ke Pak Ibnu', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W2', note: 'Evaluasi ratecard Reza Arap', feedback: 'Ratecard terlalu tinggi' },
                    { week: 'W3', note: 'Penyusunan skema alternatif 10% revshare', feedback: 'Revision Submitted' },
                    { week: 'W4', note: 'Meeting dealing BA Raditya Dika', feedback: 'Need Feedback Pak Angga' }
                  ]
                },
                { 
                  code: 'TKB-1.3', title: 'Skema kerjasama brand ambassador', output: 'Skema disetujui', deadline: '30 Jun 2026', status: 'Selesai', isTKB: true, link: '📄 Draft Skema BA' 
                },
                { 
                  code: 'TKB-1.4', title: 'Dealing Brand Ambassador', output: 'Dealing BA', actual: 'Approved Pak Ibnu; Progress Overdue/Late (Due 30 Jul)', deadline: '30 Jul 2026', status: 'Progress Overdue', isTKB: true, link: '🔗 Ratecard Raditya Dika',
                  penaltyAmount: 'Rp200.000',
                  weeklyLogs: [
                    { week: 'W1', note: 'Review profil BA', feedback: 'Approved Pak Ibnu' },
                    { week: 'W2', note: 'Follow up ratecard & meeting BA', feedback: 'In Progress' },
                    { week: 'W3', note: 'Finalisasi skema kerjasama', feedback: 'Pending Approval' },
                    { week: 'W4', note: 'Lewat due date 30 Jul', feedback: '🔴 Overdue (Kena Denda Rp200rb)' }
                  ]
                },
                { 
                  code: 'TKB-1.5', title: 'Relaunching Store', output: 'Event Launching', deadline: '30 Okt 2026', status: 'Hold', isTKB: true, link: '📄 Deck Event' 
                }
              ]
            },
            {
              id: 'TKB-2.0',
              name: 'Goal 2: PRODUK — Pengembangan produk Makanan',
              targetOutput: 'Produk Makanan Unik khas Jepang & Bali',
              targetOutcome: 'Penambahan varian fast-moving retail',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-2.1', title: 'Riset Pasar Makanan', output: 'Laporan Riset', deadline: '7 Jun 2026', status: 'Selesai', isTKB: true, link: '📄 Laporan Riset' },
                { code: 'TKB-2.2', title: 'Reach out product makanan unik khas jepang', output: 'Contact Vendor', deadline: '14 Jun 2026', status: 'Selesai', isTKB: true, link: '🔗 Vendor List JP' },
                { code: 'TKB-2.3', title: 'Approaching Vendor', output: 'Diskusi Produk', deadline: '30 Jun 2026', status: 'Selesai', isTKB: true, link: '📄 Minutes of Meeting' },
                { code: 'TKB-2.4', title: 'Sampling Product', output: 'Sample Approved', deadline: '7 Jul 2026', status: 'Selesai', isTKB: true, link: '📄 Sample Review' },
                { 
                  code: 'TKB-2.5', title: 'Dealing Produk Makanan', output: 'Kontrak PKS', actual: 'Approved Pak Angga di W1; status Hold (bar merah di W2–W5) - Belum selesainya kesepakatan margin dengan supplier', deadline: '31 Jul 2026', status: 'Hold', isTKB: true, link: '📄 Draft PKS',
                  weeklyLogs: [
                    { week: 'W1', note: 'Review margin & kesepakatan supplier', feedback: 'Approved Pak Angga' },
                    { week: 'W2', note: 'Negosiasi tertahan', feedback: '🔴 Hold / Terhenti' },
                    { week: 'W3', note: 'Evaluasi ulang margin supplier', feedback: '🔴 Hold / Terhenti' },
                    { week: 'W4', note: 'Pending kesepakatan akhir', feedback: '🔴 Hold / Terhenti' }
                  ]
                }
              ]
            },
            {
              id: 'TKB-3.1',
              name: 'Goal 3: OPERASIONAL — Relayout Area Lantai 4 (Segmentasi Family & Anak)',
              targetOutput: 'Redesign & Relayout Lantai 4',
              targetOutcome: 'Peningkatan experience pengunjung keluarga & anak',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-3.1.1', title: 'Reconcept dan Design Lantai 4 - Segmentasi Family & Anak', output: 'Model Design L4 Selesai', actual: 'Selesai sesuai arahan konsep', deadline: '15 Jul 2026', status: 'Selesai', isTKB: true, link: '📄 Design L4 Figma' 
                },
                { 
                  code: 'TKB-3.1.2', title: 'RAB Reconcept & Design Lantai 4', output: 'RAB L4 Final', actual: 'W1 Approved Pak Ibnu, W2 Need Feedback Pak Ibnu, W3 Approved Pak Ibnu, W4 Revisi — Masih ada revisi detailing konsep experience, tetapi keterlambatan ada di pihak Dayen (2026.08. W4 Update keterlambatan dayen)', deadline: '30 Jun 2026', status: 'Progress Overdue', isTKB: true, link: '📄 RAB L4',
                  penaltyAmount: 'Rp200.000',
                  weeklyLogs: [
                    { week: 'W1', note: 'Pitching & estimasi awal', feedback: 'Approved Pak Ibnu' },
                    { week: 'W2', note: 'Review detailing kebutuhan L4', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W3', note: 'Revisi nominal & spec', feedback: 'Approved Pak Ibnu' },
                    { week: 'W4', note: 'Detailing konsep tertahan Dayen', feedback: '🔴 Revisi (Overdue - Denda Rp200rb)' }
                  ]
                },
                { 
                  code: 'TKB-3.1.3', title: 'Approaching & Dealing Vendor', output: 'Dealing Vendor Selesai', deadline: '30 Jun 2026', status: 'Selesai', isTKB: true, link: '🔗 Contract Vendor' 
                },
                { 
                  code: 'TKB-3.1.4', title: 'Timeline Reconcept & Design Lantai 4', output: 'Timeline Final', actual: 'W1 Approved Pak Ibnu, W2 Need Feedback Pak Ibnu; Progress Overdue (Due: 30 Jun 2026)', deadline: '30 Jun 2026', status: 'Progress Overdue', isTKB: true, link: '📄 Timeline L4',
                  penaltyAmount: 'Rp200.000',
                  weeklyLogs: [
                    { week: 'W1', note: 'Draft timeline pengerjaan', feedback: 'Approved Pak Ibnu' },
                    { week: 'W2', note: 'Penyesuaian jadwal eksekusi', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W3', note: 'Menunggu konfirmasi final', feedback: 'In Progress' },
                    { week: 'W4', note: 'Lewat due date 30 Jun', feedback: '🔴 Overdue (Kena Denda Rp200rb)' }
                  ]
                },
                { 
                  code: 'TKB-3.1.5', title: 'Relayout floor Lantai 4', output: 'Konstruksi & Relayout L4', actual: 'Status Belum Berjalan sesuai jadwal', deadline: '30 Nov 2026', status: 'Belum Mulai', isTKB: true, link: '📄 WO Floor L4' 
                }
              ]
            },
            {
              id: 'TKB-3.2',
              name: 'Goal 3: OPERASIONAL — Relayout Area Lantai 3 (Segmentasi Premium dan Kolaborasi Brand)',
              targetOutput: 'Redesign & Relayout Lantai 3',
              targetOutcome: 'Peningkatan experience pengunjung segmen premium',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-3.2.1', title: 'Reconcept dan Design Lantai 3 - Segmentasi Premium dan Kolaborasi Brand', output: 'Design Approved', deadline: '30 Jun 2026', status: 'Selesai', isTKB: true, link: '📄 Concept L3' 
                },
                { 
                  code: 'TKB-3.2.2', title: 'RAB Reconcept & Design Lantai 3', output: 'RAB Approved', actual: 'W1 Approved Pak Ibnu, W2 Need Feedback Pak Ibnu, W3 Approved Pak Ibnu, W4 Revisi — Masih ada revisi detailing konsep experience, tetapi keterlambatan ada di pihak Dayen (2026.08. W4 Update keterlambatan dayen)', deadline: '31 Jul 2026', status: 'Progress', isTKB: true, link: '📄 RAB L3',
                  weeklyLogs: [
                    { week: 'W1', note: 'Penyusunan RAB Premium L3', feedback: 'Approved Pak Ibnu' },
                    { week: 'W2', note: 'Review penyesuaian brand collab', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W3', note: 'Approval spec material', feedback: 'Approved Pak Ibnu' },
                    { week: 'W4', note: 'Revisi detailing konsep Dayen', feedback: 'Revisi (In Progress)' }
                  ]
                },
                { 
                  code: 'TKB-3.2.3', title: 'Approaching & Dealing Vendor', output: 'Dealing Vendor Selesai', deadline: '30 Jul 2026', status: 'Selesai', isTKB: true, link: '🔗 Vendor List' 
                },
                { 
                  code: 'TKB-3.2.4', title: 'Timeline Reconcept & Design Lantai 3', output: 'Timeline Approved', actual: 'W1 Approved Pak Ibnu, W2 Need Feedback Pak Ibnu; On Progress', deadline: '30 Jul 2026', status: 'Progress', isTKB: true, link: '📄 Draft Schedule L3',
                  weeklyLogs: [
                    { week: 'W1', note: 'Jadwal relayout premium L3', feedback: 'Approved Pak Ibnu' },
                    { week: 'W2', note: 'Feedback alur pengerjaan', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W3', note: 'Sinkronisasi vendor instalasi', feedback: 'In Progress' },
                    { week: 'W4', note: 'Penyelarasan schedule', feedback: 'In Progress' }
                  ]
                },
                { 
                  code: 'TKB-3.2.5', title: 'Relayout floor Lantai 3', output: 'Konstruksi & Relayout L3', actual: 'Status Belum Berjalan sesuai jadwal', deadline: '30 Nov 2026', status: 'Belum Mulai', isTKB: true, link: '📄 WO Floor L3' 
                }
              ]
            }
          ]
        }
      ]
    },
    '6': {
      monthName: 'Juli 2026',
      projects: [
        {
          id: 'tkb',
          name: 'The Keranjang Bali (TKB)',
          objectives: [
            {
              id: 'TKB-1.0',
              name: 'Goal 1: Brand Positioning — Target 100% Ontime',
              targetOutput: 'Re-positioning brand image TKB',
              targetOutcome: 'Penyesuaian persepsi & kenaikan brand awareness',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { 
                  code: 'TKB-1.1', title: 'Brand Positioning concept', output: 'Disetujui', deadline: '7 Jun 2026', status: 'Done', isTKB: true, link: '📄 Concept Deck',
                  weeklyLogs: [
                    { week: 'W1', date: '17 Mei 2026', note: 'Penyusunan draft awal', feedback: 'Internal Discussion' },
                    { week: 'W2', date: '24 Mei 2026', note: 'Review tim marketing', feedback: 'Revision Concept' },
                    { week: 'W3', date: '31 Mei 2026', note: 'Final deck diserahkan', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W4', date: '07 Jun 2026', note: 'Approval final', feedback: 'Approved Pak Ibnu' }
                  ]
                },
                { 
                  code: 'TKB-1.2', title: 'RAB Brand Positioning', output: 'RAB Final', actual: 'Need Feedback Pak Ibnu; ratecard Reza Arap dinilai terlalu tinggi; rencana skema revenue share 10%/bln, komisi 10%, fee produk kolaborasi 10%', deadline: '30 Jul 2026', status: 'Progress', isTKB: true, link: '📄 Draft RAB TKB',
                  weeklyLogs: [
                    { week: 'W1', date: '07 Jul 2026', note: 'Submit RAB awal ke Pak Ibnu', feedback: 'Need Feedback Pak Ibnu' },
                    { week: 'W2', date: '14 Jul 2026', note: 'Evaluasi ratecard Reza Arap', feedback: 'Ratecard terlalu tinggi' },
                    { week: 'W3', date: '21 Jul 2026', note: 'Penyusunan skema alternatif 10% revshare', feedback: 'Revision Submitted' },
                    { week: 'W4', date: '28 Jul 2026', note: 'Negosiasi ulang vendor & BA Raditya Dika', feedback: 'In Review Pak Angga' }
                  ]
                },
                { code: 'TKB-1.3', title: 'Skema kerjasama brand ambassador', output: 'Skema disetujui', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '📄 Draft Skema BA' },
                { 
                  code: 'TKB-1.4', title: 'Dealing Brand Ambassador', output: 'Dealing BA', actual: 'Menunggu meeting Reza Arap; opsi baru (Raditya Dika, Vindes); meeting tim Raditya Dika selesai, ratecard masuk, tunggu feedback Pak I', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '🔗 Ratecard Raditya Dika',
                  weeklyLogs: [
                    { week: 'W1', date: '07 Jul 2026', note: 'Contact agen Reza Arap', feedback: 'Waiting Schedule' },
                    { week: 'W2', date: '14 Jul 2026', note: 'Search alternatif (Raditya Dika, Vindes)', feedback: 'Approved Search' },
                    { week: 'W3', date: '21 Jul 2026', note: 'Meeting tim Raditya Dika', feedback: 'Ratecard Received' },
                    { week: 'W4', date: '28 Jul 2026', note: 'Approved Pak Ibnu', feedback: 'Approved Pak Ibnu' }
                  ]
                },
                { code: 'TKB-1.5', title: 'Relaunching Store', output: 'Event Launching', deadline: '30 Okt 2026', status: 'Belum Mulai', isTKB: true, link: '📄 Deck Event' }
              ]
            },
            {
              id: 'TKB-2.1',
              name: 'Goal 2: Operasional — Relayout Area Lantai 3 (Family & Anak)',
              targetOutput: 'Redesign & Relayout Lantai 3',
              targetOutcome: 'Peningkatan experience pengunjung keluarga',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-2.1.1', title: 'Reconcept dan Design Lantai 3', output: 'Model Design L3', actual: 'Revisi — meeting feedback Pak Ibnu & Pak Angga, update revisi & benchmark konsep', deadline: '15 Jul 2026', status: 'Progress', isTKB: true, link: '📄 Design L3' },
                { 
                  code: 'TKB-2.1.2', title: 'RAB Reconcept & Design Lantai 3', output: 'RAB L3', actual: 'Revisi — RAB masih ada penyesuaian karena masih pitching vendor', deadline: '30 Jun 2026', status: 'Progress Overdue', isTKB: true, link: '📄 RAB L3',
                  penaltyAmount: 'Rp200.000',
                  weeklyLogs: [
                    { week: 'W1', date: '07 Jun 2026', note: 'Pitching 3 vendor lokal', feedback: 'Vendor Comparison' },
                    { week: 'W2', date: '14 Jun 2026', note: 'Penyesuaian item material', feedback: 'Need Revision' },
                    { week: 'W3', date: '21 Jun 2026', note: 'Negosiasi harga vendor', feedback: 'In Progress' },
                    { week: 'W4', date: '30 Jun 2026', note: 'Lewat due date - belum final', feedback: '🔴 Overdue (Kena Denda Rp200rb)' }
                  ]
                },
                { code: 'TKB-2.1.3', title: 'Approaching & Dealing Vendor', output: 'Dealing Vendor', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '🔗 Contract Vendor' },
                { code: 'TKB-2.1.4', title: 'Timeline Reconcept & Design Lantai 3', output: 'Timeline Final', actual: 'Pakai opsi 2 pararel menunggu concept dayen yang masih revisi', deadline: '30 Jun 2026', status: 'Not Started Overdue', isTKB: true, link: '📄 Timeline L3', penaltyAmount: 'Rp200.000' },
                { code: 'TKB-2.1.5', title: 'Relayout floor Lantai 3', output: 'Konstruksi Selesai', deadline: '30 Nov 2026', status: 'Belum Mulai', isTKB: true, link: '📄 WO Floor' }
              ]
            },
            {
              id: 'TKB-2.2',
              name: 'Goal 2: Operasional — Relayout Area Lantai 2 (Premium & Kolaborasi)',
              targetOutput: 'Redesign & Relayout Lantai 2',
              targetOutcome: 'Peningkatan pencapaian sales produk premium',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-2.2.1', title: 'Reconcept dan Design Lantai 2', output: 'Design Approved', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '📄 Concept L2' },
                { code: 'TKB-2.2.2', title: 'RAB Reconcept & Design Lantai 2', output: 'RAB Approved', actual: 'Need Feedback Pak Angga; update RAB masih ada penyesuaian (masih pitching vendor)', deadline: '31 Jul 2026', status: 'Progress', isTKB: true, link: '📄 RAB L2' },
                { code: 'TKB-2.2.3', title: 'Approaching & Dealing Vendor', output: 'Dealing Vendor', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '🔗 Vendor List' },
                { code: 'TKB-2.2.4', title: 'Timeline Reconcept & Design Lantai 2', output: 'Timeline Approved', actual: 'Need Feedback Pak Angga', deadline: '30 Jul 2026', status: 'Belum Mulai', isTKB: true, link: '📄 Draft Schedule' },
                { code: 'TKB-2.2.5', title: 'Relayout floor Lantai 2', output: 'Selesai', deadline: '30 Nov 2026', status: 'Belum Mulai', isTKB: true, link: '📄 WO Floor L2' }
              ]
            },
            {
              id: 'TKB-2.3',
              name: 'Goal 2: Operasional — Peningkatan Basket Size & Traffic Rasio',
              targetOutput: 'Basket Size Rp530.000 & Rasio Traffic ke Transaksi 4000%',
              targetOutcome: 'Peningkatan revenue per pengunjung store',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-2.3.1', title: 'Mapping MPP Kasir PKWT Tidak DW', output: 'Mapping Selesai', actual: 'Eskalasi Pak Angga ke Bu Muni (10 Jul 2026); pengajuan BUSPRO TKB ke IT & Inovasi', deadline: '12 Jul 2026', status: 'Done', isTKB: true, link: '📄 Eskalasi Bu Muni' },
                { code: 'TKB-2.3.2', title: 'Timeline Training PC & Kasir', output: 'Jadwal Training', actual: 'Need Feedback Pak Angga', deadline: '18 Jul 2026', status: 'Done', isTKB: true, link: '📄 Modul Training' },
                { code: 'TKB-2.3.3', title: 'Indikator keberhasilan training Kasir & PC', output: 'Matrix KPI Training', actual: 'Need Feedback Pak Angga', deadline: '18 Jul 2026', status: 'Done', isTKB: true, link: '📄 Matrix Indikator' },
                { code: 'TKB-2.3.4', title: 'Membuat framework OPS Semester 2 2026', output: 'Framework OPS S2', actual: 'Need Feedback Pak Angga', deadline: '12 Jul 2026', status: 'Done', isTKB: true, link: '📄 Framework Deck' },
                { code: 'TKB-2.3.5', title: 'Menyusun strategi sumber traffic baru', output: 'Pemetaan Institusi/Hotel', actual: 'Revisi — feedback Pak Angga: kurang detail; aktivasi pemetaan hotel disetujui', deadline: '31 Jul 2026', status: 'Done', isTKB: true, link: '📄 Map Hotel Approved' },
                { code: 'TKB-2.3.6', title: 'Solved problem & Aktivasi Traffic', output: 'Weekly Activation Plan', actual: 'Revisi — campaign 17 Agu "Sekeranjang Kemerdekaan", campaign nongkrong Bali; submit meeting Pak I', deadline: '31 Jul 2026', status: 'Done', isTKB: true, link: '📄 Jadwal Campaign' }
              ]
            },
            {
              id: 'TKB-3.0',
              name: 'Goal 3: SDM Operation — Target 100% Ontime',
              targetOutput: 'Pemenuhan SDM Operation Berkualitas',
              targetOutcome: 'Penurunan turnover & peningkatan SLA pelayanan',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-3.1', title: 'Reach out kandidat', output: 'List Kandidat', actual: 'Approved Pak Angga', deadline: '20 Jun 2026', status: 'Done', isTKB: true, link: '📄 Candidate List' },
                { code: 'TKB-3.2', title: 'Approaching kandidat', output: 'Interviews Scheduled', actual: 'Approved Pak Angga', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '📄 Schedule App' },
                { code: 'TKB-3.3', title: 'Interview kandidat', output: 'User Interview Selesai', actual: 'Kandidat: Rinaldy Sudirman, Hari Gusti Putra, Jusac Rabin — Approved Pak Angga', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '📄 Result Interview' },
                { code: 'TKB-3.4', title: 'Offering salary', output: 'Offering Letter Sent', actual: '90–100% gagal offering karena penawaran salary tidak masuk (monitoring Anggi Pangesti)', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '📄 Monitoring Anggi' },
                { code: 'TKB-3.5', title: 'Join (Onboarding SDM)', output: 'SDM Masuk Kerja', actual: '100% gagal offering karena penawaran salary tidak masuk', deadline: '30 Jul 2026', status: 'Overdue', isTKB: true, link: '📄 HR Escalation', penaltyAmount: 'Rp200.000' }
              ]
            },
            {
              id: 'TKB-4.0',
              name: 'Goal 4: PRODUK — Pengembangan Produk Makanan (Target 100% Ontime)',
              targetOutput: 'Produk Makanan Unik khas Jepang & Bali',
              targetOutcome: 'Penambahan varian fast-moving retail',
              budget: null,
              penaltyClause: 'CCP: Late > Denda Rp200.000',
              krs: [
                { code: 'TKB-4.1', title: 'Riset Pasar Makanan', output: 'Laporan Riset', deadline: '7 Jun 2026', status: 'Done', isTKB: true, link: '📄 Laporan Riset' },
                { code: 'TKB-4.2', title: 'Reach out produk makanan unik Jepang', output: 'Contact Vendor', deadline: '14 Jun 2026', status: 'Done', isTKB: true, link: '🔗 Vendor List JP' },
                { code: 'TKB-4.3', title: 'Approaching Vendor Makanan', output: 'Diskusi Produk', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '📄 Minutes of Meeting' },
                { code: 'TKB-4.4', title: 'Sampling Product Makanan', output: 'Sample Approved', deadline: '7 Jul 2026', status: 'Done', isTKB: true, link: '📄 Sample Review' },
                { code: 'TKB-4.5', title: 'Dealing Vendor Makanan', output: 'Kontrak PKS', actual: 'Belum selesainya kesepakatan margin dengan supplier', deadline: '31 Jul 2026', status: 'Overdue', isTKB: true, link: '📄 Draft PKS', penaltyAmount: 'Rp200.000' }
              ]
            }
          ]
        }
      ]
    }

  }
};
// --------------------------------------------------------------------------
// OKR PRODEV DATASET — Produk Development (Data Real Juli 2026)
// --------------------------------------------------------------------------
const prodevOKRData = {
  monthsData: {
    '7': {
      monthName: 'Agustus 2026',
      project: { id: 'prodev', name: 'Produk Development (PRODEV)' },
      objectives: [
        {
          id: 'PD-1',
          name: 'Objective 1 — Produk Luar Negri',
          targetOutput: 'Produk sudah tersedia untuk di launching dengan total 10 pcs Produk Pria + 5 pcs Produk pendamping Wanita',
          targetOutcome: 'Provide Campaign Luar Negri dengan Motif yang original',
          deadline: '31 Agust 2026',
          krs: [
            { code: 'PD-1.1', title: 'Pembuatan Design Produk Jaket', output: '10 Looks', deadline: 'Done', status: 'Done', actual: '1. Menentukan arahan Design, 2. Menyetujui Opsi-opsi Design yang akan diajukan ke Owner', link: '📄 Design Deck' },
            { code: 'PD-1.2', title: 'Produksi Sample Produk Jaket', output: '10 Pcs', deadline: '30 Mei 2026', status: 'Done', actual: '1. Menentukan vendor/penjahit produksi sample, 2. Menyetujui kualitas & finishing sample yang dihasilkan', link: '📄 Sample Review' },
            { code: 'PD-1.3', title: 'Motif Design Kain Original', output: '2 Motif dengn 3 Warna', deadline: '30 Mei 2026', status: 'Done', actual: '1. Menentukan arahan motif & palet warna sesuai konsep LN, 2. Menyetujui motif final sebelum masuk ke proses produksi kain', link: '📄 Motif Approve' },
            { code: 'PD-1.4', title: 'Produksi Motif Kain original (Digital Print)', output: '2 Motif dengn 3 Warna', deadline: '31 Juli 2026', status: 'Progress', actual: '1. Menentukan vendor digital print, 2. Menyetujui hasil cetak sesuai standar warna & kualitas', link: '📄 Output Print' },
            { code: 'PD-1.5', title: 'Produksi Motif Kain original (Batik Tulis)', output: '2 Motif dengn 3 Warna', deadline: '31 Juli 2026', status: 'Progress', actual: '1. Menyetujui proses & hasil akhir batik sebelum masuk ke produksi garmen', link: '📄 Status Tulis' },
            { code: 'PD-1.6', title: 'Pembuatan Design Produk Waita (Wanita)', output: '5 Looks', deadline: '15 Juli 2026', status: 'Done', actual: '1. Menentukan arahan design produk wanita pendamping, 2. Menyetujui opsi design yang diajukan ke Owner', link: '📄 Draft Wastra' },
            { code: 'PD-1.7', title: 'Produksi Sample Produk Waita (Wanita)', output: '5 Pcs', deadline: '15 Agust 2026', status: 'Progress', actual: '1. Menentukan vendor produksi sample wanita, 2. Menyetujui kualitas & fitting sample produk wanita', link: '📄 Status Sample' }
          ]
        },
        {
          id: 'PD-2',
          name: 'Objective 2 — Produk Premium (Store Jakarta)',
          targetOutput: 'Store Premium Jakarta: Kapasitas display 1.027 pcs dengan 10% new Produk (320 pcs)',
          targetOutcome: 'Dapat memprovide kebutuhan Store guna meningkatkan Sales Store',
          deadline: '31 Agust 2026',
          krs: [
            { code: 'PD-2.1', title: 'Design Motif Kain Pola Exclusive', output: '5 Looks', deadline: '25 Juli 2026', status: 'Progress', actual: '1. Menentukan arahan design motif eksklusif sesuai positioning Premium Store, 2. Menyetujui 30 looks sebelum masuk produksi', link: '📄 PO Superfine' },
            { code: 'PD-2.2', title: 'Produksi Kain Pola Exclusive', output: '5 pcs', deadline: '15 Agust 2026', status: 'Progress', actual: '1. Menentukan vendor kain pola, 2. Menyetujui kualitas kain sebelum distribusi ke store', link: '📄 Status Vendor' },
            { code: 'PD-2.3', title: 'Design Motif Kain Baron Exclusive', output: '30 Looks', deadline: '25 Juli 2026', status: 'Progress', actual: '1. Menentukan arahan motif kain baron yang bernilai eksklusif, 2. Menyetujui 30 looks final', link: '📄 Status Baron' },
            { code: 'PD-2.4', title: 'Produksi Kain Baron Exclusive', output: '10 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: '1. Menentukan vendor kain baron, 2. Menyetujui kualitas hasil produksi', link: '📄 Status Sutra' },
            { code: 'PD-2.5', title: 'Design Motif Kain Sutra Exclusive', output: '5 Looks', deadline: '25 Juli 2026', status: 'Progress', actual: '1. Menentukan arahan motif Sutra dengan nilai premium, 2. Menyetujui 30 looks final', link: '📄 Status Sutra 10M' },
            { code: 'PD-2.6', title: 'Produksi Kain Sutra Exclusive', output: '5 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: '1. Menentukan vendor kain sutra, 2. Menyetujui kualitas & tekstur kain hasil produksi', link: '📄 Status Serat' },
            { code: 'PD-2.7', title: 'Design Motif Kemeja Katun', output: '30 Looks', deadline: '25 Juli 2026', status: 'Progress', actual: '1. Menentukan arahan design kemeja katun, 2. Menyetujui 30 looks sebelum produksi', link: '📄 Status Katun' },
            { code: 'PD-2.8', title: 'Produksi Kemeja Katun', output: '30 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: '1. Menyetujui vendor kemeja katun, 2. Menyetujui kualitas jahitan & finishing', link: '📄 Status Produksi Katun' },
            { code: 'PD-2.9', title: 'Design Motif Hem Katun', output: '30 Looks', deadline: '25 Juli 2026', status: 'Progress', actual: '1. Menentukan arahan design hem katun, 2. Menyetujui 30 looks sebelum produksi', link: '📄 Story Deck' },
            { code: 'PD-2.10', title: 'Produksi Hem Katun', output: '30 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: '1. Menentukan vendor produksi hem katun, 2. Menyetujui kualitas jahitan & finishing', link: '📄 Draft Seragam' },
            { code: 'PD-2.11', title: 'Produk dengan Story Khusus', output: '5 Produk', deadline: '15 Agust 2026', status: 'Progress', actual: '1. Menentukan narasi/story untuk masing-masing produk, 2. Menyetujui konsep story & presentasi produk ke tim marketing', link: '📄 Story Deck' },
            { code: 'PD-2.12', title: 'Pembuatan Design Produk Seragam SPG', output: '2 Looks Approved', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: '1. Menentukan arahan design seragam SPG, 2. Menyetujui 2 looks sebelum produksi', link: '📄 Draft Seragam' }
          ]
        },
        {
          id: 'PD-3',
          name: 'Objective 3 — Topi Momen',
          targetOutput: 'Tersedia 5 Looks Design Kaos yang disetujui oleh Owner',
          targetOutcome: 'Peningkatan Sales Pada Stand Momen',
          deadline: '30 Juli 2026',
          krs: [
            { code: 'PD-3.1', title: 'Design Motif', output: '5 Looks', deadline: 'Done', status: 'Done', actual: '1. Menentukan arahan design motif topi, 2. Menyetujui 5 looks final yang akan di Showing ke Owner', link: '📄 Design Topi' },
            { code: 'PD-3.2', title: 'Produksi Sample Topi', output: '5 Looks', deadline: '15 Juli 2026', status: 'Done', actual: '1. Menentukan vendor produksi sample topi, 2. Menyetujui kualitas & konstruksi sample sebelum masuk produksi massal', link: '📄 Sample Topi' }
          ]
        },
        {
          id: 'PD-4',
          name: 'Objective 4 — Produk Fashion Show (IFW)',
          targetOutput: 'Dapat menjangkau minimal 5 juta reach audience di social media',
          targetOutcome: 'Dapat meningkatkan Brand Awareness untuk menjaga eksistensi Brand',
          deadline: '20 Juli 2026',
          krs: [
            { code: 'PD-4.1', title: 'Design Produk Momen Fashion Show', output: '12 Looks', deadline: '25 Mei 2026', status: 'Done', actual: '1. Menentukan arahan konsep design sesuai tema IFW, 2. Menyetujui 12 looks yang siap diproduksi', link: '📄 Design Set 1' },
            { code: 'PD-4.2', title: 'Produksi Produk Momen Fashion Show', output: '12 Looks', deadline: '10 Juli 2026', status: 'Done', actual: '1. Menentukan vendor & timeline produksi, 2. Menyetujui kualitas garmen & kesiapan untuk runway', link: '📄 Sample Set 1' },
            { code: 'PD-4.3', title: 'Design Produk BT Fashion Show', output: '15 looks', deadline: '25 Mei 2026', status: 'Done', actual: '1. Menentukan arahan design sesuai brief Fashion Show, 2. Menyetujui 15 looks final', link: '📄 Design Set 2' },
            { code: 'PD-4.4', title: 'Produksi Produk BT Fashion Show', output: '15 looks', deadline: '10 Juli 2026', status: 'Done', actual: '1. Menentukan vendor & jadwal produksi BT, 2. Menyetujui hasil produksi & kesiapan tampil di Fashion Show', link: '📄 Output PBF' }
          ]
        },
        {
          id: 'PD-5',
          name: 'Objective 5 — Kaos Momen',
          targetOutput: 'Tersedia Design Kemeja MOMEN yang disetujui oleh Owner',
          targetOutcome: 'Peningkatan Sales Pada Stand Momen',
          deadline: '30 September 2026',
          krs: [
            { code: 'PD-5.1', title: 'Design Kemeja Momen', output: '4 Looks', deadline: 'Done', status: 'Done', actual: '1. Menentukan arahan design & palet warna kaos momen, 2. Menyetujui 10 looks final sebelum produksi', link: '📄 Design Kaos' },
            { code: 'PD-5.2', title: 'Produksi Kemeja Momen', output: '4 Looks', deadline: '30 September 2026', status: 'Progress', actual: '1. Menentukan vendor sablon & produksi kaos, 2. Menyetujui kualitas cetak, bahan & finishing setiap batch', link: '📄 Output Kaos' }
          ]
        }
      ]
    },
    '6': {
      monthName: 'Juli 2026',
      project: { id: 'prodev', name: 'Produk Development (PRODEV)' },
      objectives: [
        {
          id: 'PD-1',
          name: 'Objective 1 — Produk Lokal Negri',
          targetOutput: 'Produk karya handmade & motif original',
          targetOutcome: 'Provide Campaign dengan motif yang original',
          deadline: '31 Agust 2026',
          krs: [
            { code: 'PD-1.1', title: 'Percepatan Design Produk Detail', output: '10 Looks', deadline: '—', status: 'Done', actual: 'Design sudah selesai dan disetujui owner', link: '📄 Design Deck' },
            { code: 'PD-1.2', title: 'Pembuatan Sampel Produk Detail', output: '10 Pcs', deadline: '30 Mei 2026', status: 'Done', actual: 'Sample selesai dibuat dan dievaluasi', link: '📄 Sample Review' },
            { code: 'PD-1.3', title: 'Motif Design Motif Original', output: '2 Motif design 3 Warna', deadline: '—', status: 'Done', actual: 'Motif original sudah di-approve', link: '📄 Motif Approve' },
            { code: 'PD-1.4', title: 'Produksi Motif Design (Digital Print)', output: '2 Motif design 3 Warna', deadline: '31 Juli 2026', status: 'Done', actual: 'Produksi digital print selesai', link: '📄 Output Print' },
            { code: 'PD-1.5', title: 'Produksi Motif Batik Tulis', output: '2 Motif design 3 Warna', deadline: '31 Juli 2026', status: 'Progress', actual: 'Proses pengerjaan batik tulis masih berjalan di pengrajin', link: '📄 Status Tulis' },
            { code: 'PD-1.6', title: 'Percepatan Design Produk Wastra', output: '5 Looks', deadline: '15 Agust 2026', status: 'Progress', actual: 'Draft design wastra dalam proses finalisasi', link: '📄 Draft Wastra' },
            { code: 'PD-1.7', title: 'Produksi Sampel Produk Wastra', output: '5 Pcs', deadline: '15 Agust 2026', status: 'Progress', actual: 'Menunggu finalisasi design sebelum produksi sample', link: '📄 Status Sample' }
          ]
        },
        {
          id: 'PD-2',
          name: 'Objective 2 — Produk Premium (Store Jakarta)',
          targetOutput: 'Store Premium Jakarta: Kapasitas display & produk premium',
          targetOutcome: 'Dapat memprovide kebutuhan Store guna meningkatkan Sales Store',
          deadline: '31 Agust 2026',
          krs: [
            { code: 'PD-2.1', title: 'Produksi Kain Pola Exclusive 1–5 Juta', output: '5 pcs', deadline: '15 Agust 2026', status: 'Progress', actual: 'Opsi kain Superfine & trial batik dipesan', link: '📄 PO Superfine' },
            { code: 'PD-2.2', title: 'Produksi Kain Pola Exclusive 5–10 Juta', output: '5 pcs', deadline: '15 Agust 2026', status: 'Progress', actual: 'Belum ada update vendor/sample/approval', link: '📄 Status Vendor' },
            { code: 'PD-2.3', title: 'Produksi Kain Baron Exclusive 5–10 Juta', output: '10 pcs', deadline: '15 Agust 2026', status: 'Progress', actual: 'Belum ada update, berpotensi terdampak keputusan beli produk jadi', link: '📄 Status Baron' },
            { code: 'PD-2.4', title: 'Produksi Kain Sutra Exclusive 5–10 Juta', output: '5 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: 'Belum ada update vendor/hasil/approval', link: '📄 Status Sutra' },
            { code: 'PD-2.5', title: 'Produksi Kain Sutra Exclusive 10–20 Juta', output: '5 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: 'Belum ada update vendor/hasil/approval/tekstur', link: '📄 Status Sutra 10M' },
            { code: 'PD-2.6', title: 'Produksi Kain Serat Exclusive', output: '5 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: 'Belum ada update', link: '📄 Status Serat' },
            { code: 'PD-2.7', title: 'Design Motif New Katun', output: '30 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: 'Belum ada update jumlah, perlu diselaraskan dgn keputusan beli produk jadi', link: '📄 Status Katun' },
            { code: 'PD-2.8', title: 'Produksi New Katun', output: '30 pcs', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: 'Belum ada update vendor/jumlah/sample/approval', link: '📄 Status Produksi Katun' },
            { code: 'PD-2.9', title: 'Produksi Design Produk Story House', output: '1 Produk', deadline: '15 Agust 2026', status: 'Progress', actual: 'Daftar produk prioritas dibuat, finalisasi narasi & approval belum terkonfirmasi', link: '📄 Story Deck' },
            { code: 'PD-2.10', title: 'Percepatan Design Produk Garment SPG', output: '2 Looks Approved', deadline: '15 Agust 2026', status: 'Belum Mulai', actual: 'Desain awal ada, masih direvisi, cari alternatif desain pria', link: '📄 Draft Seragam' }
          ]
        },
        {
          id: 'PD-3',
          name: 'Objective 3 — Topi Momen',
          targetOutput: 'Tersedia 5 Looks Design Topi yang disetujui',
          targetOutcome: 'Peningkatan Sales Pada Stand Momen',
          deadline: '30 Juli 2026',
          krs: [
            { code: 'PD-3.1', title: 'Design Motif Topi', output: '5 Looks', deadline: '15 Juli 2026', status: 'Done', actual: 'Design 5 looks selesai dan disetujui', link: '📄 Design Topi' },
            { code: 'PD-3.2', title: 'Produksi Sample Topi', output: '5 Looks', deadline: '15 Juli 2026', status: 'Done', actual: 'Sample topi selesai diproduksi dan siap di-deal', link: '📄 Sample Topi' }
          ]
        },
        {
          id: 'PD-4',
          name: 'Objective 4 — Produk Fashion Show (PBF)',
          targetOutput: 'Produk Fashion Show siap tampil runway',
          targetOutcome: 'Dapat meningkatkan Brand Awareness untuk menjaga eksistensi Brand',
          deadline: '20 Juli 2026',
          krs: [
            { code: 'PD-4.1', title: 'Design Produk Fashion Show (Set 1)', output: '13 Looks', deadline: '29 Mei 2026', status: 'Done', actual: 'Design 13 looks selesai dan disetujui untuk produksi', link: '📄 Design Set 1' },
            { code: 'PD-4.2', title: 'Produksi Sample Fashion Show (Set 1)', output: '5 Looks', deadline: '20 Juli 2026', status: 'Done', actual: 'Sample 5 looks selesai', link: '📄 Sample Set 1' },
            { code: 'PD-4.3', title: 'Design Produk Fashion Show (Set 2)', output: '11 Looks', deadline: '29 Mei 2026', status: 'Done', actual: 'Design 11 looks set 2 selesai', link: '📄 Design Set 2' },
            { code: 'PD-4.4', title: 'Produksi Produk Fashion Show (Set 2)', output: '11 Looks', deadline: '30 Juli 2026', status: 'Done', actual: 'Produksi 11 looks selesai, siap untuk foto konten', link: '📄 Output PBF' }
          ]
        },
        {
          id: 'PD-5',
          name: 'Objective 5 — Kaos Momen',
          targetOutput: 'Tersedia 10 Looks Kaos Momen yang disetujui',
          targetOutcome: 'Peningkatan Sales Pada Stand Momen',
          deadline: '31 Agust 2026',
          krs: [
            { code: 'PD-5.1', title: 'Design Kaos Momen', output: '10 Looks with 5 Warna', deadline: '11 Agust 2026', status: 'Done', actual: 'Design 10 looks x 5 warna selesai dan disetujui', link: '📄 Design Kaos' },
            { code: 'PD-5.2', title: 'Produksi Kaos Momen', output: '10 Looks with 5 Warna', deadline: '11 Agust 2026', status: 'Done', actual: 'Produksi selesai, siap distribusi ke divisi Momen', link: '📄 Output Kaos' }
          ]
        }
      ]
    }
  }
};

// --------------------------------------------------------------------------
// OKR PRODUKSI DATASET — Batik Factory + Handprint Factory + Garment
// --------------------------------------------------------------------------
const produksiOKRData = {
  monthsData: {
    '7': {
      monthName: 'Agustus 2026',
      sections: [
        {
          id: 'batik-factory', name: '🏭 Batik Factory', color: '#F59E0B',
          objectives: [
            {
              id: 'BF-1.1', category: 'Percepatan Proses Produksi',
              name: 'Meningkatkan Leadtime Produksi ke 95%',
              targetOutput: 'Output Produksi di 5000 pcs',
              targetOutcome: 'Bisa menyelesaikan PO ontime 95%',
              deadline: '31 Agu 2026',
              krs: [
                { code: 'BF-1.1.1', title: 'Menyusun Capacity Planning mingguan berdasarkan PO, forecast, manpower dan kapasitas mesin', output: 'Capacity Planning tersedia dan tervalidasi', deadline: '10 Agustus 2026', status: 'Done', link: 'Fabrikasi | Kalender Produksi', actual: 'Sudah mulai peralihan planning produksi tersistem' },
                { code: 'BF-1.1.2', title: 'Membuat Capacity Loading berdasarkan kapasitas Available, Booked dan Idle', output: 'Capacity Loading mingguan tersedia 100%', deadline: '10 Agustus 2026', status: 'Done', link: 'Fabrikasi | Kalender Produksi', actual: 'Sudah mulai peralihan planning produksi tersistem' },
                { code: 'BF-1.1.3', title: 'Membuat dashboard monitoring Capacity Booking Rate', output: 'Dashboard Capacity aktif dan update 100% hari kerja', deadline: '29 Agustus 2026', status: 'Done', link: 'Fabrikasi | Kalender Produksi', actual: 'Masih on progres develop perbaikan untuk kesesuaian data' }
              ]
            },
            {
              id: 'BF-1.2', category: 'Percepatan Proses Produksi',
              name: 'Menjaga Stabilitas Ontime Delivery Rate di 95%',
              targetOutput: 'Ontime Delivery Rate stabil di 200 pcs/hari',
              targetOutcome: 'Bisa menyelesaikan PO ontime 95%',
              deadline: '31 Agu 2026',
              krs: [
                { code: 'BF-1.2.1', title: 'Melakukan review kapasitas produksi dan forecast 4 minggu ke depan', output: 'Rolling Capacity Forecast tersedia', deadline: '15 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-1.2.2', title: 'Menetapkan Production Priority berdasarkan due date, customer priority dan material readiness', output: '100% order critical memiliki priority plan', deadline: '12 Agustus 2026', status: 'Done', link: 'Fabrikasi | Kalender Produksi', actual: 'Sudah mulai peralihan planning produksi tersistem' },
                { code: 'BF-1.2.3', title: 'Membuat Early Warning H-2 untuk order yang berisiko terlambat', output: '100% order H-2 termonitor', deadline: '10 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-1.2.4', title: 'Membuat skema Fast Track Order untuk order critical', output: '100% order critical memiliki prioritas dan jalur eskalasi', deadline: '12 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' }
              ]
            },
            {
              id: 'BF-2.1', category: 'Perbaikan Kualitas Reject',
              name: 'Menurunkan angka reject hingga ke <5%.',
              targetOutput: 'Perbaikan proses pre-production, produksi, & post production',
              targetOutcome: '% Reject Critical menurun',
              deadline: '31 Agu 2026',
              krs: [
                { code: 'BF-2.1.1', stage: 'Perbaikan proses pre-production', title: 'Membuat Pareto Top 3 defect produksi', output: 'Pareto Top 3 defect tersedia setiap minggu', deadline: '15 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-2.1.2', stage: 'Perbaikan proses pre-production', title: 'Melakukan RCA (Root Cause Analysis) menggunakan 4M + 5 Why untuk defect dominan', output: '100% defect dominan memiliki RCA', deadline: '15 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-2.1.3', stage: 'Perbaikan proses pre-production', title: 'Menetapkan Critical Process Parameter (CPP) pada proses kritis', output: 'CPP tersedia untuk 100% proses kritis', deadline: '21 Agustus 2026', status: 'Done', link: 'Fabrikasi | Kalender Produksi', actual: '-' },
                { code: 'BF-2.1.4', stage: 'Perbaikan proses produksi', title: 'Membuat Material Readiness Checklist sebelum proses produksi', output: '100% batch menggunakan checklist', deadline: '20 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-2.1.5', stage: 'Perbaikan proses produksi', title: 'Melakukan audit kepatuhan SOP dan CPP', output: 'Kepatuhan proses minimal 95%', deadline: '20 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-2.1.6', stage: 'Perbaikan proses produksi', title: 'Melakukan corrective action terhadap defect dominan', output: '100% temuan memiliki corrective action', deadline: 'Mingguan', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-2.1.7', stage: 'Perbaikan proses produksi', title: 'Melakukan monitoring dan validasi hasil improvement', output: 'Rework turun minimal 30%', deadline: 'Mingguan', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-2.1.8', stage: 'Perbaikan proses produksi', title: 'Membuat analisa Cost of Poor Quality (COPQ)', output: 'Laporan COPQ tersedia 100% setiap minggu', deadline: '22 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW)', actual: '-' },
                { code: 'BF-2.1.9', stage: 'Perbaikan proses produksi', title: 'Menetapkan standard consumption kain, malam, dye dan chemical', output: 'Standard consumption tersedia untuk 100% proses utama', deadline: '22 Agustus 2026', status: 'Done', link: 'Fabrikasi | Sampel Produksi', actual: '-' },
                { code: 'BF-2.1.10', stage: 'Perbaikan post production', title: 'Menjalankan program Kaizen berdasarkan sumber waste terbesar', output: 'Minimal 2 program Kaizen', deadline: '31 Agustus 2026', status: 'Done', link: 'Control Board Mini Factory (NEW) Sheet : Kaizen', actual: '-' },
                { code: 'BF-2.1.11', stage: 'Perbaikan post production', title: 'Mengukur saving hasil improvement', output: 'Saving terdokumentasi dalam Rupiah', deadline: '31 Agustus 2026', status: 'Done', link: 'NOMINAL PRODUK REJECT', actual: '-' }
              ]
            }
          ]
        },
        {
          id: 'handprint-factory', name: '🖐️ Handprint Factory', color: '#6366F1',
          objectives: [
            {
              id: 'HF-1.1', category: 'Optimasi & Akselerasi Quality Control (QC) Handprint',
              name: 'Penambahan & Efisiensi PIC QC Kain Handprint guna Mencegah Keterlambatan PO',
              targetOutput: 'Perekrutan & Pelatihan 2 PIC QC Baru; SOP Pengecekan Cepat',
              targetOutcome: 'Zero Late Shipment akibat Bottleneck QC; Lead Time Pengecekan Turun 50%',
              deadline: '31 Agu 2026',
              krs: [
                { code: 'HF-1.1.1', title: 'Melakukan penambahan & onboarding 1 PIC QC Handprint terampil', output: '1 PIC QC Aktif & Kompeten', deadline: '31 Aug 2026', status: 'Done', link: '-', actual: 'Sudah Join' },
                { code: 'HF-1.1.2', title: 'Mempercepat rata-rata durasi pengecekan kain dari 24 jam menjadi max 6 jam per lot', output: 'SOP Inspection < 6 jam/lot', deadline: '15 Sep 2026', status: 'On Progress', link: '-', actual: 'Menunggu PIC baru onboard' },
                { code: 'HF-1.1.3', title: 'Mencapai ketepatan waktu inspeksi (QC On-Time Rate) sebesar 98% untuk seluruh PO Handprint', output: 'Laporan QC On-Time Rate 98%', deadline: '30 Sep 2026', status: 'On Progress', link: '-', actual: '-' },
                { code: 'HF-1.1.4', title: 'Menekan tingkat keterlambatan pengiriman (Late PO) akibat antrean QC hingga 0%', output: '0 Case Late PO (QC Cause)', deadline: '30 Sep 2026', status: 'On Progress', link: '-', actual: '-' }
              ]
            },
            {
              id: 'HF-2.1', category: 'Digitalisasi & Automasi Sistem Produksi Handprint (Notifikasi, WIP, Tasklist)',
              name: 'Implementasi Sistem Tracking WIP (Work In Progress) Real-time Kain Handprint',
              targetOutput: 'Modul Tracking WIP Handprint terintegrasi di Dashboard Produksi',
              targetOutcome: 'Transparansi 100% posisi kain di setiap stasiun kerja & bottleneck terdeteksi dinamis',
              deadline: '31 Agu 2026',
              krs: [
                { code: 'HF-2.1.1', title: 'Mengembangkan & merilis fitur Tracking WIP Real-Time per Lot Handprint di Sistem Dashboard', output: 'Sistem WIP Live & Functional', deadline: '15 Sep 2026', status: 'Done', link: 'Sistem Handprint', actual: 'Pengembangan UI/UX & Database' },
                { code: 'HF-2.1.2', title: 'Mencapai 100% kepatuhan operator dalam melakukan scan/input status WIP di setiap stasiun', output: 'Kepatuhan Input Data 100%', deadline: '30 Sep 2026', status: 'Done', link: 'Sistem Handprint', actual: 'Training operator dijadwalkan' }
              ]
            },
            {
              id: 'HF-2.2', category: 'Digitalisasi & Automasi Sistem Produksi Handprint (Notifikasi, WIP, Tasklist)',
              name: 'Pengembangan Sistem Notifikasi Otomatis untuk Status & Alert Handprint',
              targetOutput: 'Sistem Notifikasi Push/Alert (Delay/Reject/QC Ready) ke SPV & Tim',
              targetOutcome: 'Respon penanganan kendala produksi < 15 menit dari tim terdesain',
              deadline: '31 Agu 2026',
              krs: [
                { code: 'HF-2.2.1', title: 'Membangun sistem notifikasi otomatis untuk kain siap QC, delay produksi, dan alert defect high-risk', output: 'Fitur Push Notification Active', deadline: '20 Sep 2026', status: 'Done', link: 'Sistem Handprint', actual: 'Integrasi API notifikasi' },
                { code: 'HF-2.2.2', title: 'Menurunkan Response Time terhadap alert kemacetan produksi/defect menjadi di bawah 15 menit', output: 'Avg Response Time < 15 Min', deadline: '30 Sep 2026', status: 'Done', link: 'Sistem Handprint', actual: '-' }
              ]
            },
            {
              id: 'HF-2.3', category: 'Digitalisasi & Automasi Sistem Produksi Handprint (Notifikasi, WIP, Tasklist)',
              name: 'Implementasi Sistem Tasklist Otomatis Harian Tim Produksi Handprint',
              targetOutput: 'Auto-generated Daily Tasklist berdasarkan Prioritas PO di Sistem',
              targetOutcome: 'Peningkatan produktivitas tim & tidak ada task/PO yang terlewat',
              deadline: '31 Agu 2026',
              krs: [
                { code: 'HF-2.3.1', title: 'Merancang & mengimplementasikan modul Auto-Tasklist harian berdasarkan priority PO & due date', output: 'Module Tasklist Otomatis', deadline: '25 Sep 2026', status: 'Done', link: 'Sistem Handprint', actual: '-' },
                { code: 'HF-2.3.2', title: 'Mencapai Task Completion Rate harian tim produksi sebesar minimum 95%', output: 'Task Completion Rate 95%', deadline: '30 Sep 2026', status: 'Done', link: 'Sistem Handprint', actual: '-' }
              ]
            }
          ]
        }
      ]
    },
    '6': {
      monthName: 'Juli 2026',
      sections: [
        {
          id: 'batik-factory', name: '🏭 Batik Factory', color: '#F59E0B',
          objectives: [
            {
              id: 'BF-1', category: 'Percepatan Proses Produksi',
              name: 'Mengurangi Cacat/In Proses saat ini dari 40% menjadi <20%',
              targetOutput: 'Output Produksi 80–90% bebas cacat',
              targetOutcome: 'Efisiensi produksi meningkat, cacat berkurang signifikan',
              deadline: '6 Juli 2026',
              krs: [
                { code: 'BF-1.1', title: 'Monitoring setiap hari pending DFRT dan salah coding', output: 'Monitoring pending DO RFP actual vs daily', deadline: 'Sabtu, 6 Jul 2026', status: 'Done', actual: 'Monitoring berjalan rutin, pending teridentifikasi harian', link: 'OKR PRODUCTION BT' },
                { code: 'BF-1.2', title: 'Menurunkan produksi cacat 50% (completed template)', output: 'Template monitoring 70% complete', deadline: 'Sabtu, 11 Jul 2026', status: 'Progress', actual: 'Template cacat monitoring selesai 70%, implementasi berjalan', link: 'OKR PRODUCTION BT' },
                { code: 'BF-1.3', title: 'Monitoring coding QR per item produksi', output: '3 hari sekali update & validasi', deadline: 'Jumat, 31 Jul 2026', status: 'Progress', actual: 'Sistem QR coding aktif, update rutin 3 hari sekali', link: 'OKR PRODUCTION BT' },
                { code: 'BF-1.4', title: 'Menurunkan cacat melalui Quality Control intensif', output: 'Target QC < 5% per batch', deadline: 'Minggu, 6 Jul 2026', status: 'Progress', actual: 'QC team aktif pengecekan harian setiap batch', link: 'OKR PRODUCTION BT' }
              ]
            },
            {
              id: 'BF-2', category: 'Percepatan Proses Produksi',
              name: 'Meningkatkan Produksi Delivery / Optimasi Output Maks',
              targetOutput: 'Delivery mencapai 200 pcs/order',
              targetOutcome: 'Kapasitas delivery meningkat, backlog berkurang',
              deadline: '31 Juli 2026',
              krs: [
                { code: 'BF-2.1', title: 'Analisis bottleneck mesin percetakan', output: 'Laporan analisis bottleneck', deadline: 'Kamis, 24 Jul 2026', status: 'Done', actual: '5 titik bottleneck kritis teridentifikasi dan dilaporkan', link: 'OKR PRODUCTION BT' },
                { code: 'BF-2.2', title: 'Optimasi alur cetak batik mesin — SOP baru', output: 'SOP alur cetak diperbarui', deadline: 'Kamis, 24 Jul 2026', status: 'Done', actual: 'SOP baru diterapkan dan divalidasi tim produksi', link: 'OKR PRODUCTION BT' },
                { code: 'BF-2.3', title: 'Implementasi sistem antrian mesin digital', output: 'Sistem antrian 100% digital', deadline: 'Kamis, 24 Jul 2026', status: 'Progress', actual: 'Antrian digital 60% terpasang, sisa masih manual', link: 'OKR PRODUCTION BT' },
                { code: 'BF-2.4', title: 'Trial prosedur bongkar sistem mesin beli', output: 'Mesin beli Maks teruji', deadline: 'Kamis, 30 Jul 2026', status: 'Progress', actual: 'Trial bongkar mesin beli berjalan di tim teknis', link: 'OKR PRODUCTION BT' }
              ]
            },
            {
              id: 'BF-3', category: 'Percetakan Final Box',
              name: 'Percetakan Final Box — Optimasi Kapasitas (% Kapasitas Optimal)',
              targetOutput: '% Kapasitas final box terisi optimal',
              targetOutcome: 'Produksi Final Box memenuhi target kapasitas penuh',
              deadline: '31 Juli 2026',
              krs: [
                { code: 'BF-3.1', title: 'Material: Mewah Percetakan — Pengadaan bahan premium', output: 'PO bahan premium approved', deadline: 'Jumat, 24 Jul 2026', status: 'Progress', actual: 'Negosiasi harga dengan supplier berjalan, menunggu approval', link: 'OKR PRODUCTION BT' },
                { code: 'BF-3.2', title: 'Material: Wastra Batikring — Produksi per motif', output: 'Min saldo motif Batik ring terpenuhi', deadline: 'Jumat, 30 Jul 2026', status: 'Progress', actual: '3 dari 7 motif selesai diproduksi', link: 'OKR PRODUCTION BT' },
                { code: 'BF-3.3', title: 'Material: Tentu Batikring — Target volume produksi', output: 'Min saldo Tentu ring terpenuhi', deadline: 'Jumat, 30 Jul 2026', status: 'Progress', actual: 'Target volume divalidasi, koordinasi supplier aktif', link: 'OKR PRODUCTION BT' },
                { code: 'BF-3.4', title: 'Material: Air Baku perendaman — Ketersediaan stok', output: 'Stok air baku 30 hari terjamin', deadline: 'Kamis, 30 Jul 2026', status: 'Progress', actual: 'Pengecekan sumber air baku, stok aman 15 hari ke depan', link: 'OKR PRODUCTION BT' }
              ]
            }
          ]
        },
        {
          id: 'handprint-factory', name: '🖐️ Handprint Factory', color: '#6366F1',
          objectives: [
            {
              id: 'HF-1.1', category: 'Perawatan & Pemeliharaan',
              name: 'Perawatan & Pemeliharaan Alat Area Lokasi non Tatikanan',
              targetOutput: 'Semua mesin tatikanan kondisi optimal',
              targetOutcome: 'Downtime mesin berkurang, produksi lancar',
              deadline: '31 Juli 2026',
              krs: [
                { code: 'HF-1.1.1', title: 'Area mesin tatikanan — Perawatan rutin berkala', output: 'Jadwal perawatan 100% terlaksana', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'Perawatan berkala mesin tatikanan selesai', link: 'OKR PRODUCTION BT' },
                { code: 'HF-1.1.2', title: 'Dapur bubur — 1 filter tatikanan diperbaiki/ganti', output: 'Filter baru terpasang', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'Filter tatikanan berhasil diganti, dapur bubur operasional', link: 'OKR PRODUCTION BT' },
                { code: 'HF-1.1.3', title: 'Pencegahan CAK mesin — Pipe lubricant sistem', output: 'Pipe lubricant berfungsi normal', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'Pipe lubricant terpasang, overheating mesin dicegah', link: 'OKR PRODUCTION BT' },
                { code: 'HF-1.1.4', title: 'Pencegahan alat berikutnya — Jadwal preventif', output: 'Jadwal preventif maintenance Q3', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'Jadwal preventif Q3 dibuat dan disetujui management', link: 'OKR PRODUCTION BT' }
              ]
            },
            {
              id: 'HF-1.2', category: 'Engineering & Operational Maintenance',
              name: 'Perawatan & Modifikasi Pilar Busur Mesin Kelas Room B Batik List',
              targetOutput: 'Throughput Room B meningkat optimal',
              targetOutcome: 'Bottleneck Room B berkurang, efisiensi naik',
              deadline: '31 Juli 2026',
              krs: [
                { code: 'HF-1.2.1', title: 'Inspeksi pilar busur Room B — Temuan & rekomendasi', output: 'Laporan inspeksi pilar busur', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: '3 titik perbaikan ditemukan dan ditindaklanjuti', link: 'OKR PRODUCTION BT' },
                { code: 'HF-1.2.2', title: 'Perbaikan sistem mekanik mekatronik mesin', output: 'Sistem mekanik optimal', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'Mekatronik berhasil diperbaiki dan diuji coba', link: 'OKR PRODUCTION BT' },
                { code: 'HF-1.2.3', title: 'Update SOP alur fungsional Kelas/Room B', output: 'SOP Room B final & tersosialisasi', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'SOP Room B diperbarui dan disosialisasikan ke operator', link: 'OKR PRODUCTION BT' }
              ]
            },
            {
              id: 'HF-1.3', category: 'Engineering & Operational Maintenance',
              name: 'Koordinasi Pilot — Pemulihan Daur-of-Plant (Lintas Plant)',
              targetOutput: 'Koordinasi lintas plant berjalan efektif',
              targetOutcome: 'Sinergi produksi antar plant optimal',
              deadline: '31 Juli 2026',
              krs: [
                { code: 'HF-1.3.1', title: 'Identifikasi mesin yang bisa direnovasi dari vendor', output: 'Daftar mesin renovasi eksternal', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'Identifikasi selesai, 4 mesin layak direnovasi', link: 'OKR PRODUCTION BT' },
                { code: 'HF-1.3.2', title: 'Follow-up PO vendor renovasi mesin', output: 'PO vendor terkirim & confirmed', deadline: 'Sabtu, 11 Jul 2026', status: 'Done', actual: 'Vendor konfirmasi jadwal, PO terkirim tepat waktu', link: 'OKR PRODUCTION BT' },
                { code: 'HF-1.3.3', title: 'Jalan koordinasi QC lintas plant — Meeting rutin', output: 'Jadwal meeting mingguan lintas plant', deadline: 'Jumat, 31 Jul 2026', status: 'Progress', actual: 'Koordinasi berjalan, meeting mingguan ditetapkan setiap Senin', link: 'OKR PRODUCTION BT' }
              ]
            },
            {
              id: 'HF-2.1', category: 'Compliance & Quality Control',
              name: 'Pembuatan Area QC Internal Handprint',
              targetOutput: 'SOP QC Handprint tersedia & area QC terbentuk',
              targetOutcome: 'Area QC terstruktur, produk berkualitas standar',
              deadline: '31 Juli 2026',
              krs: [
                { code: 'HF-2.1.1', title: 'Membuat SOP untuk proses QC Handprint', output: 'SOP QC Handprint final approved', deadline: 'Jumat, 31 Jul 2026', status: 'Progress', actual: 'Draft SOP 80% selesai, review manager berlangsung', link: 'OKR PRODUCTION BT' },
                { code: 'HF-2.1.2', title: 'Mitra penilaian dengan task QC — Evaluasi vendor QC', output: 'Vendor QC terpilih & kontrak', deadline: 'Jumat, 31 Jul 2026', status: 'Progress', actual: 'Evaluasi 3 vendor QC sedang berlangsung', link: 'OKR PRODUCTION BT' },
                { code: 'HF-2.1.3', title: 'Outcome SOP — Implementasi area QC internal', output: 'Area QC operasional penuh', deadline: 'Jumat, 31 Jul 2026', status: 'Progress', actual: 'Area fisik sudah disiapkan, alat QC dalam pengadaan', link: 'OKR PRODUCTION BT' }
              ]
            }
          ]
        },
        {
          id: 'garment', name: '👔 Garment', color: '#10B981',
          objectives: [
            {
              id: 'GM-1', category: 'Produksi Internal',
              name: 'Pembuatan Seragam untuk Produksi Internal BT-Rich Treste',
              targetOutput: 'Target menggunakan 98% produksi BT untuk internal',
              targetOutcome: 'Kebutuhan seragam internal terpenuhi dari produksi sendiri',
              deadline: '31 Juli 2026',
              budget: 'Rp 1.000.000.000',
              krs: [
                { code: 'GM-1.1', title: 'Layout Produksi dan Ket Kode seragam', output: 'Layout & kode seragam final', deadline: '17 Nov 2024', status: 'Done', actual: 'Layout dan koding seragam selesai dan disetujui', link: 'https://bit.ly/layout-seragam' },
                { code: 'GM-1.2', title: 'BCP (Batas Serta & Alasan Trendo) — Review awal', output: 'BCP dokumen approved', deadline: '11 Nov 2024', status: 'Done', actual: 'BCP direview dan disetujui divisi produksi', link: 'https://bit.ly/bcp-seragam' },
                { code: 'GM-1.3', title: 'Kalibrasi Ket Pemangan GBC — 1 Tahun siklus', output: 'GBC terkalibrasi, sertifikat valid', deadline: '24 Okt 2024', status: 'Progress', actual: 'Kalibrasi GBC dalam proses, jadwal 1 tahun ditetapkan', link: 'OKR PRODUCTION BT' },
                { code: 'GM-1.4', title: 'Perpajakan Kredit Ket Pemangan Garment', output: 'Dokumen pajak kredit completed', deadline: '30 Mei 2025', status: 'Done', actual: 'Dokumen perpajakan kredit garment selesai diurus', link: 'OKR PRODUCTION BT' },
                { code: 'GM-1.5', title: 'HH Produksi Garment — Standarisasi jam kerja', output: 'SOP HH Produksi final', deadline: '29 Mei 2024', status: 'Done', actual: 'Standar HH produksi ditetapkan dan berlaku', link: 'OKR PRODUCTION BT' },
                { code: 'GM-1.6', title: 'Kalibrasi HH Produksi ulang — Update standar 2026', output: 'HH Produksi 2026 diperbarui', deadline: '31 Jul 2026', status: 'Progress', actual: 'Review standar HH 2026 berlangsung, target akhir Juli', link: 'OKR PRODUCTION BT' }
              ]
            }
          ]
        }
      ]
    }
  }
};

// Helper: Normalize status into 5 main visual categories
function normalizeOKRStatus(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('done') || s.includes('selesai')) return { key: 'Done', label: 'Done', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.5)', icon: '🟢' };
  if (s.includes('overdue')) return { key: 'Overdue', label: 'Overdue', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', icon: '🔴' };
  if (s.includes('hold')) return { key: 'Hold', label: 'Hold', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.5)', icon: '🟠' };
  if (s.includes('progress') || s.includes('progres') || s.includes('berjalan') || s.includes('jalan') || s.includes('revisi')) return { key: 'On Progress', label: 'On Progress / Berjalan', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 0.5)', icon: '🟡' };
  return { key: 'Belum Mulai', label: 'Belum Mulai', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.2)', border: 'rgba(156, 163, 175, 0.5)', icon: '⚪' };
}

// --------------------------------------------------------------------------
// VIEW 4: OKR (Dashboard Visual Interaktif OKR Proyek)
// --------------------------------------------------------------------------
function renderOKRView() {
  const selectedProj = state.okrProjectFilter || 'all';
  const selectedStat = state.okrStatusFilter || 'all';

  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = okrRealData.monthsData ? (okrRealData.monthsData[currentMonthKey] || okrRealData.monthsData['7']) : okrRealData;
  const monthTitle = monthData.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');

  // Gather KRs based on project filter
  let activeProjects = monthData.projects || [];
  if (selectedProj !== 'all') {
    activeProjects = (monthData.projects || []).filter(p => p.id === selectedProj);
  }

  // All KRs extracted for metric cards & Kanban
  let allKRs = [];
  activeProjects.forEach(p => {
    p.objectives.forEach(obj => {
      obj.krs.forEach(kr => {
        allKRs.push({
          ...kr,
          projectId: p.id,
          projectName: p.name,
          objId: obj.id,
          objName: obj.name,
          targetOutput: kr.output || obj.targetOutput,
          targetOutcome: obj.targetOutcome,
          normStatus: normalizeOKRStatus(kr.status)
        });
      });
    });
  });

  // Filter KRs by selected status & search query
  const filteredKRs = allKRs.filter(kr => {
    const matchStatus = selectedStat === 'all' || kr.normStatus.key === selectedStat;
    const matchSearch = !state.searchQuery || 
      kr.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
      kr.code.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Summary Metrics
  const totalKRs = allKRs.length;
  const doneKRs = allKRs.filter(k => k.normStatus.key === 'Done').length;
  const overdueKRs = allKRs.filter(k => k.normStatus.key === 'Overdue').length;
  const holdKRs = allKRs.filter(k => k.normStatus.key === 'Hold').length;
  const donePercent = totalKRs ? Math.round((doneKRs / totalKRs) * 100) : 0;

  // Dedicated TKB Overdue Penalties (CCP Denda Rp200.000)
  const overdueTKBKRs = allKRs.filter(k => k.isTKB && k.normStatus.key === 'Overdue');
  const totalTKBDenda = overdueTKBKRs.length * 200000;

  // Kanban Board Columns
  const kanbanColumns = [
    { key: 'Overdue', title: '🔴 Overdue (Critical Priority)', color: '#EF4444' },
    { key: 'Hold', title: '🟠 Hold', color: '#F59E0B' },
    { key: 'On Progress', title: '🟡 On Progress / Revisi', color: '#EAB308' },
    { key: 'Belum Mulai', title: '⚪ Belum Mulai', color: '#9CA3AF' },
    { key: 'Done', title: '🟢 Done', color: '#10B981' }
  ];

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      
      <!-- Top Control & Filter Header -->
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:16px 20px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;">
        <div>
          <h2 style="color:var(--text-primary); font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:10px; margin:0;">
            ${getUnitLogoHtml('okr-bt', 32)}
            <span>Dashboard OKR Proyek Executive — Batik Trusmi (BT) (${monthTitle})</span>
          </h2>
          <p style="color:var(--text-secondary); font-size:0.8rem; margin:4px 0 0 0;">
            Monitoring Status Progress OKR (Premium Cirebon, Premium Jakarta, & The Keranjang Bali)
          </p>
        </div>

        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <!-- Filter Bulan -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Bulan:</span>
            <select id="okrMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" 
                    style="background:var(--bg-card); border:1.5px solid var(--accent-gold); color:var(--text-primary); padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
              <option value="7" ${state.selectedSalesMonth === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
              <option value="6" ${state.selectedSalesMonth === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
            </select>
          </div>

          <!-- Filter Project (hanya Premium Jakarta yang aktif) -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Project:</span>
            <select id="okrProjSelect" onchange="window.handleOKRProjectFilterChange(this.value)" 
                    style="background:var(--bg-card); border:1.5px solid var(--accent-gold); color:var(--text-primary); padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
              <option value="all" ${selectedProj === 'all' ? 'selected' : ''}>🏙️ Premium Jakarta (1 Proyek Aktif)</option>
            </select>
          </div>

          <!-- Filter Status -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Status:</span>
            <select id="okrStatSelect" onchange="window.handleOKRStatusFilterChange(this.value)" 
                    style="background:var(--bg-card); border:1.5px solid var(--accent-gold); color:var(--text-primary); padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
              <option value="all" ${selectedStat === 'all' ? 'selected' : ''}>Semua Status (5 Kategori)</option>
              <option value="Overdue" ${selectedStat === 'Overdue' ? 'selected' : ''}>🔴 Overdue</option>
              <option value="Hold" ${selectedStat === 'Hold' ? 'selected' : ''}>🟠 Hold</option>
              <option value="On Progress" ${selectedStat === 'On Progress' ? 'selected' : ''}>🟡 On Progress / Revisi</option>
              <option value="Belum Mulai" ${selectedStat === 'Belum Mulai' ? 'selected' : ''}>⚪ Belum Mulai</option>
              <option value="Done" ${selectedStat === 'Done' ? 'selected' : ''}>🟢 Done</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Metric Summary Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Total Key Results (KR)</span>
            <div class="metric-icon-box okr-theme"><i data-lucide="layers"></i></div>
          </div>
          <div class="metric-value">${totalKRs} KR Active</div>
          <div class="metric-trend trend-neutral">${activeProjects.length} Proyek Strategis</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Overall Done Rate</span>
            <div class="metric-icon-box okr-theme"><i data-lucide="check-circle-2"></i></div>
          </div>
          <div class="metric-value" style="color:#059669;">${donePercent}% Completed</div>
          <div class="metric-trend trend-up">${doneKRs} dari ${totalKRs} KR Selesai</div>
        </div>

        <div class="metric-card" style="border-color:rgba(225, 29, 72, 0.3);">
          <div class="metric-card-header">
            <span class="metric-title">Critical Overdue Items</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="alert-triangle"></i></div>
          </div>
          <div class="metric-value" style="color:#E11D48;">${overdueKRs} Items</div>
          <div class="metric-trend trend-down">Butuh Action Segera</div>
        </div>

        <div class="metric-card" style="border-color:rgba(217, 119, 6, 0.3);">
          <div class="metric-card-header">
            <span class="metric-title">Held Projects</span>
            <div class="metric-icon-box milestone-theme"><i data-lucide="pause-circle"></i></div>
          </div>
          <div class="metric-value" style="color:#D97706;">${holdKRs} Items</div>
          <div class="metric-trend trend-neutral">Evaluasi Strategi</div>
        </div>
      </div>

      <!-- Dedicated Panel Potensi Sanksi Keterlambatan Denda CCP TKB -->
      ${(selectedProj === 'all' || selectedProj === 'tkb') && overdueTKBKRs.length > 0 ? `
        <div style="background:linear-gradient(135deg, rgba(225, 29, 72, 0.12) 0%, var(--bg-card) 100%); border:1.5px solid #E11D48; padding:18px 20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px; border-bottom:1px solid rgba(225, 29, 72, 0.3); padding-bottom:10px;">
            <div>
              <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; color:#F43F5E; font-weight:800; display:flex; align-items:center; gap:6px;">
                <i data-lucide="alert-octagon"></i> Panel Potensi Sanksi Keterlambatan (Denda CCP TKB)
              </div>
              <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:2px;">
                Klausul CCP TKB: <span style="color:#FFF; font-weight:700;">Late > Denda Rp200.000 / KR</span> (Menampilkan HANYA KR berstatus Overdue yang berpotensi kena denda)
              </div>
            </div>
            <div style="background:rgba(225, 29, 72, 0.2); border:1px solid #E11D48; color:#FDA4AF; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.95rem; font-family:monospace;">
              Total Potensi Denda: Rp ${totalTKBDenda.toLocaleString('id-ID')}
            </div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:12px;">
            ${overdueTKBKRs.map(kr => `
              <div style="background:var(--bg-card); border:1px solid rgba(225, 29, 72, 0.35); padding:14px; border-radius:8px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px; box-shadow:var(--shadow-sm);">
                <div style="flex:1; min-width:0;">
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <span style="font-size:0.7rem; font-family:monospace; color:var(--accent-gold); font-weight:800; background:rgba(217,119,6,0.15); padding:2px 6px; border-radius:4px;">${kr.code}</span>
                    <span style="font-size:0.7rem; color:var(--text-secondary);">📅 Due: ${kr.deadline}</span>
                  </div>
                  <div style="color:var(--text-primary); font-size:0.85rem; font-weight:700; margin-bottom:4px; line-height:1.3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${kr.title}</div>
                  <div style="font-size:0.72rem; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${kr.objName}</div>
                </div>
                <div style="flex-shrink:0;">
                  <span style="background:rgba(225, 29, 72, 0.2); color:#FDA4AF; border:1px solid #E11D48; padding:4px 10px; border-radius:6px; font-size:0.75rem; font-weight:800; white-space:nowrap; display:inline-block;">
                    Denda Rp200.000
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Objective Progress Bars Grid -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);">
        <h3 style="color:var(--text-primary); font-size:1rem; font-weight:800; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="target" style="color:var(--accent-gold);"></i> Progress Completion per Objective / Project
        </h3>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
          ${activeProjects.map(proj => proj.objectives.map(obj => {
            const objDone = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
            const objTotal = obj.krs.length;
            const objPercent = objTotal ? Math.round((objDone / objTotal) * 100) : 0;

            return `
              <div style="background:rgba(255, 255, 255, 0.03); border:1px solid var(--border-color); padding:14px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <div>
                    <span style="font-size:0.72rem; color:var(--accent-gold); font-weight:700;">${proj.name}</span>
                    <h4 style="color:var(--text-primary); font-size:0.85rem; font-weight:700; margin:2px 0 0 0;">${obj.name}</h4>
                  </div>
                  <span style="font-size:0.9rem; font-weight:800; color:${objPercent === 100 ? '#10B981' : objPercent > 40 ? 'var(--accent-gold)' : '#38BDF8'}; font-family:monospace;">
                    ${objPercent}%
                  </span>
                </div>
                <div style="background:rgba(255, 255, 255, 0.08); height:8px; border-radius:4px; overflow:hidden; margin-bottom:8px;">
                  <div style="background:${objPercent === 100 ? '#10B981' : 'linear-gradient(90deg, #F59E0B, #10B981)'}; height:100%; width:${objPercent}%; transition:width 0.3s ease;"></div>
                </div>
                <div style="font-size:0.75rem; color:var(--text-secondary); display:flex; justify-content:space-between;">
                  <span>Done: ${objDone}/${objTotal} Key Results</span>
                  <span>Outcome: ${obj.targetOutcome || '-'}</span>
                </div>
              </div>
            `;
          }).join('')).join('')}
        </div>
      </div>

      <!-- KANBAN BOARD (Fokus Utama Action Item Prioritas) -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="color:var(--text-primary); font-size:1.05rem; font-weight:800; margin:0; display:flex; align-items:center; gap:8px;">
              <i data-lucide="kanban" style="color:var(--accent-gold);"></i> Kanban Board Action Items (Fokus Utama Prioritas Exec)
            </h3>
            <span style="font-size:0.78rem; color:var(--text-secondary);">Klik kartu KR untuk expand detail output, progress realita & link dokumen</span>
          </div>
          <div style="font-size:0.78rem; color:var(--accent-gold); font-weight:700;">
            Menampilkan ${filteredKRs.length} / ${totalKRs} KR Active
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px; overflow-x:auto;">
          ${kanbanColumns.map(col => {
            const colKRs = filteredKRs.filter(k => k.normStatus.key === col.key);

            return `
              <div style="background:rgba(255, 255, 255, 0.03); border:1px solid var(--border-color); border-top:3px solid ${col.color}; padding:12px; border-radius:8px; min-height:350px; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
                  <span style="font-size:0.82rem; font-weight:800; color:var(--text-primary);">${col.title}</span>
                  <span style="background:${col.color}15; color:${col.color}; border:1px solid ${col.color}40; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:10px;">
                    ${colKRs.length}
                  </span>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px; flex:1; overflow-y:auto;">
                  ${colKRs.length === 0 ? `
                    <div style="text-align:center; padding:20px 10px; color:var(--text-secondary); font-size:0.75rem; font-style:italic;">
                      Kosong
                    </div>
                  ` : colKRs.map(kr => `
                    <div onclick="window.showKRDetailModal('${kr.code}', '${kr.title.replace(/'/g, "\\'")}', '${kr.projectName}', '${kr.objName.replace(/'/g, "\\'")}', '${(kr.targetOutput||'').replace(/'/g, "\\'")}', '${(kr.actual||kr.output||'').replace(/'/g, "\\'")}', '${kr.deadline}', '${kr.normStatus.key}', '${kr.urgency || '-'}', '${kr.link || ''}')" 
                         style="background:var(--bg-card); border:1px solid ${kr.normStatus.border}; padding:10px 12px; border-radius:6px; cursor:pointer; transition:transform 0.15s ease, border-color 0.15s ease; box-shadow:var(--shadow-sm);"
                         onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                      
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:0.7rem; font-family:monospace; color:var(--accent-gold); font-weight:800;">${kr.code}</span>
                        <span style="font-size:0.7rem; background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800;">
                          ${kr.normStatus.label}
                        </span>
                      </div>

                      <h5 style="color:var(--text-primary); font-size:0.82rem; font-weight:700; margin:0 0 6px 0; line-height:1.3;">${kr.title}</h5>

                      <div style="font-size:0.72rem; color:var(--text-secondary); margin-bottom:6px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                        Target: ${kr.targetOutput}
                      </div>

                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.7rem; color:var(--text-secondary); border-top:1px solid #F1F5F9; padding-top:6px; margin-top:6px;">
                        <span style="color:#2563EB;">📅 ${kr.deadline}</span>
                        <span style="color:var(--accent-gold); display:flex; align-items:center; gap:3px;">
                          ${kr.link ? '<i data-lucide="file-text" style="width:12px; height:12px;"></i> Doc' : 'Expand 🔍'}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Timeline/Gantt Target Waktu Horizontal -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);">
        <h3 style="color:var(--text-primary); font-size:1.05rem; font-weight:800; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="calendar-days" style="color:var(--accent-gold);"></i> Timeline & Deadline Target Waktu KR (Plot Horizontal 2026)
        </h3>

        <div style="overflow-x:auto;">
          <table class="custom-table" style="font-size:0.78rem;">
            <thead>
              <tr>
                <th style="text-align:left; width:120px;">KR Code</th>
                <th style="text-align:left; width:220px;">Deskripsi Key Result</th>
                <th style="text-align:center; width:100px;">Project</th>
                <th style="text-align:center;">Jan</th>
                <th style="text-align:center;">Feb</th>
                <th style="text-align:center;">Mar</th>
                <th style="text-align:center;">Mei</th>
                <th style="text-align:center;">Jun</th>
                <th style="text-align:center;">Jul</th>
                <th style="text-align:center;">Agu</th>
                <th style="text-align:center;">Okt</th>
                <th style="text-align:center;">Nov</th>
                <th style="text-align:center; width:120px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredKRs.map(kr => {
                const deadlineLower = kr.deadline.toLowerCase();
                const isJan = deadlineLower.includes('jan');
                const isFeb = deadlineLower.includes('feb');
                const isMar = deadlineLower.includes('mar');
                const isMei = deadlineLower.includes('mei');
                const isJun = deadlineLower.includes('jun');
                const isJul = deadlineLower.includes('jul');
                const isAgu = deadlineLower.includes('agu');
                const isOkt = deadlineLower.includes('okt');
                const isNov = deadlineLower.includes('nov');

                return `
                  <tr>
                    <td style="font-family:monospace; color:var(--accent-gold); font-weight:800;">${kr.code}</td>
                    <td style="color:var(--text-primary); font-weight:600;">${kr.title}</td>
                    <td style="text-align:center; font-size:0.72rem; color:var(--text-secondary);">${kr.projectName}</td>
                    
                    <!-- Month Gantt Plots -->
                    <td style="text-align:center;">${isJan ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isFeb ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isMar ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isMei ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isJun ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isJul ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isAgu ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isOkt ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>
                    <td style="text-align:center;">${isNov ? `<span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800; font-size:0.7rem;">● ${kr.deadline.split(' ')[0]}</span>` : '-'}</td>

                    <td style="text-align:center;">
                      <span style="background:${kr.normStatus.bg}; color:${kr.normStatus.color}; border:1px solid ${kr.normStatus.border}; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:800;">
                        ${kr.normStatus.label}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// Handlers for OKR Project & Status Filters
window.handleOKRProjectFilterChange = function(projectId) {
  state.okrProjectFilter = projectId;
  renderCurrentView();
};

window.handleOKRStatusFilterChange = function(statusKey) {
  state.okrStatusFilter = statusKey;
  renderCurrentView();
};

// Expandable Modal for KR Detail View (includes Weekly Evidence Log for TKB)
window.showKRDetailModal = function(code, title, project, objective, targetOutput, actualProgress, deadline, statusKey, urgency, link) {
  const norm = normalizeOKRStatus(statusKey);
  
  // Find KR object to retrieve weekly logs if TKB
  let foundKR = null;
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = okrRealData.monthsData ? (okrRealData.monthsData[currentMonthKey] || okrRealData.monthsData['7']) : okrRealData;
  (monthData.projects || []).forEach(p => {
    p.objectives.forEach(obj => {
      const match = obj.krs.find(k => k.code === code);
      if (match) foundKR = match;
    });
  });

  const weeklyLogs = foundKR && foundKR.weeklyLogs ? foundKR.weeklyLogs : [];

  openModal(
    `Detail Key Result: [${code}] ${title}`,
    `
      <div style="display:flex; flex-direction:column; gap:14px; font-size:0.9rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:6px;">
          <div>
            <span style="font-size:0.75rem; color:var(--accent-gold); font-weight:800;">${project}</span>
            <div style="color:#FFF; font-weight:700;">${objective}</div>
          </div>
          <span style="background:${norm.bg}; color:${norm.color}; border:1px solid ${norm.border}; padding:4px 10px; border-radius:6px; font-weight:800;">
            ${norm.icon} ${norm.label}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <strong style="color:var(--text-secondary); display:block; font-size:0.75rem;">TARGET OUTPUT:</strong>
            <span style="color:#FFF; font-weight:700;">${targetOutput}</span>
          </div>
          <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
            <strong style="color:var(--text-secondary); display:block; font-size:0.75rem;">DEADLINE WAKTU:</strong>
            <span style="color:#60A5FA; font-weight:700;">📅 ${deadline}</span>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:6px; border:1px solid rgba(255,255,255,0.05);">
          <strong style="color:var(--text-secondary); display:block; font-size:0.75rem; margin-bottom:4px;">PROGRESS REALITA & KETERANGAN ACTUAL:</strong>
          <p style="color:#FFF; font-weight:600; margin:0; line-height:1.4;">${actualProgress || 'Dalam proses pengerjaan sesuai alur milestone.'}</p>
        </div>

        <!-- Weekly Evidence Log Timeline (Accordion / Mini Log for TKB) -->
        ${weeklyLogs.length > 0 ? `
          <div style="background:rgba(0,0,0,0.3); border:1px solid var(--accent-gold); padding:12px; border-radius:6px;">
            <strong style="color:var(--accent-gold); display:block; font-size:0.8rem; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">
              📋 Weekly Evidence Log (W1 - W4 Updates & Feedback)
            </strong>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${weeklyLogs.map(log => `
                <div style="background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:4px; display:flex; justify-content:space-between; align-items:center; font-size:0.78rem;">
                  <div>
                    <span style="color:var(--accent-gold); font-weight:800; margin-right:6px;">${log.week} (${log.date}):</span>
                    <span style="color:#FFF;">${log.note}</span>
                  </div>
                  <span style="background:rgba(245, 158, 11, 0.2); color:#F59E0B; border:1px solid #F59E0B; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:700;">
                    ${log.feedback}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:12px; margin-top:4px;">
          <div>
            ${urgency !== '-' ? `<span style="background:rgba(239, 68, 68, 0.2); color:#EF4444; padding:4px 8px; border-radius:4px; font-weight:800; font-size:0.75rem;">Urgensi: ${urgency}</span>` : ''}
          </div>
          <div>
            ${link ? `
              <a href="#" onclick="alert('Membuka Dokumen Output: ${link}'); return false;" 
                 style="display:inline-flex; align-items:center; gap:6px; background:var(--accent-gold); color:#000; font-weight:800; padding:6px 12px; border-radius:6px; text-decoration:none; font-size:0.8rem;">
                📄 Klik Buka Output (${link})
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `
  );
};

// --------------------------------------------------------------------------
// VIEW 4b: OKR TKB — The Keranjang Bali (TERPISAH dari OKR BT)
// --------------------------------------------------------------------------
function renderTKBOKRView() {
  const selectedStat = state.okrStatusFilter || 'all';

  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = tkbOKRData.monthsData ? (tkbOKRData.monthsData[currentMonthKey] || tkbOKRData.monthsData['7']) : tkbOKRData;
  const proj = (monthData.projects && monthData.projects[0]) || tkbOKRData.projects[0];
  const monthTitle = monthData.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');

  let allKRs = [];
  proj.objectives.forEach(obj => {
    obj.krs.forEach(kr => {
      allKRs.push({
        ...kr,
        projectName: proj.name,
        objId: obj.id,
        objName: obj.name,
        targetOutput: kr.output || obj.targetOutput,
        penaltyClause: obj.penaltyClause || '',
        normStatus: normalizeOKRStatus(kr.status)
      });
    });
  });

  const filteredKRs = allKRs.filter(kr =>
    selectedStat === 'all' || kr.normStatus.key === selectedStat
  );

  const totalKRs = allKRs.length;
  const doneKRs = allKRs.filter(k => k.normStatus.key === 'Done').length;
  const overdueKRs = allKRs.filter(k => k.normStatus.key === 'Overdue').length;
  const donePercent = totalKRs ? Math.round((doneKRs / totalKRs) * 100) : 0;
  const overdueTKBKRs = allKRs.filter(k => k.normStatus.key === 'Overdue');
  const totalDenda = overdueTKBKRs.length * 200000;

  const kanbanColumns = [
    { key: 'Overdue', title: '🔴 Overdue (Critical Priority)', color: '#EF4444' },
    { key: 'Hold', title: '🟠 Hold', color: '#F59E0B' },
    { key: 'On Progress', title: '🟡 On Progress / Revisi', color: '#EAB308' },
    { key: 'Belum Mulai', title: '⚪ Belum Mulai', color: '#9CA3AF' },
    { key: 'Done', title: '🟢 Done', color: '#10B981' }
  ];

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">

      <!-- Header -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:16px 20px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; box-shadow:var(--shadow-sm);">
        <div>
          <h2 style="color:var(--text-primary); font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:10px; margin:0;">
            ${getUnitLogoHtml('okr-tkb', 32)}
            <span>OKR Dashboard — The Keranjang Bali (TKB) (${monthTitle})</span>
          </h2>
          <p style="color:var(--text-secondary); font-size:0.8rem; margin:4px 0 0 0;">
            Monitoring Status OKR TKB — ${monthTitle} | CCP Klausul: Late > Denda Rp200.000 / KR
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <!-- Filter Bulan -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Bulan:</span>
            <select id="okrTkbMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" 
                    style="background:var(--bg-card); border:1.5px solid var(--accent-gold); color:var(--text-primary); padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
              <option value="7" ${state.selectedSalesMonth === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
              <option value="6" ${state.selectedSalesMonth === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Status:</span>
            <select onchange="window.handleOKRStatusFilterChange(this.value)"
                    style="background:var(--bg-card); border:1.5px solid var(--accent-gold); color:var(--text-primary); padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
              <option value="all" ${selectedStat==='all'?'selected':''}>Semua Status</option>
              <option value="Overdue" ${selectedStat==='Overdue'?'selected':''}>🔴 Overdue</option>
              <option value="Hold" ${selectedStat==='Hold'?'selected':''}>🟠 Hold</option>
              <option value="On Progress" ${selectedStat==='On Progress'?'selected':''}>🟡 On Progress / Revisi</option>
              <option value="Belum Mulai" ${selectedStat==='Belum Mulai'?'selected':''}>⚪ Belum Mulai</option>
              <option value="Done" ${selectedStat==='Done'?'selected':''}>🟢 Done</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-card-header"><span class="metric-title">Total KR TKB</span><div class="metric-icon-box okr-theme"><i data-lucide="layers"></i></div></div>
          <div class="metric-value">${totalKRs} KR</div>
          <div class="metric-trend trend-neutral">${proj.objectives.length} Objectives / Goals</div>
        </div>
        <div class="metric-card">
          <div class="metric-card-header"><span class="metric-title">Done Rate TKB</span><div class="metric-icon-box okr-theme"><i data-lucide="check-circle-2"></i></div></div>
          <div class="metric-value" style="color:#059669;">${donePercent}%</div>
          <div class="metric-trend trend-up">${doneKRs} dari ${totalKRs} KR Selesai</div>
        </div>
        <div class="metric-card" style="border-color:rgba(225,29,72,0.3);">
          <div class="metric-card-header"><span class="metric-title">KR Overdue (Potensi Denda)</span><div class="metric-icon-box complain-theme"><i data-lucide="alert-triangle"></i></div></div>
          <div class="metric-value" style="color:#E11D48;">${overdueKRs} KR</div>
          <div class="metric-trend trend-down">Potensi Total Denda: Rp ${totalDenda.toLocaleString('id-ID')}</div>
        </div>
        <div class="metric-card" style="border-color:rgba(225,29,72,0.4); background:rgba(225,29,72,0.04);">
          <div class="metric-card-header"><span class="metric-title">CCP Klausul Denda</span><div class="metric-icon-box complain-theme"><i data-lucide="alert-octagon"></i></div></div>
          <div class="metric-value" style="color:#E11D48; font-size:1rem;">Rp 200.000 / KR</div>
          <div class="metric-trend trend-down">Berlaku semua KR Overdue</div>
        </div>
      </div>

      <!-- Panel Potensi Sanksi Denda CCP — HANYA KR Overdue -->
      ${overdueTKBKRs.length > 0 ? `
        <div style="background:linear-gradient(135deg,rgba(225,29,72,0.12),rgba(17,24,39,0.8)); border:1.5px solid #E11D48; padding:20px 24px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);">
          <!-- Panel Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px; border-bottom:1px solid rgba(225,29,72,0.3); padding-bottom:14px;">
            <div>
              <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:2px; color:#F43F5E; font-weight:800; display:flex; align-items:center; gap:8px;">
                <i data-lucide="shield-alert" style="width:16px;height:16px;"></i>
                Panel Potensi Sanksi Keterlambatan (Denda CCP TKB)
              </div>
              <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:4px;">
                Klausul: <strong style="color:var(--text-primary);">Late > Denda Rp200.000 per KR</strong> — Hanya KR Overdue yang ditampilkan
              </div>
            </div>
            <div style="background:rgba(225,29,72,0.2); border:1.5px solid #E11D48; color:#FDA4AF; padding:8px 18px; border-radius:8px; font-weight:800; font-family:monospace; font-size:1rem; white-space:nowrap;">
              Total Potensi Denda: Rp ${totalDenda.toLocaleString('id-ID')}
            </div>
          </div>
          <!-- Denda Cards — 3 kolom -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
            ${overdueTKBKRs.map(kr => `
              <div style="background:var(--bg-card); border:1px solid rgba(225,29,72,0.35); border-radius:10px; overflow:hidden; box-shadow:var(--shadow-sm);">
                <!-- Card Top Bar -->
                <div style="background:rgba(225,29,72,0.15); border-bottom:1px solid rgba(225,29,72,0.3); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.72rem; font-family:monospace; color:var(--accent-gold); font-weight:800; background:rgba(217,119,6,0.15); padding:3px 8px; border-radius:4px;">${kr.code}</span>
                  <span style="background:rgba(225,29,72,0.25); color:#FDA4AF; border:1px solid rgba(225,29,72,0.5); padding:3px 10px; border-radius:5px; font-size:0.7rem; font-weight:800;">Denda Rp200.000</span>
                </div>
                <!-- Card Body -->
                <div style="padding:12px 14px;">
                  <div style="color:var(--text-primary); font-size:0.87rem; font-weight:700; line-height:1.35; margin-bottom:6px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${kr.title}</div>
                  <div style="font-size:0.7rem; color:var(--text-secondary); margin-bottom:8px;">📅 Due: <span style="color:#F43F5E; font-weight:600;">${kr.deadline}</span></div>
                  <div style="font-size:0.68rem; color:var(--text-secondary); background:rgba(255,255,255,0.04); border-radius:4px; padding:4px 8px; margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${kr.objName}</div>
                  ${kr.actual ? `<div style="font-size:0.72rem; color:#FDA4AF; line-height:1.4; background:rgba(225,29,72,0.1); border-left:2px solid #E11D48; padding:6px 10px; border-radius:0 4px 4px 0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;"><span style="color:var(--text-secondary); font-weight:600;">Aktual: </span>${kr.actual}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `<div style="background:rgba(5,150,105,0.12); border:1px solid #10B981; padding:14px 20px; border-radius:var(--radius-md); color:#34D399; font-weight:700;">✅ Tidak ada KR Overdue saat ini — Tidak ada potensi denda CCP</div>`}


      <!-- Progress Bars per Objective -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:20px; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);">
        <h3 style="color:var(--text-primary); font-size:1rem; font-weight:800; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="bar-chart-3" style="color:var(--accent-gold);"></i> Progress Completion per Goal / Objective (TKB)
        </h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:14px;">
          ${proj.objectives.map(obj => {
            const objDone = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
            const objTotal = obj.krs.length;
            const objPct = objTotal ? Math.round((objDone / objTotal) * 100) : 0;
            const hasOverdue = obj.krs.some(k => normalizeOKRStatus(k.status).key === 'Overdue');
            return `
              <div style="background:rgba(255,255,255,0.03); border:1px solid ${hasOverdue ? 'rgba(225,29,72,0.3)' : 'var(--border-color)'}; padding:14px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <div>
                    ${obj.penaltyClause ? `<span style="font-size:0.65rem; color:#F43F5E; font-weight:700; display:block; margin-bottom:2px;">⚠️ ${obj.penaltyClause}</span>` : ''}
                    <h4 style="color:var(--text-primary); font-size:0.84rem; font-weight:700; margin:0;">${obj.name}</h4>
                  </div>
                  <span style="font-size:0.88rem; font-weight:800; color:${objPct===100?'#10B981':objPct>50?'var(--accent-gold)':'#38BDF8'}; font-family:monospace;">${objPct}%</span>
                </div>
                <div style="background:rgba(255,255,255,0.08); height:8px; border-radius:4px; overflow:hidden; margin-bottom:8px;">
                  <div style="background:${objPct===100?'#10B981':'linear-gradient(90deg,#F59E0B,#10B981)'}; height:100%; width:${objPct}%;"></div>
                </div>
                <div style="font-size:0.72rem; color:var(--text-secondary);">Done: ${objDone}/${objTotal} KR</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Kanban Board TKB -->
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:20px; border-radius:var(--radius-md);">
        <h3 style="color:#FFF; font-size:1.05rem; font-weight:800; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="kanban" style="color:var(--accent-gold);"></i> Kanban Board TKB — Klik kartu untuk lihat Weekly Log & Evidence
          <span style="font-size:0.78rem; color:var(--accent-gold); font-weight:700; margin-left:auto;">${filteredKRs.length}/${totalKRs} KR</span>
        </h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:14px;">
          ${kanbanColumns.map(col => {
            const colKRs = filteredKRs.filter(k => k.normStatus.key === col.key);
            return `
              <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); border-top:3px solid ${col.color}; padding:12px; border-radius:8px; min-height:300px; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05);">
                  <span style="font-size:0.8rem; font-weight:800; color:#FFF;">${col.title}</span>
                  <span style="background:${col.color}22; color:${col.color}; border:1px solid ${col.color}55; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:10px;">${colKRs.length}</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; flex:1;">
                  ${colKRs.length === 0 ? `<div style="text-align:center; padding:20px; color:var(--text-secondary); font-size:0.75rem; font-style:italic;">Kosong</div>` :
                    colKRs.map(kr => `
                      <div onclick="window.showTKBKRDetail('${kr.code}')"
                           style="background:rgba(255,255,255,0.03); border:1px solid ${kr.normStatus.border}; padding:10px; border-radius:6px; cursor:pointer; transition:transform 0.15s;"
                           onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                          <span style="font-size:0.68rem; font-family:monospace; color:var(--accent-gold); font-weight:800;">${kr.code}</span>
                          <span style="font-size:0.68rem; background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:1px 6px; border-radius:4px; font-weight:800;">${kr.normStatus.label}</span>
                        </div>
                        <h5 style="color:#FFF; font-size:0.8rem; font-weight:700; margin:0 0 4px 0; line-height:1.3;">${kr.title}</h5>
                        ${kr.actual ? `<div style="font-size:0.7rem; color:var(--text-secondary); overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${kr.actual}</div>` : ''}
                        <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:var(--text-secondary); border-top:1px solid rgba(255,255,255,0.05); padding-top:5px; margin-top:6px;">
                          <span style="color:#60A5FA;">📅 ${kr.deadline}</span>
                          ${kr.weeklyLogs ? `<span style="color:var(--accent-gold);">📋 ${kr.weeklyLogs.length} Weekly Log</span>` : `<span>🔍 Detail</span>`}
                        </div>
                      </div>
                    `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}

// Modal detail untuk OKR TKB (dengan Weekly Evidence Log)
window.showTKBKRDetail = function(code) {
  let foundKR = null;
  let foundObj = null;
  tkbOKRData.projects[0].objectives.forEach(obj => {
    const match = obj.krs.find(k => k.code === code);
    if (match) { foundKR = match; foundObj = obj; }
  });
  if (!foundKR) return;

  const norm = normalizeOKRStatus(foundKR.status);
  const weeklyLogs = foundKR.weeklyLogs || [];
  const hasOverdue = norm.key === 'Overdue';

  openModal(
    `[TKB] Detail KR: ${foundKR.code} — ${foundKR.title}`,
    `<div style="display:flex;flex-direction:column;gap:14px;font-size:0.9rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px 14px;border-radius:6px;">
        <div>
          <span style="font-size:0.72rem;color:var(--accent-gold);font-weight:800;">The Keranjang Bali (TKB)</span>
          <div style="color:#FFF;font-weight:700;font-size:0.85rem;">${foundObj.name}</div>
          ${foundObj.penaltyClause ? `<div style="font-size:0.72rem;color:#EF4444;margin-top:2px;">⚠️ ${foundObj.penaltyClause}</div>` : ''}
        </div>
        <span style="background:${norm.bg};color:${norm.color};border:1px solid ${norm.border};padding:4px 10px;border-radius:6px;font-weight:800;">${norm.icon} ${norm.label}</span>
      </div>

      ${hasOverdue ? `<div style="background:rgba(239,68,68,0.15);border:1px solid #EF4444;padding:10px 14px;border-radius:6px;display:flex;align-items:center;gap:10px;">
        <i data-lucide="alert-octagon" style="color:#EF4444;flex-shrink:0;"></i>
        <span style="color:#EF4444;font-weight:700;font-size:0.85rem;">⚠️ KR ini OVERDUE — Potensi terkena Denda CCP Rp200.000 sesuai klausul kontrak</span>
      </div>` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">TARGET OUTPUT:</strong>
          <span style="color:#FFF;font-weight:700;">${foundKR.output || '-'}</span>
        </div>
        <div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">DEADLINE:</strong>
          <span style="color:#60A5FA;font-weight:700;">📅 ${foundKR.deadline}</span>
        </div>
      </div>

      ${foundKR.actual ? `<div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
        <strong style="color:var(--text-secondary);display:block;font-size:0.72rem;margin-bottom:4px;">PROGRESS AKTUAL / KETERANGAN:</strong>
        <p style="color:#FFF;font-weight:600;margin:0;line-height:1.5;">${foundKR.actual}</p>
      </div>` : ''}

      ${weeklyLogs.length > 0 ? `
        <div style="background:rgba(0,0,0,0.3);border:1px solid var(--accent-gold);padding:12px;border-radius:6px;">
          <strong style="color:var(--accent-gold);display:block;font-size:0.8rem;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">📋 Weekly Evidence Log (W1–W4 Updates & Feedback)</strong>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${weeklyLogs.map(log => `
              <div style="background:rgba(255,255,255,0.03);padding:8px 10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:0.78rem;">
                <div>
                  <span style="color:var(--accent-gold);font-weight:800;margin-right:6px;">${log.week} (${log.date}):</span>
                  <span style="color:#FFF;">${log.note}</span>
                </div>
                <span style="background:rgba(245,158,11,0.2);color:#F59E0B;border:1px solid #F59E0B;padding:2px 8px;border-radius:4px;font-size:0.7rem;font-weight:700;white-space:nowrap;">${log.feedback}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${foundKR.link ? `<div style="text-align:right;">
        <a href="#" onclick="alert('Membuka: ${foundKR.link}'); return false;"
           style="display:inline-flex;align-items:center;gap:6px;background:var(--accent-gold);color:#000;font-weight:800;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:0.8rem;">
          📄 ${foundKR.link}
        </a>
      </div>` : ''}
    </div>`
  );
};

// --------------------------------------------------------------------------
// VIEW 4c: OKR PRODEV
// --------------------------------------------------------------------------
function renderProdevOKRView() {
  const selectedStat = state.okrStatusFilter || 'all';

  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = prodevOKRData.monthsData ? (prodevOKRData.monthsData[currentMonthKey] || prodevOKRData.monthsData['7']) : prodevOKRData;
  const proj = monthData;
  const monthTitle = monthData.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');

  let allKRs = [];
  proj.objectives.forEach(obj => {
    obj.krs.forEach(kr => {
      allKRs.push({ ...kr, objId: obj.id, objName: obj.name, normStatus: normalizeOKRStatus(kr.status) });
    });
  });
  const filteredKRs = selectedStat === 'all' ? allKRs : allKRs.filter(k => k.normStatus.key === selectedStat);
  const totalKRs = allKRs.length;
  const doneKRs = allKRs.filter(k => k.normStatus.key === 'Done').length;
  const progressKRs = allKRs.filter(k => k.normStatus.key === 'On Progress').length;
  const belumKRs = allKRs.filter(k => k.normStatus.key === 'Belum Mulai').length;
  const donePercent = totalKRs ? Math.round((doneKRs / totalKRs) * 100) : 0;
  const kanbanColumns = [
    { key: 'Done', title: '🟢 Done', color: '#10B981' },
    { key: 'On Progress', title: '🟡 On Progress', color: '#EAB308' },
    { key: 'Belum Mulai', title: '⚪ Belum Mulai', color: '#9CA3AF' },
    { key: 'Hold', title: '🟠 Hold', color: '#F59E0B' },
    { key: 'Overdue', title: '🔴 Overdue', color: '#EF4444' }
  ];
  return `
    <div style="display:flex;flex-direction:column;gap:20px;">
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:16px 20px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
        <div>
          <h2 style="color:#FFF;font-size:1.25rem;font-weight:800;display:flex;align-items:center;gap:8px;margin:0;">
            <i data-lucide="layers" style="color:var(--accent-gold);"></i> OKR Dashboard — Produk Development (PRODEV) (${monthTitle}) 🎨
          </h2>
          <p style="color:var(--text-secondary);font-size:0.8rem;margin:4px 0 0 0;">Monitoring OKR PRODEV — ${monthTitle} | ${proj.objectives.length} Objectives Strategis</p>
        </div>
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <!-- Filter Bulan -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Bulan:</span>
            <select id="prodevMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" 
                    style="background:#111827; border:1.5px solid var(--accent-gold); color:#FFF; padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
              <option value="7" ${state.selectedSalesMonth === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
              <option value="6" ${state.selectedSalesMonth === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Status:</span>
            <select onchange="window.handleOKRStatusFilterChange(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:6px 12px;border-radius:6px;font-size:0.82rem;font-weight:700;cursor:pointer;">
              <option value="all" ${selectedStat==='all'?'selected':''}>Semua Status</option>
              <option value="Done" ${selectedStat==='Done'?'selected':''}>🟢 Done</option>
              <option value="On Progress" ${selectedStat==='On Progress'?'selected':''}>🟡 On Progress</option>
              <option value="Belum Mulai" ${selectedStat==='Belum Mulai'?'selected':''}>⚪ Belum Mulai</option>
            </select>
          </div>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card"><div class="metric-card-header"><span class="metric-title">Total KR PRODEV</span><div class="metric-icon-box okr-theme"><i data-lucide="layers"></i></div></div><div class="metric-value">${totalKRs} KR</div><div class="metric-trend trend-neutral">${proj.objectives.length} Objectives</div></div>
        <div class="metric-card" style="border-color:rgba(16,185,129,0.4);"><div class="metric-card-header"><span class="metric-title">Done</span><div class="metric-icon-box okr-theme"><i data-lucide="check-circle-2"></i></div></div><div class="metric-value" style="color:#10B981;">${doneKRs} KR (${donePercent}%)</div><div class="metric-trend trend-up">Selesai sesuai target</div></div>
        <div class="metric-card" style="border-color:rgba(234,179,8,0.4);"><div class="metric-card-header"><span class="metric-title">On Progress</span><div class="metric-icon-box milestone-theme"><i data-lucide="loader"></i></div></div><div class="metric-value" style="color:#EAB308;">${progressKRs} KR</div><div class="metric-trend trend-neutral">Sedang dikerjakan</div></div>
        <div class="metric-card" style="border-color:rgba(156,163,175,0.4);"><div class="metric-card-header"><span class="metric-title">Belum Mulai</span><div class="metric-icon-box complain-theme"><i data-lucide="clock"></i></div></div><div class="metric-value" style="color:#9CA3AF;">${belumKRs} KR</div><div class="metric-trend trend-neutral">Perlu percepatan</div></div>
      </div>

      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:20px;border-radius:var(--radius-md);">
        <h3 style="color:#FFF;font-size:1rem;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i data-lucide="bar-chart-3" style="color:var(--accent-gold);"></i> Progress per Objective</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">
          ${proj.objectives.map(obj => {
            const done = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
            const total = obj.krs.length;
            const pct = total ? Math.round((done/total)*100) : 0;
            return `<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);padding:14px;border-radius:8px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                <div>
                  <div style="font-size:0.67rem;color:var(--accent-gold);font-weight:800;margin-bottom:2px;">Due: ${obj.deadline}</div>
                  <h4 style="color:#FFF;font-size:0.83rem;font-weight:700;margin:0;line-height:1.3;">${obj.name}</h4>
                </div>
                <span style="font-size:0.88rem;font-weight:800;color:${pct===100?'#10B981':pct>50?'#EAB308':'#9CA3AF'};font-family:monospace;flex-shrink:0;margin-left:8px;">${pct}%</span>
              </div>
              <div style="background:rgba(255,255,255,0.08);height:8px;border-radius:4px;overflow:hidden;margin-bottom:6px;">
                <div style="background:${pct===100?'#10B981':'linear-gradient(90deg,#EAB308,#10B981)'};height:100%;width:${pct}%;"></div>
              </div>
              <div style="font-size:0.72rem;color:var(--text-secondary);">Done ${done}/${total} KR</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:20px;border-radius:var(--radius-md);">
        <h3 style="color:#FFF;font-size:1.05rem;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
          <i data-lucide="kanban" style="color:var(--accent-gold);"></i> Kanban Board PRODEV
          <span style="font-size:0.78rem;color:var(--accent-gold);font-weight:700;margin-left:auto;">${filteredKRs.length}/${totalKRs} KR</span>
        </h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
          ${kanbanColumns.map(col => {
            const colKRs = filteredKRs.filter(k => k.normStatus.key === col.key);
            return `<div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);border-top:3px solid ${col.color};padding:12px;border-radius:8px;min-height:280px;display:flex;flex-direction:column;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="font-size:0.8rem;font-weight:800;color:#FFF;">${col.title}</span>
                <span style="background:${col.color}22;color:${col.color};border:1px solid ${col.color}55;font-size:0.75rem;font-weight:800;padding:2px 8px;border-radius:10px;">${colKRs.length}</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;flex:1;">
                ${colKRs.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:0.75rem;font-style:italic;">Kosong</div>'
                  : colKRs.map(kr => `<div onclick="window.showProdevKRDetail('${kr.code}')"
                     style="background:rgba(255,255,255,0.03);border:1px solid ${kr.normStatus.border};padding:10px;border-radius:6px;cursor:pointer;transition:transform 0.15s;"
                     onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                      <span style="font-size:0.67rem;font-family:monospace;color:var(--accent-gold);font-weight:800;">${kr.code}</span>
                      <span style="font-size:0.67rem;background:${kr.normStatus.bg};color:${kr.normStatus.color};padding:1px 5px;border-radius:3px;font-weight:800;">${kr.normStatus.label}</span>
                    </div>
                    <h5 style="color:#FFF;font-size:0.79rem;font-weight:700;margin:0 0 3px;line-height:1.3;">${kr.title}</h5>
                    <div style="font-size:0.7rem;color:var(--text-secondary);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:5px;">${kr.actual||''}</div>
                    <div style="display:flex;justify-content:space-between;font-size:0.67rem;color:var(--text-secondary);border-top:1px solid rgba(255,255,255,0.05);padding-top:4px;">
                      <span style="color:#60A5FA;">📅 ${kr.deadline}</span>
                      <span style="color:var(--accent-gold);">📦 ${kr.output}</span>
                    </div>
                  </div>`).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:20px;border-radius:var(--radius-md);">
        <h3 style="color:#FFF;font-size:1rem;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i data-lucide="list" style="color:var(--accent-gold);"></i> Rincian Semua KR per Objective</h3>
        ${proj.objectives.map(obj => `
          <div style="margin-bottom:16px;border:1px solid rgba(255,255,255,0.07);border-radius:8px;overflow:hidden;">
            <div style="background:rgba(255,255,255,0.04);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.07);">
              <div>
                <span style="font-size:0.7rem;color:var(--accent-gold);font-weight:800;">${obj.id} | Due: ${obj.deadline}</span>
                <div style="color:#FFF;font-size:0.88rem;font-weight:700;">${obj.name}</div>
              </div>
              <div style="font-size:0.78rem;color:var(--text-secondary);">✅ ${obj.krs.filter(k=>normalizeOKRStatus(k.status).key==='Done').length}/${obj.krs.length} Done</div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:0.78rem;">
              <thead><tr style="background:rgba(255,255,255,0.03);">
                <th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:left;width:80px;">Kode</th>
                <th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:left;">Key Result</th>
                <th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:center;">Target</th>
                <th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:center;">Deadline</th>
                <th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:center;">Status</th>
              </tr></thead>
              <tbody>
                ${obj.krs.map((kr,i) => {
                  const norm = normalizeOKRStatus(kr.status);
                  return '<tr style="border-top:1px solid rgba(255,255,255,0.04);cursor:pointer;" onclick="window.showProdevKRDetail(\'' + kr.code + '\')" onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'' + (i%2===0?'rgba(255,255,255,0.01)':'transparent') + '\'">'
                    + '<td style="padding:8px 10px;font-family:monospace;color:var(--accent-gold);font-weight:800;">' + kr.code + '</td>'
                    + '<td style="padding:8px 10px;color:#FFF;font-weight:600;">' + kr.title + '</td>'
                    + '<td style="padding:8px 10px;color:var(--text-secondary);text-align:center;">' + kr.output + '</td>'
                    + '<td style="padding:8px 10px;color:#60A5FA;text-align:center;font-size:0.72rem;">' + kr.deadline + '</td>'
                    + '<td style="padding:8px 10px;text-align:center;"><span style="background:' + norm.bg + ';color:' + norm.color + ';border:1px solid ' + norm.border + ';padding:2px 8px;border-radius:4px;font-weight:800;font-size:0.72rem;">' + norm.icon + ' ' + norm.label + '</span></td>'
                    + '</tr>';
                }).join('')}
              </tbody>
            </table>
          </div>`).join('')}
      </div>
    </div>
  `;
}

window.showProdevKRDetail = function(code) {
  let foundKR = null, foundObj = null;
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = prodevOKRData.monthsData ? (prodevOKRData.monthsData[currentMonthKey] || prodevOKRData.monthsData['7']) : prodevOKRData;
  (monthData.objectives || []).forEach(obj => {
    const m = obj.krs.find(k => k.code === code);
    if (m) { foundKR = m; foundObj = obj; }
  });
  if (!foundKR) return;
  const norm = normalizeOKRStatus(foundKR.status);
  openModal('[PRODEV] ' + foundKR.code + ' — ' + foundKR.title,
    '<div style="display:flex;flex-direction:column;gap:14px;font-size:0.9rem;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px 14px;border-radius:6px;">'
    + '<div><span style="font-size:0.72rem;color:var(--accent-gold);font-weight:800;">Produk Development (PRODEV)</span>'
    + '<div style="color:#FFF;font-weight:700;font-size:0.85rem;">' + foundObj.name + '</div>'
    + '<div style="font-size:0.72rem;color:var(--text-secondary);">Due Objective: ' + foundObj.deadline + '</div></div>'
    + '<span style="background:' + norm.bg + ';color:' + norm.color + ';border:1px solid ' + norm.border + ';padding:4px 10px;border-radius:6px;font-weight:800;">' + norm.icon + ' ' + norm.label + '</span>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">TARGET OUTPUT:</strong><span style="color:#FFF;font-weight:700;">' + foundKR.output + '</span></div>'
    + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">DEADLINE:</strong><span style="color:#60A5FA;font-weight:700;">📅 ' + foundKR.deadline + '</span></div>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;margin-bottom:4px;">PROGRESS AKTUAL:</strong><p style="color:#FFF;font-weight:600;margin:0;line-height:1.5;">' + (foundKR.actual || 'Belum ada update.') + '</p></div>'
    + '<div style="text-align:right;"><a href="#" onclick="alert(\'Membuka: ' + foundKR.link + '\'); return false;" style="display:inline-flex;align-items:center;gap:6px;background:var(--accent-gold);color:#000;font-weight:800;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:0.8rem;">' + foundKR.link + '</a></div>'
    + '</div>'
  );
};

// --------------------------------------------------------------------------
// VIEW 4d: OKR PRODUKSI — Batik Factory + Handprint Factory + Garment
// --------------------------------------------------------------------------
function renderProduksiOKRView() {
  const selectedStat = state.okrStatusFilter || 'all';
  const activeSection = state.produksiSection || 'batik-factory';

  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = produksiOKRData.monthsData ? (produksiOKRData.monthsData[currentMonthKey] || produksiOKRData.monthsData['7']) : produksiOKRData;
  const monthTitle = monthData.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');

  const sections = monthData.sections || [];
  const section = sections.find(s => s.id === activeSection) || sections[0] || { name: 'Produksi', objectives: [] };

  let allKRs = [];
  (section.objectives || []).forEach(obj => {
    (obj.krs || []).forEach(kr => {
      allKRs.push({ ...kr, objId: obj.id, objName: obj.name, category: obj.category, normStatus: normalizeOKRStatus(kr.status) });
    });
  });

  const filteredKRs = selectedStat === 'all' ? allKRs : allKRs.filter(k => k.normStatus.key === selectedStat);
  const totalKRs = allKRs.length;
  const doneKRs = allKRs.filter(k => k.normStatus.key === 'Done').length;
  const progressKRs = allKRs.filter(k => k.normStatus.key === 'On Progress').length;
  const belumKRs = allKRs.filter(k => k.normStatus.key === 'Belum Mulai').length;
  const donePercent = totalKRs ? Math.round((doneKRs / totalKRs) * 100) : 0;

  const kanbanCols = [
    { key: 'Done', title: '🟢 Done', color: '#10B981' },
    { key: 'On Progress', title: '🟡 On Progress', color: '#EAB308' },
    { key: 'Belum Mulai', title: '⚪ Belum Mulai', color: '#9CA3AF' },
    { key: 'Hold', title: '🟠 Hold', color: '#F59E0B' },
    { key: 'Overdue', title: '🔴 Overdue', color: '#EF4444' }
  ];

  const tabsHTML = sections.map(s =>
    '<button onclick="window.switchProduksiSection(\'' + s.id + '\')" style="padding:8px 16px;border-radius:6px;border:1.5px solid '
    + (s.id === activeSection ? s.color : 'rgba(255,255,255,0.1)')
    + ';background:' + (s.id === activeSection ? s.color + '22' : 'transparent')
    + ';color:' + (s.id === activeSection ? s.color : '#9CA3AF')
    + ';font-weight:800;font-size:0.82rem;cursor:pointer;">' + s.name + '</button>'
  ).join('');

  const progressBarsHTML = (section.objectives || []).map(obj => {
    const done = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
    const total = obj.krs.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return '<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);padding:14px;border-radius:8px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">'
      + '<div><div style="font-size:0.65rem;color:var(--accent-gold);font-weight:800;margin-bottom:2px;">' + obj.category + ' | Due: ' + obj.deadline + '</div>'
      + '<h4 style="color:#FFF;font-size:0.82rem;font-weight:700;margin:0;line-height:1.3;">' + obj.name + '</h4></div>'
      + '<span style="font-size:0.88rem;font-weight:800;color:' + (pct === 100 ? '#10B981' : pct > 50 ? '#EAB308' : '#9CA3AF') + ';font-family:monospace;flex-shrink:0;margin-left:8px;">' + pct + '%</span>'
      + '</div>'
      + '<div style="background:rgba(255,255,255,0.08);height:8px;border-radius:4px;overflow:hidden;margin-bottom:6px;">'
      + '<div style="background:' + (pct === 100 ? '#10B981' : 'linear-gradient(90deg,' + section.color + ',#10B981)') + ';height:100%;width:' + pct + '%;"></div></div>'
      + '<div style="font-size:0.72rem;color:var(--text-secondary);">Done ' + done + '/' + total + ' KR</div></div>';
  }).join('');

  const kanbanHTML = kanbanCols.map(col => {
    const colKRs = filteredKRs.filter(k => k.normStatus.key === col.key);
    const cardsHTML = colKRs.length === 0
      ? '<div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:0.75rem;font-style:italic;">Kosong</div>'
      : colKRs.map(kr =>
          '<div onclick="window.showProduksiKRDetail(\'' + kr.code + '\',\'' + activeSection + '\')" '
          + 'style="background:rgba(255,255,255,0.03);border:1px solid ' + kr.normStatus.border + ';padding:10px;border-radius:6px;cursor:pointer;transition:transform 0.15s;" '
          + 'onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'translateY(0)\'">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">'
          + '<span style="font-size:0.67rem;font-family:monospace;color:var(--accent-gold);font-weight:800;">' + kr.code + '</span>'
          + '<span style="font-size:0.67rem;background:' + kr.normStatus.bg + ';color:' + kr.normStatus.color + ';padding:1px 5px;border-radius:3px;font-weight:800;">' + (kr.status || kr.normStatus.label) + '</span></div>'
          + '<h5 style="color:#FFF;font-size:0.79rem;font-weight:700;margin:0 0 3px;line-height:1.3;">' + (kr.stage ? '<span style="color:var(--accent-gold);font-size:0.7rem;">[' + kr.stage + '] </span>' : '') + kr.title + '</h5>'
          + (kr.actual && kr.actual !== '-' ? '<div style="font-size:0.7rem;color:var(--text-secondary);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:5px;">' + kr.actual + '</div>' : '')
          + '<div style="display:flex;justify-content:space-between;font-size:0.67rem;color:var(--text-secondary);border-top:1px solid rgba(255,255,255,0.05);padding-top:4px;gap:6px;">'
          + '<span style="color:#60A5FA;">📅 ' + kr.deadline + '</span>'
          + '<span style="color:var(--accent-gold);text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;" title="' + kr.output + '">📦 ' + kr.output + '</span></div></div>'
        ).join('');
    return '<div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);border-top:3px solid ' + col.color + ';padding:12px;border-radius:8px;min-height:280px;display:flex;flex-direction:column;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.05);">'
      + '<span style="font-size:0.8rem;font-weight:800;color:#FFF;">' + col.title + '</span>'
      + '<span style="background:' + col.color + '22;color:' + col.color + ';border:1px solid ' + col.color + '55;font-size:0.75rem;font-weight:800;padding:2px 8px;border-radius:10px;">' + colKRs.length + '</span></div>'
      + '<div style="display:flex;flex-direction:column;gap:8px;flex:1;">' + cardsHTML + '</div></div>';
  }).join('');

  const tableHTML = (section.objectives || []).map(obj => {
    const done = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
    const rows = obj.krs.map((kr, i) => {
      const norm = normalizeOKRStatus(kr.status);
      return '<tr style="border-top:1px solid rgba(255,255,255,0.04);cursor:pointer;" onclick="window.showProduksiKRDetail(\'' + kr.code + '\',\'' + activeSection + '\')" onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'' + (i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent') + '\'">'
        + '<td style="padding:10px 12px;font-family:monospace;color:var(--accent-gold);font-weight:800;white-space:nowrap;">' + kr.code + '</td>'
        + '<td style="padding:10px 12px;color:#FFF;font-weight:600;">' + (kr.stage ? '<span style="display:inline-block;font-size:0.68rem;color:var(--accent-gold);margin-right:6px;background:rgba(245,158,11,0.15);padding:1px 6px;border-radius:4px;border:1px solid rgba(245,158,11,0.3);">' + kr.stage + '</span>' : '') + kr.title + '</td>'
        + '<td style="padding:10px 12px;color:var(--text-secondary);text-align:center;">' + kr.output + '</td>'
        + '<td style="padding:10px 12px;color:#60A5FA;text-align:center;font-size:0.75rem;white-space:nowrap;">' + kr.deadline + '</td>'
        + '<td style="padding:10px 12px;text-align:center;white-space:nowrap;"><span style="background:' + norm.bg + ';color:' + norm.color + ';border:1px solid ' + norm.border + ';padding:2px 8px;border-radius:4px;font-weight:800;font-size:0.72rem;">' + norm.icon + ' ' + (kr.status || norm.label) + '</span></td>'
        + '<td style="padding:10px 12px;text-align:center;font-size:0.75rem;">' + (kr.link && kr.link !== '-' ? '<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(167,139,250,0.12);color:#C4B5FD;border:1px solid rgba(167,139,250,0.25);padding:2px 8px;border-radius:4px;font-weight:600;font-size:0.72rem;">📄 ' + kr.link + '</span>' : '<span style="color:var(--text-secondary);">-</span>') + '</td>'
        + '<td style="padding:10px 12px;color:var(--text-secondary);font-size:0.75rem;">' + (kr.actual && kr.actual !== '-' ? kr.actual : '-') + '</td>'
        + '</tr>';
    }).join('');
    return '<div style="margin-bottom:18px;border:1px solid rgba(255,255,255,0.07);border-radius:8px;overflow:hidden;background:rgba(255,255,255,0.015);">'
      + '<div style="background:rgba(255,255,255,0.04);padding:12px 16px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid rgba(255,255,255,0.07);gap:12px;flex-wrap:wrap;">'
      + '<div>'
      + '<span style="font-size:0.68rem;color:var(--accent-gold);font-weight:800;">' + obj.id + ' | ' + obj.category + ' | Due: ' + obj.deadline + '</span>'
      + '<div style="color:#FFF;font-size:0.92rem;font-weight:700;margin-top:2px;">' + obj.name + '</div>'
      + (obj.targetOutput || obj.targetOutcome ? '<div style="font-size:0.74rem;color:var(--text-secondary);margin-top:5px;display:flex;gap:16px;flex-wrap:wrap;">'
        + (obj.targetOutput ? '<span>📦 <strong style="color:#FFF;">Target Output:</strong> ' + obj.targetOutput + '</span>' : '')
        + (obj.targetOutcome ? '<span>🎯 <strong style="color:#FFF;">Target Outcome:</strong> ' + obj.targetOutcome + '</span>' : '')
        + '</div>' : '')
      + '</div>'
      + '<div style="font-size:0.78rem;color:var(--text-secondary);white-space:nowrap;padding:4px 10px;background:rgba(255,255,255,0.04);border-radius:6px;">✅ ' + done + '/' + obj.krs.length + ' Done</div></div>'
      + '<div style="overflow-x:auto;">'
      + '<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:760px;">'
      + '<thead><tr style="background:rgba(255,255,255,0.03);">'
      + '<th style="padding:10px 12px;color:var(--text-secondary);font-weight:700;text-align:left;width:85px;">Kode</th>'
      + '<th style="padding:10px 12px;color:var(--text-secondary);font-weight:700;text-align:left;">Key Result (KR)</th>'
      + '<th style="padding:10px 12px;color:var(--text-secondary);font-weight:700;text-align:center;width:170px;">Target Output</th>'
      + '<th style="padding:10px 12px;color:var(--text-secondary);font-weight:700;text-align:center;width:120px;">Target Waktu</th>'
      + '<th style="padding:10px 12px;color:var(--text-secondary);font-weight:700;text-align:center;width:120px;">Status</th>'
      + '<th style="padding:10px 12px;color:var(--text-secondary);font-weight:700;text-align:center;width:160px;">Link Output</th>'
      + '<th style="padding:10px 12px;color:var(--text-secondary);font-weight:700;text-align:left;width:180px;">Evaluasi</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }).join('');

  return `
    <div style="display:flex;flex-direction:column;gap:20px;">
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:16px 20px;border-radius:var(--radius-md);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
          <div>
            <h2 style="color:#FFF;font-size:1.25rem;font-weight:800;display:flex;align-items:center;gap:8px;margin:0;">
              <i data-lucide="factory" style="color:var(--accent-gold);"></i> OKR Dashboard — Produksi (${monthTitle}) 🏭
            </h2>
            <p style="color:var(--text-secondary);font-size:0.8rem;margin:4px 0 0 0;">${sections.map(s => s.name).join(' · ')} — ${monthTitle}</p>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <select id="produksiMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:6px 12px;border-radius:6px;font-size:0.82rem;font-weight:700;cursor:pointer;">
              <option value="7" ${currentMonthKey === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
              <option value="6" ${currentMonthKey === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
            </select>
            <select onchange="window.handleOKRStatusFilterChange(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:6px 12px;border-radius:6px;font-size:0.82rem;font-weight:700;cursor:pointer;">
              <option value="all" ${selectedStat === 'all' ? 'selected' : ''}>Semua Status</option>
              <option value="Done" ${selectedStat === 'Done' ? 'selected' : ''}>🟢 Done</option>
              <option value="On Progress" ${selectedStat === 'On Progress' ? 'selected' : ''}>🟡 On Progress</option>
              <option value="Belum Mulai" ${selectedStat === 'Belum Mulai' ? 'selected' : ''}>⚪ Belum Mulai</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">${tabsHTML}</div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card"><div class="metric-card-header"><span class="metric-title">Total KR — ${section.name}</span><div class="metric-icon-box okr-theme"><i data-lucide="layers"></i></div></div><div class="metric-value">${totalKRs} KR</div><div class="metric-trend trend-neutral">${(section.objectives || []).length} Objectives</div></div>
        <div class="metric-card" style="border-color:rgba(16,185,129,0.4);"><div class="metric-card-header"><span class="metric-title">Done ✅</span><div class="metric-icon-box okr-theme"><i data-lucide="check-circle-2"></i></div></div><div class="metric-value" style="color:#10B981;">${doneKRs} KR (${donePercent}%)</div><div class="metric-trend trend-up">Selesai sesuai target</div></div>
        <div class="metric-card" style="border-color:rgba(234,179,8,0.4);"><div class="metric-card-header"><span class="metric-title">On Progress 🟡</span><div class="metric-icon-box milestone-theme"><i data-lucide="loader"></i></div></div><div class="metric-value" style="color:#EAB308;">${progressKRs} KR</div><div class="metric-trend trend-neutral">Sedang dikerjakan</div></div>
        <div class="metric-card" style="border-color:rgba(156,163,175,0.4);"><div class="metric-card-header"><span class="metric-title">Belum Mulai ⚪</span><div class="metric-icon-box complain-theme"><i data-lucide="clock"></i></div></div><div class="metric-value" style="color:#9CA3AF;">${belumKRs} KR</div><div class="metric-trend trend-neutral">Perlu percepatan</div></div>
      </div>

      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:20px;border-radius:var(--radius-md);">
        <h3 style="color:#FFF;font-size:1rem;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i data-lucide="bar-chart-3" style="color:var(--accent-gold);"></i> Progress per Objective — ${section.name}</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">${progressBarsHTML}</div>
      </div>

      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:20px;border-radius:var(--radius-md);">
        <h3 style="color:#FFF;font-size:1.05rem;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
          <i data-lucide="kanban" style="color:var(--accent-gold);"></i> Kanban Board — ${section.name}
          <span style="font-size:0.78rem;color:var(--accent-gold);font-weight:700;margin-left:auto;">${filteredKRs.length}/${totalKRs} KR</span>
        </h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">${kanbanHTML}</div>
      </div>

      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:20px;border-radius:var(--radius-md);">
        <h3 style="color:#FFF;font-size:1rem;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;"><i data-lucide="list" style="color:var(--accent-gold);"></i> Rincian KR per Objective — ${section.name}</h3>
        ${tableHTML}
      </div>
    </div>
  `;
}

window.switchProduksiSection = function(sectionId) {
  state.produksiSection = sectionId;
  renderCurrentView();
};

window.showProduksiKRDetail = function(code, sectionId) {
  let foundKR = null, foundObj = null, foundSection = null;
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = produksiOKRData.monthsData ? (produksiOKRData.monthsData[currentMonthKey] || produksiOKRData.monthsData['7']) : produksiOKRData;
  const sections = monthData.sections || [];

  sections.forEach(sec => {
    if (sec.id === sectionId || !sectionId) {
      (sec.objectives || []).forEach(obj => {
        const m = (obj.krs || []).find(k => k.code === code);
        if (m) { foundKR = m; foundObj = obj; foundSection = sec; }
      });
    }
  });
  if (!foundKR) return;
  const norm = normalizeOKRStatus(foundKR.status);
  openModal('[PRODUKSI] ' + foundKR.code + ' — ' + foundKR.title,
    '<div style="display:flex;flex-direction:column;gap:14px;font-size:0.9rem;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px 14px;border-radius:6px;">'
    + '<div><span style="font-size:0.72rem;color:var(--accent-gold);font-weight:800;">' + (foundSection ? foundSection.name : 'Produksi') + ' — ' + (foundObj ? foundObj.category : '') + '</span>'
    + '<div style="color:#FFF;font-weight:700;font-size:0.85rem;">' + (foundObj ? foundObj.name : '') + '</div>'
    + '<div style="font-size:0.72rem;color:var(--text-secondary);">Due Objective: ' + (foundObj ? foundObj.deadline : '-') + '</div></div>'
    + '<span style="background:' + norm.bg + ';color:' + norm.color + ';border:1px solid ' + norm.border + ';padding:4px 10px;border-radius:6px;font-weight:800;">' + norm.icon + ' ' + (foundKR.status || norm.label) + '</span>'
    + '</div>'
    + (foundObj && (foundObj.targetOutput || foundObj.targetOutcome) ? '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
      + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">TARGET OUTPUT (OBJECTIVE):</strong><span style="color:#FFF;font-weight:600;font-size:0.8rem;">' + (foundObj.targetOutput || '-') + '</span></div>'
      + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">TARGET OUTCOME (OBJECTIVE):</strong><span style="color:#10B981;font-weight:600;font-size:0.8rem;">🎯 ' + (foundObj.targetOutcome || '-') + '</span></div>'
      + '</div>' : '')
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">TARGET OUTPUT (KR):</strong><span style="color:#FFF;font-weight:700;">' + foundKR.output + '</span></div>'
    + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">TARGET WAKTU:</strong><span style="color:#60A5FA;font-weight:700;">📅 ' + foundKR.deadline + '</span></div>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;margin-bottom:4px;">EVALUASI / PROGRESS AKTUAL:</strong><p style="color:#FFF;font-weight:600;margin:0;line-height:1.5;">' + (foundKR.actual || 'Belum ada catatan evaluasi.') + '</p></div>'
    + (foundKR.link && foundKR.link !== '-' ? '<div style="text-align:right;"><span style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.15);border:1px solid var(--accent-gold);color:var(--accent-gold);font-weight:700;padding:6px 14px;border-radius:6px;font-size:0.8rem;">🔗 Link Output: ' + foundKR.link + '</span></div>' : '')
    + '</div>'
  );
};

// Handlers for OKR Project & Status Filters


window.handleOKRProjectFilterChange = function(projectId) {
  state.okrProjectFilter = projectId;
  renderCurrentView();
};

window.handleOKRStatusFilterChange = function(statusKey) {
  state.okrStatusFilter = statusKey;
  renderCurrentView();
};




// --------------------------------------------------------------------------
// VIEW 5: COMPLAIN
// --------------------------------------------------------------------------
// VIEW 5: COMPLAIN — Real Data Complain BT (Juli 2026)
// --------------------------------------------------------------------------
function renderComplainView() {
  const subId = state.activeSub || 'complain-bt';
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = mockData.complain.monthsData ? (mockData.complain.monthsData[currentMonthKey] || mockData.complain.monthsData['7']) : mockData.complain;
  const monthTitle = monthData.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');
  const unitData = monthData[subId] || { summary: {}, offlineTickets: [], onlineStar1Tickets: [], onlineStar2Tickets: [], googleTickets: [] };

  if (subId === 'complain-tkb') {
    return `
      <div style="display:flex;flex-direction:column;gap:20px;">
        
        <!-- Scorecard Metric Header for TKB -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-card-header">
              <span class="metric-title">Total Complain ${monthTitle}</span>
              <div class="metric-icon-box complain-theme"><i data-lucide="message-square-check"></i></div>
            </div>
            <div class="metric-value" style="color:#10B981;">0</div>
            <div class="metric-trend trend-up">Periode ${monthTitle}</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-header">
              <span class="metric-title">Sumber Google Review</span>
              <div class="metric-icon-box complain-theme"><i data-lucide="star"></i></div>
            </div>
            <div class="metric-value" style="color:#10B981;">0</div>
            <div class="metric-trend trend-up">Nol Komplain Customer</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-header">
              <span class="metric-title">Kategori Pelayanan</span>
              <div class="metric-icon-box complain-theme"><i data-lucide="user-check"></i></div>
            </div>
            <div class="metric-value" style="color:#10B981;">0</div>
            <div class="metric-trend trend-up">Tidak Ada Komplain</div>
          </div>

          <div class="metric-card">
            <div class="metric-card-header">
              <span class="metric-title">Kategori Produk & Area</span>
              <div class="metric-icon-box complain-theme"><i data-lucide="package-check"></i></div>
            </div>
            <div class="metric-value" style="color:#10B981;">0</div>
            <div class="metric-trend trend-up">Tidak Ada Komplain</div>
          </div>
        </div>

        <!-- Main Spreadsheet-Style Data Table for TKB -->
        <div class="table-card" style="padding:0;overflow:hidden;border:1px solid var(--border-gold);">
          
          <!-- Banner Title -->
          <div style="background:linear-gradient(90deg, #10B981 0%, #059669 100%);color:#FFF;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h3 style="margin:0;font-size:1.1rem;font-weight:900;letter-spacing:0.5px;">KOMPLAIN THE KERANJANG BALI</h3>
              <div style="font-size:0.8rem;opacity:0.9;margin-top:2px;">Periode : ${monthTitle}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <select id="complainTKBMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:4px 10px;border-radius:6px;font-size:0.8rem;font-weight:700;cursor:pointer;">
                <option value="7" ${currentMonthKey === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
                <option value="6" ${currentMonthKey === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
              </select>
              <span style="font-size:0.78rem;background:rgba(0,0,0,0.25);padding:4px 12px;border-radius:4px;font-weight:700;">Sheet 5B. Complain - TKB</span>
            </div>
          </div>

          <div style="overflow-x:auto;">
            <table class="custom-table" style="width:100%;border-collapse:collapse;font-size:0.86rem;">
              <thead>
                <tr style="background:rgba(255,255,255,0.06);border-bottom:2px solid var(--border-gold);">
                  <th style="width:180px;text-align:center;padding:12px;color:var(--accent-gold);">Sumber Komplain</th>
                  <th style="width:180px;padding:12px;color:var(--accent-gold);">Kategori Komplain</th>
                  <th style="padding:12px;color:var(--accent-gold);">Detail Komplain</th>
                  <th style="width:120px;text-align:center;padding:12px;color:var(--accent-gold);">Link</th>
                  <th style="width:180px;text-align:center;padding:12px;color:var(--accent-gold);">Solving (Janji Konsumen)</th>
                  <th style="width:90px;text-align:center;padding:12px;color:var(--accent-gold);">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                
                <tr style="background:rgba(255,255,255,0.01);border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td rowspan="3" style="vertical-align:middle;text-align:center;font-weight:800;color:#FFF;background:rgba(255,255,255,0.02);border-right:1px solid rgba(255,255,255,0.08);">
                    <div style="font-size:1.1rem;color:var(--accent-gold);margin-bottom:4px;">Google Review</div>
                    <span style="font-size:0.72rem;color:var(--text-secondary);font-weight:600;">(Official Review)</span>
                  </td>
                  <td style="font-weight:700;color:#FFF;padding:12px;">Pelayanan</td>
                  <td style="color:#10B981;font-weight:600;padding:12px;">Tidak ada complain</td>
                  <td style="text-align:center;color:var(--text-secondary);padding:12px;">-</td>
                  <td style="text-align:center;color:var(--text-secondary);padding:12px;">-</td>
                  <td style="text-align:center;font-weight:800;color:#10B981;font-size:1rem;padding:12px;">0</td>
                </tr>

                <tr style="background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="font-weight:700;color:#FFF;padding:12px;">Produk</td>
                  <td style="color:#10B981;font-weight:600;padding:12px;">Tidak ada complain</td>
                  <td style="text-align:center;color:var(--text-secondary);padding:12px;">-</td>
                  <td style="text-align:center;color:var(--text-secondary);padding:12px;">-</td>
                  <td style="text-align:center;font-weight:800;color:#10B981;font-size:1rem;padding:12px;">0</td>
                </tr>

                <tr style="background:rgba(255,255,255,0.01);border-bottom:1px solid rgba(255,255,255,0.08);">
                  <td style="font-weight:700;color:#FFF;padding:12px;">Area</td>
                  <td style="color:#10B981;font-weight:600;padding:12px;">Tidak ada complain</td>
                  <td style="text-align:center;color:var(--text-secondary);padding:12px;">-</td>
                  <td style="text-align:center;color:var(--text-secondary);padding:12px;">-</td>
                  <td style="text-align:center;font-weight:800;color:#10B981;font-size:1rem;padding:12px;">0</td>
                </tr>

                <tr style="background:linear-gradient(90deg, rgba(234,179,8,0.15) 0%, rgba(16,185,129,0.15) 100%);border-top:2px solid var(--accent-gold);font-weight:900;">
                  <td colspan="5" style="color:var(--accent-gold);padding:14px 18px;font-size:0.95rem;">Total Complain ${monthTitle} by Google Review</td>
                  <td style="text-align:center;color:#10B981;font-size:1.2rem;">0</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  const star1Tickets = unitData.onlineStar1Tickets || [];
  const star2Tickets = unitData.onlineStar2Tickets || [];
  const offlineTickets = unitData.offlineTickets || [];

  const offlineProdukCount = offlineTickets.filter(t => t.category === 'Produk').reduce((acc, t) => acc + (t.total || 1), 0);
  const offlineFasilitasCount = offlineTickets.filter(t => t.category === 'Fasilitas').reduce((acc, t) => acc + (t.total || 1), 0);
  const offlinePelayananCount = offlineTickets.filter(t => t.category === 'Pelayanan').reduce((acc, t) => acc + (t.total || 1), 0);
  const offlineTotal = offlineProdukCount + offlineFasilitasCount + offlinePelayananCount;

  const onlineStar1Count = star1Tickets.reduce((acc, t) => acc + (t.total || 1), 0);
  const onlineStar2Count = star2Tickets.reduce((acc, t) => acc + (t.total || 1), 0);
  const onlineTotal = onlineStar1Count + onlineStar2Count;

  const grandTotal = offlineTotal + onlineTotal;

  return `
    <div style="display:flex;flex-direction:column;gap:20px;">
      
      <!-- Scorecard Metric Header -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Total Complain ${monthTitle}</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="message-square-warning"></i></div>
          </div>
          <div class="metric-value" style="color:var(--accent-gold);">${grandTotal}</div>
          <div class="metric-trend trend-neutral">Periode ${monthTitle}</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Complain Offline / Stand</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="store"></i></div>
          </div>
          <div class="metric-value" style="color:${offlineTotal === 0 ? '#10B981' : '#F59E0B'};">${offlineTotal}</div>
          <div class="metric-trend ${offlineTotal === 0 ? 'trend-up' : 'trend-neutral'}">Fasilitas, Produk & Pelayanan</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Google Review &lt; 3★</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="star-off"></i></div>
          </div>
          <div class="metric-value" style="color:#10B981;">0</div>
          <div class="metric-trend trend-up">Tidak Ada Review Buruk</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Complain Online (E-Commerce)</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="shopping-cart"></i></div>
          </div>
          <div class="metric-value" style="color:#F59E0B;">${onlineTotal}</div>
          <div class="metric-trend trend-neutral">${onlineStar1Count}x Rating 1★ | ${onlineStar2Count}x Rating 2★</div>
        </div>
      </div>

      <!-- Main Spreadsheet-Style Data Table -->
      <div class="table-card" style="padding:0;overflow:hidden;border:1px solid var(--border-gold);">
        
        <!-- Spreadsheet Title Banner with Month Filter Selector -->
        <div style="background:linear-gradient(90deg, #D97706 0%, #B45309 100%);color:#FFF;padding:12px 20px;font-weight:800;font-size:1.05rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <span>Complain BT ${monthTitle}</span>
          <div style="display:flex;align-items:center;gap:10px;">
            <select id="complainBTMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:4px 10px;border-radius:6px;font-size:0.8rem;font-weight:700;cursor:pointer;">
              <option value="7" ${currentMonthKey === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
              <option value="6" ${currentMonthKey === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
            </select>
            <span style="font-size:0.8rem;background:rgba(0,0,0,0.25);padding:4px 10px;border-radius:4px;">Ceremonial Monthly Report</span>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table" style="width:100%;border-collapse:collapse;font-size:0.84rem;">
            <thead>
              <tr style="background:rgba(255,255,255,0.06);border-bottom:2px solid var(--border-gold);">
                <th style="width:160px;text-align:center;padding:10px;">KATEGORI</th>
                <th style="width:150px;text-align:center;padding:10px;">STAND</th>
                <th style="padding:10px;">Kategori Complain / Product</th>
                <th style="padding:10px;">Complain / Keluhan</th>
                <th style="width:160px;text-align:center;padding:10px;">Solusi Complain</th>
                <th style="width:70px;text-align:center;padding:10px;">Total</th>
              </tr>
            </thead>
            <tbody>
              
              <!-- Section 1: Offline Categories -->
              <!-- Produk -->
              ${offlineTickets.filter(t => t.category === 'Produk').length > 0
                ? offlineTickets.filter(t => t.category === 'Produk').map((t, idx, arr) => `
                    <tr>
                      ${idx === 0 ? `<td rowspan="${arr.length}" style="font-weight:700;color:#FFF;background:rgba(255,255,255,0.02);vertical-align:middle;">Produk</td>` : ''}
                      <td style="text-align:center;color:var(--text-secondary);">${t.stand || 'Stand 1'}</td>
                      <td style="color:#FFF;font-weight:600;">${t.issue}</td>
                      <td style="color:#FCA5A5;">${t.issue}</td>
                      <td style="text-align:center;"><span style="background:rgba(16,185,129,0.2);color:#10B981;border:1px solid rgba(16,185,129,0.4);padding:3px 8px;border-radius:4px;font-weight:700;font-size:0.75rem;">${t.solusi}</span></td>
                      <td style="text-align:center;font-weight:700;color:#FFF;">${t.total || 1}</td>
                    </tr>
                  `).join('')
                : `
                  <tr>
                    <td style="font-weight:700;color:#FFF;background:rgba(255,255,255,0.02);">Produk</td>
                    <td style="text-align:center;color:var(--text-secondary);">Stand</td>
                    <td colspan="2" style="color:var(--text-secondary);">Tidak ada complain Produk</td>
                    <td style="text-align:center;color:var(--text-secondary);">-</td>
                    <td style="text-align:center;font-weight:700;color:#10B981;">0</td>
                  </tr>
                `
              }
              <tr style="background:rgba(16,185,129,0.06);font-weight:700;">
                <td colspan="5" style="color:${offlineProdukCount > 0 ? '#F59E0B' : '#10B981'};padding-left:16px;">Jumlah complain Produk</td>
                <td style="text-align:center;color:${offlineProdukCount > 0 ? '#F59E0B' : '#10B981'};">${offlineProdukCount}</td>
              </tr>

              <!-- Fasilitas -->
              <tr>
                <td style="font-weight:700;color:#FFF;background:rgba(255,255,255,0.02);">Fasilitas</td>
                <td style="text-align:center;color:var(--text-secondary);">Stand</td>
                <td colspan="2" style="color:var(--text-secondary);">Tidak ada complain Fasilitas</td>
                <td style="text-align:center;color:var(--text-secondary);">-</td>
                <td style="text-align:center;font-weight:700;color:#10B981;">0</td>
              </tr>
              <tr style="background:rgba(16,185,129,0.06);font-weight:700;">
                <td colspan="5" style="color:#10B981;padding-left:16px;">Jumlah Complain Fasilitas</td>
                <td style="text-align:center;color:#10B981;">0</td>
              </tr>

              <!-- Pelayanan -->
              <tr>
                <td style="font-weight:700;color:#FFF;background:rgba(255,255,255,0.02);">Pelayanan</td>
                <td style="text-align:center;color:var(--text-secondary);">Stand</td>
                <td colspan="2" style="color:var(--text-secondary);">Tidak ada complain Pelayanan</td>
                <td style="text-align:center;color:var(--text-secondary);">-</td>
                <td style="text-align:center;font-weight:700;color:#10B981;">0</td>
              </tr>
              <tr style="background:rgba(16,185,129,0.06);font-weight:700;">
                <td colspan="5" style="color:#10B981;padding-left:16px;">Jumlah Complain Pelayanan</td>
                <td style="text-align:center;color:#10B981;">0</td>
              </tr>

              <!-- Google Review Bintang <3 -->
              <tr>
                <td style="font-weight:700;color:#FFF;background:rgba(255,255,255,0.02);">Google Review Bintang &lt;3</td>
                <td style="text-align:center;color:var(--text-secondary);">Google Review</td>
                <td colspan="2" style="color:var(--text-secondary);">Tidak ada complain Google Review</td>
                <td style="text-align:center;color:var(--text-secondary);">-</td>
                <td style="text-align:center;font-weight:700;color:#10B981;">0</td>
              </tr>
              <tr style="background:rgba(16,185,129,0.06);font-weight:700;">
                <td colspan="5" style="color:#10B981;padding-left:16px;">Jumlah Complain Google Review</td>
                <td style="text-align:center;color:#10B981;">0</td>
              </tr>

              <!-- Section 2: Online / E-Commerce (Bintang) -->
              <tr style="background:rgba(234,179,8,0.12);border-top:2px solid var(--accent-gold);border-bottom:1.5px solid var(--accent-gold);">
                <th style="color:var(--accent-gold);text-align:center;padding:10px;font-weight:800;">Bintang (E-Commerce)</th>
                <th style="color:var(--accent-gold);padding:10px;">Product</th>
                <th colspan="2" style="color:var(--accent-gold);padding:10px;">Complain</th>
                <th style="color:var(--accent-gold);text-align:center;padding:10px;">Solusi Complain</th>
                <th style="color:var(--accent-gold);text-align:center;padding:10px;">Total</th>
              </tr>

              <!-- 1 Star Rating Rowspan Group -->
              ${star1Tickets.length > 0 ? star1Tickets.map((t, idx) => `
                <tr style="background:rgba(255,255,255,0.01);border-bottom:1px solid rgba(255,255,255,0.04);">
                  ${idx === 0 ? `
                    <td rowspan="${star1Tickets.length}" style="vertical-align:middle;text-align:center;background:rgba(255,255,255,0.02);border-right:1px solid rgba(255,255,255,0.08);">
                      <div style="font-size:1.5rem;color:#F59E0B;display:flex;justify-content:center;align-items:center;">⭐</div>
                    </td>
                  ` : ''}
                  <td style="font-weight:600;color:#FFF;max-width:280px;line-height:1.4;padding:9px 12px;">${t.product}</td>
                  <td colspan="2" style="color:#FCA5A5;font-size:0.82rem;padding:9px 12px;">${t.issue}</td>
                  <td style="text-align:center;padding:9px 12px;">
                    <span style="background:${t.solusi === 'Pemberian Gift' ? 'rgba(16,185,129,0.2)' : 'rgba(234,179,8,0.15)'};color:${t.solusi === 'Pemberian Gift' ? '#10B981' : '#F59E0B'};border:1px solid ${t.solusi === 'Pemberian Gift' ? 'rgba(16,185,129,0.4)' : 'rgba(234,179,8,0.4)'};padding:3px 8px;border-radius:4px;font-weight:700;font-size:0.75rem;">
                      ${t.solusi}
                    </span>
                  </td>
                  <td style="text-align:center;font-weight:700;color:#FFF;padding:9px 12px;">${t.total || 1}</td>
                </tr>
              `).join('') : ''}

              <!-- 2 Stars Rating Rowspan Group -->
              ${star2Tickets.length > 0 ? star2Tickets.map((t, idx) => `
                <tr style="background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.04);">
                  ${idx === 0 ? `
                    <td rowspan="${star2Tickets.length}" style="vertical-align:middle;text-align:center;background:rgba(255,255,255,0.02);border-right:1px solid rgba(255,255,255,0.08);">
                      <div style="font-size:1.3rem;color:#F59E0B;display:flex;justify-content:center;align-items:center;gap:4px;">⭐⭐</div>
                    </td>
                  ` : ''}
                  <td style="font-weight:600;color:#FFF;max-width:280px;line-height:1.4;padding:9px 12px;">${t.product}</td>
                  <td colspan="2" style="color:#FCA5A5;font-size:0.82rem;padding:9px 12px;">${t.issue}</td>
                  <td style="text-align:center;padding:9px 12px;">
                    <span style="background:${t.solusi === 'Pemberian Gift' ? 'rgba(16,185,129,0.2)' : 'rgba(234,179,8,0.15)'};color:${t.solusi === 'Pemberian Gift' ? '#10B981' : '#F59E0B'};border:1px solid ${t.solusi === 'Pemberian Gift' ? 'rgba(16,185,129,0.4)' : 'rgba(234,179,8,0.4)'};padding:3px 8px;border-radius:4px;font-weight:700;font-size:0.75rem;">
                      ${t.solusi}
                    </span>
                  </td>
                  <td style="text-align:center;font-weight:700;color:#FFF;padding:9px 12px;">${t.total || 1}</td>
                </tr>
              `).join('') : ''}

              <!-- Bottom Summary Totals -->
              <tr style="background:rgba(16,185,129,0.12);border-top:1.5px solid #10B981;font-weight:800;">
                <td colspan="5" style="color:#10B981;padding:10px 16px;font-size:0.9rem;">Jumlah Complain Online</td>
                <td style="text-align:center;color:#10B981;font-size:1rem;">${onlineTotal}</td>
              </tr>
              <tr style="background:linear-gradient(90deg, rgba(234,179,8,0.2) 0%, rgba(180,83,9,0.3) 100%);border-top:1.5px solid var(--accent-gold);font-weight:900;">
                <td colspan="5" style="color:var(--accent-gold);padding:12px 16px;font-size:0.95rem;">Total Complain ${monthTitle}</td>
                <td style="text-align:center;color:var(--accent-gold);font-size:1.15rem;">${grandTotal}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function initComplainChart() {
  // Chart removed as requested; view renders pure real spreadsheet data directly.
}

// --------------------------------------------------------------------------
// VIEW 6: MILESTONE
// --------------------------------------------------------------------------
function renderMilestoneView() {
  const subId = state.activeSub || 'milestone-bt';
  const currentMonthKey = (state.selectedSalesMonth === '6') ? '6' : '7';
  const monthData = mockData.milestone.monthsData ? (mockData.milestone.monthsData[currentMonthKey] || mockData.milestone.monthsData['7']) : mockData.milestone;
  const monthTitle = monthData.monthName || (currentMonthKey === '7' ? 'Agustus 2026' : 'Juli 2026');
  const timelineList = monthData[subId] || [];

  const filtered = timelineList.filter(m =>
    !state.searchQuery || m.title.toLowerCase().includes(state.searchQuery) || (m.desc && m.desc.toLowerCase().includes(state.searchQuery))
  );

  const totalItems = timelineList.length;
  const berjalanCount = timelineList.filter(t => t.status === 'Berjalan' || t.status === 'Completed').length;
  const progressCount = timelineList.filter(t => t.status === 'Progress' || t.status === 'In Progress').length;
  const holdCount = timelineList.filter(t => t.status === 'Hold').length;

  const isTkb = subId === 'milestone-tkb';
  const bannerTitle = isTkb ? 'THE KERANJANG BALI - MILESTONE' : 'MILESTONE ROADMAP TARGET 2026';
  const bannerSub = isTkb ? 'The Keranjang Bali (TKB) — Monitoring Rebranding Experience' : 'Batik Trusmi (BT) — Monitoring Inisiatif Strategis';
  const bannerBg = isTkb ? 'linear-gradient(90deg, #059669 0%, #10B981 100%)' : 'linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%)';

  return `
    <div style="display:flex;flex-direction:column;gap:20px;">
      
      <!-- Control Header with Month Selector & Future Goals Banner -->
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:16px 20px;border-radius:var(--radius-md);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <h2 style="color:#FFF;font-size:1.25rem;font-weight:800;margin:0;display:flex;align-items:center;gap:8px;">
            <i data-lucide="milestone" style="color:var(--accent-gold);"></i> ${bannerTitle} (${monthTitle})
          </h2>
          <p style="color:var(--text-secondary);font-size:0.8rem;margin:4px 0 0 0;">${bannerSub} | Periode ${monthTitle}</p>
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <select id="milestoneMonthSelect" onchange="window.updateSalesMonthFilter(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:6px 12px;border-radius:6px;font-size:0.82rem;font-weight:700;cursor:pointer;">
            <option value="7" ${currentMonthKey === '7' ? 'selected' : ''}>Agustus 2026 (Data Baru ✨)</option>
            <option value="6" ${currentMonthKey === '6' ? 'selected' : ''}>Juli 2026 (History 📜)</option>
          </select>
        </div>
      </div>

      ${!isTkb ? `
        <!-- Future Goals 2027 Banner -->
        <div style="background:linear-gradient(90deg, rgba(234,179,8,0.15) 0%, rgba(59,130,246,0.15) 100%);border:1px solid var(--accent-gold);padding:14px 20px;border-radius:8px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:1.2rem;">🚀</span>
            <div>
              <strong style="color:var(--accent-gold);font-size:0.88rem;display:block;">TARGET MASA DEPAN (2027):</strong>
              <span style="color:#FFF;font-size:0.82rem;font-weight:600;">Jahit Express 2 Jam · Smart Factory 20</span>
            </div>
          </div>
          <span style="background:var(--accent-gold);color:#000;font-weight:900;padding:4px 10px;border-radius:4px;font-size:0.75rem;">TARGET 2027</span>
        </div>
      ` : ''}

      <!-- Metric Cards Header -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Total Inisiatif 2026</span>
            <div class="metric-icon-box milestone-theme"><i data-lucide="milestone"></i></div>
          </div>
          <div class="metric-value" style="color:var(--accent-gold);">${totalItems}</div>
          <div class="metric-trend trend-neutral">Roadmap ${isTkb ? 'TKB' : 'BT'} 2026</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Status Berjalan</span>
            <div class="metric-icon-box milestone-theme"><i data-lucide="play-circle"></i></div>
          </div>
          <div class="metric-value" style="color:#10B981;">${berjalanCount}</div>
          <div class="metric-trend trend-up">Operasional Active</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Status In Progress</span>
            <div class="metric-icon-box milestone-theme"><i data-lucide="clock"></i></div>
          </div>
          <div class="metric-value" style="color:#3B82F6;">${progressCount}</div>
          <div class="metric-trend trend-neutral">Dalam Pengembangan</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Status Hold / Pending</span>
            <div class="metric-icon-box milestone-theme"><i data-lucide="pause-circle"></i></div>
          </div>
          <div class="metric-value" style="color:${holdCount > 0 ? '#0E7490' : 'var(--accent-gold)'};">${holdCount}</div>
          <div class="metric-trend trend-neutral">${holdCount > 0 ? 'Penundaan Sementara' : 'Tingkat Kesiapan On-Track'}</div>
        </div>
      </div>

      <!-- Main Spreadsheet-Style Data Table for Milestone -->
      <div class="table-card" style="padding:0;overflow:hidden;border:1px solid var(--border-gold);">
        
        <!-- Banner Header -->
        <div style="background:${bannerBg};color:#FFF;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex; align-items:center; gap:12px;">
            ${getUnitLogoHtml(subId, 34)}
            <div>
              <h3 style="margin:0;font-size:1.1rem;font-weight:900;letter-spacing:0.5px;">${bannerTitle}</h3>
              <div style="font-size:0.8rem;opacity:0.9;margin-top:2px;">${bannerSub} — ${monthTitle}</div>
            </div>
          </div>
          <span style="font-size:0.78rem;background:rgba(0,0,0,0.25);padding:4px 12px;border-radius:4px;font-weight:700;">Periode ${monthTitle}</span>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table" style="width:100%;border-collapse:collapse;font-size:0.86rem;">
            <thead>
              <tr style="background:rgba(255,255,255,0.06);border-bottom:2px solid var(--border-gold);">
                <th style="width:60px;text-align:center;padding:12px;color:var(--accent-gold);">No</th>
                <th style="width:120px;text-align:center;padding:12px;color:var(--accent-gold);">Tahun</th>
                <th style="padding:12px;color:var(--accent-gold);">Nama Inisiatif / Milestone</th>
                <th style="width:170px;padding:12px;color:var(--accent-gold);">Kategori / Scope</th>
                <th style="width:160px;text-align:center;padding:12px;color:var(--accent-gold);">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((m, idx) => `
                <tr style="background:${idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)'};border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="text-align:center;font-weight:700;color:var(--text-secondary);padding:12px;">${idx + 1}</td>
                  <td style="text-align:center;font-weight:800;color:#FFF;padding:12px;">
                    <span style="background:rgba(255,255,255,0.08);padding:3px 8px;border-radius:4px;">${m.year || '2026'}</span>
                  </td>
                  <td style="padding:12px;">
                    <div style="font-weight:800;color:#FFF;font-size:0.92rem;">${m.title}</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px;">${m.desc || ''}</div>
                  </td>
                  <td style="padding:12px;">
                    <span style="background:rgba(234,179,8,0.1);color:var(--accent-gold);border:1px solid rgba(234,179,8,0.3);padding:3px 8px;border-radius:4px;font-size:0.75rem;font-weight:700;">
                      ${m.tag || 'Strategic'}
                    </span>
                  </td>
                  <td style="text-align:center;padding:12px;">
                    ${m.status === 'Berjalan' ? `
                      <span style="background:#15803D;color:#FFF;padding:6px 16px;border-radius:20px;font-weight:800;font-size:0.8rem;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(21,128,61,0.3);">
                        <i data-lucide="check-circle" style="width:14px;height:14px;"></i> Berjalan
                      </span>
                    ` : m.status === 'Hold' ? `
                      <span style="background:#0E7490;color:#FFF;padding:6px 16px;border-radius:20px;font-weight:800;font-size:0.8rem;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(14,116,144,0.3);">
                        <i data-lucide="pause-circle" style="width:14px;height:14px;"></i> Hold
                      </span>
                    ` : `
                      <span style="background:#1D4ED8;color:#FFF;padding:6px 16px;border-radius:20px;font-weight:800;font-size:0.8rem;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(29,78,216,0.3);">
                        <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Progress
                      </span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// ==========================================================================
// VIEW 7: B2B DASHBOARD (ACHIEVEMENT, YOY COMPARISON, COMPLAIN WITH PHOTOS)
// ==========================================================================

const b2bMonthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const b2bDatabase = {
  // Target ACV bulanan 2026 (Total Jan-Ags = Rp 3.960.000.000, Total Full Year = Rp 6.000.000.000)
  target2026: [420000000, 480000000, 480000000, 660000000, 480000000, 540000000, 480000000, 420000000, 540000000, 480000000, 600000000, 420000000],
  // ACV Aktual 2025 (Jan - Des)
  acv2025: [49396200, 99146399, 437196380, 163115720, 180073085, 169497149, 29836562, 274537035, 167413910, 244770614, 361433600, 483325750],
  // Cash In 2025 (Jan - Des)
  cashIn2025: [0, 0, 24081550, 30579350, 131204585, 168881469, 71302062, 44909650, 102057050, 398148054, 216523865, 437298350],
  // ACV Aktual 2026 (Jan - Ags, YTD = Rp 2.885.932.921)
  acv2026: [275430924, 167980600, 399331359, 543332850, 220628800, 260594428, 405962550, 612671410, 0, 0, 0, 0],
  // Cash In 2026 (Jan - Ags, YTD = Rp 2.131.472.842)
  cashIn2026: [300544972, 283399800, 102205868, 268122736, 384872726, 295220915, 154484825, 342621000, 0, 0, 0, 0],
  
  availableMonths: [
    { key: 'all', label: 'Semua Periode YTD (Jan-Ags)', emoji: '📊' },
    { key: '7', label: 'Agustus 2026 (Data Baru ✨)', emoji: '✨' },
    { key: '6', label: 'Juli 2026 (History 📜)', emoji: '📜' },
    { key: '5', label: 'Juni 2026', emoji: '📜' },
    { key: '4', label: 'Mei 2026', emoji: '📜' },
    { key: '3', label: 'April 2026 (Peak Q2 🔥)', emoji: '🔥' },
    { key: '2', label: 'Maret 2026', emoji: '📜' },
    { key: '1', label: 'Februari 2026', emoji: '📜' },
    { key: '0', label: 'Januari 2026', emoji: '📜' }
  ]
};

// Database Tiket Komplain Customer B2B dengan Foto & Video Bukti Nyata
const b2bComplainTickets = [
  {
    id: 'B2B-CMP-2026-085',
    customer: 'PT Sanqua Multi Makmur (Sanqua)',
    orderRef: 'Seragam Karyawan Sanqua',
    date: '29 Agustus 2026',
    monthKey: '7',
    category: 'Seragam Karyawan',
    badgeType: 'b2b-badge-product',
    severity: 'High',
    pic: '-',
    photo: 'asset/complain sanqua.mp4',
    photoThumb: 'asset/complain sanqua.mp4',
    mediaType: 'video',
    title: 'Ritsleting Tidak Terjahit ke Bahan Baju & Jahitan Bagian Dalam Tidak Rapi',
    issue: 'Untuk seragam sudah kita bagikan ke karyawan, namun ada complain terkait sleting yg tidak terjahit ke bahan baju dan seperti yg saya komplain sebelumnya terkait bagian dalam sleting yg tidak rapi penjahitannya bu🙏',
    rootCause: '-',
    resolution: '-',
    status: 'Komplain Masuk',
    csat: '-'
  },
  {
    id: 'B2B-CMP-2026-086',
    customer: 'Kak Dewi (Klien)',
    orderRef: 'Celana Batik Seragam',
    date: '30 Agustus 2026',
    monthKey: '7',
    category: 'Jahitan & Cutting Celana',
    badgeType: 'b2b-badge-product',
    severity: 'High',
    pic: '-',
    photo: 'asset/complain kak dewi.jpeg',
    photoThumb: 'asset/complain kak dewi.jpeg',
    mediaType: 'image',
    title: 'Jahitan Celana Tidak Sesuai Cutting (Minta Perbaikan, Proses Kirim)',
    issue: 'Bu izin untuk jahitan celana yang seperti ini, tidak sesuai cuttingnya. Dari pihak klien minta perbaikan ya bu, celananya dalam proses kirim.',
    rootCause: '-',
    resolution: 'Dalam proses kirim untuk perbaikan cutting & penjahitan ulang',
    status: 'Komplain Masuk',
    csat: '-'
  },
  {
    id: 'B2B-CMP-2026-087',
    customer: 'Kolese Jesuit',
    orderRef: 'Kain Seragam Kolese Jesuit',
    date: '25 Agustus 2026',
    monthKey: '7',
    category: 'Kualitas Kain & Shading Warna',
    badgeType: 'b2b-badge-product',
    severity: 'High',
    pic: '-',
    photo: 'asset/kolese jesuit.jpeg',
    photoThumb: 'asset/kolese jesuit.jpeg',
    mediaType: 'image',
    title: 'Perbedaan Tone Warna (Shading/Belang) Antar Potongan Kain Seragam',
    issue: 'Terdapat ketidaksesuaian tone warna (shading/belang) antar potongan kain seragam yang dikirim antar roll/lot bahan.',
    rootCause: '-',
    resolution: 'Pengecekan lot kain & penggantian bahan dengan lot warna yang seragam',
    status: 'Komplain Masuk',
    csat: '-'
  },
  {
    id: 'B2B-CMP-2026-073',
    customer: 'RSU Asia Padang (RSU Aisyah)',
    orderRef: 'Seragam Batik Rumah Sakit',
    date: '14 Juli 2026',
    monthKey: '6',
    category: 'Pewarnaan & Tone Motif Batik',
    badgeType: 'b2b-badge-product',
    severity: 'High',
    pic: '-',
    photo: 'asset/rsu asia padang.jpeg',
    photoThumb: 'asset/rsu asia padang.jpeg',
    mediaType: 'image',
    title: 'Perbedaan Warna Motif Seragam (Ada yang Kuning dan Hijau)',
    issue: 'Bajunya sudah diterima, tapi warnanya beda-beda yaa. Ada yang kuning dan ada yang hijau pada motif bagian depan seragam.',
    rootCause: '-',
    resolution: 'Pengecekan lot pencelupan & penyeragaman batch warna seragam',
    status: 'Komplain Masuk',
    csat: '-'
  }
];

// Database Monitoring Project B2B (21 Project: On-Time vs Keterlambatan Akibat Kendala Plangkan)
const b2bProjectsDatabase = [
  { id: 1, name: 'Bank SBI', pic: 'Tanto', category: 'Perbankan / Finansial', status: 'on-time', delayReason: '-', note: 'Produksi & delivery berjalan tepat waktu sesuai schedule.' },
  { id: 2, name: 'SD Baitul Hikmah', pic: 'Tanto', category: 'Institusi Pendidikan / Sekolah', status: 'on-time', delayReason: '-', note: 'Selesai tepat waktu, seragam tersalurkan dengan baik.' },
  { id: 3, name: 'PT PDI (PTPDI)', pic: 'Hanum', category: 'Korporat / Industri', status: 'delayed', delayReason: 'Kendala Plangkan', note: 'TERLAMBAT: Tertahan antrean & presisi screen plangkan cetak sablon batch 1.' },
  { id: 4, name: 'Smart Auladi', pic: 'Hanum', category: 'Institusi Pendidikan / Sekolah', status: 'delayed', delayReason: 'Kendala Plangkan', note: 'TERLAMBAT: Kendala pembuatan plangkan cetak motif seragam batik sekolah.' },
  { id: 5, name: 'EGS', pic: 'Hanum', category: 'Korporat / Service', status: 'on-time', delayReason: '-', note: 'Proses produksi on-track sesuai SPK.' },
  { id: 6, name: 'Buana Mitra (Housekeeping)', pic: 'Hanum', category: 'Hospitality & Facility', status: 'on-time', delayReason: '-', note: 'Finishing dan delivery tepat waktu.' },
  { id: 7, name: 'SDN Cipinang Melayu', pic: 'Tanto', category: 'Institusi Pendidikan / Sekolah', status: 'on-time', delayReason: '-', note: 'Pesanan seragam selesai tepat waktu.' },
  { id: 8, name: 'Kukubima', pic: 'Ibu Era', category: 'FMCG / Promosi', status: 'on-time', delayReason: '-', note: 'Order massal selesai sesuai jadwal deadline.' },
  { id: 9, name: 'IKN (Sample)', pic: 'Ibu Era', category: 'Pemerintahan / Mockup Sample', status: 'on-time', delayReason: '-', note: 'Sample motif IKN lolos kurasi tepat waktu.' },
  { id: 10, name: 'Multisari Indo Prima', pic: 'Ibu Era', category: 'Korporat / Distribusi', status: 'on-time', delayReason: '-', note: 'Produksi seragam aman sesuai kesepakatan PO.' },
  { id: 11, name: 'KAI Commuter', pic: 'Ibu Era', category: 'BUMN / Transportasi', status: 'on-time', delayReason: '-', note: 'Produksi seragam operasional on-schedule.' },
  { id: 12, name: 'Ibu Epieta', pic: 'Ibu Era', category: 'Personal / VIP Client', status: 'on-time', delayReason: '-', note: 'Pesanan busana custom selesai tepat waktu.' },
  { id: 13, name: 'Iris', pic: 'Ibu Era', category: 'Fashion Retail / Partner', status: 'on-time', delayReason: '-', note: 'Tahap penjahitan dan QC on-track.' },
  { id: 14, name: 'STIKEP PPNI', pic: 'Ibu Era', category: 'Institusi Pendidikan / Kesehatan', status: 'on-time', delayReason: '-', note: 'Seragam nakes mahasiswa selesai tepat waktu.' },
  { id: 15, name: 'Bapak Tamrin', pic: 'Ibu Era', category: 'Personal / Executive', status: 'on-time', delayReason: '-', note: 'Pesanan batik eksklusif selesai sesuai rencana.' },
  { id: 16, name: 'PT Integra Teknologi', pic: 'Vira', category: 'Teknologi & IT Solution', status: 'delayed', delayReason: 'Kendala Plangkan', note: 'TERLAMBAT: Kendala pembuatan plangkan presisi motif batik corporate identity.' },
  { id: 17, name: 'Organisasi Lansia', pic: 'Vira', category: 'Komunitas / Sosial', status: 'on-time', delayReason: '-', note: 'Proses produksi kain dan seragam lancar on-time.' },
  { id: 18, name: 'PT Miracle Adhitama', pic: 'Vira', category: 'Korporat Swasta', status: 'on-time', delayReason: '-', note: 'Jahitan dan finishing on-track sesuai SPK.' },
  { id: 19, name: 'DSM Firmenich', pic: 'Ibu Era', category: 'Multinasional / Industri', status: 'on-time', delayReason: '-', note: 'Selesai tepat waktu sesuai standar mutu sertifikasi.' },
  { id: 20, name: 'Nawir Tour', pic: 'Ibu Era', category: 'Travel & Umroh / Haji', status: 'on-time', delayReason: '-', note: 'Seragam jemaah terselesaikan on-time tanpa hambatan.' },
  { id: 21, name: 'PT Sucofindo', pic: 'Tim B2B / Ibu Era', category: 'BUMN / Pengujian & Inspeksi', status: 'delayed', delayReason: 'Kendala Plangkan', note: 'TERLAMBAT: Kendala plangkan cetak motif seragam BUMN, revisi ukuran screen cetak.' }
];

// Top Corporate Clients & Pipeline Performance Database
const b2bTopClients = [
  { client: 'PT Astra International Tbk', sector: 'Automotive & Holding', volume: 'Rp 685.400.000', orders: 4, status: 'Active VIP', growth: '+142% YoY' },
  { client: 'PT Bank Mandiri (Persero) Tbk', sector: 'Banking & Financial', volume: 'Rp 590.250.000', orders: 6, status: 'Active VIP', growth: '+98% YoY' },
  { client: 'PT Telekomunikasi Indonesia Tbk', sector: 'Telco & Digital', volume: 'Rp 448.600.000', orders: 3, status: 'Active VIP', growth: '+215% YoY' },
  { client: 'Dinas Pariwisata & Pemda', sector: 'Government & Public', volume: 'Rp 382.150.000', orders: 5, status: 'Active Recurring', growth: '+65% YoY' },
  { client: 'PT Pertamina Patra Niaga', sector: 'Energy & Logistics', volume: 'Rp 312.800.000', orders: 2, status: 'Active New Client', growth: 'New 2026' },
  { client: 'CV Nusantara Fashion Apparel', sector: 'Retail & Garment', volume: 'Rp 268.900.000', orders: 8, status: 'Active Wholesale', growth: '+45% YoY' }
];

// Main Dispatcher for B2B View
function renderB2BView() {
  const sub = state.activeSub || 'b2b-achievement';
  
  if (sub === 'b2b-comparison') {
    return renderB2BComparisonView();
  } else if (sub === 'b2b-complain') {
    return renderB2BComplainView();
  } else {
    return renderB2BAchievementView();
  }
}

// --------------------------------------------------------------------------
// SUB-VIEW 1: ACHIEVEMENT B2B
// --------------------------------------------------------------------------
function renderB2BAchievementView() {
  const selMonth = state.selectedSalesMonth || 'all';
  const isAll = selMonth === 'all';
  const mIdx = isAll ? 7 : parseInt(selMonth, 10);

  // Totals for 2026 Jan - Ags
  const totalTargetYTD = b2bDatabase.target2026.slice(0, 8).reduce((s, v) => s + v, 0); // Rp 3.960.000.000
  const totalAcvYTD = b2bDatabase.acv2026.slice(0, 8).reduce((s, v) => s + v, 0);       // Rp 2.885.932.921
  const totalCashYTD = b2bDatabase.cashIn2026.slice(0, 8).reduce((s, v) => s + v, 0);    // Rp 2.131.472.842
  const totalTargetFY = b2bDatabase.target2026.reduce((s, v) => s + v, 0);               // Rp 6.000.000.000
  const totalAcvFY2025 = b2bDatabase.acv2025.reduce((s, v) => s + v, 0);                 // Rp 2.659.742.404
  const totalAcv2025YTD = b2bDatabase.acv2025.slice(0, 8).reduce((s, v) => s + v, 0);   // Rp 1.402.798.530

  // Key stats
  const ytdAchvPct = ((totalAcvYTD / totalTargetYTD) * 100).toFixed(1);
  const fyAchvPct = ((totalAcvYTD / totalTargetFY) * 100).toFixed(1);
  const yoyGrowthYTD = (((totalAcvYTD - totalAcv2025YTD) / totalAcv2025YTD) * 100).toFixed(1);

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      
      <!-- Top Banner Header for 1-Year ACV Sales Monitoring -->
      <div class="b2b-banner" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%); border: 1px solid rgba(99, 102, 241, 0.35); padding: 22px 26px; border-radius: var(--radius-lg);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; width:100%;">
          <div>
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="background:linear-gradient(135deg, #6366F1, #10B981); width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px rgba(16,185,129,0.35);">
                <i data-lucide="line-chart" style="color:#FFF; width:24px; height:24px;"></i>
              </div>
              <div>
                <h2 class="b2b-banner-title" style="font-size:1.4rem; font-weight:900;">MONITORING ACV SALES B2B TAHUN 2026 (1 TAHUN PENUH)</h2>
                <div class="b2b-banner-sub">Evaluasi Realisasi Nilai Kontrak ACV Sales Sepanjang 12 Bulan (Januari – Desember 2026) vs Target & Baseline 2025</div>
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <button class="pill-btn active" onclick="triggerB2BCelebration()" style="background:linear-gradient(135deg, #10B981, #059669); border:none; padding:8px 16px; color:#FFF; font-weight:800; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <i data-lucide="party-popper" style="width:16px; height:16px;"></i> Rekor Ags: Rp 612,7 Jt!
            </button>
          </div>
        </div>

        <!-- Integrated Summary Pills Bar inside Banner (Clean & Easy to Read, No Box Cards) -->
        <div style="display:flex; align-items:center; flex-wrap:wrap; gap:12px; margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08); width:100%;">
          <div style="background:rgba(255,255,255,0.05); border:1px solid var(--border-color); padding:8px 14px; border-radius:8px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:700;">🎯 TARGET 1 TAHUN (FY 2026):</span>
            <strong style="color:#FFF; font-family:monospace; font-size:0.92rem;">Rp 6.000.000.000</strong>
          </div>

          <div style="background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); padding:8px 14px; border-radius:8px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:#A7F3D0; font-weight:700;">🏆 REALISASI YTD (JAN-AGS):</span>
            <strong style="color:#10B981; font-family:monospace; font-size:0.92rem;">Rp 2.885.932.921</strong>
            <span style="font-size:0.75rem; background:#10B981; color:#FFF; padding:2px 6px; border-radius:4px; font-weight:800;">${ytdAchvPct}% YTD</span>
          </div>

          <div style="background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.3); padding:8px 14px; border-radius:8px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:#FDE68A; font-weight:700;">🚀 PERTUMBUHAN YOY:</span>
            <strong style="color:var(--accent-gold); font-family:monospace; font-size:0.92rem;">+${yoyGrowthYTD}%</strong>
            <span style="font-size:0.72rem; color:var(--text-secondary);">(vs Jan-Ags 2025: Rp 1,40 M)</span>
          </div>

          <div style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3); padding:8px 14px; border-radius:8px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:#C7D2FE; font-weight:700;">⚡ CAPAIAN VS FULL YEAR 2025:</span>
            <strong style="color:#818CF8; font-family:monospace; font-size:0.92rem;">108.5%</strong>
            <span style="font-size:0.72rem; color:var(--text-secondary);">(Melampaui Total 2025 dalam 8 Bulan)</span>
          </div>
        </div>
      </div>

      <!-- Main Full-Width Annual 12-Month ACV Sales Chart Card -->
      <div class="b2b-chart-card" style="width:100%;">
        <div class="b2b-chart-title" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <i data-lucide="bar-chart-2" class="accent" style="width:22px; height:22px;"></i>
            <span style="font-size:1.05rem; font-weight:800;">Grafik ACV Sales B2B Selama 1 Tahun (Target Bulanan 2026 vs Realisasi 2026 vs Baseline 2025)</span>
          </div>
          <div style="display:flex; align-items:center; gap:16px; font-size:0.78rem; font-weight:700;">
            <span style="display:inline-flex; align-items:center; gap:6px; color:#10B981;">
              <span style="width:12px; height:12px; border-radius:3px; background:#10B981; display:inline-block;"></span> Realisasi ACV 2026 (Jan–Ags)
            </span>
            <span style="display:inline-flex; align-items:center; gap:6px; color:#818CF8;">
              <span style="width:12px; height:12px; border-radius:3px; background:rgba(99, 102, 241, 0.4); border:1px solid #818CF8; display:inline-block;"></span> Target ACV 2026 (12 Bulan)
            </span>
            <span style="display:inline-flex; align-items:center; gap:6px; color:var(--accent-gold);">
              <span style="width:12px; height:3px; background:var(--accent-gold); display:inline-block;"></span> ACV 2025 (Baseline YoY)
            </span>
          </div>
        </div>

        <div style="position:relative; height:360px; width:100%; margin-top:14px;">
          <canvas id="b2bAnnualAcvChart"></canvas>
        </div>

        <!-- Chart Quick Legend and Highlights Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-top:14px; padding:12px 18px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--border-color); font-size:0.78rem;">
          <div>
            <span style="color:var(--text-secondary);">Rata-rata ACV/Bulan (Jan-Ags):</span>
            <strong style="color:#10B981; margin-left:4px;">Rp 360,7 Juta</strong>
          </div>
          <div>
            <span style="color:var(--text-secondary);">Puncak Tertinggi 2026:</span>
            <strong style="color:#10B981; margin-left:4px;">Agustus (Rp 612,7 Jt • 145.9% Target) 🔥</strong>
          </div>
          <div>
            <span style="color:var(--text-secondary);">Sisa Target Capaian FY26:</span>
            <strong style="color:var(--accent-gold); margin-left:4px;">Rp 3.114.067.079 (Sep - Des)</strong>
          </div>
        </div>
      </div>

      <!-- Secondary Chart: Cumulative 1-Year ACV Trajectory Chart -->
      <div class="b2b-chart-card" style="width:100%;">
        <div class="b2b-chart-title">
          <i data-lucide="trending-up" class="accent" style="width:20px; height:20px;"></i>
          <span>Trajektori Akumulasi ACV Sales Menuju Target 1 Tahun (Rp 6,00 Miliar)</span>
        </div>
        <div style="position:relative; height:260px; width:100%; margin-top:10px;">
          <canvas id="b2bCumulativeAcvChart"></canvas>
        </div>
        <div style="display:flex; justify-content:center; gap:24px; margin-top:10px; font-size:0.76rem; color:var(--text-secondary);">
          <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; border-radius:2px; background:#10B981;"></span> Akumulasi Realisasi 2026 (Jan–Ags: Rp 2,89 M)</span>
          <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; border-radius:2px; background:rgba(99,102,241,0.6);"></span> Target Akumulatif 2026 (Jan–Des: Rp 6,00 M)</span>
          <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; border-radius:2px; background:#94A3B8;"></span> Akumulasi Realisasi 2025 (Full Year: Rp 2,66 M)</span>
        </div>
      </div>

      <!-- Detail Monthly ACV Sales Table (12 Months Complete Breakdown) -->
      <div class="b2b-table-card">
        <div class="b2b-table-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="table" style="color:#FFF; width:20px; height:20px;"></i>
            <h3>Tabel Rincian ACV Sales B2B Sepanjang 12 Bulan (Januari – Desember 2026)</h3>
          </div>
          <span style="font-size:0.78rem; background:rgba(255,255,255,0.15); padding:3px 10px; border-radius:12px; font-weight:700;">
            12 Bulan Komprehensif
          </span>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table" style="font-size:0.82rem;">
            <thead>
              <tr style="background:#111827; color:#FFF; border-bottom:2px solid var(--border-color);">
                <th>BULAN</th>
                <th style="text-align:right;">TARGET 2026</th>
                <th style="text-align:right; color:#10B981;">REALISASI ACV 2026</th>
                <th style="text-align:right; color:#06B6D4;">REALISASI CASH IN 2026</th>
                <th style="text-align:right; color:var(--accent-gold);">BASELINE ACV 2025</th>
                <th style="text-align:center;">PENCAPAIAN TARGET %</th>
                <th style="text-align:center;">PERTUMBUHAN YOY ACV</th>
                <th style="text-align:center;">STATUS BULAN</th>
              </tr>
            </thead>
            <tbody>
              ${[0,1,2,3,4,5,6,7,8,9,10,11].map(idx => {
                const target = b2bDatabase.target2026[idx];
                const acv = b2bDatabase.acv2026[idx];
                const cash = b2bDatabase.cashIn2026[idx];
                const acv25 = b2bDatabase.acv2025[idx];
                
                const isAug = (idx === 7);
                const isJul = (idx === 6);
                const isFuture = (idx >= 8);

                const achvAcv = acv > 0 ? ((acv / target) * 100).toFixed(1) + '%' : '-';
                
                let growthYoYStr = '-';
                if (acv > 0 && acv25 > 0) {
                  const g = (((acv - acv25) / acv25) * 100).toFixed(1);
                  growthYoYStr = (g >= 0 ? '+' : '') + g + '%';
                } else if (acv > 0 && acv25 === 0) {
                  growthYoYStr = '+100.0%';
                }

                let rowBg = '';
                if (isAug) rowBg = 'background: rgba(16, 185, 129, 0.12); border-left: 4px solid #10B981; font-weight: 700;';
                else if (isJul) rowBg = 'background: rgba(6, 182, 212, 0.12); border-left: 4px solid #06B6D4; font-weight: 600;';
                else if (isFuture) rowBg = 'opacity: 0.55;';

                return `
                  <tr style="${rowBg}">
                    <td>
                      ${isAug 
                        ? `<strong style="color:#10B981; display:inline-flex; align-items:center; gap:6px;"><i data-lucide="sparkles" style="width:14px; height:14px; color:#10B981;"></i> AGUSTUS (Data Baru ✨)</strong>`
                        : (isJul 
                            ? `<strong style="color:#06B6D4; display:inline-flex; align-items:center; gap:6px;"><i data-lucide="history" style="width:14px; height:14px; color:#06B6D4;"></i> JULI (History 📜)</strong>`
                            : `<strong>${b2bMonthNames[idx].toUpperCase()}</strong>`)
                      }
                    </td>
                    <td style="text-align:right; font-weight:600;">${formatRupiah(target)}</td>
                    <td style="text-align:right; color:#10B981; font-weight:800;">${acv > 0 ? formatRupiah(acv) : '<span style="color:var(--text-muted); font-size:0.75rem;">(Belum Berjalan)</span>'}</td>
                    <td style="text-align:right; color:#06B6D4; font-weight:700;">${cash > 0 ? formatRupiah(cash) : '-'}</td>
                    <td style="text-align:right; color:var(--text-secondary);">${formatRupiah(acv25)}</td>
                    <td style="text-align:center;">
                      ${acv > 0 ? `
                        <span class="status-pill ${parseFloat(achvAcv) >= 100 ? 'status-achieved' : (parseFloat(achvAcv) >= 70 ? 'status-on-track' : 'status-at-risk')}">
                          ${achvAcv}
                        </span>
                      ` : '-'}
                    </td>
                    <td style="text-align:center;">
                      ${growthYoYStr !== '-' ? `
                        <span class="status-pill ${growthYoYStr.startsWith('+') ? 'status-achieved' : 'status-at-risk'}">
                          ${growthYoYStr}
                        </span>
                      ` : '-'}
                    </td>
                    <td style="text-align:center;">
                      ${acv > 0 ? (
                        parseFloat(achvAcv) >= 100 
                          ? `<span style="background:rgba(16,185,129,0.15); color:#10B981; padding:3px 8px; border-radius:4px; font-weight:800; font-size:0.74rem;">SURPASS 🔥</span>`
                          : (parseFloat(achvAcv) >= 70 
                              ? `<span style="background:rgba(6,182,212,0.15); color:#06B6D4; padding:3px 8px; border-radius:4px; font-weight:700; font-size:0.74rem;">ON TRACK</span>`
                              : `<span style="background:rgba(244,63,94,0.15); color:#F43F5E; padding:3px 8px; border-radius:4px; font-weight:700; font-size:0.74rem;">UNDER TARGET</span>`)
                      ) : '<span style="color:var(--text-muted); font-size:0.75rem;">Proyeksi Q4</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}

              <!-- TOTAL YTD (JAN-AGS) ROW -->
              <tr style="background:rgba(16, 185, 129, 0.15); font-weight:800; border-top:2px solid #10B981;">
                <td style="color:#FFF;">TOTAL REALISASI YTD 2026 (JAN–AGS)</td>
                <td style="text-align:right; color:#FFF;">${formatRupiah(totalTargetYTD)}</td>
                <td style="text-align:right; color:#10B981; font-size:0.95rem;">${formatRupiah(totalAcvYTD)}</td>
                <td style="text-align:right; color:#06B6D4; font-size:0.95rem;">${formatRupiah(totalCashYTD)}</td>
                <td style="text-align:right; color:var(--text-secondary);">${formatRupiah(totalAcv2025YTD)}</td>
                <td style="text-align:center; color:#10B981; font-size:0.9rem;">${ytdAchvPct}%</td>
                <td style="text-align:center; color:#10B981; font-size:0.9rem;">+${yoyGrowthYTD}%</td>
                <td style="text-align:center;">
                  <span class="status-pill status-achieved">YTD ON-TRACK</span>
                </td>
              </tr>

              <!-- TOTAL FULL YEAR 2026 TARGET ROW -->
              <tr style="background:rgba(99, 102, 241, 0.15); font-weight:800; border-top:1px dashed #818CF8;">
                <td style="color:#C7D2FE;">TOTAL TARGET FULL YEAR 2026 (1 TAHUN)</td>
                <td style="text-align:right; color:#C7D2FE;">${formatRupiah(totalTargetFY)}</td>
                <td style="text-align:right; color:#10B981;">(Tercapai ${fyAchvPct}% dari Target FY)</td>
                <td style="text-align:right; color:#06B6D4;">-</td>
                <td style="text-align:right; color:var(--text-secondary);">${formatRupiah(totalAcvFY2025)}</td>
                <td style="text-align:center; color:var(--accent-gold);">${fyAchvPct}%</td>
                <td style="text-align:center; color:var(--accent-gold);">Sudah 108.5% Total 2025</td>
                <td style="text-align:center;">
                  <span style="color:#818CF8; font-size:0.75rem; font-weight:800;">TARGET Rp 6,00 M</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// --------------------------------------------------------------------------
// SUB-VIEW 2: PERBANDINGAN YOY (2025 vs 2026 ACV & CASH IN)
// --------------------------------------------------------------------------
function renderB2BComparisonView() {
  const totalTargetYTD = b2bDatabase.target2026.slice(0, 8).reduce((s, v) => s + v, 0); // 3.960.000.000
  const totalAcv26 = b2bDatabase.acv2026.slice(0, 8).reduce((s, v) => s + v, 0);       // 2.885.932.921
  const totalCash26 = b2bDatabase.cashIn2026.slice(0, 8).reduce((s, v) => s + v, 0);    // 2.131.472.842
  
  const totalAcv25JanAgs = b2bDatabase.acv2025.slice(0, 8).reduce((s, v) => s + v, 0);   // 1.402.798.530
  const totalCash25JanAgs = b2bDatabase.cashIn2025.slice(0, 8).reduce((s, v) => s + v, 0); // 470.958.666
  
  const totalAcv25Full = b2bDatabase.acv2025.reduce((s, v) => s + v, 0);                 // 2.659.742.404
  const totalCash25Full = b2bDatabase.cashIn2025.reduce((s, v) => s + v, 0);             // 1.624.985.985

  const yoyGrowthAcv = (((totalAcv26 - totalAcv25JanAgs) / totalAcv25JanAgs) * 100).toFixed(2);
  const yoyGrowthCash = (((totalCash26 - totalCash25JanAgs) / totalCash25JanAgs) * 100).toFixed(2);
  const exceedFY25Pct = (((totalAcv26 - totalAcv25Full) / totalAcv25Full) * 100).toFixed(1);

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      
      <!-- Top Banner Header for YoY Comparison -->
      <div class="b2b-banner" style="background: linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.06) 100%);">
        <div>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="background:linear-gradient(135deg, #8B5CF6, #6366F1); width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(139,92,246,0.3);">
              <i data-lucide="git-compare" style="color:#FFF; width:22px; height:22px;"></i>
            </div>
            <div>
              <h2 class="b2b-banner-title">PERBANDINGAN YOY B2B (2025 VS 2026)</h2>
              <div class="b2b-banner-sub">Analisis Komparatif Pertumbuhan Nilai Kontrak ACV Sales & Arus Kas Masuk (Cash In) Antar Tahun</div>
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <span class="status-pill status-achieved" style="font-size:0.85rem; padding:6px 14px; background:rgba(16,185,129,0.15); color:#059669; border:1px solid #10B981;">
            <i data-lucide="rocket" style="width:16px; height:16px;"></i> +${yoyGrowthAcv}% Pertumbuhan ACV
          </span>
        </div>
      </div>

      <!-- Comparison Metrics Header Grid -->
      <div class="b2b-achievement-grid">
        <!-- ACV Growth Card -->
        <div class="b2b-achievement-card" style="border-left:4px solid #059669;">
          <div class="b2b-card-label">YOY GROWTH ACV SALES (JAN-AGS)</div>
          <div class="b2b-card-value" style="color:#059669;">+${yoyGrowthAcv}%</div>
          <div class="b2b-card-trend positive">
            <i data-lucide="trending-up" style="width:14px; height:14px;"></i>
            <span>2026: Rp 2,88 M vs 2025: Rp 1,40 M</span>
          </div>
          <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:6px;">Pertumbuhan nominal: <strong>+Rp 1.483.134.391</strong></div>
        </div>

        <!-- Cash In Growth Card -->
        <div class="b2b-achievement-card" style="border-left:4px solid #0284C7;">
          <div class="b2b-card-label">YOY GROWTH CASH IN (JAN-AGS)</div>
          <div class="b2b-card-value" style="color:#0284C7;">+${yoyGrowthCash}%</div>
          <div class="b2b-card-trend positive">
            <i data-lucide="trending-up" style="width:14px; height:14px;"></i>
            <span>2026: Rp 2,13 M vs 2025: Rp 470,95 Jt</span>
          </div>
          <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:6px;">Kenaikan arus kas: <strong>+Rp 1.660.514.176</strong></div>
        </div>

        <!-- Milestone Over FY 2025 Card -->
        <div class="b2b-achievement-card" style="border-left:4px solid var(--accent-gold);">
          <div class="b2b-card-label">MELAMPAUI FULL YEAR 2025</div>
          <div class="b2b-card-value" style="color:var(--accent-gold);">108.5%</div>
          <div class="b2b-card-trend positive">
            <i data-lucide="check-circle-2" style="width:14px; height:14px;"></i>
            <span>Hanya dalam 8 Bulan (Jan-Ags 2026)</span>
          </div>
          <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:6px;">FY25 ACV: Rp 2,66 M terlampaui di Agustus!</div>
        </div>

        <!-- Cash In FY 2025 Overpass Card -->
        <div class="b2b-achievement-card" style="border-left:4px solid #8B5CF6;">
          <div class="b2b-card-label">CASH IN VS FULL YEAR 2025</div>
          <div class="b2b-card-value" style="color:#7C3AED;">131.2%</div>
          <div class="b2b-card-trend positive">
            <i data-lucide="check-check" style="width:14px; height:14px;"></i>
            <span>Total FY25: Rp 1,62 M</span>
          </div>
          <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:6px;">Surplus kas terkumpul: <strong>+Rp 506 Jt</strong></div>
        </div>
      </div>

      <!-- YoY Comparison Interactive Charts -->
      <div class="b2b-chart-section">
        <!-- Chart 1: YoY ACV Sales Comparison (2025 vs 2026) -->
        <div class="b2b-chart-card">
          <div class="b2b-chart-title">
            <i data-lucide="bar-chart-2" class="accent"></i>
            <span>Perbandingan ACV Sales 2025 vs 2026 (Januari - Agustus)</span>
          </div>
          <div style="position:relative; height:280px; width:100%;">
            <canvas id="b2bYoYAcvChart"></canvas>
          </div>
          <div style="display:flex; justify-content:center; gap:20px; margin-top:10px; font-size:0.75rem; color:var(--text-secondary);">
            <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; border-radius:2px; background:#94A3B8;"></span> 2025 ACV Sales</span>
            <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; border-radius:2px; background:#059669;"></span> 2026 ACV Sales (+105.7%)</span>
          </div>
        </div>

        <!-- Chart 2: YoY Cash In Comparison (2025 vs 2026) -->
        <div class="b2b-chart-card">
          <div class="b2b-chart-title">
            <i data-lucide="wallet" class="accent"></i>
            <span>Perbandingan Realisasi Cash In 2025 vs 2026 (Januari - Agustus)</span>
          </div>
          <div style="position:relative; height:280px; width:100%;">
            <canvas id="b2bYoYCashChart"></canvas>
          </div>
          <div style="display:flex; justify-content:center; gap:20px; margin-top:10px; font-size:0.75rem; color:var(--text-secondary);">
            <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; border-radius:2px; background:#94A3B8;"></span> 2025 Cash In</span>
            <span style="display:inline-flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; border-radius:2px; background:#0284C7;"></span> 2026 Cash In (+352.6%)</span>
          </div>
        </div>
      </div>

      <!-- Master Full Year YoY Side-by-Side Table (12 Months) -->
      <div class="b2b-table-card">
        <div class="b2b-table-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="calendar-range" style="color:#FFF; width:20px; height:20px;"></i>
            <h3>Tabel Komparasi Lengkap B2B YTD: ACV & Cash In (2025 vs 2026)</h3>
          </div>
          <span style="font-size:0.78rem; background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:12px; font-weight:700; color:#FFF;">
            12 Bulan Komprehensif
          </span>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table" style="font-size:0.82rem;">
            <thead>
              <tr style="background:#111827; color:#FFF; border-bottom:2px solid var(--border-color);">
                <th>BULAN</th>
                <th style="text-align:right;">TARGET 2026</th>
                <th style="text-align:right;">2025 ACV SALES</th>
                <th style="text-align:right;">2025 CASH IN</th>
                <th style="text-align:right; color:#10B981;">2026 ACV SALES</th>
                <th style="text-align:right; color:#06B6D4;">2026 CASH IN</th>
                <th style="text-align:center;">ACHV ACV %</th>
                <th style="text-align:center;">ACHV CASH %</th>
                <th style="text-align:center;">GROWTH YOY ACV</th>
                <th style="text-align:center;">GROWTH YOY CASH</th>
              </tr>
            </thead>
            <tbody>
              ${[0,1,2,3,4,5,6,7,8,9,10,11].map(idx => {
                const target = b2bDatabase.target2026[idx];
                const acv25 = b2bDatabase.acv2025[idx];
                const cash25 = b2bDatabase.cashIn2025[idx];
                const acv26 = b2bDatabase.acv2026[idx];
                const cash26 = b2bDatabase.cashIn2026[idx];

                const isAgustus = (idx === 7);
                const isJuli = (idx === 6);
                const isFuture = (idx >= 8);

                const achvAcv = acv26 > 0 ? ((acv26 / target) * 100).toFixed(2) + '%' : '-';
                const achvCash = cash26 > 0 ? ((cash26 / target) * 100).toFixed(2) + '%' : '-';
                
                let growthAcvStr = '-';
                if (acv26 > 0 && acv25 > 0) {
                  const g = (((acv26 - acv25) / acv25) * 100).toFixed(1);
                  growthAcvStr = (g >= 0 ? '+' : '') + g + '%';
                } else if (acv26 > 0 && acv25 === 0) {
                  growthAcvStr = '+100.0%';
                }

                let growthCashStr = '-';
                if (cash26 > 0 && cash25 > 0) {
                  const g = (((cash26 - cash25) / cash25) * 100).toFixed(1);
                  growthCashStr = (g >= 0 ? '+' : '') + g + '%';
                } else if (cash26 > 0 && cash25 === 0) {
                  growthCashStr = '+100.0%';
                }

                let rowStyle = '';
                if (isAgustus) rowStyle = 'background: rgba(16, 185, 129, 0.12); border-left: 4px solid #10B981; font-weight: 700;';
                else if (isJuli) rowStyle = 'background: rgba(6, 182, 212, 0.12); border-left: 4px solid #06B6D4; font-weight: 600;';
                else if (isFuture) rowStyle = 'opacity: 0.5;';

                return `
                  <tr style="${rowStyle}">
                    <td>
                      ${isAgustus 
                        ? `<strong style="color: #10B981; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="sparkles" style="width:14px; height:14px; color:#10B981;"></i> AGUSTUS</strong>`
                        : (isJuli 
                            ? `<strong style="color: #06B6D4; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="history" style="width:14px; height:14px; color:#06B6D4;"></i> JULI</strong>`
                            : `<strong>${b2bMonthNames[idx].toUpperCase()}</strong>`)
                      }
                    </td>
                    <td style="text-align:right;">${formatRupiah(target)}</td>
                    <td style="text-align:right;">${acv25 > 0 ? formatRupiah(acv25) : '-'}</td>
                    <td style="text-align:right;">${cash25 > 0 ? formatRupiah(cash25) : '-'}</td>
                    <td style="text-align:right; color:#10B981; font-weight:${acv26 > 0 ? '800' : '400'};">${acv26 > 0 ? formatRupiah(acv26) : '-'}</td>
                    <td style="text-align:right; color:#06B6D4; font-weight:${cash26 > 0 ? '800' : '400'};">${cash26 > 0 ? formatRupiah(cash26) : '-'}</td>
                    <td style="text-align:center;">
                      ${acv26 > 0 
                        ? `<span class="status-pill ${parseFloat(achvAcv) >= 70 ? 'status-achieved' : (parseFloat(achvAcv) >= 50 ? 'status-on-track' : 'status-at-risk')}">${achvAcv}</span>` 
                        : '-'}
                    </td>
                    <td style="text-align:center;">
                      ${cash26 > 0 
                        ? `<span class="status-pill ${parseFloat(achvCash) >= 70 ? 'status-achieved' : (parseFloat(achvCash) >= 50 ? 'status-on-track' : 'status-at-risk')}">${achvCash}</span>` 
                        : '-'}
                    </td>
                    <td style="text-align:center;">
                      ${growthAcvStr !== '-' 
                        ? `<span class="status-pill ${growthAcvStr.startsWith('+') ? 'status-achieved' : 'status-at-risk'}">${growthAcvStr}</span>` 
                        : '-'}
                    </td>
                    <td style="text-align:center;">
                      ${growthCashStr !== '-' 
                        ? `<span class="status-pill ${growthCashStr.startsWith('+') ? 'status-achieved' : 'status-at-risk'}">${growthCashStr}</span>` 
                        : '-'}
                    </td>
                  </tr>
                `;
              }).join('')}

              <!-- TOTAL YTD (JAN-AGS) ROW -->
              <tr style="background: rgba(79, 70, 229, 0.18); font-weight: 800; border-top: 2px solid #818CF8;">
                <td style="color: #FFF;">TOTAL YTD (JAN-AGS)</td>
                <td style="text-align:right; color:#FFF;">${formatRupiah(totalTargetYTD)}</td>
                <td style="text-align:right; color:#FFF;">${formatRupiah(totalAcv25JanAgs)}</td>
                <td style="text-align:right; color:#FFF;">${formatRupiah(totalCash25JanAgs)}</td>
                <td style="text-align:right; color:#10B981; font-size:0.95rem;">${formatRupiah(totalAcv26)}</td>
                <td style="text-align:right; color:#06B6D4; font-size:0.95rem;">${formatRupiah(totalCash26)}</td>
                <td style="text-align:center; color:#10B981; font-weight:800;">72.88%</td>
                <td style="text-align:center; color:#06B6D4; font-weight:800;">53.83%</td>
                <td style="text-align:center; color:#10B981; font-weight:800;">+105.73%</td>
                <td style="text-align:center; color:#06B6D4; font-weight:800;">+352.58%</td>
              </tr>

              <!-- TOTAL FULL YEAR 2025 BASELINE ROW -->
              <tr style="background: rgba(255, 255, 255, 0.04); font-weight: 700;">
                <td style="color: var(--text-secondary);">BASELINE FULL YEAR 2025</td>
                <td style="text-align:right;">-</td>
                <td style="text-align:right; color:#FFF;">${formatRupiah(totalAcv25Full)}</td>
                <td style="text-align:right; color:#FFF;">${formatRupiah(totalCash25Full)}</td>
                <td style="text-align:right; color:var(--accent-gold); font-weight:800;">(Sudah 108.5% FY25)</td>
                <td style="text-align:right; color:#A78BFA; font-weight:800;">(Sudah 131.2% FY25)</td>
                <td style="text-align:center;">-</td>
                <td style="text-align:center;">-</td>
                <td style="text-align:center;">-</td>
                <td style="text-align:center;">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// SUB-VIEW 3: COMPLAIN B2B & ANALISIS KETERLAMBATAN PROJECT (KENDALA PLANGKAN)
// --------------------------------------------------------------------------
function renderB2BComplainView() {
  const tickets = b2bComplainTickets;
  const totalTickets = tickets.length;
  const projects = b2bProjectsDatabase;
  const totalProjects = projects.length; // 21
  const delayedProjects = projects.filter(p => p.status === 'delayed'); // 4
  const onTimeProjects = projects.filter(p => p.status === 'on-time'); // 17
  const onTimeCount = onTimeProjects.length;
  const delayedCount = delayedProjects.length;
  const onTimePct = ((onTimeCount / totalProjects) * 100).toFixed(1); // 81.0%
  const delayedPct = ((delayedCount / totalProjects) * 100).toFixed(1); // 19.0%

  return `
    <div style="display:flex; flex-direction:column; gap:24px;">
      
      <!-- ================================================================= -->
      <!-- BAGIAN 1: MONITORING DELIVERY PROJECT B2B & KENDALA PLANGKAN     -->
      <!-- ================================================================= -->
      
      <!-- Top Banner for Project Delivery & Plangkan Delay Analysis -->
      <div class="b2b-project-banner">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%; flex-wrap:wrap; gap:14px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="background:linear-gradient(135deg, #EF4444, #6366F1); width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px rgba(239,68,68,0.35);">
              <i data-lucide="package-check" style="color:#FFF; width:24px; height:24px;"></i>
            </div>
            <div>
              <h2 class="b2b-banner-title" style="font-size:1.35rem; font-weight:900; background:linear-gradient(90deg, #F87171 0%, #A5B4FC 50%, #34D399 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
                MONITORING DELIVERY PROJECT B2B & ANALISIS KETERLAMBATAN
              </h2>
              <div class="b2b-banner-sub">
                Evaluasi Ketepatan Waktu Pengiriman (On-Time Delivery), Rasio Presentasi Project, serta Analisis 4 Project Telat karena Kendala Plangkan Cetak
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <span style="background:rgba(239,68,68,0.18); border:1px solid rgba(239,68,68,0.4); color:#FECACA; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.8rem; display:flex; align-items:center; gap:6px;">
              <i data-lucide="alert-triangle" style="width:16px; height:16px; color:#EF4444;"></i>
              4 Project Telat (Kendala Plangkan)
            </span>
            <span style="background:rgba(16,185,129,0.18); border:1px solid rgba(16,185,129,0.4); color:#A7F3D0; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.8rem; display:flex; align-items:center; gap:6px;">
              <i data-lucide="check-circle" style="width:16px; height:16px; color:#10B981;"></i>
              17 Project Tepat Waktu (81.0%)
            </span>
          </div>
        </div>

        <!-- Quick Highlight Strip inside Banner -->
        <div style="display:flex; align-items:center; flex-wrap:wrap; gap:12px; margin-top:16px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.08); font-size:0.8rem;">
          <span style="color:var(--text-secondary); font-weight:700;">📊 Rasio Presentasi OTD:</span>
          <strong style="color:#10B981; font-family:monospace; font-size:0.95rem;">${onTimePct}% On-Time</strong>
          <span style="color:var(--text-secondary);">vs</span>
          <strong style="color:#EF4444; font-family:monospace; font-size:0.95rem;">${delayedPct}% Telat (Plangkan)</strong>
          <span style="color:var(--text-secondary); margin-left:8px;">• Total Portofolio: <strong>21 Project</strong> (Catatan 20 Project + PT Sucofindo)</span>
        </div>
      </div>

      <!-- 4 Project Scorecards -->
      <div class="b2b-project-kpi-grid">
        <!-- Card 1: Total Projects -->
        <div class="b2b-project-kpi-card portfolio">
          <div class="b2b-project-kpi-label">TOTAL PROJECT B2B</div>
          <div class="b2b-project-kpi-value" style="color:var(--accent-gold);">${totalProjects}</div>
          <div class="b2b-project-kpi-sub">
            <i data-lucide="folder-kanban" style="width:14px; height:14px; color:var(--accent-gold);"></i>
            <span>Portofolio Aktif 2026 (5 PIC)</span>
          </div>
        </div>

        <!-- Card 2: On-Time Projects -->
        <div class="b2b-project-kpi-card ontime">
          <div class="b2b-project-kpi-label">TEPAT WAKTU (ON-TIME)</div>
          <div class="b2b-project-kpi-value" style="color:#10B981;">${onTimeCount} <span style="font-size:1rem; font-weight:700; color:#A7F3D0;">(${onTimePct}%)</span></div>
          <div class="b2b-project-kpi-sub">
            <i data-lucide="check-circle-2" style="width:14px; height:14px; color:#10B981;"></i>
            <span>Timeline Sesuai Target</span>
          </div>
        </div>

        <!-- Card 3: Delayed Projects -->
        <div class="b2b-project-kpi-card delayed">
          <div class="b2b-project-kpi-label">TELAT (KENDALA PLANGKAN)</div>
          <div class="b2b-project-kpi-value" style="color:#EF4444;">${delayedCount} <span style="font-size:1rem; font-weight:700; color:#FECACA;">(${delayedPct}%)</span></div>
          <div class="b2b-project-kpi-sub">
            <i data-lucide="clock-alert" style="width:14px; height:14px; color:#EF4444;"></i>
            <span>Smart Auladi, Sucofindo, Integra, PDI</span>
          </div>
        </div>

        <!-- Card 4: Ratio Presentation -->
        <div class="b2b-project-kpi-card ratio">
          <div class="b2b-project-kpi-label">RASIO KETEPATAN DELIVERY</div>
          <div class="b2b-project-kpi-value" style="color:#818CF8;">${onTimePct}%</div>
          <div class="b2b-project-kpi-sub">
            <i data-lucide="percent" style="width:14px; height:14px; color:#818CF8;"></i>
            <span>On-Time Delivery Rate (OTD)</span>
          </div>
        </div>
      </div>

      <!-- Dual Charts: Donut Ratio & Bar PIC Distribution -->
      <div class="b2b-charts-dual">
        <!-- Chart 1: Donut Ratio -->
        <div class="b2b-chart-card">
          <div class="b2b-chart-title">
            <div style="display:flex; align-items:center; gap:8px;">
              <i data-lucide="pie-chart" class="accent" style="width:20px; height:20px;"></i>
              <span style="font-size:0.95rem; font-weight:800;">Rasio Presentasi Ketepatan Waktu Project B2B</span>
            </div>
            <span style="font-size:0.75rem; background:rgba(99,102,241,0.15); color:#C7D2FE; padding:3px 10px; border-radius:12px; font-weight:700;">
              21 Project
            </span>
          </div>
          <div style="position:relative; height:260px; width:100%; margin-top:8px;">
            <canvas id="b2bProjectRatioChart"></canvas>
            <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; padding-bottom:40px;">
              <div style="font-size:1.6rem; font-weight:900; color:#10B981; font-family:'Outfit', sans-serif;">81.0%</div>
              <div style="font-size:0.7rem; color:var(--text-secondary); font-weight:700;">ON-TIME</div>
            </div>
          </div>
          <div style="display:flex; justify-content:center; gap:20px; margin-top:8px; font-size:0.76rem; border-top:1px solid var(--border-color); padding-top:10px;">
            <span style="display:inline-flex; align-items:center; gap:6px;">
              <span style="width:10px; height:10px; border-radius:2px; background:#10B981;"></span>
              <strong>17 Project Tepat Waktu (81.0%)</strong>
            </span>
            <span style="display:inline-flex; align-items:center; gap:6px;">
              <span style="width:10px; height:10px; border-radius:2px; background:#EF4444;"></span>
              <strong>4 Project Telat (19.0%)</strong>
            </span>
          </div>
        </div>

        <!-- Chart 2: PIC Distribution Bar Chart -->
        <div class="b2b-chart-card">
          <div class="b2b-chart-title">
            <div style="display:flex; align-items:center; gap:8px;">
              <i data-lucide="users" class="accent" style="width:20px; height:20px;"></i>
              <span style="font-size:0.95rem; font-weight:800;">Distribusi Status Project per PIC Sales / BD</span>
            </div>
            <span style="font-size:0.75rem; background:rgba(16,185,129,0.15); color:#A7F3D0; padding:3px 10px; border-radius:12px; font-weight:700;">
              On-Time vs Telat
            </span>
          </div>
          <div style="position:relative; height:260px; width:100%; margin-top:8px;">
            <canvas id="b2bProjectPicChart"></canvas>
          </div>
          <div style="display:flex; justify-content:space-around; margin-top:8px; font-size:0.74rem; color:var(--text-secondary); border-top:1px solid var(--border-color); padding-top:10px;">
            <span>Ibu Era: <strong>9 On-Time (100%)</strong></span>
            <span>Hanum: <strong>2 On / 2 Telat</strong></span>
            <span>Tanto: <strong>3 On-Time (100%)</strong></span>
            <span>Vira: <strong>2 On / 1 Telat</strong></span>
          </div>
        </div>
      </div>

      <!-- Dedicated Investigation & Root Cause Box for 4 Delayed Projects -->
      <div class="b2b-plangkan-box">
        <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="b2b-plangkan-tag"><i data-lucide="alert-octagon" style="width:12px; height:12px;"></i> INVESTIGASI ROOT CAUSE</span>
              <h3 style="margin:0; font-size:1.1rem; font-weight:900; color:#FFF;">Detail 4 Project Telat Akibat Kendala Plangkan Cetak / Sablon</h3>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">
              Akar masalah keterlambatan teridentifikasi spesifik pada tahap <strong>pembuatan screen plangkan (cetakan batik/sablon)</strong>, bukan karena hambatan sales/penjahitan.
            </div>
          </div>
          <div style="background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.4); padding:4px 12px; border-radius:8px; font-size:0.75rem; color:#FCA5A5; font-weight:800;">
            Bottleneck: Screen Plangkan Printing
          </div>
        </div>

        <!-- 4 Delayed Projects Cards Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
          <!-- 1. Smart Auladi -->
          <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:12px 14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-weight:900; color:#FFF; font-size:0.9rem;">1. Smart Auladi</span>
              <span class="b2b-pic-pill"><i data-lucide="user" style="width:10px; height:10px;"></i> Hanum</span>
            </div>
            <div style="font-size:0.74rem; color:#F87171; font-weight:700; margin-bottom:4px;">Kendala: Plangkan Seragam Sekolah</div>
            <div style="font-size:0.72rem; color:var(--text-secondary); line-height:1.4;">
              Tertahan antrean pembuatan & presisi plangkan cetak motif batik logo sekolah. Proses perbaikan plat sedang dipercepat.
            </div>
          </div>

          <!-- 2. PT Sucofindo -->
          <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:12px 14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-weight:900; color:#FFF; font-size:0.9rem;">2. PT Sucofindo</span>
              <span class="b2b-pic-pill"><i data-lucide="user" style="width:10px; height:10px;"></i> Tim B2B / Ibu Era</span>
            </div>
            <div style="font-size:0.74rem; color:#F87171; font-weight:700; margin-bottom:4px;">Kendala: Plangkan Seragam BUMN</div>
            <div style="font-size:0.72rem; color:var(--text-secondary); line-height:1.4;">
              Revisi dimensi ukuran screen plangkan cetak batik korporat Sucofindo untuk menjaga kerapian logo instansi.
            </div>
          </div>

          <!-- 3. PT Integra Teknologi -->
          <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:12px 14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-weight:900; color:#FFF; font-size:0.9rem;">3. PT Integra Teknologi</span>
              <span class="b2b-pic-pill"><i data-lucide="user" style="width:10px; height:10px;"></i> Vira</span>
            </div>
            <div style="font-size:0.74rem; color:#F87171; font-weight:700; margin-bottom:4px;">Kendala: Plangkan Pola Batik IT</div>
            <div style="font-size:0.72rem; color:var(--text-secondary); line-height:1.4;">
              Pengerjaan plangkan cetak batik custom mengalami keterlambatan cetak awal; screen telah selesai direvisi dan masuk meja sablon.
            </div>
          </div>

          <!-- 4. PT PDI (PTPDI) -->
          <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:12px 14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-weight:900; color:#FFF; font-size:0.9rem;">4. PT PDI (PTPDI 1)</span>
              <span class="b2b-pic-pill"><i data-lucide="user" style="width:10px; height:10px;"></i> Hanum</span>
            </div>
            <div style="font-size:0.74rem; color:#F87171; font-weight:700; margin-bottom:4px;">Kendala: Plangkan Screen Batch 1</div>
            <div style="font-size:0.72rem; color:var(--text-secondary); line-height:1.4;">
              Antrean screen plangkan cetak sablon batch 1 tertunda; sedang dialokasikan meja cetak prioritas untuk kejar deadline.
            </div>
          </div>
        </div>

        <!-- Action Plan Note -->
        <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(239,68,68,0.2); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; font-size:0.76rem;">
          <div style="display:flex; align-items:center; gap:6px; color:#FDE68A;">
            <i data-lucide="lightbulb" style="width:15px; height:15px; color:var(--accent-gold);"></i>
            <span><strong>Rencana Solusi:</strong> Alokasi meja sablon prioritas, penambahan operator screen plangkan, dan QC cetak presisi langsung di workshop.</span>
          </div>
          <span style="color:#A7F3D0; font-weight:800;">Target Penyelesaian: 3–5 Hari Kerja</span>
        </div>
      </div>

      <!-- Section Label: Complete 21 Projects Table -->
      <div class="b2b-section-label" style="margin-top:4px;">
        <i data-lucide="list-checks" style="width:16px; height:16px;"></i>
        <span>TABEL MONITORING 21 PROJECT B2B (FILTER & STATUS KETEPATAN WAKTU)</span>
      </div>

      <!-- Filter Controls Bar -->
      <div class="b2b-filter-bar">
        <div class="b2b-filter-group">
          <span style="font-size:0.76rem; color:var(--text-secondary); font-weight:700; margin-right:4px;">Status Delivery:</span>
          <button class="b2b-filter-btn active" id="filterBtnAll" onclick="setB2BProjectStatusFilter('all')">
            Semua Project (${totalProjects})
          </button>
          <button class="b2b-filter-btn" id="filterBtnOnTime" onclick="setB2BProjectStatusFilter('on-time')" style="border-color:rgba(16,185,129,0.3);">
            <span style="color:#10B981;">●</span> Tepat Waktu (${onTimeCount})
          </button>
          <button class="b2b-filter-btn" id="filterBtnDelayed" onclick="setB2BProjectStatusFilter('delayed')" style="border-color:rgba(239,68,68,0.3);">
            <span style="color:#EF4444;">●</span> Telat Plangkan (${delayedCount})
          </button>
        </div>

        <div class="b2b-search-box">
          <i data-lucide="search" style="width:14px; height:14px; color:var(--text-secondary);"></i>
          <input type="text" id="b2bProjectSearchInput" placeholder="Cari project atau PIC..." oninput="filterB2BProjectSearch(this.value)" />
        </div>
      </div>

      <!-- Interactive 21 Projects Table -->
      <div class="b2b-table-card">
        <div class="b2b-table-header" style="background: linear-gradient(90deg, #1E1B4B 0%, #312E81 50%, #1E293B 100%);">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="table" style="color:#FFF; width:20px; height:20px;"></i>
            <h3>Daftar Portofolio 21 Project B2B & Status Pengiriman</h3>
          </div>
          <span style="font-size:0.78rem; background:rgba(255,255,255,0.15); color:#FFF; padding:3px 10px; border-radius:12px; font-weight:700;">
            17 On-Time • 4 Telat
          </span>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table" style="font-size:0.82rem;">
            <thead>
              <tr style="background:#111827; border-bottom:2px solid var(--border-color);">
                <th style="width:48px; text-align:center;">NO</th>
                <th>NAMA PROJECT / KLIEN</th>
                <th style="width:140px;">PIC SALES</th>
                <th style="width:170px;">STATUS TIMELINE</th>
                <th style="width:230px;">KENDALA / CATATAN AKAR MASALAH</th>
                <th>PROGRESS DETAIL</th>
              </tr>
            </thead>
            <tbody id="b2bProjectsTableBody">
              ${projects.map((p, idx) => {
                const isDelayed = p.status === 'delayed';
                const rowBg = isDelayed ? 'background: rgba(239, 68, 68, 0.08); border-left: 4px solid #EF4444;' : '';
                return `
                  <tr style="${rowBg}">
                    <td style="text-align:center; font-weight:700; color:var(--text-secondary);">${idx + 1}</td>
                    <td>
                      <div style="font-weight:800; color:#FFF; font-size:0.88rem; display:flex; align-items:center; gap:8px;">
                        ${p.name}
                        ${isDelayed ? '<span style="font-size:0.65rem; background:#EF4444; color:#FFF; padding:1px 6px; border-radius:4px; font-weight:800;">TELAT</span>' : ''}
                      </div>
                      <div style="font-size:0.72rem; color:var(--text-secondary);">${p.category}</div>
                    </td>
                    <td>
                      <span class="b2b-pic-pill"><i data-lucide="user" style="width:11px; height:11px;"></i> ${p.pic}</span>
                    </td>
                    <td>
                      ${isDelayed 
                        ? '<span class="b2b-plangkan-tag"><i data-lucide="clock-alert" style="width:12px; height:12px;"></i> TELAT (PLANGKAN)</span>' 
                        : '<span class="b2b-ontime-tag"><i data-lucide="check-circle-2" style="width:12px; height:12px;"></i> TEPAT WAKTU</span>'}
                    </td>
                    <td style="color:${isDelayed ? '#F87171' : 'var(--text-secondary)'}; font-size:0.78rem;">
                      ${isDelayed ? '<strong style="color:#EF4444;">Kendala Plangkan</strong> (Screen Cetak Sablon)' : '<span style="color:#10B981;">Sesuai Timeline</span>'}
                    </td>
                    <td style="font-size:0.78rem; color:${isDelayed ? '#FECACA' : 'var(--text-secondary)'};">
                      ${p.note}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- BAGIAN 2: DATA KOMPLAIN CUSTOMER B2B (FOTO & VIDEO DOKUMENTASI)   -->
      <!-- ================================================================= -->
      
      <!-- Top Banner for B2B Complain Management -->
      <div class="b2b-banner" style="background: linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(99,102,241,0.06) 100%); border-color:rgba(239,68,68,0.25); margin-top:10px;">
        <div style="display:flex; align-items:center; justify-content:space-between; width:100%; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="background:linear-gradient(135deg, #EF4444, #DC2626); width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(239,68,68,0.3);">
              <i data-lucide="video" style="color:#FFF; width:22px; height:22px;"></i>
            </div>
            <div>
              <h2 class="b2b-banner-title" style="background: linear-gradient(90deg, #DC2626 0%, #E11D48 50%, #4F46E5 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
                DATA KOMPLAIN CUSTOMER B2B & BUKTI DOKUMENTASI (FOTO & VIDEO)
              </h2>
              <div class="b2b-banner-sub">Monitoring Tiket Penanganan Keluhan Klien Korporat, Investigasi QC, & Bukti Visual Foto/Video Produk</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; background:rgba(239,68,68,0.15); padding:6px 14px; border-radius:8px; border:1px solid rgba(239,68,68,0.3);">
            <i data-lucide="alert-circle" style="width:16px; height:16px; color:#EF4444;"></i>
            <span style="font-size:0.8rem; font-weight:800; color:#FFF;">${totalTickets} Tiket Komplain Masuk</span>
          </div>
        </div>
      </div>

      <!-- Complaint KPI Summary Bar -->
      <div class="b2b-complain-summary" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        <div class="b2b-complain-stat">
          <div class="b2b-complain-stat-value" style="color:#DC2626;">${totalTickets}</div>
          <div class="b2b-complain-stat-label">TOTAL DATA KOMPLAIN</div>
        </div>
        <div class="b2b-divider-v"></div>
        <div class="b2b-complain-stat">
          <div class="b2b-complain-stat-value" style="color:#059669;">${totalTickets}</div>
          <div class="b2b-complain-stat-label">DOKUMENTASI FOTO & VIDEO</div>
        </div>
        <div class="b2b-divider-v"></div>
        <div class="b2b-complain-stat">
          <div class="b2b-complain-stat-value" style="color:#2563EB;">&lt; 24 Jam</div>
          <div class="b2b-complain-stat-label">AVG RESPONSE TIME</div>
        </div>
      </div>

      <!-- Section Label: Photo & Video Evidence Gallery -->
      <div class="b2b-section-label">
        <i data-lucide="clapperboard" style="width:16px; height:16px;"></i>
        <span>GALERI BUKTI DOKUMENTASI KOMPLAIN (KLIK UNTUK LIHAT DETAIL KOMPLAIN)</span>
      </div>

      <!-- Photo/Video Cards Grid -->
      <div class="b2b-photo-gallery">
        ${tickets.length > 0 ? tickets.map(t => {
          const isVideo = t.mediaType === 'video' || (t.photo && t.photo.endsWith('.mp4'));
          return `
          <div class="b2b-photo-card" onclick="openB2BPhotoModal('${t.id}')">
            <div style="position:relative; overflow:hidden; aspect-ratio:4/3; background:rgba(0,0,0,0.4);">
              ${isVideo ? `
                <video src="${t.photo}" style="width:100%; height:100%; object-fit:cover;" muted autoplay loop playsinline></video>
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.25); pointer-events:none;">
                  <div style="background:rgba(220,38,38,0.9); width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(220,38,38,0.6);">
                    <i data-lucide="play" style="width:18px; height:18px; color:#FFF; fill:#FFF; margin-left:2px;"></i>
                  </div>
                </div>
              ` : `
                <img src="${t.photoThumb}" alt="${t.title}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'" />
              `}
              ${isVideo ? `
                <span style="position:absolute; top:8px; right:8px; background:#DC2626; color:#FFF; font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:4px; display:flex; align-items:center; gap:3px; box-shadow:0 2px 6px rgba(0,0,0,0.4);">
                  <i data-lucide="video" style="width:11px; height:11px;"></i> VIDEO
                </span>
              ` : `
                <span style="position:absolute; top:8px; right:8px; background:#4F46E5; color:#FFF; font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:4px; display:flex; align-items:center; gap:3px; box-shadow:0 2px 6px rgba(0,0,0,0.4);">
                  <i data-lucide="image" style="width:11px; height:11px;"></i> FOTO
                </span>
              `}
            </div>
            
            <div class="b2b-photo-info">
              <div style="margin-bottom:6px;">
                <span style="font-size:0.68rem; color:#818CF8; font-weight:700; text-transform:uppercase;">Komplain Dari:</span>
                <div class="b2b-photo-title" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:800;" title="${t.customer}">
                  ${t.customer}
                </div>
              </div>
              <div>
                <span style="font-size:0.68rem; color:#F43F5E; font-weight:700; text-transform:uppercase;">Keluhan:</span>
                <div class="b2b-photo-meta" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; font-size:0.76rem; line-height:1.35;" title="${t.title}">
                  ${t.title}
                </div>
              </div>
              <div style="display:flex; justify-content:flex-end; align-items:center; margin-top:8px; border-top:1px solid var(--border-color); padding-top:6px;">
                <span style="font-size:0.72rem; color:${isVideo ? '#F43F5E' : 'var(--accent-b2b)'}; font-weight:700; display:inline-flex; align-items:center; gap:3px;">
                  ${isVideo ? 'Putar Video <i data-lucide="play" style="width:12px; height:12px;"></i>' : 'Lihat Foto <i data-lucide="zoom-in" style="width:12px; height:12px;"></i>'}
                </span>
              </div>
            </div>
          </div>
        `;}).join('') : `
          <div style="grid-column:1 / -1; padding:32px 20px; text-align:center; color:var(--text-secondary); background:var(--card-bg); border-radius:12px; border:1px dashed var(--border-color); font-weight:600;">
            Tidak ada dokumentasi komplain.
          </div>
        `}
      </div>

      <!-- Section Label: Complete Investigation Log Table -->
      <div class="b2b-section-label" style="margin-top:10px;">
        <i data-lucide="clipboard-list" style="width:16px; height:16px;"></i>
        <span>TABEL DATA KOMPLAIN CUSTOMER</span>
      </div>

      <!-- Detailed Customer Complaint Table -->
      <div class="b2b-table-card">
        <div class="b2b-table-header" style="background: linear-gradient(90deg, #991B1B 0%, #B91C1C 50%, #4338CA 100%);">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="message-square-warning" style="color:#FFF; width:20px; height:20px;"></i>
            <h3>Daftar Komplain Customer & Bukti Dokumentasi</h3>
          </div>
          <span style="font-size:0.78rem; background:rgba(0,0,0,0.25); color:#FFF; padding:3px 10px; border-radius:12px; font-weight:700;">
            ${tickets.length} Data Komplain
          </span>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table" style="font-size:0.82rem;">
            <thead>
              <tr style="background:#111827; border-bottom:2px solid var(--border-color);">
                <th style="width:60px; text-align:center;">BUKTI</th>
                <th style="width:250px;">KOMPLAIN DARI (KLIEN)</th>
                <th>KOMPLAINNYA APA (KELUHAN CUSTOMER)</th>
                <th style="width:90px; text-align:center;">AKSI</th>
              </tr>
            </thead>
            <tbody>
              ${tickets.length > 0 ? tickets.map((t, idx) => {
                const isVideo = t.mediaType === 'video' || (t.photo && t.photo.endsWith('.mp4'));
                return `
                <tr style="background:${idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'};">
                  <td style="text-align:center; padding:8px;">
                    <div style="position:relative; width:48px; height:36px; display:inline-block; cursor:pointer;" onclick="openB2BPhotoModal('${t.id}')" title="Klik untuk ${isVideo ? 'putar video komplain' : 'perbesar foto'}">
                      ${isVideo ? `
                        <video src="${t.photo}" style="width:48px; height:36px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color);"></video>
                        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.35); border-radius:4px;">
                          <i data-lucide="play" style="width:14px; height:14px; color:#FFF; fill:#FFF;"></i>
                        </div>
                      ` : `
                        <img src="${t.photoThumb}" alt="Foto ${t.id}" style="width:48px; height:36px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color);" />
                      `}
                    </div>
                  </td>
                  <td>
                    <div style="font-weight:800; color:#FFF; font-size:0.88rem;">${t.customer}</div>
                    <div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">${t.category}</div>
                  </td>
                  <td>
                    <div style="font-weight:700; color:#FFF; font-size:0.85rem; margin-bottom:3px;">${t.title}</div>
                    <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">${t.issue}</div>
                  </td>
                  <td style="text-align:center;">
                    <button class="pill-btn" onclick="openB2BPhotoModal('${t.id}')" style="font-size:0.74rem; padding:5px 12px; display:inline-flex; align-items:center; gap:4px; background:${isVideo ? 'rgba(239,68,68,0.25)' : 'rgba(79,70,229,0.25)'}; border:1px solid ${isVideo ? '#EF4444' : '#6366F1'}; color:#FFF;">
                      <i data-lucide="${isVideo ? 'video' : 'image'}" style="width:12px; height:12px;"></i> ${isVideo ? 'Video' : 'Foto'}
                    </button>
                  </td>
                </tr>
              `;}).join('') : `
                <tr>
                  <td colspan="4" style="text-align:center; padding:32px; color:var(--text-secondary); font-weight:600;">
                    Tidak ada data komplain.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// Helper filter untuk tabel 21 Project B2B
window.setB2BProjectStatusFilter = function(filter) {
  state.b2bProjectStatusFilter = filter;
  
  // Update button active state
  const btnAll = document.getElementById('filterBtnAll');
  const btnOnTime = document.getElementById('filterBtnOnTime');
  const btnDelayed = document.getElementById('filterBtnDelayed');
  if (btnAll) btnAll.classList.toggle('active', filter === 'all');
  if (btnOnTime) btnOnTime.classList.toggle('active', filter === 'on-time');
  if (btnDelayed) btnDelayed.classList.toggle('active', filter === 'delayed');

  renderB2BProjectTableRows();
};

window.filterB2BProjectSearch = function(query) {
  state.b2bProjectSearch = query ? query.toLowerCase() : '';
  renderB2BProjectTableRows();
};

function renderB2BProjectTableRows() {
  const tbody = document.getElementById('b2bProjectsTableBody');
  if (!tbody) return;
  const filter = state.b2bProjectStatusFilter || 'all';
  const query = state.b2bProjectSearch || '';

  const filtered = b2bProjectsDatabase.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesQuery = !query || 
      p.name.toLowerCase().includes(query) || 
      p.pic.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.note.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-secondary); font-weight:600;">Tidak ada project yang sesuai filter/pencarian.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((p, idx) => {
    const isDelayed = p.status === 'delayed';
    const rowBg = isDelayed ? 'background: rgba(239, 68, 68, 0.08); border-left: 4px solid #EF4444;' : '';
    return `
      <tr style="${rowBg}">
        <td style="text-align:center; font-weight:700; color:var(--text-secondary);">${idx + 1}</td>
        <td>
          <div style="font-weight:800; color:#FFF; font-size:0.88rem; display:flex; align-items:center; gap:8px;">
            ${p.name}
            ${isDelayed ? '<span style="font-size:0.65rem; background:#EF4444; color:#FFF; padding:1px 6px; border-radius:4px; font-weight:800;">TELAT</span>' : ''}
          </div>
          <div style="font-size:0.72rem; color:var(--text-secondary);">${p.category}</div>
        </td>
        <td>
          <span class="b2b-pic-pill"><i data-lucide="user" style="width:11px; height:11px;"></i> ${p.pic}</span>
        </td>
        <td>
          ${isDelayed 
            ? '<span class="b2b-plangkan-tag"><i data-lucide="clock-alert" style="width:12px; height:12px;"></i> TELAT (PLANGKAN)</span>' 
            : '<span class="b2b-ontime-tag"><i data-lucide="check-circle-2" style="width:12px; height:12px;"></i> TEPAT WAKTU</span>'}
        </td>
        <td style="color:${isDelayed ? '#F87171' : 'var(--text-secondary)'}; font-size:0.78rem;">
          ${isDelayed ? '<strong style="color:#EF4444;">Kendala Plangkan</strong> (Screen Cetak Sablon)' : '<span style="color:#10B981;">Sesuai Timeline</span>'}
        </td>
        <td style="font-size:0.78rem; color:${isDelayed ? '#FECACA' : 'var(--text-secondary)'};">
          ${p.note}
        </td>
      </tr>
    `;
  }).join('');
  initLucide();
}

// --------------------------------------------------------------------------
// LIGHTBOX & MODAL HANDLERS FOR B2B COMPLAINT PHOTOS & VIDEOS (SIMPLE & DIRECT)
// --------------------------------------------------------------------------
window.openB2BPhotoModal = function(ticketId) {
  const ticket = b2bComplainTickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const lightbox = document.getElementById('b2bLightbox');
  const inner = document.getElementById('b2bLightboxInner');
  if (!lightbox || !inner) return;

  const isVideo = ticket.mediaType === 'video' || (ticket.photo && ticket.photo.endsWith('.mp4'));

  inner.innerHTML = `
    <div style="position:relative; background:#000; display:flex; align-items:center; justify-content:center;">
      ${isVideo ? `
        <video src="${ticket.photo}" controls autoplay playsinline style="width:100%; max-height:480px; object-fit:contain; background:#000;"></video>
      ` : `
        <img src="${ticket.photo}" alt="${ticket.title}" class="b2b-lightbox-img" style="width:100%; max-height:480px; object-fit:contain; background:#000;" />
      `}
      <div style="position:absolute; top:14px; left:16px; background:rgba(15,23,42,0.85); backdrop-filter:blur(8px); padding:4px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; gap:8px;">
        <span style="${isVideo ? 'color:#38BDF8;' : 'color:#818CF8;'} font-weight:800; font-size:0.78rem; display:flex; align-items:center; gap:4px;">
          <i data-lucide="${isVideo ? 'video' : 'image'}" style="width:14px; height:14px;"></i> ${isVideo ? 'Bukti Video' : 'Bukti Foto'}
        </span>
      </div>
    </div>

    <div class="b2b-lightbox-body" style="background:#0F172A; color:var(--text-primary); padding:20px 24px;">
      <!-- Komplain Dari Siapa -->
      <div style="margin-bottom:16px;">
        <span style="font-size:0.72rem; color:#818CF8; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">
          <i data-lucide="building-2" style="width:14px; height:14px; display:inline; vertical-align:middle;"></i> Komplain Dari:
        </span>
        <h3 style="margin:0; font-size:1.25rem; font-weight:900; color:#FFF;">${ticket.customer}</h3>
      </div>

      <!-- Komplainnya Apa -->
      <div style="background:rgba(255,255,255,0.04); padding:16px; border-radius:10px; border:1px solid rgba(255,255,255,0.08);">
        <span style="font-size:0.72rem; color:#F43F5E; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:6px;">
          <i data-lucide="message-square-warning" style="width:14px; height:14px; display:inline; vertical-align:middle;"></i> Komplainnya:
        </span>
        <div style="font-size:0.95rem; color:#FFF; font-weight:700; margin-bottom:6px; line-height:1.4;">
          ${ticket.title}
        </div>
        <div style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
          ${ticket.issue}
        </div>
      </div>
    </div>
  `;

  lightbox.classList.add('active');
  initLucide();
};

window.updateB2BComplainFilter = function(val) {
  state.b2bComplainMonthFilter = val;
  renderCurrentView();
};

window.closeB2BLightbox = function(e) {
  if (e && e.target && e.target.classList && !e.target.classList.contains('b2b-lightbox') && !e.target.closest('.b2b-lightbox-close')) {
    return;
  }
  const lightbox = document.getElementById('b2bLightbox');
  if (lightbox) {
    const video = lightbox.querySelector('video');
    if (video) video.pause();
    lightbox.classList.remove('active');
  }
};

window.triggerB2BCelebration = function() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#818CF8', '#10B981', '#F59E0B', '#06B6D4', '#EC4899']
    });
  }
};

// Fitur Toggle Hide / Munculkan Kategori Besar B2B dan Subkategorinya
window.toggleB2BModuleVisibility = function() {
  const b2bItem = document.getElementById('navItemB2B');
  const icon = document.getElementById('iconToggleB2B');
  const text = document.getElementById('textToggleB2B');
  const badge = document.getElementById('badgeToggleB2B');

  if (!b2bItem) return;

  const isHidden = b2bItem.style.display === 'none' || b2bItem.style.display === '';
  if (isHidden) {
    b2bItem.style.display = 'block';
    state.isB2BVisible = true;
    if (icon) icon.setAttribute('data-lucide', 'eye-off');
    if (text) text.textContent = 'Sembunyikan B2B';
    if (badge) {
      badge.textContent = 'Aktif';
      badge.style.background = 'rgba(16, 185, 129, 0.2)';
      badge.style.color = '#A7F3D0';
    }
  } else {
    b2bItem.style.display = 'none';
    b2bItem.classList.remove('open');
    state.isB2BVisible = false;
    if (icon) icon.setAttribute('data-lucide', 'eye');
    if (text) text.textContent = 'Tampilkan B2B';
    if (badge) {
      badge.textContent = 'Hidden';
      badge.style.background = 'rgba(99, 102, 241, 0.2)';
      badge.style.color = '#C7D2FE';
    }
    if (state.activeCategory === 'b2b') {
      state.activeCategory = 'sales-ytd';
      state.activeSub = null;
      updateActiveNavUI();
      renderCurrentView();
    }
  }
  initLucide();
};

// --------------------------------------------------------------------------
// CHART INITIALIZERS FOR B2B
// --------------------------------------------------------------------------
function initB2BCharts() {
  const sub = state.activeSub || 'b2b-achievement';

  if (sub === 'b2b-achievement') {
    initB2BAchievementCharts();
  } else if (sub === 'b2b-comparison') {
    initB2BComparisonCharts();
  } else if (sub === 'b2b-complain') {
    initB2BComplainCharts();
  }
}

function initB2BAchievementCharts() {
  const months12 = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

  // Chart 1: Full-Width 1-Year ACV Sales Chart (Target vs Realisasi vs Baseline 2025)
  const annualCtx = document.getElementById('b2bAnnualAcvChart');
  if (annualCtx) {
    if (state.activeChartInstances.b2bAnnualAcv) {
      state.activeChartInstances.b2bAnnualAcv.destroy();
    }

    const targetsInM = b2bDatabase.target2026.map(v => v / 1000000);
    const acv26InM = b2bDatabase.acv2026.map((v, i) => i <= 7 ? (v / 1000000) : null);
    const acv25InM = b2bDatabase.acv2025.map(v => v / 1000000);

    state.activeChartInstances.b2bAnnualAcv = new Chart(annualCtx, {
      type: 'bar',
      data: {
        labels: months12,
        datasets: [
          {
            type: 'bar',
            label: 'Realisasi ACV 2026',
            data: acv26InM,
            backgroundColor: months12.map((_, i) => i === 7 ? 'rgba(52, 211, 153, 0.95)' : 'rgba(16, 185, 129, 0.85)'),
            borderColor: months12.map((_, i) => i === 7 ? '#34D399' : '#10B981'),
            borderWidth: 2,
            borderRadius: 6,
            order: 2
          },
          {
            type: 'bar',
            label: 'Target ACV 2026',
            data: targetsInM,
            backgroundColor: 'rgba(99, 102, 241, 0.22)',
            borderColor: '#818CF8',
            borderWidth: 1.5,
            borderRadius: 6,
            order: 3
          },
          {
            type: 'line',
            label: 'Baseline ACV 2025',
            data: acv25InM,
            borderColor: '#F59E0B',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointBackgroundColor: '#F59E0B',
            pointBorderColor: '#FFF',
            pointBorderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 7,
            tension: 0.3,
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleColor: '#FFF',
            bodyColor: '#E2E8F0',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                if (ctx.raw === null || ctx.raw === undefined) return null;
                const val = ctx.raw.toFixed(1);
                if (ctx.dataset.label === 'Realisasi ACV 2026' && ctx.dataIndex === 7) {
                  return `🏆 ${ctx.dataset.label}: Rp ${val} Jt (Rekor Tertinggi! 🔥)`;
                }
                return `${ctx.dataset.label}: Rp ${val} Jt`;
              },
              afterBody: (items) => {
                const item26 = items.find(it => it.dataset.label === 'Realisasi ACV 2026' && it.raw !== null);
                const itemTgt = items.find(it => it.dataset.label === 'Target ACV 2026');
                if (item26 && itemTgt && itemTgt.raw > 0) {
                  const pct = ((item26.raw / itemTgt.raw) * 100).toFixed(1);
                  return [`Pencapaian Target: ${pct}%`];
                }
                return [];
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#CBD5E1', font: { weight: 'bold', size: 12 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94A3B8',
              font: { weight: '600' },
              callback: (val) => `Rp ${val} Jt`
            }
          }
        }
      }
    });
  }

  // Chart 2: Cumulative 1-Year ACV Trajectory
  const cumCtx = document.getElementById('b2bCumulativeAcvChart');
  if (cumCtx) {
    if (state.activeChartInstances.b2bCumulativeAcv) {
      state.activeChartInstances.b2bCumulativeAcv.destroy();
    }

    // Cumulative Target 2026 (Jan - Des)
    let cumTgt = 0;
    const cumTargetInM = b2bDatabase.target2026.map(v => {
      cumTgt += v / 1000000;
      return cumTgt;
    });

    // Cumulative Realisasi 2026 (Jan - Ags)
    let cumAcv = 0;
    const cumAcvInM = b2bDatabase.acv2026.map((v, i) => {
      if (i <= 7) {
        cumAcv += v / 1000000;
        return cumAcv;
      }
      return null;
    });

    // Cumulative Realisasi 2025 (Jan - Des)
    let cum25 = 0;
    const cum2025InM = b2bDatabase.acv2025.map(v => {
      cum25 += v / 1000000;
      return cum25;
    });

    state.activeChartInstances.b2bCumulativeAcv = new Chart(cumCtx, {
      type: 'line',
      data: {
        labels: months12,
        datasets: [
          {
            label: 'Akumulasi Realisasi 2026',
            data: cumAcvInM,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderWidth: 3.5,
            fill: true,
            tension: 0.25,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#FFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
          },
          {
            label: 'Target Akumulatif 2026',
            data: cumTargetInM,
            borderColor: '#818CF8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 4],
            fill: false,
            tension: 0,
            pointBackgroundColor: '#818CF8',
            pointRadius: 3
          },
          {
            label: 'Akumulasi Realisasi 2025',
            data: cum2025InM,
            borderColor: '#94A3B8',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderDash: [3, 3],
            fill: false,
            tension: 0.25,
            pointBackgroundColor: '#94A3B8',
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleColor: '#FFF',
            bodyColor: '#E2E8F0',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                if (ctx.raw === null || ctx.raw === undefined) return null;
                const mVal = (ctx.raw / 1000).toFixed(2);
                return `${ctx.dataset.label}: Rp ${ctx.raw.toFixed(1)} Jt (Rp ${mVal} M)`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8', font: { weight: 'bold' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94A3B8',
              callback: (val) => `Rp ${(val / 1000).toFixed(1)} M`
            }
          }
        }
      }
    });
  }
}

function initB2BComparisonCharts() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags'];

  // Chart 1: YoY ACV Sales Comparison
  const acvCtx = document.getElementById('b2bYoYAcvChart');
  if (acvCtx) {
    if (state.activeChartInstances.b2bYoYAcv) {
      state.activeChartInstances.b2bYoYAcv.destroy();
    }

    const acv25InM = b2bDatabase.acv2025.slice(0, 8).map(v => v / 1000000);
    const acv26InM = b2bDatabase.acv2026.slice(0, 8).map(v => v / 1000000);

    state.activeChartInstances.b2bYoYAcv = new Chart(acvCtx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: '2025 ACV Sales',
            data: acv25InM,
            backgroundColor: 'rgba(148, 163, 184, 0.4)',
            borderColor: '#94A3B8',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: '2026 ACV Sales',
            data: acv26InM,
            backgroundColor: months.map((_, i) => i === 7 ? 'rgba(16, 185, 129, 0.95)' : 'rgba(16, 185, 129, 0.75)'),
            borderColor: '#10B981',
            borderWidth: 1.5,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: Rp ${ctx.raw.toFixed(1)} Jt`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8', font: { weight: 'bold' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94A3B8',
              callback: (val) => `Rp ${val} Jt`
            }
          }
        }
      }
    });
  }

  // Chart 2: YoY Cash In Comparison
  const cashCtx = document.getElementById('b2bYoYCashChart');
  if (cashCtx) {
    if (state.activeChartInstances.b2bYoYCash) {
      state.activeChartInstances.b2bYoYCash.destroy();
    }

    const cash25InM = b2bDatabase.cashIn2025.slice(0, 8).map(v => v / 1000000);
    const cash26InM = b2bDatabase.cashIn2026.slice(0, 8).map(v => v / 1000000);

    state.activeChartInstances.b2bYoYCash = new Chart(cashCtx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: '2025 Cash In',
            data: cash25InM,
            backgroundColor: 'rgba(148, 163, 184, 0.4)',
            borderColor: '#94A3B8',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: '2026 Cash In',
            data: cash26InM,
            backgroundColor: months.map((_, i) => i === 7 ? 'rgba(6, 182, 212, 0.95)' : 'rgba(6, 182, 212, 0.75)'),
            borderColor: '#06B6D4',
            borderWidth: 1.5,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: Rp ${ctx.raw.toFixed(1)} Jt`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8', font: { weight: 'bold' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94A3B8',
              callback: (val) => `Rp ${val} Jt`
            }
          }
        }
      }
    });
  }
}

// --------------------------------------------------------------------------
// CHART INITIALIZERS FOR B2B COMPLAIN & PROJECT DELIVERY MONITORING
// --------------------------------------------------------------------------
function initB2BComplainCharts() {
  // Chart 1: Donut Chart Rasio Presentasi Ketepatan Waktu Project B2B
  const ratioCanvas = document.getElementById('b2bProjectRatioChart');
  if (ratioCanvas) {
    if (state.activeChartInstances.b2bProjectRatio) {
      state.activeChartInstances.b2bProjectRatio.destroy();
    }

    state.activeChartInstances.b2bProjectRatio = new Chart(ratioCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Tepat Waktu (On-Time)', 'Telat (Kendala Plangkan)'],
        datasets: [{
          data: [17, 4],
          backgroundColor: ['#10B981', '#EF4444'],
          borderColor: ['#059669', '#DC2626'],
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleColor: '#FFF',
            bodyColor: '#CBD5E1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                const val = context.parsed;
                const total = 21;
                const pct = ((val / total) * 100).toFixed(1);
                return ` ${context.label}: ${val} Project (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Chart 2: Bar Chart Distribusi Status Project per PIC
  const picCanvas = document.getElementById('b2bProjectPicChart');
  if (picCanvas) {
    if (state.activeChartInstances.b2bProjectPic) {
      state.activeChartInstances.b2bProjectPic.destroy();
    }

    state.activeChartInstances.b2bProjectPic = new Chart(picCanvas, {
      type: 'bar',
      data: {
        labels: ['Ibu Era', 'Hanum', 'Tanto', 'Vira', 'Tim B2B'],
        datasets: [
          {
            label: 'Tepat Waktu (On-Time)',
            data: [9, 2, 3, 2, 0],
            backgroundColor: '#10B981',
            borderColor: '#059669',
            borderWidth: 1,
            borderRadius: 5
          },
          {
            label: 'Telat (Kendala Plangkan)',
            data: [0, 2, 0, 1, 1],
            backgroundColor: '#EF4444',
            borderColor: '#DC2626',
            borderWidth: 1,
            borderRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8', font: { weight: 'bold' } }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 2, color: '#94A3B8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94A3B8',
              font: { size: 11, weight: '700' },
              padding: 12
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleColor: '#FFF',
            bodyColor: '#CBD5E1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10
          }
        }
      }
    });
  }
}


