/* =====================================================================
   PENGATURAN PARAMETER OPTIK iOS LIQUID GLASS
   Diambil langsung dari konfigurasi playground liquid-glass.ybouane.com
   ===================================================================== */
const LIQUID_GLASS_CONFIG = {
  blurAmount: 0,
  refraction: 0.88,
  chromaticAberration: 0.055,
  edgeHighlight: 0.53,
  specular: 0.16,
  fresnel: 2,
  distortion: 0.13,
  cornerRadius: 32,
  zRadius: 30,
  opacity: 1,
  saturation: 0.05,
  brightness: 0,
  shadowOpacity: 0.3,
  shadowSpread: 10,
  bevelMode: 0
};

/* =====================================================================
   DATA UTAMA PRAKTIKUM (EDIT BAGIAN INI SAJA UNTUK MENGUBAH KONTEN)
   Setiap acara di bawah ini otomatis memiliki halaman "breakout room"
   sendiri pada acara.html?id=01, acara.html?id=02, dst.
   ===================================================================== */

const ACARA_LIST = [
  {
    nomor: "01",
    romawi: "I",
    password: "1",
    judul: "Pengenalan Perangkat Lunak & Basis Data Pemboran",
    deskripsi:
      "Impor data lubang bor (collar, survey, assay, lithology), validasi basis data, dan pengenalan antarmuka perangkat lunak perencanaan tambang.",
    foto: "", // Contoh jika sudah ada foto: "assets/acara-01.jpg"
    software: "Placeholder Software Tambang",
    tujuan: [
      "Memahami struktur tabel basis data pemboran (collar, survey, assay, dan lithology).",
      "Melakukan impor serta validasi kesalahan (overlapping, missing interval, dan koordinat) pada basis data.",
      "Menampilkan sebaran lubang bor secara 3D sebagai dasar pemodelan tambang."
    ],
    berkas: [
      {
        kode: "P-01",
        judul: "PPT Materi",
        keterangan: "Slide pemaparan teori dan panduan langkah kerja Acara 01 (Google Drive).",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-01",
        judul: "Data Praktikum",
        keterangan: "File CSV/Excel collar, survey, assay, dan lithology untuk latihan Acara 01.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-01",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 01.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Unduh seluruh data latihan pada kartu Data Praktikum di atas.",
      "Periksa kelengkapan kolom dan satuan data sebelum dimasukkan ke perangkat lunak.",
      "Lakukan validasi basis data hingga tidak ada galat kritis, lalu simpan proyek.",
      "Buat tangkapan layar tampilan 3D lubang bor dan susun laporan sesuai format lab."
    ],
    catatan:
      "Pastikan format pemisah desimal di laptop sudah sesuai (titik/koma) sebelum mengimpor file CSV agar data koordinat tidak terbaca keliru."
  },
  {
    nomor: "02",
    romawi: "II",
    password: "2",
    judul: "Pemodelan Geologi & Sumberdaya (Block Model)",
    deskripsi:
      "Pembuatan model blok 3D, komposit data kadar, serta estimasi distribusi kadar dan tonase endapan.",
    foto: "",
    software: "Placeholder Software Tambang",
    tujuan: [
      "Membuat batas domain geologi/wireframe dari data penampang lubang bor.",
      "Melakukan komposit sampel kadar pada panjang interval seragam.",
      "Membangun block model 3D dan mengestimasi tonase serta kadar rata-rata sumberdaya."
    ],
    berkas: [
      {
        kode: "P-02",
        judul: "PPT Materi",
        keterangan: "Slide pemodelan geologi, komposit, dan parameter estimasi block model Acara 02.",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-02",
        judul: "Data Praktikum",
        keterangan: "File proyek lanjutan basis data dan topografi untuk pembuatan block model.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-02",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 02.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Buka proyek basis data tervalidasi dari Acara 01 atau gunakan dataset Acara 02.",
      "Bangun model padatan (solid/wireframe) endapan dan lakukan validasi volume.",
      "Tentukan ukuran parent block dan sub-block sesuai geometri endapan.",
      "Jalankan estimasi kadar dan ekspor tabel rekapitulasi tonase sumberdaya."
    ],
    catatan:
      "Periksa kesesuaian densitas (specific gravity) batuan dan bijih sebelum menghitung tonase total."
  },
  {
    nomor: "03",
    romawi: "III",
    password: "3",
    judul: "Penentuan Cut-Off Grade & Stripping Ratio",
    deskripsi:
      "Analisis ekonomi awal untuk menentukan batas kadar layak tambang (COG) dan nisbah kupas (SR).",
    foto: "",
    software: "Spreadsheet & Software Tambang",
    tujuan: [
      "Menghitung Break-Even Cut-Off Grade (BECOG) berdasarkan parameter harga dan biaya.",
      "Menentukan Break-Even Stripping Ratio (BESR) untuk batas keekonomian penambangan.",
      "Menyusun kurva Grade-Tonnage sebagai dasar pemilihan skenario cadangan."
    ],
    berkas: [
      {
        kode: "P-03",
        judul: "PPT Materi",
        keterangan: "Slide rumus ekonomi tambang dasar, COG, BESR, dan panduan kurva grade-tonnage.",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-03",
        judul: "Data Praktikum",
        keterangan: "Tabel harga komoditas, recovery, biaya penambangan, dan template perhitungan.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-03",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 03.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Pelajari parameter ekonomi (harga jual, mining cost, processing cost, recovery).",
      "Hitung nilai COG dan BESR menggunakan template perhitungan.",
      "Ekspor data tonase pada beberapa variasi kadar dari block model untuk kurva grade-tonnage.",
      "Analisis sensitivitas perubahan harga terhadap cadangan layak tambang."
    ],
    catatan:
      "Sertakan satuan yang konsisten (USD/ton, g/t, atau %) di setiap tabel perhitungan."
  },
  {
    nomor: "04",
    romawi: "IV",
    password: "4",
    judul: "Optimasi Pit (Ultimate Pit Limit)",
    deskripsi:
      "Penentuan batas pit akhir optimal secara teknis dan ekonomis menggunakan parameter lereng dan harga komoditas.",
    foto: "",
    software: "Placeholder Software Tambang",
    tujuan: [
      "Menyiapkan parameter geoteknik (overall slope angle) dan ekonomi untuk optimasi pit.",
      "Menghasilkan rangkaian pit shell menggunakan variasi revenue factor.",
      "Memilih Ultimate Pit Limit (UPL) terbaik berdasarkan grafik pit-by-pit."
    ],
    berkas: [
      {
        kode: "P-04",
        judul: "PPT Materi",
        keterangan: "Slide konsep Lerchs-Grossmann / Pseudoflow, revenue factor, dan analisis pit-by-pit.",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-04",
        judul: "Data Praktikum",
        keterangan: "Model blok bernilai ekonomi dan parameter sudut lereng tiap sektor.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-04",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 04.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Masukkan block model dan verifikasi atribut kadar, densitas, serta kategori batuan.",
      "Atur sudut lereng keseluruhan (overall slope) serta parameter biaya dan harga.",
      "Jalankan optimasi untuk rentang revenue factor dan evaluasi grafik NPV/tonase.",
      "Ekspor surface pit shell terpilih sebagai acuan desain pit pada Acara 05."
    ],
    catatan:
      "Pit shell hasil optimasi belum memuat jalan tambang (ramp); perancangan ramp dilakukan pada Acara 05."
  },
  {
    nomor: "05",
    romawi: "V",
    password: "5",
    judul: "Perancangan Desain Pit & Jalan Tambang",
    deskripsi:
      "Pembuatan geometri jenjang (bench), ramp, dan jalan angkut tambang terbuka sesuai standar keselamatan.",
    foto: "",
    software: "Placeholder Software Tambang",
    tujuan: [
      "Menerapkan parameter geometri jenjang (tinggi bench, lebar berm, dan single slope).",
      "Merancang jalan angkut (ramp) dengan lebar dan kemiringan (grade) sesuai dimensi alat.",
      "Menghitung volume cadangan tertambang (mineable reserve) dari desain pit akhir."
    ],
    berkas: [
      {
        kode: "P-05",
        judul: "PPT Materi",
        keterangan: "Slide standar geometri jenjang, perhitungan lebar jalan angkut, dan desain ramp.",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-05",
        judul: "Data Praktikum",
        keterangan: "Surface topografi, pit shell acuan, dan spesifikasi dimensi dump truck.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-05",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 05.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Tentukan lebar jalan angkut minimum (umumnya 3,5× lebar alat angkut terbesar) dan grade maksimum.",
      "Buat toe dan crest tiap elevasi jenjang mengikuti batas pit shell optimal.",
      "Integrasikan ramp dari dasar pit menuju permukaan topografi (exit point).",
      "Potong desain pit dengan topografi dan hitung total ore, waste, serta stripping ratio."
    ],
    catatan:
      "Pastikan tidak ada sudut patah terlalu tajam pada tikungan ramp agar aman dilalui alat angkut."
  },
  {
    nomor: "06",
    romawi: "VI",
    password: "6",
    judul: "Perancangan Disposal (Waste Dump)",
    deskripsi:
      "Desain area penimbunan batuan penutup (overburden) dengan mempertimbangkan kapasitas dan kestabilan lereng.",
    foto: "",
    software: "Placeholder Software Tambang",
    tujuan: [
      "Menghitung volume batuan penutup tertimbun dengan memperhitungkan swell factor.",
      "Menentukan lokasi disposal yang aman di luar batas cadangan dan dekat dengan pit exit.",
      "Merancang geometri jenjang disposal serta akses jalan masuk timbunan."
    ],
    berkas: [
      {
        kode: "P-06",
        judul: "PPT Materi",
        keterangan: "Slide kriteria pemilihan lokasi waste dump, swell factor, dan geometri timbunan.",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-06",
        judul: "Data Praktikum",
        keterangan: "Topografi area izin tambang, batas IUP, dan rekap volume overburden.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-06",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 06.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Konversi volume bank cubic meter (BCM) waste menjadi loose cubic meter (LCM) memakai swell factor.",
      "Tentukan batas kaki timbunan di area stabil dan tidak menimbun potensi cadangan.",
      "Rancang jenjang timbunan dari bawah ke atas lengkap dengan jalan akses (ramp).",
      "Verifikasi bahwa kapasitas disposal lebih besar atau sama dengan total kebutuhan timbunan."
    ],
    catatan:
      "Sisakan jarak aman (buffer) dari batas IUP, badan sungai, dan infrastruktur tambang."
  },
  {
    nomor: "07",
    romawi: "VII",
    password: "7",
    judul: "Penjadwalan Produksi Tambang (Mine Scheduling)",
    deskripsi:
      "Penyusunan urutan penambangan (pushback) jangka pendek dan jangka panjang untuk memenuhi target produksi.",
    foto: "",
    software: "Placeholder Software Tambang",
    tujuan: [
      "Membagi pit akhir ke dalam tahapan penambangan (pushback/phase) yang logis.",
      "Menyusun jadwal produksi tahunan/triwulanan untuk menjaga kestabilan tonase bijih dan SR.",
      "Membuat peta kemajuan tambang (sequence map) per periode."
    ],
    berkas: [
      {
        kode: "P-07",
        judul: "PPT Materi",
        keterangan: "Slide konsep pushback design, leveling stripping ratio, dan mine scheduling.",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-07",
        judul: "Data Praktikum",
        keterangan: "Desain pit per tahap, target produksi, dan template grafik jadwal produksi.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-07",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 07.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Hitung ketersediaan ore dan waste per elevasi pada setiap pushback.",
      "Susun urutan penambangan dari atas ke bawah memenuhi target produksi tiap periode.",
      "Lakukan penyeimbangan (smoothing) nisbah kupas agar kebutuhan alat tidak fluktuatif ekstrem.",
      "Buat visualisasi peta kemajuan tambang dan grafik produksi per periode."
    ],
    catatan:
      "Pastikan aturan precedences terpenuhi: blok di elevasi bawah tidak boleh ditambang sebelum blok di atasnya terbuka."
  },
  {
    nomor: "08",
    romawi: "VIII",
    password: "8",
    judul: "Analisis Kebutuhan Alat & Evaluasi Ekonomi",
    deskripsi:
      "Perhitungan produktivitas serta jumlah alat gali-muat dan angkut, dilanjutkan analisis kelayakan biaya.",
    foto: "",
    software: "Spreadsheet & Software Tambang",
    tujuan: [
      "Menghitung waktu edar (cycle time) dan produktivitas alat gali-muat serta alat angkut.",
      "Menentukan keserasian kerja alat (match factor) dan jumlah armada per periode.",
      "Menyusun arus kas (cash flow) dan mengevaluasi kelayakan proyek (NPV, IRR, Payback Period)."
    ],
    berkas: [
      {
        kode: "P-08",
        judul: "PPT Materi",
        keterangan: "Slide perhitungan produktivitas armada, match factor, CAPEX/OPEX, dan NPV/IRR.",
        labelTombol: "Buka PPT Materi",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "D-08",
        judul: "Data Praktikum",
        keterangan: "Katalog alat berat, jarak angkut per periode, dan template cash flow.",
        labelTombol: "Unduh Data",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      },
      {
        kode: "J-08",
        judul: "Jadwal Praktikum",
        keterangan: "Jadwal pelaksanaan, pembagian plug/shift, dan tenggat waktu Acara 08.",
        labelTombol: "Lihat Jadwal",
        link: "https://drive.google.com/drive/folders/1LZ-KvaWSaIXtkgxIkfYhPLugTO2tZI-8"
      }
    ],
    langkah: [
      "Ukur jarak angkut rata-rata dari front tambang ke ROM/crusher dan disposal per periode.",
      "Hitung produktivitas excavator dan dump truck beserta kebutuhan jumlah unit dan match factor.",
      "Hitung total biaya investasi (CAPEX) dan biaya operasional (OPEX) berdasarkan jadwal produksi.",
      "Susun tabel cash flow untuk memperoleh nilai NPV, IRR, dan Payback Period."
    ],
    catatan:
      "Nilai match factor ideal mendekati 1; jelaskan alasan teknis jika terjadi waktu tunggu pada excavator atau truck."
  }
];

// DAFTAR TIM ASISTEN LABORATORIUM (PLACEHOLDER)
// Nomor WA diawali 62 (tanpa tanda + atau 0 di depan), contoh: "6281234567890"
const ASISTEN_LIST = [
  { nama: "Asisten 1", peran: "Koordinator Asisten", wa: "6281280970439", ig: "zzethaf_", foto: "assets/asisten-1.jpg" },
  { nama: "Asisten 2", peran: "Asisten Perencanaan", wa: "6281280970439", ig: "zzethaf_", foto: "assets/asisten-2.jpg" },
  { nama: "Asisten 3", peran: "Asisten Pemodelan", wa: "6281280970439", ig: "zzethaf_", foto: "assets/asisten-3.jpg" },
  { nama: "Asisten 4", peran: "Asisten Desain Pit", wa: "6281280970439", ig: "zzethaf_", foto: "assets/asisten-4.jpg" },
  { nama: "Asisten 5", peran: "Asisten Scheduling", wa: "6281280970439", ig: "zzethaf_", foto: "assets/asisten-5.jpg" }
];
