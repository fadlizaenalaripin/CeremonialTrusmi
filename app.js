/**
 * CEREMONIAL DASHBOARD 2026 - APPLICATION ENGINE
 * Real Data Integration: Sales YTD 2025-2026
 */

// Global App State
const state = {
  activeCategory: 'sales-ytd',
  activeSub: null,
  period: 'ytd2026',
  searchQuery: '',
  selectedBranch: 'all',
  activeChartInstances: {}
};

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
  ]
};

// Category Titles Mapping
const categoryTitles = {
  'sales-ytd': 'Sales YTD',
  'kpi-performance': 'KPI Performance',
  'head-to-head': 'Head to Head',
  'okr': 'OKR',
  'complain': 'Complain',
  'milestone': 'Milestone'
};

// Real Sales Database Transcribed from User Spreadsheet (2025 & 2026)
const realSalesData = {
  branches: [
    { id: 'cirebon', name: 'Batik Trusmi Cirebon', ytd2026: 39210224210, growth2026: -7.1, janJul2025: 42199328860, total2025: 72290172300, color: '#10B981' },
    { id: 'bali', name: 'The Keranjang Bali', ytd2026: 33302099695, growth2026: -21.5, janJul2025: 42407594684, total2025: 69927082478, color: '#06B6D4' },
    { id: 'ecommerce', name: 'E-Commerce', ytd2026: 3823521880, growth2026: 6.6, janJul2025: 3586914177, total2025: 6163885348, color: '#6366F1' },
    { id: 'b2b', name: 'B2B Sales', ytd2026: 2273261511, growth2026: 101.5, janJul2025: 1128261495, total2025: 2659742404, color: '#8B5CF6' },
    { id: 'medan', name: 'Batik Trusmi Medan', ytd2026: 1152787998, growth2026: -15.0, janJul2025: 1356186348, total2025: 2374344178, color: '#F59E0B' },
    { id: 'lounge', name: 'Batik Trusmi Lounge', ytd2026: 709352400, growth2026: 19.9, janJul2025: 591686500, total2025: 1125895987, color: '#EC4899' },
    { id: 'jakarta', name: 'Batik Trusmi Jakarta', ytd2026: 773208888, growth2026: -35.0, janJul2025: 1188703990, total2025: 2110907540, color: '#3B82F6' }
  ],

  months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],

  // Special Dedicated B2B Cash In & ACV Database
  b2bData: {
    target2026: [420000000, 480000000, 480000000, 660000000, 480000000, 540000000, 480000000, 420000000, 540000000, 480000000, 600000000, 420000000],
    acv2025: [49396200, 99146399, 437196380, 163115720, 180073085, 169497149, 29836562, 274537035, 167413910, 244770614, 361433600, 483325750],
    cashIn2025: [0, 0, 24081550, 30579350, 131204585, 168881469, 71302062, 44909650, 102057050, 398148054, 216523865, 437298350],
    acv2026: [275430924, 167980600, 399331359, 543332850, 220628800, 260594428, 405962550, 0, 0, 0, 0, 0],
    cashIn2026: [300544972, 283399800, 102205868, 268122736, 384872726, 295220915, 154484825, 0, 0, 0, 0, 0]
  },

  // Monthly breakdown per branch for 2026 (Jan-Jul)
  sales2026: {
    cirebon: [6145526461, 4363163085, 5280323018, 5259388670, 6992017875, 5858981677, 5310823424, 0, 0, 0, 0, 0],
    bali: [6669186960, 3788194468, 5722558473, 3923308664, 4409772270, 4390443413, 4398635447, 0, 0, 0, 0, 0],
    ecommerce: [374357149, 584738503, 728202121, 628439040, 434439105, 604922791, 468423171, 0, 0, 0, 0, 0],
    b2b: [275430924, 167980600, 399331359, 543332850, 220628800, 260594428, 405962550, 0, 0, 0, 0, 0],
    medan: [197785628, 109918500, 111007116, 160267604, 153920116, 201251166, 218637868, 0, 0, 0, 0, 0],
    lounge: [87211500, 79750000, 102363900, 101189100, 113816500, 106529900, 118491500, 0, 0, 0, 0, 0],
    jakarta: [143684463, 133054375, 91292600, 111146300, 147861050, 87493650, 58676450, 0, 0, 0, 0, 0]
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

// Calculate Total YTD 2026 across all branches (Jan-Jul)
const totalYTD2026 = realSalesData.branches.reduce((sum, b) => sum + b.ytd2026, 0); // 78,971,195,071
const totalJanJul2025 = 91330414559; // 91.33 Miliard
const totalYTDGrowth2026 = (((totalYTD2026 - totalJanJul2025) / totalJanJul2025) * 100).toFixed(1); // -13.5%

// Remaining category mock data
const mockData = {
  kpiPerformance: {
    'kpi-bt': {
      unitName: 'Batik Trusmi (BT)',
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
    },
    'kpi-tkb': {
      unitName: 'The Keranjang Bali (TKB)',
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
  },

  headToHead: {
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
      { cat: 'Ecommerce', point: 'Transaksi', bobot: '15%', btTarget: '2.720', btAct: '2.378', btAcv: '87%', btScore: '13.11%', tkbTarget: '800', btAct: '344', tkbAcv: '43.00%', tkbScore: '6.45%', vsAct: 'BT', vsTgt: 'BT' },
      { cat: 'Ecommerce', point: 'Basket Size', bobot: '15%', btTarget: 'Rp 200.000', btAct: 'Rp 196.982', btAcv: '98%', btScore: '14.77%', tkbTarget: 'Rp 200.000', tkbAct: 'Rp 98.223', tkbAcv: '49.11%', tkbScore: '7.37%', vsAct: 'BT', vsTgt: 'BT' }
    ]
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
    'complain-bt': {
      summary: { total: 9, resolved: 9, pending: 0, slaRate: '100%', avgTime: '10 Menit' },
      categories: { fasilitas: 0, produk: 0, pelayanan: 0, googleReview: 0, online: 9 },
      tickets: [
        { id: 'CMP-BT-001', customer: 'BATIK TRUSMI Bahan Kain Panjang Batik Tulis Mega Mendung Premium', issue: 'Warna warna pinknya pucat sekali', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '10 min', rating: '⭐ 1/5', date: 'Juli 2026' },
        { id: 'CMP-BT-002', customer: 'BATIK TRUSMI Longdress Pakaian Santai Wanita Daster Batik Jumbo Busui', issue: 'Gak sesuai pesanan😢', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '8 min', rating: '⭐ 1/5', date: 'Juli 2026' },
        { id: 'CMP-BT-003', customer: 'BATIK TRUSMI Denim Life Series Kemeja Wanita Denim Kombinasi Batik', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '12 min', rating: '⭐ 1/5', date: 'Juli 2026' },
        { id: 'CMP-BT-004', customer: 'BATIK TRUSMI Baju Batik Hem Pria Kemeja Lengan Pendek Mega Mendung', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '9 min', rating: '⭐ 1/5', date: 'Juli 2026' },
        { id: 'CMP-BT-005', customer: 'BATIK TRUSMI Atasan Wanita Blouse Outer Batik Mega Mendung Linchi', issue: 'Pengiriman lama', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '15 min', rating: '⭐ 1/5', date: 'Juli 2026' },
        { id: 'CMP-BT-006', customer: 'BATIK TRUSMI Atasan Wanita Blouse Batik Motif Mega Mendung Bumi Obi', issue: 'Packaging kurang safety', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '11 min', rating: '⭐ 1/5', date: 'Juli 2026' },
        { id: 'CMP-BT-007', customer: 'BATIK TRUSMI Kain Pantai Batik Bahan Rayon Cap Mega Mendung', issue: 'Produk tidak sesuai etalase', solusi: 'Pemberian Gift', status: 'Resolved', sla: '7 min', rating: '⭐ 1/5', date: 'Juli 2026' },
        { id: 'CMP-BT-008', customer: 'BATIK TRUSMI Hem Batik Murah Pria Lengan Pendek Motif Bunga Matahari', issue: 'Kualitas produk buruk', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '14 min', rating: '⭐⭐ 2/5', date: 'Juli 2026' },
        { id: 'CMP-BT-009', customer: 'BATIK TRUSMI Outer Batik Wanita Motif Abstrak Kombinasi Alma Coklat', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', status: 'Resolved', sla: '10 min', rating: '⭐⭐ 2/5', date: 'Juli 2026' }
      ]
    },

    'complain-tkb': {
      summary: { total: 0, resolved: 0, pending: 0, slaRate: '100%', avgTime: '-' },
      tickets: [
        { source: 'Google Review', category: 'Pelayanan', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 },
        { source: 'Google Review', category: 'Produk', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 },
        { source: 'Google Review', category: 'Area', detail: 'Tidak ada complain', link: '-', solving: '-', total: 0 }
      ]
    }
  },

  milestone: {
    'milestone-bt': [
      { id: 1, year: '2026', title: 'Launching Batik Kantoran', status: 'Berjalan', tag: 'Operational', desc: 'Inisiatif peluncuran lini Batik Kantoran untuk segmen korporat & instansi.', markerDone: true },
      { id: 2, year: '2026', title: 'Premium Store Jakarta', status: 'Progress', tag: 'Expansion', desc: 'Pengembangan & persiapan pembukaan galeri Premium Store di Jakarta.', markerDone: false },
      { id: 3, year: '2026', title: 'Premium Store Cirebon', status: 'Progress', tag: 'Expansion', desc: 'Pengembangan & persediaan fasilitas Premium Store di Cirebon.', markerDone: false },
      { id: 4, year: '2026', title: 'Scale Up B2B', status: 'Progress', tag: 'Growth', desc: 'Skalasi ekosistem penjualan & penetrasi pasar Business-to-Business (B2B).', markerDone: false },
      { id: 5, year: '2026', title: 'Handprint Factory', status: 'Berjalan', tag: 'Production', desc: 'Operasional penuh fasilitas produksi cetak batik tulis/tangan (Handprint).', markerDone: true },
      { id: 6, year: '2026', title: 'Garment', status: 'Berjalan', tag: 'Production', desc: 'Operasional manufaktur & penjahitan unit konveksi/garment.', markerDone: true },
      { id: 7, year: '2026', title: 'Laboratory Matching Color', status: 'Berjalan', tag: 'R&D Quality', desc: 'Fasilitas laboratorium formulasi pencelupan & pencocokan warna presisi.', markerDone: true },
      { id: 8, year: '2026', title: 'Weighing System', status: 'Progress', tag: 'System', desc: 'Digitalisasi & otomatisasi sistem penimbangan bahan baku produksi.', markerDone: false },
      { id: 9, year: '2026', title: 'Digital Printing', status: 'Progress', tag: 'Technology', desc: 'Implementasi dan instalasi teknologi modern Digital Printing tekstil.', markerDone: false }
    ],

    'milestone-tkb': [
      { id: 1, year: '2026', title: 'Rebranding Experience Lt 4 : Family & Kids', status: 'Progress', tag: 'Rebranding Lt 4', desc: 'Pengembangan konsep zona belanja & hiburan interaktif Family & Kids di Lantai 4.', markerDone: false },
      { id: 2, year: '2026', title: 'Rebranding Experience Lt 3 : Glow In The Dark & Solar Activ', status: 'Progress', tag: 'Rebranding Lt 3', desc: 'Instalasi arena pengalaman sensorial Glow In The Dark & Solar Activity di Lantai 3.', markerDone: false },
      { id: 3, year: '2026', title: 'Rebranding Experience Lt 2 : Canggu - La brissa', status: 'Hold', tag: 'Rebranding Lt 2', desc: 'Penundaan sementara (Hold) penataan area thematic Canggu - La Brissa di Lantai 2.', markerDone: false },
      { id: 4, year: '2026', title: 'Rebranding Experience Lt 1 : Local Bali - Denpasar', status: 'Berjalan', tag: 'Rebranding Lt 1', desc: 'Operasional & penataan zona budaya lokal khas Bali - Denpasar di Lantai 1.', markerDone: true }
    ]
  }
};

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
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
  }
}

window.selectSubCategory = function(subId) {
  state.activeSub = subId;
  updateActiveNavUI();
  renderCurrentView();
};

// --------------------------------------------------------------------------
// VIEW 1: SALES YTD (Strictly 2025 vs 2026 Comparison)
// --------------------------------------------------------------------------
function renderSalesYTD() {
  const formatRupiah = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');
  const formatRupiahShort = (num) => {
    if (num >= 1000000000) return 'Rp ' + (num / 1000000000).toFixed(2).replace('.', ',') + ' M';
    if (num >= 1000000) return 'Rp ' + (num / 1000000).toFixed(2).replace('.', ',') + ' Jt';
    return 'Rp ' + num;
  };

  const selectedBranchId = state.selectedBranch || 'all';

  const branchesWithShare = realSalesData.branches.map(b => {
    const share = ((b.ytd2026 / totalYTD2026) * 100).toFixed(1);
    return { ...b, share };
  });

  const branches = branchesWithShare.filter(b =>
    !state.searchQuery || b.name.toLowerCase().includes(state.searchQuery)
  );

  const selectedBranchObj = selectedBranchId === 'all'
    ? null
    : realSalesData.branches.find(b => b.id === selectedBranchId);

  return `


    <!-- 7 Kartu Scorecard Masing-Masing Divisi (Enlarged 70px Donut Ring, 100% Gapless Balanced Flex Layout) -->
    <div style="margin-bottom:24px;">
      <div style="font-size:0.95rem; font-weight:800; color:#FFF; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
        <i data-lucide="layout-grid" style="color:var(--accent-gold);"></i>
        <span>Scorecard Sales YTD Per Divisi / Channel (Growth % Pada Circular Ring Chart)</span>
      </div>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
        ${branchesWithShare.map(b => {
          const isSelected = selectedBranchId === b.id;
          const isPositive = b.growth2026 >= 0;
          const growthColor = isPositive ? '#10B981' : '#EF4444';
          const growthText = (isPositive ? '+' : '') + b.growth2026 + '%';
          const absGrowth = Math.min(Math.abs(b.growth2026), 100);
          const jul2026Val = realSalesData.sales2026[b.id] ? realSalesData.sales2026[b.id][6] : 0;

          return `
            <div onclick="window.updateBranchChartFilter('${b.id}')"
                 style="background:${isSelected ? 'rgba(245, 158, 11, 0.14)' : 'var(--bg-card)'};
                        border: 2px solid ${isSelected ? 'var(--accent-gold)' : b.color + '60'};
                        box-shadow: ${isSelected ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none'};
                        border-radius: var(--radius-md); padding: 14px 16px; cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden;"
                 title="Klik untuk filter grafik divisi ${b.name}">
              
              <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: ${b.color};"></div>
              
              <!-- Header: Nama Divisi + Enlarged Donut Ring Visual (70px) -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div>
                  <span style="font-weight: 800; font-size: 1.02rem; color: #FFF; line-height: 1.2; display: block;">${b.name}</span>
                  <span style="font-size: 0.74rem; color: var(--text-secondary); font-weight: 600;">Sales YTD 2026 vs 2025</span>
                </div>

                <!-- Enlarged Circular Donut Chart Visual (74px x 74px) untuk Growth % -->
                <div style="position: relative; width: 74px; height: 74px; flex-shrink: 0;" title="Growth YoY: ${growthText}">
                  <svg width="74" height="74" viewBox="0 0 74 74" style="transform: rotate(-90deg); filter: drop-shadow(0 0 6px ${growthColor}60);">
                    <circle cx="37" cy="37" r="28" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="5.5" />
                    <circle cx="37" cy="37" r="28" fill="none" stroke="${growthColor}" stroke-width="5.5"
                            stroke-dasharray="175.93"
                            stroke-dashoffset="${(175.93 * (1 - Math.max(absGrowth, 15) / 100)).toFixed(2)}"
                            stroke-linecap="round" />
                  </svg>
                  <div style="position: absolute; top: 0; left: 0; width: 74px; height: 74px; display: flex; align-items: center; justify-content: center; font-size: ${growthText.length >= 7 ? '0.67rem' : (growthText.length >= 6 ? '0.72rem' : '0.82rem')}; font-weight: 800; color: ${growthColor}; font-family: monospace; white-space: nowrap; letter-spacing: -0.5px; line-height: 1;">
                    ${growthText}
                  </div>
                </div>
              </div>

              <!-- Angka Total Sales Real YTD 2026 -->
              <div style="font-size: 1.35rem; font-weight: 800; color: ${b.color}; font-family: monospace; margin-bottom: 6px;">
                ${formatRupiah(b.ytd2026)}
              </div>

              <!-- Achievement / Realisasi Sales Bulan Juli 2026 -->
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:0.78rem; background:rgba(16,185,129,0.08); padding:5px 8px; border-radius:4px; border:1px solid rgba(16,185,129,0.2);">
                <span style="color:#10B981; font-weight:700; display:flex; align-items:center; gap:4px;">
                  <i data-lucide="check-circle-2" style="width:12px; height:12px;"></i> Realisasi Juli 2026:
                </span>
                <strong style="color:#FFF; font-family:monospace; font-weight:800; font-size:0.85rem;">${formatRupiah(jul2026Val)}</strong>
              </div>

              <!-- Baseline Sales 2025 (Nominal Angka Real) -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 8px; font-size: 0.78rem;">
                <span style="color: var(--text-secondary);">
                  Baseline 2025: <strong style="color: #06B6D4; font-family:monospace;">${formatRupiah(b.janJul2025)}</strong>
                </span>
                <span style="color: var(--text-muted); font-size: 0.72rem; font-weight: 600;">
                  <i data-lucide="calendar" style="width: 11px; height: 11px; display: inline;"></i> Jan–Jul
                </span>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Charts Section: Full Width Monthly Sales Trend Chart (Filling Empty Space Rightward) -->
    <div class="chart-card" style="margin-bottom: 24px; width: 100%;">
      <div class="chart-card-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div class="chart-card-title">
          <i data-lucide="line-chart" style="color: var(--accent-sales);"></i>
          <span>Grafik Realisasi Sales Bulanan (${selectedBranchObj ? selectedBranchObj.name : 'Konsolidasi Semua Outlet'})</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:0.82rem; color:var(--text-secondary); font-weight:600;"><i data-lucide="filter" style="width:13px; height:13px; display:inline;"></i> Divisi / Channel:</span>
          <select id="branchChartFilter" class="pill-btn" style="background:#1E293B; color:#FFF; font-weight:700; border:1px solid var(--accent-gold); outline:none; padding:8px 14px; border-radius:6px; cursor:pointer;" onchange="window.updateBranchChartFilter(this.value)">
            <option value="all" ${state.selectedBranch === 'all' ? 'selected' : ''}>Semua Outlet (Konsolidasi) (${totalYTDGrowth2026 >= 0 ? '+' : ''}${totalYTDGrowth2026}%)</option>
            ${realSalesData.branches.map(b => `
              <option value="${b.id}" ${state.selectedBranch === b.id ? 'selected' : ''}>
                ${b.name} (${b.growth2026 >= 0 ? '+' : ''}${b.growth2026}%)
              </option>
            `).join('')}
          </select>
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
          <span>Ringkasan Realisasi Sales YTD 2026 & Perbandingan VS 2025 Per Branch</span>
        </div>
      </div>
      <table class="custom-table">
        <thead>
          <tr>
            <th>Cabang / Channel</th>
            <th>Baseline 2025 (Jan-Jul)</th>
            <th>Realisasi YTD 2026 (Jan-Jul)</th>
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
                <td>${formatRupiah(b.janJul2025)}</td>
                <td style="color:var(--accent-sales); font-weight:700;">${formatRupiah(b.ytd2026)}</td>
                <td>
                  <span class="status-pill ${b.growth2026 >= 0 ? 'status-on-track' : 'status-at-risk'}">
                    ${b.growth2026 >= 0 ? '+' : ''}${b.growth2026}%
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

    <!-- Detailed Monthly Breakdown Table 2026 vs 2025 -->
    <div class="table-card">
      <div class="chart-card-header">
        <div class="chart-card-title">
          <i data-lucide="calendar" style="color: var(--accent-okr);"></i>
          <span>Tabel Realisasi Sales Bulanan 2026 (Januari - Juli)</span>
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
            ${[0,1,2,3,4,5,6].map(mIdx => {
              const monthName = realSalesData.months[mIdx];
              const isJuliCeremonial = (mIdx === 6);
              return `
                <tr style="${isJuliCeremonial ? 'background: rgba(245, 158, 11, 0.18); border-left: 4px solid var(--accent-gold); font-weight: 700;' : ''}">
                  <td>
                    ${isJuliCeremonial 
                      ? `<strong style="color: var(--accent-gold); display: inline-flex; align-items: center; gap: 6px;"><i data-lucide="sparkles" style="width:16px; height:16px; color:var(--accent-gold);"></i> Juli (Ceremonial Month)</strong>`
                      : `<strong>${monthName}</strong>`
                    }
                  </td>
                  ${realSalesData.branches.map(b => {
                    const val = realSalesData.sales2026[b.id][mIdx];
                    return `<td style="text-align:right; ${isJuliCeremonial ? 'color: var(--accent-gold); font-weight: 800;' : ''}">${formatRupiah(val)}</td>`;
                  }).join('')}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dedicated B2B Performance & Cash In Analysis Table (Transcribed from User Google Sheet) -->
    <div class="table-card" style="margin-top:24px; border: 1px solid rgba(139, 92, 246, 0.35);">
      <div class="chart-card-header" style="background: rgba(139, 92, 246, 0.12); padding: 14px 18px; border-bottom: 1px solid rgba(139, 92, 246, 0.3); display:flex; justify-content:space-between; align-items:center;">
        <div class="chart-card-title">
          <i data-lucide="badge-dollar-sign" style="color: #8B5CF6; width: 22px; height: 22px;"></i>
          <span style="font-size: 1.05rem; font-weight: 800; color: #FFF;">Detail Laporan B2B Sales YTD: ACV Sales & Cash In (2025 vs 2026)</span>
        </div>
        <span class="status-pill status-achieved" style="font-size: 0.78rem; background: rgba(139, 92, 246, 0.25); color: #C4B5FD; border: 1px solid #8B5CF6;">
          <i data-lucide="trending-up" style="width:13px; height:13px; display:inline;"></i> +101.5% YoY Growth ACV
        </span>
      </div>

      <!-- B2B KPI Executive Scorecard Bar -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; padding: 16px; background: rgba(15, 23, 42, 0.6); border-bottom: 1px solid rgba(255,255,255,0.06);">
        <div style="background: rgba(255,255,255,0.03); padding: 12px 14px; border-radius: 8px; border-left: 3px solid #8B5CF6;">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600; display: block;">TARGET SALES B2B 2026 (JAN-JUL)</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: #FFF; font-family: monospace;">Rp 3.540.000.000</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px 14px; border-radius: 8px; border-left: 3px solid #10B981;">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600; display: block;">REALISASI ACV SALES 2026</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: #10B981; font-family: monospace;">Rp 2.273.261.511</span>
          <span style="font-size: 0.7rem; color: #A7F3D0; font-weight: 700; display: block;">(64.2% Achv | +101.5% YoY)</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px 14px; border-radius: 8px; border-left: 3px solid #06B6D4;">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600; display: block;">REALISASI CASH IN 2026</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: #06B6D4; font-family: monospace;">Rp 1.788.851.842</span>
          <span style="font-size: 0.7rem; color: #67E8F9; font-weight: 700; display: block;">(50.5% Achv | +319.9% YoY)</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); padding: 12px 14px; border-radius: 8px; border-left: 3px solid var(--accent-gold);">
          <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600; display: block;">BASELINE CASH IN 2025 (JAN-JUL)</span>
          <span style="font-size: 1.15rem; font-weight: 800; color: var(--accent-gold); font-family: monospace;">Rp 426.049.016</span>
          <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600; display: block;">(Full Year 2025: Rp 1,62 M)</span>
        </div>
      </div>

      <div style="overflow-x:auto;">
        <table class="custom-table" style="font-size: 0.82rem;">
          <thead>
            <tr style="background: #1E293B; color: #FFF;">
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

              const isJuli = (mIdx === 6);
              const isFuture = (mIdx >= 7);

              const achvAcv = acv26 > 0 ? ((acv26 / target) * 100).toFixed(2) + '%' : '0.00%';
              const achvCash = cash26 > 0 ? ((cash26 / target) * 100).toFixed(2) + '%' : '0.00%';
              
              let growthYoYStr = '-100.00%';
              if (acv26 > 0 && acv25 > 0) {
                const g = (((acv26 - acv25) / acv25) * 100).toFixed(2);
                growthYoYStr = (g >= 0 ? '+' : '') + g + '%';
              } else if (acv26 > 0 && acv25 === 0) {
                growthYoYStr = '+100.00%';
              }

              return `
                <tr style="${isJuli ? 'background: rgba(245, 158, 11, 0.18); border-left: 4px solid var(--accent-gold); font-weight: 700;' : (isFuture ? 'opacity: 0.55;' : '')}">
                  <td>
                    ${isJuli 
                      ? `<strong style="color: var(--accent-gold); display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="sparkles" style="width:14px; height:14px; color:var(--accent-gold);"></i> JULI</strong>`
                      : `<strong>${monthName.toUpperCase()}</strong>`
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

            <!-- TOTAL YTD (JULI) SUMMARY ROW -->
            <tr style="background: rgba(139, 92, 246, 0.2); font-weight: 800; border-top: 2px solid #8B5CF6;">
              <td style="color: #FFF;">TOTAL MTD (JULI) / YTD</td>
              <td style="text-align:right; color:#FFF;">Rp 3.540.000.000</td>
              <td style="text-align:right; color:#FFF;">Rp 1.128.261.495</td>
              <td style="text-align:right; color:#FFF;">Rp 426.049.016</td>
              <td style="text-align:right; color:#10B981;">Rp 2.273.261.511</td>
              <td style="text-align:right; color:#06B6D4;">Rp 1.788.851.842</td>
              <td style="text-align:center; color:#10B981;">64.22%</td>
              <td style="text-align:center; color:#06B6D4;">50.53%</td>
              <td style="text-align:center; color:#10B981;">+101.48%</td>
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

window.updateBranchChartFilter = function(branchId) {
  state.selectedBranch = branchId;
  renderCurrentView();
};

function initSalesCharts() {
  const trendCtx = document.getElementById('realSalesTrendChart');
  const pieCtx = document.getElementById('realSalesPieChart');

  if (trendCtx) {
    if (state.activeChartInstances.realSalesTrend) {
      state.activeChartInstances.realSalesTrend.destroy();
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
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
            label: '2026 (Jan-Jul)',
            data: data2026InM,
            rawValues: raw2026,
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: '#10B981',
            borderWidth: 1,
            borderRadius: 6,
            order: 2
          },
          {
            type: 'line',
            label: '2025 Trendline (Jan-Jul)',
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
      <tr>
        <td><strong>${realSalesData.months[i]}</strong></td>
        <td style="color:var(--accent-sales);">${i < 7 ? formatRupiah(rows2026[i]) : '-'}</td>
        <td>${formatRupiah(rows2025[i])}</td>
      </tr>
    `;
  }

  tableHtml += `</tbody></table>`;

  openModal(
    `Detail Realisasi Sales: ${branch.name}`,
    `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p><strong>YTD 2026 (Jan-Jul):</strong> <span style="color:var(--accent-sales); font-weight:800; font-size:1.1rem;">${formatRupiah(branch.ytd2026)}</span> (Growth vs 2025: ${branch.growth2026}%)</p>
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
  const unitData = mockData.kpiPerformance[subId] || mockData.kpiPerformance['kpi-bt'];

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
          <h2 style="font-size:1.25rem; font-weight:800; color:#FFF; display:flex; align-items:center; gap:10px; margin:0;">
            ${getUnitLogoHtml(subId, 32)}
            <span>Header Scorecard KPI Juli 2026 — ${unitData.unitName}</span>
          </h2>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:4px;">
            Skor Terbobot Konsolidasi Overall: <strong style="color:var(--accent-gold); font-size:1.05rem;">${unitData.overallScore}%</strong>
          </p>
        </div>

        <!-- Filter Interaktif Dropdown & Reset -->
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="font-size:0.85rem; color:var(--text-secondary); font-weight:600;"><i data-lucide="filter" style="width:14px; height:14px; display:inline;"></i> Filter Departemen:</span>
          <select class="chart-filter" id="kpiDeptSelect" onchange="window.handleKPIDeptFilterChange(this.value)" style="background:var(--bg-card); border:1px solid var(--accent-gold); color:#FFF; padding:8px 14px; border-radius:var(--radius-sm); font-size:0.85rem; font-weight:700; cursor:pointer;">
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
                 style="background:${isSelected ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-card)'}; 
                        border:2px solid ${isSelected ? 'var(--accent-gold)' : c.color + '50'}; 
                        box-shadow: ${isSelected ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none'};
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
        <div class="table-card" style="border:1px solid rgba(239, 68, 68, 0.4); background:rgba(239, 68, 68, 0.05); padding:16px;">
          <div class="chart-card-header" style="border-bottom:1px solid rgba(239, 68, 68, 0.2); padding-bottom:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <div class="chart-card-title" style="color:#EF4444; font-weight:800; font-size:0.95rem;">
              <i data-lucide="alert-triangle" style="color:#EF4444;"></i>
              <span>Red Flag Panel (%ACV < 70%)</span>
              <span style="background:rgba(239, 68, 68, 0.2); color:#EF4444; font-size:0.7rem; padding:2px 6px; border-radius:10px; font-weight:700;">
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
                      <strong style="color:#FFF; display:block;">${rf.objective}</strong>
                      <span style="font-size:0.72rem; color:var(--text-secondary);">${rf.dept}</span>
                    </td>
                    <td style="text-align:right; font-family:monospace; color:var(--text-secondary);">${rf.target || '-'}</td>
                    <td style="text-align:right; font-family:monospace; color:#EF4444; font-weight:700;">${rf.actual}</td>
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
        <div class="table-card" style="border:1px solid rgba(245, 158, 11, 0.4); background:rgba(245, 158, 11, 0.03); padding:16px;">
          <div class="chart-card-header" style="border-bottom:1px solid rgba(245, 158, 11, 0.2); padding-bottom:10px; margin-bottom:10px;">
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
                      <span style="font-size:0.72rem; color:#FFF;">${v.dept}</span>
                    </td>
                    <td>
                      <div style="color:#FCA5A5; font-size:0.75rem; margin-bottom:2px;">${v.pelanggaran}</div>
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
        <h3 style="font-size:1.1rem; font-weight:800; color:#FFF; margin:0; display:flex; align-items:center; gap:8px;">
          <i data-lucide="layers" style="color:var(--accent-kpi);"></i>
          Rincian Scorecard Departemen (${filteredDepartments.length} Departemen Tampil)
        </h3>
      </div>

      ${filteredDepartments.map(dept => `
        <div class="table-card" style="margin-bottom:20px; border-left:4px solid var(--accent-kpi);">
          <div class="chart-card-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">
            <div class="chart-card-title">
              <span style="font-size:1.05rem; font-weight:800; color:#FFF;">${dept.name}</span>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="status-pill ${dept.statusClass}" style="font-size:0.85rem; font-weight:800; padding:4px 12px;">
                Score KPI: ${dept.score}%
              </span>
            </div>
          </div>

          ${dept.perspectives.map(p => `
            <div style="margin-bottom:16px;">
              <div style="background:rgba(255,255,255,0.03); padding:6px 12px; border-radius:6px; border-left:3px solid var(--accent-kpi); margin-bottom:8px; font-weight:700; font-size:0.85rem; color:#FFF; display:flex; justify-content:space-between;">
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
  const unitData = mockData.kpiPerformance[subId] || mockData.kpiPerformance['kpi-bt'];

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
// VIEW 3: HEAD TO HEAD (Strictly Real Juni 2026 Data: BT vs TKB)
// --------------------------------------------------------------------------
function renderHeadToHead() {
  const h2h = mockData.headToHead;
  const s = h2h.summary;

  const selectedCat = state.h2hCategoryFilter || 'all';

  // Filter items based on selected category dropdown
  const filteredItems = h2h.items.filter(item => {
    if (selectedCat === 'all') return true;
    return item.cat.toLowerCase() === selectedCat.toLowerCase();
  });

  return `
    <!-- Top Executive Leaderboard Card -->
    <div style="background:var(--bg-card); border:1px solid var(--accent-gold); border-radius:var(--radius-md); padding:20px; margin-bottom:24px; position:relative; overflow:hidden;">
      <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, #10B981, #F59E0B, #06B6D4);"></div>
      
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
        <!-- Left: BT Status -->
        <div style="flex:1; min-width:260px; display:flex; align-items:center; gap:16px; background:rgba(16, 185, 129, 0.08); padding:16px; border-radius:var(--radius-sm); border:1px solid rgba(16, 185, 129, 0.3);">
          <div style="width:52px; height:52px; border-radius:50%; background:#10B981; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:1.5rem; box-shadow:0 0 16px rgba(16, 185, 129, 0.4); flex-shrink:0;">
            <i data-lucide="crown"></i>
          </div>
          <div>
            <span style="font-size:0.78rem; color:#A7F3D0; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; display:block;">Pemenang H2H (VS Actual & Target)</span>
            <h3 style="font-size:1.25rem; font-weight:800; color:#FFF; margin:2px 0;">Batik Trusmi (BT)</h3>
            <div style="display:flex; gap:10px; margin-top:4px; font-size:0.8rem; font-weight:700;">
              <span style="color:#10B981;">VS Actual: <strong>${s.vsActual.btWins} WIN</strong></span>
              <span style="color:var(--accent-gold);">• VS Target: <strong>${s.vsTarget.btWins} WIN</strong></span>
            </div>
          </div>
        </div>

        <!-- Center: VS Badge -->
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
          <div style="width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg, #EC4899, #8B5CF6); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.2rem; color:#FFF; box-shadow:0 0 20px rgba(236,72,153,0.5);">
            VS
          </div>
          <span style="font-size:0.72rem; color:var(--text-secondary); margin-top:6px; font-weight:600;">H2H Juni 2026</span>
          <button class="btn-ceremony" onclick="triggerConfettiCelebration()" style="padding:4px 12px; font-size:0.72rem; margin-top:6px;">
            <i data-lucide="sparkles" style="width:12px; height:12px;"></i> Selebrasi BT
          </button>
        </div>

        <!-- Right: TKB Status -->
        <div style="flex:1; min-width:260px; display:flex; align-items:center; gap:16px; background:rgba(6, 182, 212, 0.08); padding:16px; border-radius:var(--radius-sm); border:1px solid rgba(6, 182, 212, 0.3);">
          <div style="width:52px; height:52px; border-radius:50%; background:#06B6D4; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:1.5rem; box-shadow:0 0 16px rgba(6, 182, 212, 0.4); flex-shrink:0;">
            <i data-lucide="store"></i>
          </div>
          <div>
            <span style="font-size:0.78rem; color:#67E8F9; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; display:block;">Runner-Up H2H</span>
            <h3 style="font-size:1.25rem; font-weight:800; color:#FFF; margin:2px 0;">The Keranjang Bali (TKB)</h3>
            <div style="display:flex; gap:10px; margin-top:4px; font-size:0.8rem; font-weight:700;">
              <span style="color:#EF4444;">VS Actual: <strong>${s.vsActual.tkbWins} WIN</strong></span>
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
          <span>Perbandingan Total Skor KPI (%) Per Kategori (Batik Trusmi vs The Keranjang Bali)</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary); font-weight:600;">
          <span style="display:inline-block; width:10px; height:10px; background:#10B981; border-radius:2px; margin-right:4px;"></span> BT
          <span style="display:inline-block; width:10px; height:10px; background:#06B6D4; border-radius:2px; margin-left:10px; margin-right:4px;"></span> TKB
        </div>
      </div>
      <div class="chart-wrapper" style="height:320px;">
        <canvas id="h2hBarChart"></canvas>
      </div>
    </div>

    <!-- Matriks Perbandingan Detail (Dengan Dropdown Filter Kategori & Tampilan Sangat Rapi) -->
    <div class="table-card" style="border:1px solid rgba(245, 158, 11, 0.3);">
      
      <!-- Filter Dropdown & Quick Pills -->
      <div class="chart-card-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; border-bottom:1px solid var(--border-color); padding-bottom:14px; margin-bottom:16px;">
        <div>
          <h3 style="font-size:1.05rem; font-weight:800; color:#FFF; margin:0; display:flex; align-items:center; gap:8px;">
            <i data-lucide="filter" style="color:var(--accent-gold); width:18px; height:18px;"></i>
            Matriks Perbandingan H2H Juni 2026
          </h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">Filter berdasarkan kategori untuk membaca data lebih fokus dan mudah</p>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="font-size:0.82rem; color:var(--text-secondary); font-weight:700;">Filter Kategori:</span>
          
          <select id="h2hCatSelect" onchange="window.handleH2HCatFilterChange(this.value)" 
                  style="background:var(--bg-card); border:2px solid var(--accent-gold); color:#FFF; padding:8px 14px; border-radius:var(--radius-sm); font-size:0.85rem; font-weight:800; cursor:pointer;">
            <option value="all" ${selectedCat === 'all' ? 'selected' : ''}>Semua Kategori (14 Indikator)</option>
            <option value="Revenue" ${selectedCat === 'Revenue' ? 'selected' : ''}>1. Revenue (BT 77.98% vs TKB 38.85%)</option>
            <option value="Operational" ${selectedCat === 'Operational' ? 'selected' : ''}>2. Operational (BT 89.81% vs TKB 70.70%)</option>
            <option value="Marketing" ${selectedCat === 'Marketing' ? 'selected' : ''}>3. Marketing (BT 56.51% vs TKB 52.20%)</option>
            <option value="Ecommerce" ${selectedCat === 'Ecommerce' ? 'selected' : ''}>4. Ecommerce (BT 57.16% vs TKB 20.44%)</option>
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
            <tr style="background:rgba(255,255,255,0.03);">
              <th rowspan="2" style="vertical-align:middle; text-align:left; border-radius:6px 0 0 6px;">Kategori</th>
              <th rowspan="2" style="vertical-align:middle; text-align:left;">Point Check</th>
              <th rowspan="2" style="vertical-align:middle; text-align:center;">Bobot</th>
              <th colspan="4" style="text-align:center; background:rgba(16, 185, 129, 0.15); color:#A7F3D0; font-weight:800; border-bottom:1px solid rgba(16, 185, 129, 0.3);">Batik Trusmi (BT)</th>
              <th colspan="4" style="text-align:center; background:rgba(6, 182, 212, 0.15); color:#67E8F9; font-weight:800; border-bottom:1px solid rgba(6, 182, 212, 0.3);">The Keranjang Bali (TKB)</th>
              <th colspan="2" style="text-align:center; background:rgba(245, 158, 11, 0.15); color:var(--accent-gold); font-weight:800; border-bottom:1px solid rgba(245, 158, 11, 0.3); border-radius:0 6px 6px 0;">Pemenang H2H</th>
            </tr>
            <tr style="background:rgba(255,255,255,0.02);">
              <!-- BT Headers -->
              <th style="text-align:right; color:var(--text-secondary); background:rgba(16, 185, 129, 0.05);">Target</th>
              <th style="text-align:right; color:#10B981; background:rgba(16, 185, 129, 0.05);">Actual</th>
              <th style="text-align:center; color:#A7F3D0; background:rgba(16, 185, 129, 0.05);">%ACV</th>
              <th style="text-align:center; color:var(--accent-gold); background:rgba(16, 185, 129, 0.05);">Score</th>
              <!-- TKB Headers -->
              <th style="text-align:right; color:var(--text-secondary); background:rgba(6, 182, 212, 0.05);">Target</th>
              <th style="text-align:right; color:#06B6D4; background:rgba(6, 182, 212, 0.05);">Actual</th>
              <th style="text-align:center; color:#67E8F9; background:rgba(6, 182, 212, 0.05);">%ACV</th>
              <th style="text-align:center; color:#06B6D4; background:rgba(6, 182, 212, 0.05);">Score</th>
              <!-- VS Headers -->
              <th style="text-align:center; background:rgba(245, 158, 11, 0.05);">VS Actual</th>
              <th style="text-align:center; background:rgba(245, 158, 11, 0.05);">VS Target</th>
            </tr>
          </thead>
          <tbody>
            ${filteredItems.map((item, idx) => {
              const isFirstInCat = idx === 0 || filteredItems[idx - 1].cat !== item.cat;
              const catItemsCount = filteredItems.filter(i => i.cat === item.cat).length;
              const catObj = h2h.categoryScores.find(c => c.category === item.cat);

              const vsActBadge = item.vsAct === 'BT' 
                ? '<span style="display:inline-block; background:rgba(16, 185, 129, 0.2); color:#10B981; border:1px solid rgba(16, 185, 129, 0.5); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">BT WIN</span>'
                : (item.vsAct === 'TKB' 
                    ? '<span style="display:inline-block; background:rgba(245, 158, 11, 0.2); color:#F59E0B; border:1px solid rgba(245, 158, 11, 0.5); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">TKB WIN</span>'
                    : '<span style="display:inline-block; background:rgba(59, 130, 246, 0.2); color:#60A5FA; border:1px solid rgba(59, 130, 246, 0.5); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">DRAW</span>');

              const vsTgtBadge = item.vsTgt === 'BT' 
                ? '<span style="display:inline-block; background:rgba(16, 185, 129, 0.2); color:#10B981; border:1px solid rgba(16, 185, 129, 0.5); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">BT WIN</span>'
                : (item.vsTgt === 'TKB' 
                    ? '<span style="display:inline-block; background:rgba(245, 158, 11, 0.2); color:#F59E0B; border:1px solid rgba(245, 158, 11, 0.5); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">TKB WIN</span>'
                    : '<span style="display:inline-block; background:rgba(59, 130, 246, 0.2); color:#60A5FA; border:1px solid rgba(59, 130, 246, 0.5); font-size:0.75rem; padding:3px 10px; font-weight:800; border-radius:6px;">DRAW</span>');

              return `
                <tr style="background:rgba(255,255,255,0.015); transition:all 0.15s ease;">
                  ${isFirstInCat ? `
                    <td rowspan="${catItemsCount}" style="vertical-align:middle; font-weight:800; color:#FFF; background:rgba(245, 158, 11, 0.04); border-right:1px solid rgba(245, 158, 11, 0.2); padding:12px;">
                      <div style="font-size:0.95rem; color:#FFF;">${item.cat}</div>
                      <div style="font-size:0.75rem; color:var(--accent-gold); margin-top:6px; font-weight:700; line-height:1.4;">
                        <span style="color:#10B981;">BT: ${catObj ? catObj.btScore : ''}%</span><br>
                        <span style="color:#06B6D4;">TKB: ${catObj ? catObj.tkbScore : ''}%</span>
                      </div>
                    </td>
                  ` : ''}
                  <td style="padding:10px 12px;"><strong style="color:#FFF; font-size:0.85rem;">${item.point}</strong></td>
                  <td style="text-align:center; font-family:monospace; color:var(--text-secondary);">${item.bobot}</td>
                  <!-- BT Values -->
                  <td style="text-align:right; font-family:monospace; color:var(--text-secondary);">${item.btTarget}</td>
                  <td style="text-align:right; font-family:monospace; color:#10B981; font-weight:800;">${item.btAct}</td>
                  <td style="text-align:center; font-weight:800; color:#A7F3D0;">${item.btAcv}</td>
                  <td style="text-align:center; font-family:monospace; color:var(--accent-gold); font-weight:800;">${item.btScore}</td>
                  <!-- TKB Values -->
                  <td style="text-align:right; font-family:monospace; color:var(--text-secondary);">${item.tkbTarget}</td>
                  <td style="text-align:right; font-family:monospace; color:#06B6D4; font-weight:800;">${item.tkbAct}</td>
                  <td style="text-align:center; font-weight:800; color:#67E8F9;">${item.tkbAcv}</td>
                  <td style="text-align:center; font-family:monospace; color:#06B6D4; font-weight:800;">${item.tkbScore}</td>
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
  const h2h = mockData.headToHead;

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
  projects: [
    {
      id: 'cirebon',
      name: 'Premium Cirebon',
      objectives: [
        {
          id: '1.1',
          name: 'Objective 1.1 — Perbaikan dan Renovasi Area Ceiling',
          targetOutput: 'Perbaikan area bocor & perkuat struktur ceiling untuk redesign interior premium',
          targetOutcome: 'Zero complain fasilitas',
          budget: null,
          krs: [
            { code: '1.1.1', title: 'Pengecekan atap premium', output: 'Survey & analisis masalah ceiling', deadline: '31 Jan 2026', status: 'Done', link: '📄 Doc Survey' },
            { code: '1.1.2', title: 'Perbaikan area atap', output: 'Kendala bocor terselesaikan sampai akar masalah', deadline: '15 Feb 2026', status: 'Done', link: '📄 Laporan Perbaikan' },
            { code: '1.1.3', title: 'Fiksasi vendor perbaikan atap', output: 'Vendor terpercaya (Biaya/Mutu/Waktu) difiksasi', deadline: '15 Mar 2026', status: 'Done', link: '🔗 Kontrak Vendor' },
            { code: '1.1.4', title: 'RAB approval', output: 'RAB versi final disetujui', deadline: '31 Agu 2026', status: 'Hold', note: 'Hold (mencari strategi Premium Cirebon baru)', link: '📄 Draft RAB' },
            { code: '1.1.5', title: 'Belanja Material', output: 'Material sudah datang', deadline: '31 Agu 2026', status: 'Hold', link: '🔗 Daftar Material' },
            { code: '1.1.6', title: 'Pengerjaan Perbaikan Ceiling Tahap 1', output: 'Perbaikan AC Outdoor & Talang Air', deadline: '31 Agu 2026', status: 'Hold', link: '📄 WO AC & Talang' },
            { code: '1.1.8', title: 'Pengerjaan Perbaikan Ceiling Tahap 2', output: 'Perbaikan spandex struktur ceiling', deadline: '31 Agu 2026', status: 'Hold', link: '📄 Specs Spandex' }
          ]
        },
        {
          id: '1.2',
          name: 'Objective 1.2 — Perluasan Area ke arah stand kain & ganti konsep ceiling/interior/floor',
          targetOutput: 'Area premium bisa beroperasi',
          targetOutcome: 'Penjualan produk premium naik 20%',
          budget: { target: 'Rp1.000.000.000', actual: 'Rp50.250.000', percent: '5.0%' },
          krs: [
            { code: '1.2.1', title: 'Pembuatan Konsep Area', output: 'Layout & Konsep Area Premium disetujui', deadline: '24 Jan 2026', status: 'Done', link: '📄 Layout Concept' },
            { code: '1.2.2', title: 'Hiring Freelance Interior', output: '1 Freelance Interior', deadline: '28 Feb 2026', status: 'Done', link: '🔗 Contract Designer' },
            { code: '1.2.3', title: 'Model 3D', output: 'Model 3D final disetujui', deadline: '11 Jul 2026', status: 'Progress Overdue', link: '📄 Render 3D' },
            { code: '1.2.4', title: 'Gambar Kerja dan RAB', output: 'Gambar Kerja & RAB Final disetujui', deadline: '16 Jul 2026', status: 'Not Started Overdue', link: '📄 Blueprint & RAB' },
            { code: '1.2.5', title: 'Finalisasi Vendor & Spesifikasi Material', output: 'Vendor difiksasi', deadline: '16 Jul 2026', status: 'Not Started Overdue', link: '🔗 Vendor List' },
            { code: '1.2.6', title: 'Pembelian Material', output: 'Material dibeli', deadline: '31 Jul 2026', status: 'Not Started Overdue', link: '📄 PO Material' },
            { code: '1.2.7', title: 'Pengerjaan Area Stand Tahap 1', output: 'Redesign konsep & konstruksi Ceiling', deadline: '15 Agu 2026', status: 'Not Started Overdue', link: '📄 Timeline Konstruksi' },
            { code: '1.2.8', title: 'Pengerjaan Area Stand Tahap 2', output: 'Perluasan area premium', deadline: '15 Jul 2026', status: 'Not Started Overdue', link: '📄 Layout Expansion' },
            { code: '1.2.9', title: 'Pengerjaan Area Stand Tahap 3', output: 'Redesign konsep interior & flooring', deadline: '15 Agu 2026', status: 'Belum Mulai', link: '📄 Flooring Specs' }
          ]
        },
        {
          id: '2.1',
          name: 'Objective 2.1 — Pembuatan Rules & SOP (SDM)',
          targetOutput: 'Rules Pelayanan Premium seperti Wolter',
          targetOutcome: 'Peningkatan WOM & 20% traffic ke toko',
          budget: null,
          krs: [
            { code: '2.1.1', title: 'Pembuatan Rules Pelayanan', output: '100% Sesuai', deadline: '26 Jan 2026', status: 'Done', link: '📄 Dokumen Rules' },
            { code: '2.1.2', title: 'Skema Training & Pelatihan SDM', output: '100% Sesuai', deadline: '29 Jan 2026', status: 'Done', link: '📄 Modul Training' },
            { code: '2.1.3', title: 'Skema Reward & Punishment', output: '100% Sesuai', deadline: '31 Jan 2026', status: 'Done', link: '📄 Matrix Reward' }
          ]
        },
        {
          id: '2.2',
          name: 'Objective 2.2 — Pemenuhan SDM',
          targetOutput: '100% terpenuhi',
          targetOutcome: 'Peningkatan 20% traffic ke toko',
          budget: null,
          krs: [
            { code: '2.2.1', title: 'Pencarian SDM', output: '100% Terpenuhi', deadline: '15 Feb 2026', status: 'Done', link: '🔗 Database Kandidat' },
            { code: '2.2.2', title: 'Training SDM', output: '100% Berjalan', deadline: '28 Feb 2026', status: 'Done', link: '📄 Absensi Training' }
          ]
        },
        {
          id: '3.1',
          name: 'Objective 3.1 — Komposisi Produk Premium',
          targetOutput: 'Komposisi 70% Pria, 20% Wanita, 10% Kain',
          targetOutcome: 'Peningkatan 30% penjualan produk pria',
          budget: null,
          krs: [
            { code: '3.1.1', title: 'Pembuatan Kuncian Produk', output: '100% Keterlaksanaan', deadline: '26 Jan 2026', status: 'Done', link: '📄 Kuncian Produk' },
            { code: '3.1.2', title: 'Kurasi Pemenuhan Produk', output: '1 Moodboard', deadline: '9 Feb 2026', status: 'Done', link: '📄 Moodboard' },
            { code: '3.1.3', title: 'Distribusi Produk', output: 'Approval Design', deadline: '16 Feb 2026', status: 'Done', link: '📄 Approval Design' },
            { code: '3.1.4', title: 'Re Launching & Display Area', output: '100% Display Produk', deadline: '1 Mar 2026', status: 'Done', link: '📄 Photo Display' }
          ]
        },
        {
          id: '3.2',
          name: 'Objective 3.2 — Produk New Premium',
          targetOutput: 'Komposisi 70% Pria, 20% Wanita, 10% Kain',
          targetOutcome: 'Peningkatan 30% penjualan produk pria',
          budget: null,
          krs: [
            { code: '3.2.1', title: 'Fiksasi Design', output: '100% Sesuai', deadline: '13 Mei 2026', status: 'Done', link: '📄 Design Deck' },
            { code: '3.2.2', title: 'Sample', output: '100% Sesuai', deadline: '1 Agu 2026', status: 'Progress Overdue', link: '📄 Sample Review' },
            { code: '3.2.3', title: 'Mass Production', output: '100% Sesuai', deadline: '31 Agu 2026', status: 'Belum Mulai', link: '📄 PO Pabrik' }
          ]
        }
      ]
    },
    {
      id: 'jakarta',
      name: 'Premium Jakarta',
      objectives: [
        {
          id: '1.0',
          name: '1. Infra (Due: 31 Agu 2026)',
          targetOutput: '100% Store Premium Jakarta bisa beroperasi',
          targetOutcome: 'Peningkatan Traffic',
          budget: null,
          krs: [
            { code: '1.1', title: 'Interior Fixtures (lemari, lighting, rak)', urgency: 'Middle', output: 'Ready digunakan', actual: 'Progress ±90%, furniture mayoritas selesai, pintu kaca selesai, sisa cermin/km/pintu gudang', deadline: '31 Agu 2026', status: 'Done', link: '📄 Photo Fixtures' },
            { code: '1.2', title: 'Sofa & Table', urgency: 'Middle', output: 'Ready digunakan', actual: 'Main sofa diproduksi vendor Dimitri, bench sample vendor Agra, estimasi selesai 11 Agu 2026', deadline: '31 Agu 2026', status: 'Done', link: '🔗 PO Dimitri & Agra' },
            { code: '1.3', title: 'Vendor Laser Cutting', urgency: 'High', output: 'Dealing Vendor', actual: '3 vendor dibandingkan, termurah Rp148.912.000, revisi tulisan "Casual & Luxury Batik"', deadline: '31 Agu 2026', status: 'Done', link: '📄 Comparison Vendor' },
            { code: '1.4', title: 'Pekerjaan Lasercut dan Logo', urgency: 'High', output: 'Selesai', actual: 'Estimasi 3 minggu setelah deal, logo pakai konsep MOMEN, tanggal deal belum ada', deadline: '31 Agu 2026', status: 'Progres', link: '📄 Draft Lasercut' }
          ]
        },
        {
          id: '2.0',
          name: '2. Experience (Due: 31 Agu 2026)',
          targetOutput: 'Ambience & Display Mahal Approved',
          targetOutcome: 'Peningkatan Traffic & Retensi Store',
          budget: null,
          krs: [
            { code: '2.1', title: 'Pengadaan Speaker', urgency: 'Middle', output: '7 titik', actual: 'Speaker dibeli, jadwal pasang minggu ini, tunggu 3 unit dari Denpasar', deadline: '31 Agu 2026', status: 'Done', link: '📄 Resi Pengiriman' },
            { code: '2.2', title: 'Pemilihan Ambience Lighting', urgency: 'Middle', output: 'All Rak', actual: 'Arahan lighting diberikan, interior ±90%, lighting spesifik belum konfirmasi', deadline: '31 Agu 2026', status: 'Done', link: '📄 Layout Lighting' },
            { code: '2.3', title: 'Pemilihan Wangi (ambience parfume)', urgency: 'Middle', output: 'Approved', actual: '1 opsi aroma diperoleh, approval & vendor final belum terkonfirmasi', deadline: '31 Agu 2026', status: 'Progres', link: '📄 Sample Parfume' },
            { code: '2.4', title: 'Experience Display (produk terlihat mahal)', urgency: 'Middle', output: 'Approved', actual: 'Konsep disetujui, figura kemeja dibuat & dipasang, katalog jahit masih desain', deadline: '31 Agu 2026', status: 'Done', link: '📄 Concept Display' },
            { code: '2.5', title: 'Experience Display pada dinding', urgency: 'Middle', output: 'Approved', actual: 'Opsi disetujui, pembuatan display & quotes visual berjalan', deadline: '31 Agu 2026', status: 'Revisi', link: '📄 Visual Quotes' }
          ]
        },
        {
          id: '3.0',
          name: '3. SDM (Due: 31 Juli 2026)',
          targetOutput: 'SOP Baku beserta implementasi',
          targetOutcome: 'Ketersediaan kuantitas & kualitas SDM',
          budget: null,
          krs: [
            { code: '3.1', title: 'Design Produk Seragam SPG', urgency: 'Middle', output: 'Design Approve', actual: 'Desain awal ada, masih direvisi, cari alternatif desain pria', deadline: '31 Jul 2026', status: 'Revisi', link: '📄 Draft Seragam' },
            { code: '3.2', title: 'Pencarian Head Pengalaman', urgency: 'High', output: 'Ready SDM', actual: 'Diarahkan cari Product Consultant', deadline: '31 Jul 2026', status: 'Progres', link: '🔗 List Candidate' },
            { code: '3.3', title: 'Pencarian SDM Penjahit', urgency: 'High', output: 'Ready SDM', actual: 'Belum ada update kandidat', deadline: '31 Jul 2026', status: 'Progres', link: '📄 Status Penjahit' },
            { code: '3.4', title: '60% SDM baru', urgency: 'Low', output: '—', actual: 'Belum ada data kebutuhan/realisasi', deadline: '31 Jul 2026', status: 'Belum Mulai', link: '📄 Plan HR' },
            { code: '3.5', title: 'SOP cara ngomong ke customer', urgency: 'Low', output: 'SOP Tersedia', actual: 'SOP dibuat, perlu evaluasi manager berpengalaman', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Communication' },
            { code: '3.6', title: 'SOP cara menarik desire beli', urgency: 'Low', output: 'SOP Tersedia', actual: 'Sama, perlu evaluasi manager', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Upselling' },
            { code: '3.7', title: 'SOP Penyajian minum', urgency: 'Low', output: 'SOP Tersedia', actual: 'SOP dibuat, approval final belum diinfo', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Hospitality' },
            { code: '3.8', title: 'Cara Grooming', urgency: 'Low', output: 'SOP Tersedia', actual: 'SOP dibuat, approval final belum diinfo', deadline: '31 Jul 2026', status: 'Done', link: '📄 SOP Grooming' }
          ]
        },
        {
          id: '4.0',
          name: '4. Marketing (Due: 31 Juli 2026)',
          targetOutput: 'Konsep Deck & Campaign',
          targetOutcome: 'Tetap ada marketing sebelum launching',
          budget: null,
          krs: [
            { code: '4.1', title: 'Konsep Experience', urgency: 'High', output: 'Konsep Deck', actual: 'Selesai, dipakai dasar eksekusi', deadline: '31 Jul 2026', status: 'Done', link: '📄 Deck Exp' },
            { code: '4.2', title: 'Konsep Campaign', urgency: 'Middle', output: 'Konsep Deck', actual: 'Konsep placement/traffic/soft launching disusun, belum final deck/approval', deadline: '31 Jul 2026', status: 'Done', link: '📄 Deck Campaign' },
            { code: '4.3', title: 'Konsep Per Produk (per Section)', urgency: 'Middle', output: 'Konsep Deck', actual: 'Dipresentasikan & disetujui, eksekusi dipantau di KR Experience Display', deadline: '31 Jul 2026', status: 'Done', link: '📄 Deck Product' },
            { code: '4.4', title: 'Logo Megah Batik', urgency: 'Middle', output: 'Approve Design', actual: 'Keputusan final logo MOMEN, revisi nama/logo mundur (keputusan owner)', deadline: '31 Jul 2026', status: 'Done', link: '📄 Final Logo MOMEN' },
            { code: '4.5', title: 'Optimasi Instagram', urgency: '—', output: '—', actual: 'Rencana manfaatkan audiens IG Batik Wolter tersedia, belum ada bukti implementasi', deadline: '31 Jul 2026', status: 'Progres', link: '🔗 Account Wolter' }
          ]
        },
        {
          id: '5.0',
          name: '5. Produk (Due: 31 Sept 2026)',
          targetOutput: 'Kapasitas display 1.052 pcs dengan 15% new produk (155 pcs)',
          targetOutcome: 'Provide kebutuhan store untuk tingkatkan Sales Store',
          budget: null,
          krs: [
            { code: '5.1', title: 'Percepatan Pemenuhan dengan Beli Produk', urgency: 'High', output: '100 pcs', actual: 'Diarahkan target 100 pcs, jumlah realisasi belum tersedia', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Target Buy' },
            { code: '5.2', title: 'Design Motif Kain', urgency: 'High', output: '50 design', actual: 'Brief warna diterima, arahan motif eksklusif, approve 30 looks sebelum produksi', deadline: '31 Sep 2026', status: 'Done', link: '📄 30 Looks Design' },
            { code: '5.3', title: 'Produksi Kain Pola Exclusive 1–5 Juta', urgency: 'Middle', output: '5 pcs', actual: 'Opsi kain Superfine & trial batik dipesan', deadline: '31 Sep 2026', status: 'Progres', link: '📄 PO Superfine' },
            { code: '5.4', title: 'Produksi Kain Pola Exclusive 5–10 Juta', urgency: 'Middle', output: '10 pcs', actual: 'Belum ada update vendor/sample/approval', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Vendor' },
            { code: '5.5', title: 'Produksi Kain Baron Exclusive 5–10 Juta', urgency: 'Middle', output: '30 pcs', actual: 'Belum ada update, berpotensi terdampak keputusan beli produk jadi', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Baron' },
            { code: '5.6', title: 'Produksi Kain Sutra Exclusive 5–10 Juta', urgency: 'Middle', output: '10 pcs', actual: 'Belum ada update vendor/hasil/approval', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Sutra 5M' },
            { code: '5.7', title: 'Produksi Kain Sutra Exclusive 10–20 Juta', urgency: 'Middle', output: '5 pcs', actual: 'Belum ada update vendor/hasil/approval/tekstur', deadline: '31 Sep 2026', status: 'Belum Mulai', link: '📄 Status Sutra 10M' },
            { code: '5.8', title: 'Produksi Kain Katun (New) 1–5 Juta', urgency: 'Middle', output: '30 pcs', actual: 'Belum ada update jumlah, perlu diselaraskan dgn keputusan beli produk jadi', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Katun' },
            { code: '5.9', title: 'Produksi Hem Katun', urgency: 'Middle', output: '30 pcs', actual: 'Belum ada update vendor/jumlah/sample/approval', deadline: '31 Sep 2026', status: 'Progres', link: '📄 Status Hem' },
            { code: '5.10', title: 'Perhitungan Harga HPP', urgency: 'Low', output: '1 Dokumen', actual: 'Dokumen selesai', deadline: '31 Sep 2026', status: 'Done', link: '📄 HPP Document' },
            { code: '5.11', title: 'Produk dengan Story Khusus 10–20 Juta', urgency: '—', output: '5 Produk', actual: 'Daftar produk prioritas dibuat, finalisasi narasi & approval belum terkonfirmasi', deadline: '31 Sep 2026', status: 'Belum Mulai', link: '📄 Story Deck' }
          ]
        }
      ]
    }
  ]
};

// --------------------------------------------------------------------------
// OKR TKB DATASET — The Keranjang Bali (TERPISAH dari BT)
// --------------------------------------------------------------------------
const tkbOKRData = {
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
                { week: 'W4', date: '28 Jul 2026', note: 'Negosiasi ulang vendor', feedback: 'In Review Pak Ibnu' }
              ]
            },
            { 
              code: 'TKB-1.3', title: 'Skema kerjasama brand ambassador', output: 'Skema disetujui', deadline: '30 Jun 2026', status: 'Done', isTKB: true, link: '📄 Draft Skema BA' 
            },
            { 
              code: 'TKB-1.4', title: 'Dealing Brand Ambassador', output: 'Dealing BA', actual: 'Menunggu meeting Reza Arap; opsi baru (Raditya Dika, Vindes); meeting tim Raditya Dika selesai, ratecard masuk, tunggu feedback Pak I', deadline: '30 Jul 2026', status: 'Done', isTKB: true, link: '🔗 Ratecard Raditya Dika',
              weeklyLogs: [
                { week: 'W1', date: '07 Jul 2026', note: 'Contact agen Reza Arap', feedback: 'Waiting Schedule' },
                { week: 'W2', date: '14 Jul 2026', note: 'Search alternatif (Raditya Dika, Vindes)', feedback: 'Approved Search' },
                { week: 'W3', date: '21 Jul 2026', note: 'Meeting tim Raditya Dika', feedback: 'Ratecard Received' },
                { week: 'W4', date: '28 Jul 2026', note: 'Eskalasi ke Pak I', feedback: 'Waiting Feedback Pak I' }
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
              code: 'TKB-2.1.2', title: 'RAB Reconcept & Design Lantai 3', output: 'RAB L3', actual: 'Revisi — RAB masih ada penyesuaian karena masih pitching vendor', deadline: '30 Jun 2026', status: 'Progress Overdue', isTKB: true, link: '📄 RAB L3',
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
              code: 'TKB-2.1.4', title: 'Timeline Reconcept & Design Lantai 3', output: 'Timeline Final', actual: 'Pakai opsi 2 pararel menunggu concept dayen yang masih revisi', deadline: '30 Jun 2026', status: 'Not Started Overdue', isTKB: true, link: '📄 Timeline L3',
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
              code: 'TKB-2.3.6', title: 'Solved problem & Aktivasi Traffic', output: 'Weekly Activation Plan', actual: 'Revisi — campaign 17 Agu "Sekeranjang Kemerdekaan", campaign nongkrong Bali; submit meeting Pak I', deadline: '31 Jul 2026', status: 'Done', isTKB: true, link: '📄 Jadwal Campaign' 
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
};
// --------------------------------------------------------------------------
// OKR PRODEV DATASET — Produk Development (Data Real Juli 2026)
// --------------------------------------------------------------------------
const prodevOKRData = {
  project: { id: 'prodev', name: 'Produk Development (PRODEV)' },
  objectives: [
    {
      id: 'PD-1',
      name: 'Objective 1 — Produk Lokal Negri',
      targetOutput: 'Produk karya handmade yang memiliki story dan berhasil menarik perhatian konsumen & menghias motif yang unik original',
      targetOutcome: 'Peningkatan capaian target penjualan produk yang unik original',
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
      targetOutput: 'Store Premium Jakarta: Kapasitas display 1.027 pcs, dengan 15% new Produk (155 pcs)',
      targetOutcome: 'Target banyaknya produk yang siap untuk mengisi store premium Jakarta',
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
      targetOutput: 'Tersedia 5 Looks Design yang bisa di-deal oleh Owner',
      targetOutcome: 'Tersegmentasi Satu Porsi Topi Momen',
      deadline: '30 Juli 2026',
      krs: [
        { code: 'PD-3.1', title: 'Design Motif Topi', output: '5 Looks', deadline: '15 Juli 2026', status: 'Done', actual: 'Design 5 looks selesai dan disetujui', link: '📄 Design Topi' },
        { code: 'PD-3.2', title: 'Produksi Sample Topi', output: '5 Looks', deadline: '15 Juli 2026', status: 'Done', actual: 'Sample topi selesai diproduksi dan siap di-deal', link: '📄 Sample Topi' }
      ]
    },
    {
      id: 'PD-4',
      name: 'Objective 4 — Produk Fashion Show (PBF)',
      targetOutput: 'Dapat menghasilkan minimal 1 foto yang baik untuk di-posting di social media',
      targetOutcome: 'Terdapat konten digital yang bisa di-repost di berbagai Brand',
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
      targetOutput: 'Tersedia 25 Looks Design yang bisa dijual oleh Owner',
      targetOutcome: 'Tersegmentasi Sales Pada Divisi Momen',
      deadline: '31 Agust 2026',
      krs: [
        { code: 'PD-5.1', title: 'Design Kaos Momen', output: '10 Looks with 5 Warna', deadline: '11 Agust 2026', status: 'Done', actual: 'Design 10 looks x 5 warna selesai dan disetujui', link: '📄 Design Kaos' },
        { code: 'PD-5.2', title: 'Produksi Kaos Momen', output: '10 Looks with 5 Warna', deadline: '11 Agust 2026', status: 'Done', actual: 'Produksi selesai, siap distribusi ke divisi Momen', link: '📄 Output Kaos' }
      ]
    }
  ]
};

// --------------------------------------------------------------------------
// OKR PRODUKSI DATASET — Batik Factory + Handprint Factory + Garment
// --------------------------------------------------------------------------
const produksiOKRData = {
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
};

// Helper: Normalize status into 5 main visual categories
function normalizeOKRStatus(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('done') || s.includes('selesai')) return { key: 'Done', label: 'Done', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)', border: 'rgba(16, 185, 129, 0.5)', icon: '🟢' };
  if (s.includes('overdue')) return { key: 'Overdue', label: 'Overdue', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', icon: '🔴' };
  if (s.includes('hold')) return { key: 'Hold', label: 'Hold', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)', border: 'rgba(245, 158, 11, 0.5)', icon: '🟠' };
  if (s.includes('progress') || s.includes('progres') || s.includes('revisi')) return { key: 'On Progress', label: 'On Progress / Revisi', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 0.5)', icon: '🟡' };
  return { key: 'Belum Mulai', label: 'Belum Mulai', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.2)', border: 'rgba(156, 163, 175, 0.5)', icon: '⚪' };
}

// --------------------------------------------------------------------------
// VIEW 4: OKR (Dashboard Visual Interaktif OKR Proyek)
// --------------------------------------------------------------------------
function renderOKRView() {
  const selectedProj = state.okrProjectFilter || 'all';
  const selectedStat = state.okrStatusFilter || 'all';

  // Gather KRs based on project filter
  let activeProjects = okrRealData.projects;
  if (selectedProj !== 'all') {
    activeProjects = okrRealData.projects.filter(p => p.id === selectedProj);
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
          <h2 style="color:#FFF; font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:10px; margin:0;">
            ${getUnitLogoHtml('okr-bt', 32)}
            <span>Dashboard OKR Proyek Executive — Batik Trusmi (BT)</span>
          </h2>
          <p style="color:var(--text-secondary); font-size:0.8rem; margin:4px 0 0 0;">
            Monitoring Status Progress OKR (Premium Cirebon, Premium Jakarta, & The Keranjang Bali)
          </p>
        </div>

        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <!-- Filter Project -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Project:</span>
            <select id="okrProjSelect" onchange="window.handleOKRProjectFilterChange(this.value)" 
                    style="background:#111827; border:1.5px solid var(--accent-gold); color:#FFF; padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
              <option value="all" ${selectedProj === 'all' ? 'selected' : ''}>Semua Project (Cirebon, Jakarta, TKB)</option>
              <option value="cirebon" ${selectedProj === 'cirebon' ? 'selected' : ''}>🏛️ Premium Cirebon</option>
              <option value="jakarta" ${selectedProj === 'jakarta' ? 'selected' : ''}>🏙️ Premium Jakarta</option>
              <option value="tkb" ${selectedProj === 'tkb' ? 'selected' : ''}>🏝️ The Keranjang Bali (TKB)</option>
            </select>
          </div>

          <!-- Filter Status -->
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Status:</span>
            <select id="okrStatSelect" onchange="window.handleOKRStatusFilterChange(this.value)" 
                    style="background:#111827; border:1.5px solid var(--accent-gold); color:#FFF; padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
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
          <div class="metric-value" style="color:#10B981;">${donePercent}% Completed</div>
          <div class="metric-trend trend-up">${doneKRs} dari ${totalKRs} KR Selesai</div>
        </div>

        <div class="metric-card" style="border-color:rgba(239, 68, 68, 0.4);">
          <div class="metric-card-header">
            <span class="metric-title">Critical Overdue Items</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="alert-triangle"></i></div>
          </div>
          <div class="metric-value" style="color:#EF4444;">${overdueKRs} Items</div>
          <div class="metric-trend trend-down">Butuh Action Segera</div>
        </div>

        <div class="metric-card" style="border-color:rgba(245, 158, 11, 0.4);">
          <div class="metric-card-header">
            <span class="metric-title">Held Projects</span>
            <div class="metric-icon-box milestone-theme"><i data-lucide="pause-circle"></i></div>
          </div>
          <div class="metric-value" style="color:#F59E0B;">${holdKRs} Items</div>
          <div class="metric-trend trend-neutral">Evaluasi Strategi</div>
        </div>
      </div>

      <!-- Dedicated Panel Potensi Sanksi Keterlambatan Denda CCP TKB -->
      ${(selectedProj === 'all' || selectedProj === 'tkb') && overdueTKBKRs.length > 0 ? `
        <div style="background:linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%); border:1.5px solid #EF4444; padding:18px 20px; border-radius:var(--radius-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px; border-bottom:1px solid rgba(239, 68, 68, 0.3); padding-bottom:10px;">
            <div>
              <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; color:#EF4444; font-weight:800; display:flex; align-items:center; gap:6px;">
                <i data-lucide="alert-octagon"></i> Panel Potensi Sanksi Keterlambatan (Denda CCP TKB)
              </div>
              <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:2px;">
                Klausul CCP TKB: <span style="color:#FFF; font-weight:700;">Late > Denda Rp200.000 / KR</span> (Menampilkan HANYA KR berstatus Overdue yang berpotensi kena denda)
              </div>
            </div>
            <div style="background:rgba(239, 68, 68, 0.25); border:1px solid #EF4444; color:#EF4444; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.95rem; font-family:monospace;">
              Total Potensi Denda: Rp ${totalTKBDenda.toLocaleString('id-ID')}
            </div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
            ${overdueTKBKRs.map(kr => `
              <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(239, 68, 68, 0.4); padding:12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <span style="font-size:0.7rem; font-family:monospace; color:var(--accent-gold); font-weight:800;">${kr.code}</span>
                  <div style="color:#FFF; font-size:0.82rem; font-weight:700; margin:2px 0;">${kr.title}</div>
                  <div style="font-size:0.72rem; color:var(--text-secondary);">Due Date: ${kr.deadline} | Objective: ${kr.objName}</div>
                </div>
                <div style="text-align:right; margin-left:10px;">
                  <span style="background:rgba(239, 68, 68, 0.3); color:#EF4444; border:1px solid #EF4444; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:800; display:inline-block;">
                    Denda Rp200.000
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Budget Panel Khusus Objective 1.2 Premium Cirebon -->
      ${selectedProj === 'all' || selectedProj === 'cirebon' ? `
        <div style="background:linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%); border:1px solid var(--accent-gold); padding:16px 20px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--accent-gold); font-weight:800;">
              💰 Panel Budget Strategis — Objective 1.2 Premium Cirebon
            </div>
            <div style="font-size:0.95rem; color:#FFF; font-weight:700; margin-top:4px;">
              Perluasan Area Stand Kain & Redesign Concept (Budget Target vs Actual)
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
            <div>
              <span style="font-size:0.75rem; color:var(--text-secondary); display:block;">Target Budget:</span>
              <span style="font-size:1.1rem; color:#FFF; font-weight:800; font-family:monospace;">Rp 1.000.000.000</span>
            </div>
            <div style="font-size:1.4rem; color:var(--accent-gold); font-weight:300;">/</div>
            <div>
              <span style="font-size:0.75rem; color:var(--text-secondary); display:block;">Actual Budget:</span>
              <span style="font-size:1.1rem; color:#10B981; font-weight:800; font-family:monospace;">Rp 50.250.000</span>
            </div>
            <div style="background:rgba(16, 185, 129, 0.2); border:1px solid #10B981; color:#10B981; padding:6px 12px; border-radius:6px; font-weight:800; font-size:0.85rem;">
              Serapan Budget: 5.0%
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Objective Progress Bars Grid -->
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:20px; border-radius:var(--radius-md);">
        <h3 style="color:#FFF; font-size:1rem; font-weight:800; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="bar-chart-3" style="color:var(--accent-gold);"></i> Progress Completion Bar per Objective
        </h3>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:16px;">
          ${activeProjects.map(proj => proj.objectives.map(obj => {
            const objDone = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
            const objTotal = obj.krs.length;
            const objPercent = objTotal ? Math.round((objDone / objTotal) * 100) : 0;

            return `
              <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); padding:14px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <div>
                    <span style="font-size:0.72rem; color:var(--accent-gold); font-weight:700;">${proj.name}</span>
                    <h4 style="color:#FFF; font-size:0.85rem; font-weight:700; margin:2px 0 0 0;">${obj.name}</h4>
                  </div>
                  <span style="font-size:0.9rem; font-weight:800; color:${objPercent === 100 ? '#10B981' : objPercent > 40 ? '#F59E0B' : '#60A5FA'}; font-family:monospace;">
                    ${objPercent}%
                  </span>
                </div>
                <div style="background:rgba(255,255,255,0.08); height:8px; border-radius:4px; overflow:hidden; margin-bottom:8px;">
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
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:20px; border-radius:var(--radius-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div>
            <h3 style="color:#FFF; font-size:1.05rem; font-weight:800; margin:0; display:flex; align-items:center; gap:8px;">
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
              <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); border-top:3px solid ${col.color}; padding:12px; border-radius:8px; min-height:350px; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05);">
                  <span style="font-size:0.82rem; font-weight:800; color:#FFF;">${col.title}</span>
                  <span style="background:${col.color}22; color:${col.color}; border:1px solid ${col.color}55; font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:10px;">
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
                         style="background:rgba(255,255,255,0.03); border:1px solid ${kr.normStatus.border}; padding:10px 12px; border-radius:6px; cursor:pointer; transition:transform 0.15s ease, border-color 0.15s ease;"
                         onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                      
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:0.7rem; font-family:monospace; color:var(--accent-gold); font-weight:800;">${kr.code}</span>
                        <span style="font-size:0.7rem; background:${kr.normStatus.bg}; color:${kr.normStatus.color}; padding:2px 6px; border-radius:4px; font-weight:800;">
                          ${kr.normStatus.label}
                        </span>
                      </div>

                      <h5 style="color:#FFF; font-size:0.82rem; font-weight:700; margin:0 0 6px 0; line-height:1.3;">${kr.title}</h5>

                      <div style="font-size:0.72rem; color:var(--text-secondary); margin-bottom:6px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                        Target: ${kr.targetOutput}
                      </div>

                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.7rem; color:var(--text-secondary); border-top:1px solid rgba(255,255,255,0.05); padding-top:6px; margin-top:6px;">
                        <span style="color:#60A5FA;">📅 ${kr.deadline}</span>
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
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:20px; border-radius:var(--radius-md);">
        <h3 style="color:#FFF; font-size:1.05rem; font-weight:800; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
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
                    <td style="color:#FFF; font-weight:600;">${kr.title}</td>
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
  okrRealData.projects.forEach(p => {
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

  const proj = tkbOKRData.projects[0];
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
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:16px 20px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px;">
        <div>
          <h2 style="color:#FFF; font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:10px; margin:0;">
            ${getUnitLogoHtml('okr-tkb', 32)}
            <span>OKR Dashboard — The Keranjang Bali (TKB)</span>
          </h2>
          <p style="color:var(--text-secondary); font-size:0.8rem; margin:4px 0 0 0;">
            Monitoring Status OKR TKB — Juli 2026 | CCP Klausul: Late > Denda Rp200.000 / KR
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:0.8rem; color:var(--text-secondary); font-weight:700;">Status:</span>
          <select onchange="window.handleOKRStatusFilterChange(this.value)"
                  style="background:#111827; border:1.5px solid var(--accent-gold); color:#FFF; padding:6px 12px; border-radius:6px; font-size:0.82rem; font-weight:700; cursor:pointer;">
            <option value="all" ${selectedStat==='all'?'selected':''}>Semua Status</option>
            <option value="Overdue" ${selectedStat==='Overdue'?'selected':''}>🔴 Overdue</option>
            <option value="On Progress" ${selectedStat==='On Progress'?'selected':''}>🟡 On Progress / Revisi</option>
            <option value="Belum Mulai" ${selectedStat==='Belum Mulai'?'selected':''}>⚪ Belum Mulai</option>
            <option value="Done" ${selectedStat==='Done'?'selected':''}>🟢 Done</option>
          </select>
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
          <div class="metric-value" style="color:#10B981;">${donePercent}%</div>
          <div class="metric-trend trend-up">${doneKRs} dari ${totalKRs} KR Selesai</div>
        </div>
        <div class="metric-card" style="border-color:rgba(239,68,68,0.4);">
          <div class="metric-card-header"><span class="metric-title">KR Overdue (Potensi Denda)</span><div class="metric-icon-box complain-theme"><i data-lucide="alert-triangle"></i></div></div>
          <div class="metric-value" style="color:#EF4444;">${overdueKRs} KR</div>
          <div class="metric-trend trend-down">Potensi Total Denda: Rp ${totalDenda.toLocaleString('id-ID')}</div>
        </div>
        <div class="metric-card" style="border-color:rgba(239,68,68,0.6); background:rgba(239,68,68,0.06);">
          <div class="metric-card-header"><span class="metric-title">CCP Klausul Denda</span><div class="metric-icon-box complain-theme"><i data-lucide="alert-octagon"></i></div></div>
          <div class="metric-value" style="color:#EF4444; font-size:1rem;">Rp 200.000 / KR</div>
          <div class="metric-trend trend-down">Berlaku semua KR Overdue</div>
        </div>
      </div>

      <!-- Panel Potensi Sanksi Denda CCP — HANYA KR Overdue -->
      ${overdueTKBKRs.length > 0 ? `
        <div style="background:linear-gradient(135deg,rgba(239,68,68,0.15),rgba(17,24,39,0.97)); border:1.5px solid #EF4444; padding:18px 20px; border-radius:var(--radius-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px; border-bottom:1px solid rgba(239,68,68,0.3); padding-bottom:10px;">
            <div>
              <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; color:#EF4444; font-weight:800; display:flex; align-items:center; gap:6px;">
                <i data-lucide="alert-octagon"></i> Panel Potensi Sanksi Keterlambatan (Denda CCP TKB)
              </div>
              <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:3px;">
                Klausul: <strong style="color:#FFF;">Late > Denda Rp200.000 per KR</strong> — Hanya KR Overdue yang ditampilkan
              </div>
            </div>
            <div style="background:rgba(239,68,68,0.25); border:1px solid #EF4444; color:#EF4444; padding:6px 14px; border-radius:8px; font-weight:800; font-family:monospace;">
              Total Potensi Denda: Rp ${totalDenda.toLocaleString('id-ID')}
            </div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px;">
            ${overdueTKBKRs.map(kr => `
              <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(239,68,68,0.4); padding:12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <span style="font-size:0.7rem; font-family:monospace; color:var(--accent-gold); font-weight:800;">${kr.code}</span>
                  <div style="color:#FFF; font-size:0.82rem; font-weight:700; margin:2px 0;">${kr.title}</div>
                  <div style="font-size:0.72rem; color:var(--text-secondary);">Due: ${kr.deadline} | ${kr.objName}</div>
                  ${kr.actual ? `<div style="font-size:0.72rem; color:var(--text-secondary); margin-top:2px;">Aktual: ${kr.actual}</div>` : ''}
                </div>
                <span style="background:rgba(239,68,68,0.3); color:#EF4444; border:1px solid #EF4444; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:800; white-space:nowrap; margin-left:10px;">
                  Denda Rp200.000
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `<div style="background:rgba(16,185,129,0.1); border:1px solid #10B981; padding:14px 20px; border-radius:var(--radius-md); color:#10B981; font-weight:700;">✅ Tidak ada KR Overdue saat ini — Tidak ada potensi denda CCP</div>`}

      <!-- Progress Bars per Objective -->
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:20px; border-radius:var(--radius-md);">
        <h3 style="color:#FFF; font-size:1rem; font-weight:800; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="bar-chart-3" style="color:var(--accent-gold);"></i> Progress Completion per Goal / Objective (TKB)
        </h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:14px;">
          ${proj.objectives.map(obj => {
            const objDone = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
            const objTotal = obj.krs.length;
            const objPct = objTotal ? Math.round((objDone / objTotal) * 100) : 0;
            const hasOverdue = obj.krs.some(k => normalizeOKRStatus(k.status).key === 'Overdue');
            return `
              <div style="background:rgba(255,255,255,0.02); border:1px solid ${hasOverdue ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}; padding:14px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                  <div>
                    ${obj.penaltyClause ? `<span style="font-size:0.65rem; color:#EF4444; font-weight:700; display:block; margin-bottom:2px;">⚠️ ${obj.penaltyClause}</span>` : ''}
                    <h4 style="color:#FFF; font-size:0.84rem; font-weight:700; margin:0;">${obj.name}</h4>
                  </div>
                  <span style="font-size:0.88rem; font-weight:800; color:${objPct===100?'#10B981':objPct>50?'#F59E0B':'#60A5FA'}; font-family:monospace;">${objPct}%</span>
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
  const proj = prodevOKRData;
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
            <i data-lucide="layers" style="color:var(--accent-gold);"></i> OKR Dashboard — Produk Development (PRODEV) 🎨
          </h2>
          <p style="color:var(--text-secondary);font-size:0.8rem;margin:4px 0 0 0;">Monitoring OKR PRODEV — Juli–Agustus 2026 | ${proj.objectives.length} Objectives Strategis</p>
        </div>
        <select onchange="window.handleOKRStatusFilterChange(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:6px 12px;border-radius:6px;font-size:0.82rem;font-weight:700;cursor:pointer;">
          <option value="all" ${selectedStat==='all'?'selected':''}>Semua Status</option>
          <option value="Done" ${selectedStat==='Done'?'selected':''}>🟢 Done</option>
          <option value="On Progress" ${selectedStat==='On Progress'?'selected':''}>🟡 On Progress</option>
          <option value="Belum Mulai" ${selectedStat==='Belum Mulai'?'selected':''}>⚪ Belum Mulai</option>
        </select>
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
  prodevOKRData.objectives.forEach(obj => {
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
  const section = produksiOKRData.sections.find(s => s.id === activeSection) || produksiOKRData.sections[0];

  let allKRs = [];
  section.objectives.forEach(obj => {
    obj.krs.forEach(kr => {
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

  const tabsHTML = produksiOKRData.sections.map(s =>
    '<button onclick="window.switchProduksiSection(\'' + s.id + '\')" style="padding:8px 16px;border-radius:6px;border:1.5px solid '
    + (s.id === activeSection ? s.color : 'rgba(255,255,255,0.1)')
    + ';background:' + (s.id === activeSection ? s.color + '22' : 'transparent')
    + ';color:' + (s.id === activeSection ? s.color : '#9CA3AF')
    + ';font-weight:800;font-size:0.82rem;cursor:pointer;">' + s.name + '</button>'
  ).join('');

  const progressBarsHTML = section.objectives.map(obj => {
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
          + '<span style="font-size:0.67rem;background:' + kr.normStatus.bg + ';color:' + kr.normStatus.color + ';padding:1px 5px;border-radius:3px;font-weight:800;">' + kr.normStatus.label + '</span></div>'
          + '<h5 style="color:#FFF;font-size:0.79rem;font-weight:700;margin:0 0 3px;line-height:1.3;">' + kr.title + '</h5>'
          + '<div style="font-size:0.7rem;color:var(--text-secondary);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-bottom:5px;">' + (kr.actual || '') + '</div>'
          + '<div style="display:flex;justify-content:space-between;font-size:0.67rem;color:var(--text-secondary);border-top:1px solid rgba(255,255,255,0.05);padding-top:4px;">'
          + '<span style="color:#60A5FA;">📅 ' + kr.deadline + '</span>'
          + '<span style="color:var(--accent-gold);">📦 ' + kr.output + '</span></div></div>'
        ).join('');
    return '<div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);border-top:3px solid ' + col.color + ';padding:12px;border-radius:8px;min-height:280px;display:flex;flex-direction:column;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.05);">'
      + '<span style="font-size:0.8rem;font-weight:800;color:#FFF;">' + col.title + '</span>'
      + '<span style="background:' + col.color + '22;color:' + col.color + ';border:1px solid ' + col.color + '55;font-size:0.75rem;font-weight:800;padding:2px 8px;border-radius:10px;">' + colKRs.length + '</span></div>'
      + '<div style="display:flex;flex-direction:column;gap:8px;flex:1;">' + cardsHTML + '</div></div>';
  }).join('');

  const tableHTML = section.objectives.map(obj => {
    const done = obj.krs.filter(k => normalizeOKRStatus(k.status).key === 'Done').length;
    const rows = obj.krs.map((kr, i) => {
      const norm = normalizeOKRStatus(kr.status);
      return '<tr style="border-top:1px solid rgba(255,255,255,0.04);cursor:pointer;" onclick="window.showProduksiKRDetail(\'' + kr.code + '\',\'' + activeSection + '\')" onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'' + (i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent') + '\'">'
        + '<td style="padding:8px 10px;font-family:monospace;color:var(--accent-gold);font-weight:800;">' + kr.code + '</td>'
        + '<td style="padding:8px 10px;color:#FFF;font-weight:600;">' + kr.title + '</td>'
        + '<td style="padding:8px 10px;color:var(--text-secondary);text-align:center;">' + kr.output + '</td>'
        + '<td style="padding:8px 10px;color:#60A5FA;text-align:center;font-size:0.72rem;">' + kr.deadline + '</td>'
        + '<td style="padding:8px 10px;text-align:center;"><span style="background:' + norm.bg + ';color:' + norm.color + ';border:1px solid ' + norm.border + ';padding:2px 8px;border-radius:4px;font-weight:800;font-size:0.72rem;">' + norm.icon + ' ' + norm.label + '</span></td>'
        + '</tr>';
    }).join('');
    return '<div style="margin-bottom:14px;border:1px solid rgba(255,255,255,0.07);border-radius:8px;overflow:hidden;">'
      + '<div style="background:rgba(255,255,255,0.04);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.07);">'
      + '<div><span style="font-size:0.67rem;color:var(--accent-gold);font-weight:800;">' + obj.id + ' | ' + obj.category + ' | Due: ' + obj.deadline + '</span>'
      + '<div style="color:#FFF;font-size:0.88rem;font-weight:700;">' + obj.name + '</div></div>'
      + '<div style="font-size:0.78rem;color:var(--text-secondary);">✅ ' + done + '/' + obj.krs.length + ' Done</div></div>'
      + '<table style="width:100%;border-collapse:collapse;font-size:0.78rem;">'
      + '<thead><tr style="background:rgba(255,255,255,0.03);">'
      + '<th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:left;width:90px;">Kode</th>'
      + '<th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:left;">Key Result</th>'
      + '<th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:center;">Target</th>'
      + '<th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:center;">Deadline</th>'
      + '<th style="padding:8px 10px;color:var(--text-secondary);font-weight:700;text-align:center;">Status</th>'
      + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }).join('');

  return `
    <div style="display:flex;flex-direction:column;gap:20px;">
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);padding:16px 20px;border-radius:var(--radius-md);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
          <div>
            <h2 style="color:#FFF;font-size:1.25rem;font-weight:800;display:flex;align-items:center;gap:8px;margin:0;">
              <i data-lucide="factory" style="color:var(--accent-gold);"></i> OKR Dashboard — Produksi 🏭
            </h2>
            <p style="color:var(--text-secondary);font-size:0.8rem;margin:4px 0 0 0;">Batik Factory · Handprint Factory · Garment — Juli 2026</p>
          </div>
          <select onchange="window.handleOKRStatusFilterChange(this.value)" style="background:#111827;border:1.5px solid var(--accent-gold);color:#FFF;padding:6px 12px;border-radius:6px;font-size:0.82rem;font-weight:700;cursor:pointer;">
            <option value="all" ${selectedStat === 'all' ? 'selected' : ''}>Semua Status</option>
            <option value="Done" ${selectedStat === 'Done' ? 'selected' : ''}>🟢 Done</option>
            <option value="On Progress" ${selectedStat === 'On Progress' ? 'selected' : ''}>🟡 On Progress</option>
            <option value="Belum Mulai" ${selectedStat === 'Belum Mulai' ? 'selected' : ''}>⚪ Belum Mulai</option>
          </select>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">${tabsHTML}</div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card"><div class="metric-card-header"><span class="metric-title">Total KR — ${section.name}</span><div class="metric-icon-box okr-theme"><i data-lucide="layers"></i></div></div><div class="metric-value">${totalKRs} KR</div><div class="metric-trend trend-neutral">${section.objectives.length} Objectives</div></div>
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
  produksiOKRData.sections.forEach(sec => {
    if (sec.id === sectionId || !sectionId) {
      sec.objectives.forEach(obj => {
        const m = obj.krs.find(k => k.code === code);
        if (m) { foundKR = m; foundObj = obj; foundSection = sec; }
      });
    }
  });
  if (!foundKR) return;
  const norm = normalizeOKRStatus(foundKR.status);
  openModal('[PRODUKSI] ' + foundKR.code + ' — ' + foundKR.title,
    '<div style="display:flex;flex-direction:column;gap:14px;font-size:0.9rem;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px 14px;border-radius:6px;">'
    + '<div><span style="font-size:0.72rem;color:var(--accent-gold);font-weight:800;">' + (foundSection ? foundSection.name : 'Produksi') + ' — ' + foundObj.category + '</span>'
    + '<div style="color:#FFF;font-weight:700;font-size:0.85rem;">' + foundObj.name + '</div>'
    + '<div style="font-size:0.72rem;color:var(--text-secondary);">Due Objective: ' + foundObj.deadline + '</div></div>'
    + '<span style="background:' + norm.bg + ';color:' + norm.color + ';border:1px solid ' + norm.border + ';padding:4px 10px;border-radius:6px;font-weight:800;">' + norm.icon + ' ' + norm.label + '</span>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">'
    + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">TARGET OUTPUT:</strong><span style="color:#FFF;font-weight:700;">' + foundKR.output + '</span></div>'
    + '<div style="background:rgba(255,255,255,0.02);padding:10px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;">DEADLINE:</strong><span style="color:#60A5FA;font-weight:700;">📅 ' + foundKR.deadline + '</span></div>'
    + '</div>'
    + '<div style="background:rgba(255,255,255,0.02);padding:12px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);"><strong style="color:var(--text-secondary);display:block;font-size:0.72rem;margin-bottom:4px;">PROGRESS AKTUAL:</strong><p style="color:#FFF;font-weight:600;margin:0;line-height:1.5;">' + (foundKR.actual || 'Belum ada update.') + '</p></div>'
    + '<div style="text-align:right;"><a href="#" onclick="return false;" style="display:inline-flex;align-items:center;gap:6px;background:var(--accent-gold);color:#000;font-weight:800;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:0.8rem;">🔗 ' + foundKR.link + '</a></div>'
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
  const data = mockData.complain[subId] || { summary: {}, tickets: [] };

  if (subId === 'complain-tkb') {
    return `
      <div style="display:flex;flex-direction:column;gap:20px;">
        
        <!-- Scorecard Metric Header for TKB -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-card-header">
              <span class="metric-title">Total Complain Juli</span>
              <div class="metric-icon-box complain-theme"><i data-lucide="message-square-check"></i></div>
            </div>
            <div class="metric-value" style="color:#10B981;">0</div>
            <div class="metric-trend trend-up">Periode Juli 2026</div>
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
              <div style="font-size:0.8rem;opacity:0.9;margin-top:2px;">Periode : Juli 2026</div>
            </div>
            <span style="font-size:0.78rem;background:rgba(0,0,0,0.25);padding:4px 12px;border-radius:4px;font-weight:700;">Sheet 5B. Complain - TKB</span>
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
                
                <!-- Google Review Rowspan Group -->
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

                <!-- Summary Total Row -->
                <tr style="background:linear-gradient(90deg, rgba(234,179,8,0.15) 0%, rgba(16,185,129,0.15) 100%);border-top:2px solid var(--accent-gold);font-weight:900;">
                  <td colspan="5" style="color:var(--accent-gold);padding:14px 18px;font-size:0.95rem;">Total Complain Juli by Google Review</td>
                  <td style="text-align:center;color:#10B981;font-size:1.2rem;">0</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // Exact 9 items for BT Complain (Juli 2026): 6 items for 1-Star, 3 items for 2-Stars
  const star1Tickets = [
    { product: 'BATIK TRUSMI Bahan Kain Panjang Batik Tulis Mega Mendung Premium', issue: 'Warna:warna pinknya pucat sekali', solusi: 'Permintaan Maaf', total: 1 },
    { product: 'BATIK TRUSMI Longdress Pakaian Santai Wanita Daster Batik Jumbo Untuk Wanita Busui Friendly', issue: 'Gak sesuai pesanan😢', solusi: 'Permintaan Maaf', total: 1 },
    { product: 'BATIK TRUSMI Denim Life Series Kemeja Wanita Denim Kombinasi Batik', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 },
    { product: 'BATIK TRUSMI Baju Batik Hem Pria Kemeja Pria Lengan Pendek Batik Mega Mendung Kombinasi Beras Tumpah Murah Seragaman', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 },
    { product: 'BATIK TRUSMI Atasan Wanita Blouse Outer Batik Mega Mendung Linzhi', issue: 'pengiriman lama', solusi: 'Permintaan Maaf', total: 1 },
    { product: 'BATIK TRUSMI Atasan Wanita Blouse Batik Motif Mega Mendung Bumi Obi Mop Biru', issue: 'packaging kurang safety', solusi: 'Permintaan Maaf', total: 1 }
  ];

  const star2Tickets = [
    { product: 'BATIK TRUSMI Kain Pantai Batik Bahan Rayon Batik Cap Motif Mega Mendung Caplis Ckt HL', issue: 'produk tidak sesuai etalase', solusi: 'Pemberian Gift', total: 1 },
    { product: 'BATIK TRUSMI Hem Batik Murah Batik Pria Kemeja Lengan Pendek Atasan Pria Batik Seragaman Motif Bunga Matahari', issue: 'kualitas produk buruk', solusi: 'Permintaan Maaf', total: 1 },
    { product: 'BATIK TRUSMI Outer Batik Wanita Motif Abstrak Kombinasi Alma Coklat', issue: 'Tidak sesuai deskripsi', solusi: 'Permintaan Maaf', total: 1 }
  ];

  return `
    <div style="display:flex;flex-direction:column;gap:20px;">
      
      <!-- Scorecard Metric Header -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Total Complain Juli</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="message-square-warning"></i></div>
          </div>
          <div class="metric-value" style="color:var(--accent-gold);">9</div>
          <div class="metric-trend trend-neutral">Periode Juli 2026</div>
        </div>

        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-title">Complain Offline / Stand</span>
            <div class="metric-icon-box complain-theme"><i data-lucide="store"></i></div>
          </div>
          <div class="metric-value" style="color:#10B981;">0</div>
          <div class="metric-trend trend-up">Fasilitas, Produk & Pelayanan</div>
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
          <div class="metric-value" style="color:#F59E0B;">9</div>
          <div class="metric-trend trend-neutral">6x Rating 1★ | 3x Rating 2★</div>
        </div>
      </div>

      <!-- Main Spreadsheet-Style Data Table -->
      <div class="table-card" style="padding:0;overflow:hidden;border:1px solid var(--border-gold);">
        
        <!-- Spreadsheet Title Banner -->
        <div style="background:linear-gradient(90deg, #D97706 0%, #B45309 100%);color:#FFF;padding:12px 20px;font-weight:800;font-size:1.05rem;display:flex;justify-content:space-between;align-items:center;">
          <span>Complain BT Juli 2026</span>
          <span style="font-size:0.8rem;background:rgba(0,0,0,0.25);padding:4px 10px;border-radius:4px;">Ceremonial Monthly Report</span>
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
              <tr>
                <td style="font-weight:700;color:#FFF;background:rgba(255,255,255,0.02);">Produk</td>
                <td style="text-align:center;color:var(--text-secondary);">Stand</td>
                <td colspan="2" style="color:var(--text-secondary);">Tidak ada complain Produk</td>
                <td style="text-align:center;color:var(--text-secondary);">-</td>
                <td style="text-align:center;font-weight:700;color:#10B981;">0</td>
              </tr>
              <tr style="background:rgba(16,185,129,0.06);font-weight:700;">
                <td colspan="5" style="color:#10B981;padding-left:16px;">Jumlah complain Produk</td>
                <td style="text-align:center;color:#10B981;">0</td>
              </tr>

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

              <!-- 1 Star Rating Rowspan Group (6 Items) -->
              ${star1Tickets.map((t, idx) => `
                <tr style="background:rgba(255,255,255,0.01);border-bottom:1px solid rgba(255,255,255,0.04);">
                  ${idx === 0 ? `
                    <td rowspan="6" style="vertical-align:middle;text-align:center;background:rgba(255,255,255,0.02);border-right:1px solid rgba(255,255,255,0.08);">
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
                  <td style="text-align:center;font-weight:700;color:#FFF;padding:9px 12px;">1</td>
                </tr>
              `).join('')}

              <!-- 2 Stars Rating Rowspan Group (3 Items) -->
              ${star2Tickets.map((t, idx) => `
                <tr style="background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.04);">
                  ${idx === 0 ? `
                    <td rowspan="3" style="vertical-align:middle;text-align:center;background:rgba(255,255,255,0.02);border-right:1px solid rgba(255,255,255,0.08);">
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
                  <td style="text-align:center;font-weight:700;color:#FFF;padding:9px 12px;">1</td>
                </tr>
              `).join('')}

              <!-- Bottom Summary Totals (Matching Spreadsheet Rows 22 & 23) -->
              <tr style="background:rgba(16,185,129,0.12);border-top:1.5px solid #10B981;font-weight:800;">
                <td colspan="5" style="color:#10B981;padding:10px 16px;font-size:0.9rem;">Jumlah Complain Online</td>
                <td style="text-align:center;color:#10B981;font-size:1rem;">9</td>
              </tr>
              <tr style="background:linear-gradient(90deg, rgba(234,179,8,0.2) 0%, rgba(180,83,9,0.3) 100%);border-top:1.5px solid var(--accent-gold);font-weight:900;">
                <td colspan="5" style="color:var(--accent-gold);padding:12px 16px;font-size:0.95rem;">Total Complain Juli</td>
                <td style="text-align:center;color:var(--accent-gold);font-size:1.15rem;">9</td>
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
  const timelineList = mockData.milestone[subId] || [];

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
              <div style="font-size:0.8rem;opacity:0.9;margin-top:2px;">${bannerSub}</div>
            </div>
          </div>
          <span style="font-size:0.78rem;background:rgba(0,0,0,0.25);padding:4px 12px;border-radius:4px;font-weight:700;">Periode 2026</span>
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
